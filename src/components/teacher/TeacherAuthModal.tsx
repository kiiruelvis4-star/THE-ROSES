import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Fingerprint,
  Smartphone,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { TeacherProfile, DeviceActivationInfo } from '../../types';
import { storage } from '../../services/storageService';
import { SchoolLogo } from '../SchoolLogo';
import { checkBiometricSupport, registerBiometrics, authenticateWithBiometrics } from '../../services/biometricService';
import { supabaseSync } from '../../services/supabaseSyncService';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (selectedTeacher: TeacherProfile) => void;
  preselectedTeacherId?: string;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedTeacherId
}) => {
  const teacherProfiles = storage.getTeacherProfiles();
  const [deviceActivation, setDeviceActivation] = useState<DeviceActivationInfo | null>(() => storage.getDeviceActivation());
  
  // Activation form states
  const [selectedId, setSelectedId] = useState<string>(preselectedTeacherId || teacherProfiles[0]?.id || 'tr-elvis');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [enableBiometrics, setEnableBiometrics] = useState<boolean>(true);
  const [biometricAvailable, setBiometricAvailable] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [biometricStatusMsg, setBiometricStatusMsg] = useState<string>('');

  // Check device biometric capabilities on mount
  useEffect(() => {
    if (isOpen) {
      const currentActivation = storage.getDeviceActivation();
      setDeviceActivation(currentActivation);

      checkBiometricSupport().then(res => {
        setBiometricAvailable(res.isSupported);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDeviceBound = !!deviceActivation && deviceActivation.status !== 'REVOKED';
  const boundTeacher = isDeviceBound 
    ? (teacherProfiles.find(t => t.id === deviceActivation.teacherId) || teacherProfiles[0])
    : (teacherProfiles.find(t => t.id === selectedId) || teacherProfiles[0]);

  // Handle 1-Tap Biometric Login for already-bound teacher
  const handleBiometricUnlock = async () => {
    setError(null);
    setIsProcessing(true);
    setBiometricStatusMsg('Verifying device authorization...');

    try {
      // Check if Admin revoked this device lock in Supabase
      const deviceStatus = await supabaseSync.verifyDeviceStatus(boundTeacher.id, storage.getDeviceUniqueId());
      if (deviceStatus === 'REVOKED') {
        setIsProcessing(false);
        setBiometricStatusMsg('');
        setError('Your device binding has been revoked by the Administrator. Please re-activate.');
        return;
      }

      setBiometricStatusMsg('Please scan your fingerprint or face...');
      const authRes = await authenticateWithBiometrics(deviceActivation?.biometricCredentialId);
      if (authRes.success) {
        storage.setTeacherAuthenticated(true);
        storage.setAuthenticatedTeacherId(boundTeacher.id);
        setIsProcessing(false);
        onSuccess(boundTeacher);
      } else {
        setIsProcessing(false);
        setBiometricStatusMsg('');
        setError(authRes.error || 'Biometric scan was not recognized. Please use your password.');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setBiometricStatusMsg('');
      setError('Biometric sensor error. Please use your password.');
    }
  };

  // Handle Password Login for bound teacher
  const handlePasswordUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password.trim()) {
      setError('Please enter your faculty password.');
      return;
    }

    setIsProcessing(true);

    // Check if Admin revoked this device lock in Supabase
    const deviceStatus = await supabaseSync.verifyDeviceStatus(boundTeacher.id, storage.getDeviceUniqueId());
    if (deviceStatus === 'REVOKED') {
      setIsProcessing(false);
      setError('Your device binding has been revoked by the Administrator. Please re-activate.');
      return;
    }

    if (storage.verifyTeacherPassword(password, boundTeacher.id)) {
      storage.setTeacherAuthenticated(true);
      storage.setAuthenticatedTeacherId(boundTeacher.id);
      setIsProcessing(false);
      setPassword('');
      onSuccess(boundTeacher);
    } else {
      setIsProcessing(false);
      setError('Incorrect password for ' + boundTeacher.name + '.');
    }
  };

  // Handle First-Time Device Activation & Binding
  const handleDeviceActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password.trim()) {
      setError('Please enter your authorized faculty password to activate.');
      return;
    }

    setIsProcessing(true);

    if (!storage.verifyTeacherPassword(password, selectedTeacher.id)) {
      setIsProcessing(false);
      setError(`Invalid password for ${selectedTeacher.name}. Activation failed.`);
      return;
    }

    let credentialId: string | undefined = undefined;

    // If teacher opted to enable biometrics and device supports it
    if (enableBiometrics && biometricAvailable) {
      setBiometricStatusMsg('Prompting fingerprint/face registration...');
      try {
        const bioRes = await registerBiometrics(selectedTeacher.id, selectedTeacher.name);
        if (bioRes.success && bioRes.credentialId) {
          credentialId = bioRes.credentialId;
        }
      } catch (err) {
        console.warn('Biometric registration optional skipped:', err);
      }
    }

    const deviceId = storage.getDeviceUniqueId();
    const newActivation: DeviceActivationInfo = {
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      deviceId,
      deviceName: navigator.userAgent.includes('Android') ? 'Android Smartphone' : 'Web Device',
      activatedAt: new Date().toISOString(),
      biometricEnabled: !!credentialId || (enableBiometrics && biometricAvailable),
      biometricCredentialId: credentialId,
      status: 'ACTIVE'
    };

    // Check backend Supabase binding: enforce that teacher cannot bind second device without Admin reset
    const regResult = await supabaseSync.registerDeviceLock(newActivation);
    if (regResult && !regResult.success && regResult.error) {
      setIsProcessing(false);
      setError(regResult.error);
      return;
    }

    // Store activation locally
    storage.setDeviceActivation(newActivation);
    storage.setTeacherAuthenticated(true);
    storage.setAuthenticatedTeacherId(selectedTeacher.id);
    setIsProcessing(false);
    setPassword('');
    onSuccess(selectedTeacher);
  };

  const selectedTeacher = teacherProfiles.find(t => t.id === selectedId) || teacherProfiles[0];

  return (
    <div 
      id="teacher-auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in"
    >
      <div 
        id="teacher-auth-card"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 transition-all"
      >
        {/* Top Header */}
        <div className="relative bg-[#172554] p-5 text-white">
          <button
            id="close-teacher-auth-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/20">
              <SchoolLogo size="xs" badgeOnly />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  {isDeviceBound ? 'Teacher Security' : 'Device Activation'}
                </span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tight mt-0.5 font-heading">
                Little Roses Academy
              </h2>
              <p className="text-xs text-blue-200/90">
                {isDeviceBound ? 'Authenticated Staff Access' : 'Permanent Teacher-Device Pairing'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {biometricStatusMsg && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl flex items-center gap-2.5 text-xs text-blue-700 dark:text-blue-300 animate-pulse">
              <Fingerprint className="w-5 h-5 text-blue-600 shrink-0" />
              <span>{biometricStatusMsg}</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCENARIO A: RETURNING TEACHER (DEVICE IS BOUND)       */}
          {/* ==================================================== */}
          {isDeviceBound ? (
            <div className="space-y-4">
              {/* Bound Profile Banner */}
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                  {boundTeacher.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-md">
                      Bound Faculty
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Paired
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">
                    {boundTeacher.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    TSC: {boundTeacher.tscNumber} • {boundTeacher.role}
                  </p>
                </div>
              </div>

              {/* 1-Tap Biometric Unlock Button */}
              {deviceActivation.biometricEnabled && biometricAvailable && (
                <button
                  type="button"
                  id="biometric-unlock-btn"
                  onClick={handleBiometricUnlock}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Fingerprint className="w-5 h-5" />
                  <span>Unlock with Biometrics (Fingerprint / Face)</span>
                </button>
              )}

              {/* Divider if biometrics present */}
              {deviceActivation.biometricEnabled && biometricAvailable && (
                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                  <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Or Use Password
                  </span>
                </div>
              )}

              {/* Password Fallback Form */}
              <form onSubmit={handlePasswordUnlock} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Enter Password for {boundTeacher.name}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Faculty Password"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                      disabled={isProcessing}
                      autoFocus={!deviceActivation.biometricEnabled}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Default: <strong className="font-mono text-blue-600 dark:text-blue-400">teacher123</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setPassword('teacher123');
                        setError(null);
                      }}
                      className="text-[10px] font-bold text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800"
                    >
                      Fill Default
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#172554] hover:bg-blue-900 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? 'Verifying...' : 'Sign In to Teacher Dashboard'}</span>
                </button>
              </form>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400">
                  Device locked to {boundTeacher.name}. To rebind, contact the School Administrator.
                </p>
              </div>
            </div>
          ) : (
            /* ==================================================== */
            /* SCENARIO B: FIRST TIME ACTIVATION (DEVICE UNBOUND)   */
            /* ==================================================== */
            <form onSubmit={handleDeviceActivation} className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <Smartphone className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  <strong>Device Activation:</strong> This device will be permanently paired with your teacher account.
                </span>
              </div>

              {/* Step 1: Select Teacher Account */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  1. Select Your Faculty Account
                </label>
                <div className="space-y-2">
                  {teacherProfiles.map((tp) => (
                    <label
                      key={tp.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedId === tp.id
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-100 ring-1 ring-blue-600'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="teacherProfile"
                          checked={selectedId === tp.id}
                          onChange={() => setSelectedId(tp.id)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-xs font-bold">{tp.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            TSC: {tp.tscNumber} • {tp.assignments.map(a => a.gradeSummary).join(', ')}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 2: Faculty Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  2. Authorized Faculty Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter assigned teacher password"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                    disabled={isProcessing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Default: <strong className="font-mono text-blue-600 dark:text-blue-400">teacher123</strong> (or teacher's name)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPassword('teacher123');
                      setError(null);
                    }}
                    className="text-[10px] font-bold text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800"
                  >
                    Fill Default
                  </button>
                </div>
              </div>

              {/* Step 3: Biometric Option */}
              {biometricAvailable && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableBiometrics}
                      onChange={(e) => setEnableBiometrics(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Fingerprint className="w-4 h-4 text-blue-600" />
                        Enable Biometric Unlock (Fingerprint / Face)
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Allows instant 1-tap unlock using this phone's biometric sensor on future logins.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#172554] hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isProcessing ? 'Activating Device...' : 'Activate & Bind This Device'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
