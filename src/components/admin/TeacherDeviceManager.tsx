import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  ShieldCheck, 
  RefreshCw, 
  RotateCcw, 
  Fingerprint, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  KeyRound,
  Users
} from 'lucide-react';
import { TeacherProfile, DeviceActivationInfo } from '../../types';
import { storage } from '../../services/storageService';
import { supabaseSync } from '../../services/supabaseSyncService';

export const TeacherDeviceManager: React.FC = () => {
  const teacherProfiles = storage.getTeacherProfiles();
  const [deviceLocks, setDeviceLocks] = useState<DeviceActivationInfo[]>(() => storage.getAllDeviceLocks());
  const [resettingTeacherId, setResettingTeacherId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setDeviceLocks(storage.getAllDeviceLocks());
    });
    return () => unsub();
  }, []);

  const handleRevokeDevice = async (teacherId: string, teacherName: string) => {
    await supabaseSync.revokeDeviceLock(teacherId);
    setDeviceLocks(storage.getAllDeviceLocks());
    setResettingTeacherId(null);
    setNotice(`Device lock for ${teacherName} has been reset. The teacher can now activate a new phone.`);
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800 px-2.5 py-0.5 rounded-full">
              Hardware Security
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Biometric & Device Binding
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Teacher Device Associations & Locks
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 max-w-2xl">
            Each teacher account is permanently bound to their verified physical device with optional biometric authentication. If a teacher replaces or loses their phone, reset their device lock below so they can re-activate on a new device.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teacherProfiles.map((tp) => {
          const lock = deviceLocks.find(l => l.teacherId === tp.id && l.status === 'ACTIVE');
          const isBound = !!lock;

          return (
            <div
              key={tp.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isBound
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
                    {tp.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {tp.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      TSC: {tp.tscNumber} • {tp.role}
                    </p>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">
                      {tp.assignments.map(a => `${a.subject} (${a.gradeSummary})`).join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isBound ? (
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Bound
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      Unpaired
                    </span>
                  )}
                </div>
              </div>

              {/* Hardware Device Details */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                {isBound ? (
                  <>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Device Model:
                      </span>
                      <span className="font-mono font-medium truncate max-w-[180px]">
                        {lock.deviceName || 'Android Smartphone'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Fingerprint className="w-3.5 h-3.5 text-slate-400" /> Biometrics:
                      </span>
                      <span className={lock.biometricEnabled ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {lock.biometricEnabled ? 'Enabled (Fingerprint / Face)' : 'Password Only'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-slate-500">Activated:</span>
                      <span>{new Date(lock.activatedAt).toLocaleDateString()}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-400 italic">
                    Awaiting first login on teacher's physical phone.
                  </p>
                )}
              </div>

              {/* Revoke / Reset Action */}
              {isBound && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                  {resettingTeacherId === tp.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-rose-600 font-bold">Reset device pairing?</span>
                      <button
                        onClick={() => handleRevokeDevice(tp.id, tp.name)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                      >
                        Yes, Reset
                      </button>
                      <button
                        onClick={() => setResettingTeacherId(null)}
                        className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setResettingTeacherId(tp.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Device Lock</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
