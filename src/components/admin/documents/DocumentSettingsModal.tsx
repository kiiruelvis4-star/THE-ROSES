import React, { useState } from 'react';
import { Settings, X, Save, CheckCircle2, Hash, ShieldCheck, Stamp, Building2 } from 'lucide-react';
import { DocumentSettings } from './DocumentTypes';
import { SystemConfig } from '../../../types';

interface DocumentSettingsModalProps {
  settings: DocumentSettings;
  systemConfig: SystemConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (newSettings: DocumentSettings) => void;
}

export const DocumentSettingsModal: React.FC<DocumentSettingsModalProps> = ({
  settings,
  systemConfig,
  isOpen,
  onClose,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<DocumentSettings>({ ...settings });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">
                Document Centre Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Numbering sequences, official stamps, and signature defaults
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Numbering Format */}
          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-600" />
              Automated Document Numbering
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Institutional Prefix:
                </label>
                <input
                  type="text"
                  value={formData.numberingPrefix}
                  onChange={e => setFormData({ ...formData, numberingPrefix: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  placeholder="LRA"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Next Sequence Number:
                </label>
                <input
                  type="number"
                  value={formData.nextSequence}
                  onChange={e => setFormData({ ...formData, nextSequence: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Sample Generated Code: <strong className="font-mono text-emerald-700 dark:text-emerald-400">{formData.numberingPrefix}/ADM/2026/{String(formData.nextSequence).padStart(3, '0')}</strong>
            </p>
          </div>

          {/* Attestation Defaults */}
          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Default Signatory & Headteacher
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Headteacher Name:
                </label>
                <input
                  type="text"
                  value={formData.defaultHeadTeacherName}
                  onChange={e => setFormData({ ...formData, defaultHeadTeacherName: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Official Title:
                </label>
                <input
                  type="text"
                  value={formData.defaultHeadTeacherTitle}
                  onChange={e => setFormData({ ...formData, defaultHeadTeacherTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showDigitalStamp}
                  onChange={e => setFormData({ ...formData, showDigitalStamp: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Enable Official Circular Rubber Stamp by default</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showDigitalSignature}
                  onChange={e => setFormData({ ...formData, showDigitalSignature: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Enable Headteacher Digital Signature line by default</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-black rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
