import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, BookOpen, Plus, Trash2, Calendar, ShieldCheck, RotateCcw } from 'lucide-react';
import { storage, CurriculumSettings, DEFAULT_CURRICULUM_SETTINGS } from '../../services/storageService';

interface EditCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CurriculumSettings;
  onSettingsUpdated: (newSettings: CurriculumSettings) => void;
}

export const EditCurriculumModal: React.FC<EditCurriculumModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsUpdated
}) => {
  const [lowerSubjects, setLowerSubjects] = useState<string[]>([]);
  const [upperSubjects, setUpperSubjects] = useState<string[]>([]);
  const [kpseaWindow, setKpseaWindow] = useState('');
  const [examSeriesNote, setExamSeriesNote] = useState('');
  const [newLowerSubject, setNewLowerSubject] = useState('');
  const [newUpperSubject, setNewUpperSubject] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setLowerSubjects([...(settings.lowerPrimarySubjects || DEFAULT_CURRICULUM_SETTINGS.lowerPrimarySubjects)]);
      setUpperSubjects([...(settings.upperPrimarySubjects || DEFAULT_CURRICULUM_SETTINGS.upperPrimarySubjects)]);
      setKpseaWindow(settings.kpseaWindow || DEFAULT_CURRICULUM_SETTINGS.kpseaWindow);
      setExamSeriesNote(settings.examSeriesNote || DEFAULT_CURRICULUM_SETTINGS.examSeriesNote);
      setSavedSuccess(false);
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleAddLowerSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLowerSubject.trim()) return;
    if (!lowerSubjects.includes(newLowerSubject.trim())) {
      setLowerSubjects([...lowerSubjects, newLowerSubject.trim()]);
    }
    setNewLowerSubject('');
  };

  const handleRemoveLowerSubject = (index: number) => {
    setLowerSubjects(lowerSubjects.filter((_, i) => i !== index));
  };

  const handleAddUpperSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpperSubject.trim()) return;
    if (!upperSubjects.includes(newUpperSubject.trim())) {
      setUpperSubjects([...upperSubjects, newUpperSubject.trim()]);
    }
    setNewUpperSubject('');
  };

  const handleRemoveUpperSubject = (index: number) => {
    setUpperSubjects(upperSubjects.filter((_, i) => i !== index));
  };

  const handleResetDefaults = () => {
    if (confirm('Reset curriculum structure to official KICD defaults?')) {
      setLowerSubjects([...DEFAULT_CURRICULUM_SETTINGS.lowerPrimarySubjects]);
      setUpperSubjects([...DEFAULT_CURRICULUM_SETTINGS.upperPrimarySubjects]);
      setKpseaWindow(DEFAULT_CURRICULUM_SETTINGS.kpseaWindow);
      setExamSeriesNote(DEFAULT_CURRICULUM_SETTINGS.examSeriesNote);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CurriculumSettings = {
      lowerPrimarySubjects: lowerSubjects,
      upperPrimarySubjects: upperSubjects,
      kpseaWindow: kpseaWindow.trim() || 'October 26–29, 2026',
      examSeriesNote: examSeriesNote.trim() || 'Ready for Opener & Midterm',
      syncStatus: 'Offline & Local Engine Ready'
    };

    storage.saveCurriculumSettings(updated);
    onSettingsUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl my-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="font-black text-base tracking-tight">Edit CBE Curriculum Structure</h2>
              <p className="text-xs text-blue-200">
                Offline Administration • Learning Areas & Examination Windows
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Curriculum structure updated and persisted offline!</span>
            </div>
          )}

          {/* Offline Sync Assurance Banner */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-bold text-emerald-900 dark:text-emerald-300">
                Offline Mode Active • Saved Directly in Local Storage
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold">
              KICD Aligned
            </span>
          </div>

          {/* Section 1: Lower Primary Learning Areas */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Lower Primary Learning Areas (Grades 1–3)</span>
              </h3>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                {lowerSubjects.length} Areas
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {lowerSubjects.map((subject, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium shadow-xs"
                >
                  <span>{subject}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLowerSubject(idx)}
                    className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer ml-1"
                    title={`Remove ${subject}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Lower Subject input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newLowerSubject}
                onChange={(e) => setNewLowerSubject(e.target.value)}
                placeholder="Add lower primary subject..."
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddLowerSubject}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Section 2: Upper Primary Learning Areas */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Upper Primary Learning Areas (Grades 4–6)</span>
              </h3>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                {upperSubjects.length} Areas
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {upperSubjects.map((subject, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium shadow-xs"
                >
                  <span>{subject}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUpperSubject(idx)}
                    className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer ml-1"
                    title={`Remove ${subject}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Upper Subject input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newUpperSubject}
                onChange={(e) => setNewUpperSubject(e.target.value)}
                placeholder="Add upper primary subject..."
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddUpperSubject}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Section 3: KPSEA Window & Exam Notes */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Assessment & Examination Configuration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Grade 6 KPSEA Window
                </label>
                <input
                  type="text"
                  value={kpseaWindow}
                  onChange={(e) => setKpseaWindow(e.target.value)}
                  placeholder="e.g. October 26–29, 2026"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Targeter & Jesma Series Readiness
                </label>
                <input
                  type="text"
                  value={examSeriesNote}
                  onChange={(e) => setExamSeriesNote(e.target.value)}
                  placeholder="e.g. Ready for Opener & Midterm"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all hover:shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Curriculum (Offline)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
