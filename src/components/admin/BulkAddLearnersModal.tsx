import React, { useState } from 'react';
import { 
  Users, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  FileText, 
  Database, 
  Download, 
  Plus, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { bulkAddLearners, generateSqliteLearnersSQL, LearnerInput } from '../../services/sqliteDb';
import { storage } from '../../services/storageService';
import confetti from 'canvas-confetti';

interface BulkAddLearnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SAMPLE_CSV = `John Kamau, Grade 1, Male, LRA-0601, Grace Kamau, 0712345678
Mary Wanjiku, Grade 2, Female, LRA-0602, Peter Wanjiku, 0722345679
Brian Omondi, Grade 3, Male, LRA-0603, Jane Omondi, 0733345680
Faith Muthoni, Grade 4, Female, LRA-0604, David Muthoni, 0744345681
Kevin Kiprop, Grade 5, Male, LRA-0605, Sarah Kiprop, 0755345682
Esther Akinyi, Grade 6, Female, LRA-0606, George Akinyi, 0766345683`;

export const BulkAddLearnersModal: React.FC<BulkAddLearnersModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [inputText, setInputText] = useState(SAMPLE_CSV);
  const [mode, setMode] = useState<'csv' | 'json'>('csv');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Parse lines into learner objects
  const parseLearners = (): LearnerInput[] => {
    if (mode === 'json') {
      try {
        const parsed = JSON.parse(inputText);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => ({
            name: String(item.name || '').trim(),
            grade: String(item.grade || 'Grade 1').trim(),
            gender: String(item.gender || 'Male').trim(),
            admissionNumber: item.admissionNumber ? String(item.admissionNumber).trim() : undefined,
            parentName: item.parentName ? String(item.parentName).trim() : undefined,
            parentPhone: item.parentPhone ? String(item.parentPhone).trim() : undefined
          })).filter(l => l.name.length > 0);
        }
      } catch (e) {
        return [];
      }
    }

    // CSV Parsing
    const lines = inputText.split('\n');
    const learners: LearnerInput[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const name = parts[0];
        const grade = parts[1] || 'Grade 1';
        const gender = parts[2] || 'Male';
        const admissionNumber = parts[3] || undefined;
        const parentName = parts[4] || undefined;
        const parentPhone = parts[5] || undefined;
        if (name) {
          learners.push({
            name,
            grade,
            gender,
            admissionNumber,
            parentName,
            parentPhone
          });
        }
      }
    });

    return learners;
  };

  const parsedList = parseLearners();

  const handleBulkEnroll = async () => {
    if (parsedList.length === 0) {
      setStatusMessage({
        type: 'error',
        text: 'Please provide at least one valid learner with Name and Grade.'
      });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ type: null, text: '' });

    try {
      const resultMessage = await bulkAddLearners(parsedList);
      setIsProcessing(false);
      setStatusMessage({
        type: 'success',
        text: resultMessage || `Successfully enrolled ${parsedList.length} learners into Little Roses EduHub!`
      });

      // Celebration effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1800);
    } catch (err: any) {
      setIsProcessing(false);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to bulk add learners.'
      });
    }
  };

  const handleDownloadSqlScript = () => {
    const currentStudents = storage.getStudents();
    const sql = generateSqliteLearnersSQL(currentStudents);
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LittleRoses_Learners_SQLite_Export_${new Date().toISOString().slice(0, 10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-blue-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl shadow-inner backdrop-blur-sm">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider mb-1">
                <Database className="w-3 h-3" /> SQLite & Storage Integration
              </div>
              <h2 className="text-xl font-black tracking-tight">
                Bulk Add Learners
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Enroll multiple learners at once via CSV or JSON into EduHub
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Format Selector & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
              <button
                onClick={() => setMode('csv')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mode === 'csv'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                CSV / Tabular Format
              </button>
              <button
                onClick={() => setMode('json')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mode === 'json'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                JSON Array Format
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setInputText(SAMPLE_CSV)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Load Sample Cohort
              </button>
              <button
                onClick={() => setInputText('')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Text Input Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {mode === 'csv' ? 'Enter one learner per line (Name, Grade, Gender, [Admission], [ParentName], [Phone]):' : 'Paste JSON Array of learners:'}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {parsedList.length} valid learner{parsedList.length === 1 ? '' : 's'} detected
              </span>
            </div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === 'csv'
                  ? 'Kamau Njoroge, Grade 4, Male, LRA-0610, Alice Njoroge, 0712345678\nFaith Wairimu, Grade 5, Female, LRA-0611, Jane Wairimu, 0723456789'
                  : '[{"name": "Kamau Njoroge", "grade": "Grade 4", "gender": "Male"}]'
              }
              className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Parsed Preview Card */}
          {parsedList.length > 0 && (
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ready to enroll ({parsedList.length} learners):
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Showing first 3
                </span>
              </div>
              <div className="space-y-1 text-xs">
                {parsedList.slice(0, 3).map((l, i) => (
                  <div key={i} className="flex items-center justify-between p-1.5 bg-white dark:bg-slate-900 rounded-lg text-[11px] border border-emerald-100 dark:border-emerald-900/50">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{l.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-semibold">{l.grade}</span>
                      <span className="text-slate-500 dark:text-slate-400">{l.gender}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Message Alert */}
          {statusMessage.type && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300'
                : 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200 border border-rose-300'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* SQLite Code / SQL Export Utilities */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
            <button
              onClick={handleDownloadSqlScript}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Export SQLite .SQL Script</span>
            </button>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-right">
              Compatible with Expo SQLite &amp; Web Offline Storage
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleBulkEnroll}
            disabled={isProcessing || parsedList.length === 0}
            className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 active:scale-95 text-white rounded-xl font-black text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Enrolling {parsedList.length} Learners...</span>
            ) : (
              <>
                <span>Enroll {parsedList.length} Learners Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
