import { supabase, isSupabaseConfigured, SUPABASE_URL } from '../supabaseClient';
import { UnifiedResource, DeviceActivationInfo } from '../types';
import { storage } from './storageService';

export interface SyncResult {
  status: 'synced' | 'offline' | 'error';
  resourcesCount: number;
  newCount: number;
  updatedCount: number;
  deletedCount: number;
  timestamp: string;
  message: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  role: 'admin' | 'teacher';
  teacher_id?: string;
  full_name?: string;
}

class SupabaseSyncService {
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private syncListeners: ((result: SyncResult) => void)[] = [];
  private lastSyncResult: SyncResult | null = null;
  private cachedProfile: UserProfile | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.syncTeacherResources();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });

      // Listen to Supabase auth state changes
      try {
        supabase.auth.onAuthStateChange((_event, session) => {
          if (!session) {
            this.cachedProfile = null;
          } else {
            this.fetchCurrentUserProfile();
          }
        });
      } catch (err) {
        console.warn('Auth state change listener initialization warning:', err);
      }
    }
  }

  public subscribe(listener: (result: SyncResult) => void) {
    this.syncListeners.push(listener);
    if (this.lastSyncResult) {
      listener(this.lastSyncResult);
    }
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== listener);
    };
  }

  public isConfigured(): boolean {
    return isSupabaseConfigured;
  }

  public getProjectUrl(): string {
    return SUPABASE_URL;
  }

  private notify(result: SyncResult) {
    this.lastSyncResult = result;
    this.syncListeners.forEach(listener => {
      try {
        listener(result);
      } catch (e) {
        console.error('Error in sync listener:', e);
      }
    });
  }

  // =========================================================================
  // SUPABASE AUTHENTICATION HELPERS
  // =========================================================================

  /**
   * Sign in with email and password via Supabase Auth
   */
  public async signInWithEmail(email: string, password: string): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const profile = await this.fetchCurrentUserProfile();
        return { success: true, profile: profile || undefined };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication error' };
    }
  }

  /**
   * Sign out current Supabase user session
   */
  public async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.cachedProfile = null;
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
  }

  /**
   * Get active Supabase session
   */
  public async getSession() {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  }

  /**
   * Get active Supabase user
   */
  public async getUser() {
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch {
      return null;
    }
  }

  /**
   * Fetch current user's profile from 'profiles' table
   */
  public async fetchCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const user = await this.getUser();
      if (!user) {
        this.cachedProfile = null;
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !data) {
        // Fallback to user metadata if profiles table not yet queried
        const role = (user.app_metadata?.role || user.user_metadata?.role || 'teacher') as 'admin' | 'teacher';
        this.cachedProfile = {
          id: user.id,
          email: user.email,
          role,
          teacher_id: user.user_metadata?.teacher_id,
          full_name: user.user_metadata?.full_name
        };
        return this.cachedProfile;
      }

      this.cachedProfile = {
        id: data.id,
        email: data.email || user.email,
        role: data.role as 'admin' | 'teacher',
        teacher_id: data.teacher_id,
        full_name: data.full_name
      };
      return this.cachedProfile;
    } catch {
      return null;
    }
  }

  public getCachedProfile(): UserProfile | null {
    return this.cachedProfile;
  }

  // =========================================================================
  // SUPABASE STORAGE (PDFs / Learning Materials)
  // =========================================================================

  /**
   * Upload resource file to Supabase Storage bucket 'resource-files'
   */
  public async uploadResourceFile(
    file: File, 
    resourceId: string
  ): Promise<{ publicUrl: string; storagePath: string; error?: string }> {
    if (!this.isConfigured() || !navigator.onLine) {
      return { 
        publicUrl: '', 
        storagePath: '', 
        error: !this.isConfigured() 
          ? 'Supabase backend not yet configured. File saved to local browser cache.' 
          : 'Device is offline. File saved locally.' 
      };
    }

    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `materials/${resourceId}/${Date.now()}_${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resource-files')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.warn('Supabase storage upload error:', uploadError.message);
        return { publicUrl: '', storagePath: '', error: uploadError.message };
      }

      const { data } = supabase.storage
        .from('resource-files')
        .getPublicUrl(storagePath);

      return {
        publicUrl: data.publicUrl,
        storagePath
      };
    } catch (err: any) {
      console.warn('Storage upload exception:', err);
      return { publicUrl: '', storagePath: '', error: err.message || 'Upload failed' };
    }
  }

  /**
   * Delete resource file from Supabase Storage
   */
  public async deleteResourceFile(storagePath: string): Promise<boolean> {
    if (!this.isConfigured() || !navigator.onLine || !storagePath) return false;
    try {
      const { error } = await supabase.storage
        .from('resource-files')
        .remove([storagePath]);
      if (error) console.warn('Storage file remove error:', error.message);
      return !error;
    } catch {
      return false;
    }
  }

  // =========================================================================
  // RESOURCE SYNCHRONIZATION & OFFLINE CACHING
  // =========================================================================

  /**
   * Pull published teacher resources from Supabase and update local offline cache
   */
  public async syncTeacherResources(): Promise<SyncResult> {
    const localResources = storage.getUnifiedResources();

    if (!this.isConfigured()) {
      const unconfiguredResult: SyncResult = {
        status: 'offline',
        resourcesCount: localResources.filter(r => r.published).length,
        newCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        timestamp: new Date().toLocaleTimeString(),
        message: 'Operating in Offline Storage (Configure VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to enable cloud sync)'
      };
      this.notify(unconfiguredResult);
      return unconfiguredResult;
    }

    if (!navigator.onLine) {
      const offlineResult: SyncResult = {
        status: 'offline',
        resourcesCount: localResources.filter(r => r.published).length,
        newCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        timestamp: new Date().toLocaleTimeString(),
        message: 'Working in Offline Mode (Serving from cached storage)'
      };
      this.notify(offlineResult);
      return offlineResult;
    }

    try {
      // Query Supabase teacher_resources (RLS policy ensures teachers only receive published = true)
      const { data, error } = await supabase
        .from('teacher_resources')
        .select('*')
        .eq('published', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch notice:', error.message);
        const errResult: SyncResult = {
          status: 'error',
          resourcesCount: localResources.length,
          newCount: 0,
          updatedCount: 0,
          deletedCount: 0,
          timestamp: new Date().toLocaleTimeString(),
          message: error.message.includes('Could not find the table')
            ? 'Supabase tables pending manual SQL setup. Local resources active.'
            : `Cloud status: ${error.message}`
        };
        this.notify(errResult);
        return errResult;
      }

      if (data) {
        // Map database records to UnifiedResource format
        const cloudResources: UnifiedResource[] = data.map(row => ({
          id: row.id,
          title: row.title,
          resourceType: row.resource_type,
          grade: row.grade,
          subject: row.subject,
          term: row.term || undefined,
          description: row.description || '',
          inputType: row.input_type || 'RAW_TEXT',
          fileName: row.file_name,
          fileSize: row.file_size,
          fileType: row.file_type,
          fileDataUrl: row.file_data_url,
          storagePath: row.storage_path,
          rawTextContent: row.raw_text_content,
          published: row.published !== false,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          authorName: row.author_name || 'School Administrator',
          authorRole: row.author_role || 'ADMIN',
          version: row.version || 1
        }));

        // Merge cloud with local:
        // Retain local admin drafts, update published items from cloud
        const adminDrafts = localResources.filter(r => !r.published);
        const merged = [...adminDrafts, ...cloudResources];

        // Persist to local offline storage
        storage.saveUnifiedResources(merged);

        const successResult: SyncResult = {
          status: 'synced',
          resourcesCount: cloudResources.length,
          newCount: cloudResources.length,
          updatedCount: 0,
          deletedCount: 0,
          timestamp: new Date().toLocaleTimeString(),
          message: `Synced with Supabase Cloud (${cloudResources.length} curriculum resources available offline)`
        };
        this.notify(successResult);
        return successResult;
      }

      return {
        status: 'synced',
        resourcesCount: localResources.length,
        newCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        timestamp: new Date().toLocaleTimeString(),
        message: 'Connected to Supabase'
      };
    } catch (err: any) {
      console.warn('Sync exception:', err);
      const fallbackResult: SyncResult = {
        status: 'error',
        resourcesCount: localResources.length,
        newCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        timestamp: new Date().toLocaleTimeString(),
        message: 'Offline / Cached resources active'
      };
      this.notify(fallbackResult);
      return fallbackResult;
    }
  }

  /**
   * Fetch all resources for Admin (including drafts and unpublished)
   */
  public async fetchAdminResources(): Promise<UnifiedResource[]> {
    const local = storage.getUnifiedResources();

    if (!navigator.onLine) {
      return local;
    }

    try {
      const { data, error } = await supabase
        .from('teacher_resources')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.warn('Supabase admin fetch notice:', error.message);
        return local;
      }

      if (data && data.length > 0) {
        const cloudResources: UnifiedResource[] = data.map(row => ({
          id: row.id,
          title: row.title,
          resourceType: row.resource_type,
          grade: row.grade,
          subject: row.subject,
          term: row.term,
          description: row.description || '',
          inputType: row.input_type || 'RAW_TEXT',
          fileName: row.file_name,
          fileSize: row.file_size,
          fileType: row.file_type,
          fileDataUrl: row.file_data_url,
          storagePath: row.storage_path,
          rawTextContent: row.raw_text_content,
          published: row.published,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          authorName: row.author_name,
          authorRole: row.author_role,
          version: row.version || 1
        }));

        storage.saveUnifiedResources(cloudResources);
        return cloudResources;
      }

      return local;
    } catch (e) {
      console.warn('Admin fetch exception:', e);
      return local;
    }
  }

  /**
   * Save (Insert/Update) a resource in Supabase Cloud and local cache
   * Backend RLS enforces that only authenticated Admins can insert/update.
   */
  public async saveResource(
    resource: UnifiedResource, 
    fileToUpload?: File
  ): Promise<{ success: boolean; cloudSynced: boolean; message: string }> {
    // 1. If a new physical file is provided, upload to Supabase Storage bucket first
    if (fileToUpload && navigator.onLine) {
      const uploadRes = await this.uploadResourceFile(fileToUpload, resource.id);
      if (uploadRes.publicUrl) {
        resource.fileDataUrl = uploadRes.publicUrl;
        resource.storagePath = uploadRes.storagePath;
      }
    }

    // 2. Save locally first for instant optimistic response & offline resilience
    storage.saveSingleUnifiedResource(resource);

    if (!navigator.onLine) {
      return {
        success: true,
        cloudSynced: false,
        message: 'Saved locally (will sync to Supabase when online)'
      };
    }

    try {
      const row = {
        id: resource.id,
        title: resource.title,
        resource_type: resource.resourceType,
        grade: resource.grade,
        subject: resource.subject,
        term: resource.term || null,
        description: resource.description,
        input_type: resource.inputType,
        file_name: resource.fileName || null,
        file_size: resource.fileSize || null,
        file_type: resource.fileType || null,
        file_data_url: resource.fileDataUrl || null,
        storage_path: resource.storagePath || null,
        raw_text_content: resource.rawTextContent || null,
        published: resource.published,
        created_at: resource.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_name: resource.authorName || 'School Administrator',
        author_role: 'ADMIN',
        version: (resource.version || 1) + 1
      };

      const { error } = await supabase
        .from('teacher_resources')
        .upsert(row);

      if (error) {
        console.warn('Supabase save notice:', error.message);
        const isAuthError = error.code === '42501' || error.message.toLowerCase().includes('violates row-level security');
        return {
          success: !isAuthError,
          cloudSynced: false,
          message: isAuthError 
            ? 'Backend Authorization Denied: Administrator clearance required in Supabase to modify resources.' 
            : `Saved locally. Cloud sync status: ${error.message}`
        };
      }

      return {
        success: true,
        cloudSynced: true,
        message: resource.published 
          ? 'Resource published to Supabase Cloud & Teachers' 
          : 'Draft saved in Supabase Cloud (hidden from teachers)'
      };
    } catch (err: any) {
      console.warn('Supabase save error:', err);
      return {
        success: true,
        cloudSynced: false,
        message: 'Saved locally in offline storage'
      };
    }
  }

  /**
   * Delete a resource from Supabase Cloud and local cache
   * Backend RLS enforces that only authenticated Admins can delete.
   */
  public async deleteResource(id: string): Promise<{ success: boolean; message: string }> {
    const local = storage.getUnifiedResources();
    const item = local.find(r => r.id === id);

    // Clean up local storage
    storage.deleteUnifiedResource(id);

    if (navigator.onLine) {
      try {
        // If resource had a file in Supabase Storage, delete it
        if (item?.storagePath) {
          await this.deleteResourceFile(item.storagePath);
        }

        const { error } = await supabase
          .from('teacher_resources')
          .delete()
          .eq('id', id);

        if (error) {
          console.warn('Supabase delete error:', error.message);
          const isAuthError = error.code === '42501' || error.message.toLowerCase().includes('violates row-level security');
          if (isAuthError) {
            return { 
              success: false, 
              message: 'Backend Authorization Denied: Only administrators can delete resources in Supabase.' 
            };
          }
        }
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    return { success: true, message: 'Resource removed.' };
  }

  /**
   * Toggle publish / unpublish status
   * Backend RLS enforces that only authenticated Admins can update published status.
   */
  public async togglePublishResource(id: string, published: boolean): Promise<boolean> {
    const resources = storage.getUnifiedResources();
    const item = resources.find(r => r.id === id);
    if (!item) return false;

    item.published = published;
    item.updatedAt = new Date().toISOString();
    storage.saveSingleUnifiedResource(item);

    if (navigator.onLine) {
      try {
        const { error } = await supabase
          .from('teacher_resources')
          .update({ published, updated_at: item.updatedAt })
          .eq('id', id);

        if (error) {
          console.warn('Toggle publish cloud error:', error.message);
          return false;
        }
      } catch (e) {
        console.warn('Toggle publish cloud error:', e);
        return false;
      }
    }

    return true;
  }

  // =========================================================================
  // TEACHER DEVICE BINDING & ISOLATION
  // =========================================================================

  /**
   * Register Device Lock in Supabase Cloud
   * Enforces that a teacher cannot register a second active device without admin reset.
   */
  public async registerDeviceLock(
    info: DeviceActivationInfo
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Cache locally
    storage.setDeviceActivation(info);

    if (!this.isConfigured() || !navigator.onLine) {
      return { success: true };
    }

    try {
      // 2. Check if this teacher account already has an ACTIVE lock on another device
      const { data: existingLocks, error: checkError } = await supabase
        .from('teacher_devices')
        .select('*')
        .eq('teacher_id', info.teacherId)
        .eq('status', 'ACTIVE');

      if (!checkError && existingLocks && existingLocks.length > 0) {
        const otherDevice = existingLocks.find(l => l.device_id !== info.deviceId);
        if (otherDevice) {
          return {
            success: false,
            error: `This teacher account is already locked to another physical device (${otherDevice.device_name || 'Authorized Phone'}). Contact the administrator to reset your device lock.`
          };
        }
      }

      // 3. Register or update the current device lock
      const { error: upsertError } = await supabase
        .from('teacher_devices')
        .upsert({
          id: `${info.teacherId}-${info.deviceId}`,
          teacher_id: info.teacherId,
          device_id: info.deviceId,
          device_name: info.deviceName || (navigator.userAgent.includes('Android') ? 'Android Phone' : 'Web Device'),
          activated_at: info.activatedAt,
          biometric_enabled: info.biometricEnabled,
          biometric_credential_id: info.biometricCredentialId || null,
          status: 'ACTIVE',
          updated_at: new Date().toISOString()
        });

      if (upsertError) {
        console.warn('Device lock cloud register error:', upsertError.message);
        return { success: true }; // Allow local activation if Supabase table not yet configured
      }

      return { success: true };
    } catch (err: any) {
      console.warn('Device lock cloud register exception:', err);
      return { success: true };
    }
  }

  /**
   * Verify if this device's lock is still active in Supabase (or was revoked by Admin)
   */
  public async verifyDeviceStatus(teacherId: string, deviceId: string): Promise<'ACTIVE' | 'REVOKED'> {
    if (!this.isConfigured() || !navigator.onLine) return 'ACTIVE';

    try {
      const { data, error } = await supabase
        .from('teacher_devices')
        .select('status')
        .eq('teacher_id', teacherId)
        .eq('device_id', deviceId)
        .maybeSingle();

      if (error || !data) return 'ACTIVE';
      if (data.status === 'REVOKED') {
        storage.revokeDeviceLock(teacherId);
        return 'REVOKED';
      }
      return 'ACTIVE';
    } catch {
      return 'ACTIVE';
    }
  }

  /**
   * Admin revokes a teacher's device binding so they can activate a new phone
   * Backend RLS enforces that only authenticated Admins can revoke device bindings.
   */
  public async revokeDeviceLock(teacherId: string): Promise<boolean> {
    storage.revokeDeviceLock(teacherId);

    if (!this.isConfigured() || !navigator.onLine) return true;

    try {
      const { error } = await supabase
        .from('teacher_devices')
        .update({ status: 'REVOKED', updated_at: new Date().toISOString() })
        .eq('teacher_id', teacherId);

      if (error) {
        console.warn('Cloud revoke device error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Cloud revoke device error:', err);
      return false;
    }
  }
}

export const supabaseSync = new SupabaseSyncService();
