import { supabase } from '../supabaseClient';
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

class SupabaseSyncService {
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private syncListeners: ((result: SyncResult) => void)[] = [];
  private lastSyncResult: SyncResult | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.syncTeacherResources();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
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

  /**
   * Pull published teacher resources from Supabase and update local offline cache
   */
  public async syncTeacherResources(): Promise<SyncResult> {
    const localResources = storage.getUnifiedResources();

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
      // Query Supabase teacher_resources
      const { data, error } = await supabase
        .from('teacher_resources')
        .select('*')
        .eq('published', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error (may need table creation):', error.message);
        const errResult: SyncResult = {
          status: 'error',
          resourcesCount: localResources.length,
          newCount: 0,
          updatedCount: 0,
          deletedCount: 0,
          timestamp: new Date().toLocaleTimeString(),
          message: `Cloud table not ready or offline: ${error.message}`
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
          rawTextContent: row.raw_text_content,
          published: row.published !== false,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          authorName: row.author_name || 'Admin',
          authorRole: row.author_role || 'ADMIN',
          version: row.version || 1
        }));

        // Merge cloud with local:
        // Keep any local-only admin drafts, update published items from cloud
        const adminDrafts = localResources.filter(r => !r.published);
        const merged = [...adminDrafts, ...cloudResources];

        storage.saveUnifiedResources(merged);

        const successResult: SyncResult = {
          status: 'synced',
          resourcesCount: cloudResources.length,
          newCount: cloudResources.length,
          updatedCount: 0,
          deletedCount: 0,
          timestamp: new Date().toLocaleTimeString(),
          message: `Synced with Supabase Cloud (${cloudResources.length} resources active)`
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
        console.warn('Supabase admin fetch error:', error);
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
   */
  public async saveResource(resource: UnifiedResource): Promise<{ success: boolean; cloudSynced: boolean; message: string }> {
    // 1. Save locally first for instant optimistic response & offline resilience
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
        raw_text_content: resource.rawTextContent || null,
        published: resource.published,
        created_at: resource.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_name: resource.authorName || 'Admin',
        author_role: 'ADMIN',
        version: (resource.version || 1) + 1
      };

      const { error } = await supabase
        .from('teacher_resources')
        .upsert(row);

      if (error) {
        console.warn('Supabase upsert error:', error.message);
        return {
          success: true,
          cloudSynced: false,
          message: `Saved locally. Cloud sync pending: ${error.message}`
        };
      }

      return {
        success: true,
        cloudSynced: true,
        message: 'Successfully published to Supabase Cloud & Teachers'
      };
    } catch (err: any) {
      console.warn('Supabase save error:', err);
      return {
        success: true,
        cloudSynced: false,
        message: 'Saved locally'
      };
    }
  }

  /**
   * Delete a resource from Supabase Cloud and local cache
   */
  public async deleteResource(id: string): Promise<{ success: boolean; message: string }> {
    storage.deleteUnifiedResource(id);

    if (navigator.onLine) {
      try {
        await supabase
          .from('teacher_resources')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    return { success: true, message: 'Resource removed.' };
  }

  /**
   * Toggle publish / unpublish status
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
        await supabase
          .from('teacher_resources')
          .update({ published, updated_at: item.updatedAt })
          .eq('id', id);
      } catch (e) {
        console.warn('Toggle publish cloud error:', e);
      }
    }

    return true;
  }

  /**
   * Register Device Lock in Supabase Cloud
   */
  public async registerDeviceLock(info: DeviceActivationInfo): Promise<boolean> {
    storage.setDeviceActivation(info);

    if (!navigator.onLine) return true;

    try {
      await supabase
        .from('teacher_devices')
        .upsert({
          id: `${info.teacherId}-${info.deviceId}`,
          teacher_id: info.teacherId,
          teacher_name: info.teacherName,
          device_id: info.deviceId,
          device_name: info.deviceName || navigator.userAgent,
          activated_at: info.activatedAt,
          biometric_enabled: info.biometricEnabled,
          status: 'ACTIVE'
        });
      return true;
    } catch (err) {
      console.warn('Device lock cloud register error:', err);
      return true;
    }
  }

  /**
   * Verify if this device's lock is still active in Supabase (or was revoked by Admin)
   */
  public async verifyDeviceStatus(teacherId: string, deviceId: string): Promise<'ACTIVE' | 'REVOKED'> {
    if (!navigator.onLine) return 'ACTIVE';

    try {
      const { data, error } = await supabase
        .from('teacher_devices')
        .select('status')
        .eq('teacher_id', teacherId)
        .eq('device_id', deviceId)
        .maybeSingle();

      if (error || !data) return 'ACTIVE';
      return data.status === 'REVOKED' ? 'REVOKED' : 'ACTIVE';
    } catch {
      return 'ACTIVE';
    }
  }

  /**
   * Admin revokes a teacher's device binding so they can activate a new phone
   */
  public async revokeDeviceLock(teacherId: string): Promise<boolean> {
    storage.revokeDeviceLock(teacherId);

    if (!navigator.onLine) return true;

    try {
      await supabase
        .from('teacher_devices')
        .update({ status: 'REVOKED' })
        .eq('teacher_id', teacherId);
      return true;
    } catch (err) {
      console.warn('Cloud revoke device error:', err);
      return true;
    }
  }
}

export const supabaseSync = new SupabaseSyncService();
