import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Save, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Calendar, 
  UserCheck, 
  Download 
} from 'lucide-react';
import { storage, RawSavedScheme } from '../../services/storageService';

interface RawSchemeQuickUploadProps {
  teacherName?: string;
}

export const RawSchemeQuickUpload: React.FC<RawSchemeQuickUploadProps> = ({
  teacherName = 'Teacher Elvis'
}) => {
  const [role, setRole] = useState(teacherName);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [rawSchemeData, setRawSchemeData] = useState('');
  const [savedSchemes, setSavedSchemes] = useState<RawSavedScheme[]>(() => storage.getRawSavedSchemes());
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync role if prop updates
  useEffect(() => {
    if (teacherName) {
      setRole(teacherName);
    }
  }, [teacherName]);

  // Offline Live Clock & Dynamic Calendar Date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Format Time (HH:MM:SS)
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);

      // Format Date
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveScheme = () => {
    if (rawSchemeData.trim().length > 0) {
      const newItem = storage.saveRawScheme(rawSchemeData, role);
      setSavedSchemes(storage.getRawSavedSchemes());
      setRawSchemeData('');
      setSaveSuccessMessage('Scheme/Lesson Plan saved successfully! 🥳');
      setTimeout(() => {
        setSaveSuccessMessage(null);
      }, 4000);
    }
  };

  const handleDeleteScheme = (id: string) => {
    storage.deleteRawScheme(id);
    setSavedSchemes(storage.getRawSavedSchemes());
  };

  const handleCopyScheme = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
      {/* Header & Offline Live Clock Card */}
      <div 
        id="offline-live-clock-card"
        className="bg-[#1a237e] text-white w-full p-5 sm:p-6 rounded-2xl shadow-md text-center border border-indigo-900"
      >
        <div className="text-2xl sm:text-3xl font-black tracking-wider font-mono">
          🔵 {currentTime || '00:00:00'}
        </div>
        <div className="text-xs sm:text-sm text-[#bbdefb] mt-1.5 font-medium">
          {currentDate || 'Loading date...'}
        </div>
      </div>

      {/* App Branding & Active User */}
      <div className="text-center space-y-0.5">
        <h2 className="text-xl sm:text-2xl font-black text-[#1a237e] dark:text-indigo-400">
          Little Roses EduHub V2
        </h2>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Active User: <span className="text-[#0288d1] dark:text-sky-400 font-bold">{role}</span>
        </p>
      </div>

      {/* Schemes & Lesson Plan Upload Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0288d1]" />
            Upload Schemes / Lesson Plans
          </h3>
          <span className="text-[11px] font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 px-2.5 py-0.5 rounded-full">
            Offline Saved
          </span>
        </div>

        <textarea
          rows={5}
          value={rawSchemeData}
          onChange={(e) => setRawSchemeData(e.target.value)}
          placeholder="Paste raw scheme or lesson plan data here..."
          className="w-full p-3.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-sans text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all resize-y"
        />

        <button
          type="button"
          onClick={handleSaveScheme}
          disabled={!rawSchemeData.trim()}
          className="w-full py-3 px-4 bg-[#0288d1] hover:bg-[#0277bd] active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Raw Data Offline</span>
        </button>

        {/* Success Alert Banner */}
        {saveSuccessMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Display Saved Content */}
      {savedSchemes.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Saved Content ({savedSchemes.length})
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Cached locally in browser & app
            </span>
          </div>

          <div className="space-y-3">
            {savedSchemes.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#f0f4f8] dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/70 dark:border-slate-700/70 space-y-2.5 transition-all hover:border-sky-300 dark:hover:border-sky-700"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                    {item.teacherName || role}
                  </span>
                  <span>{item.timestamp}</span>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono leading-relaxed bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800">
                  {item.content}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyScheme(item.content, item.id)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteScheme(item.id)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold border border-rose-200 dark:border-rose-900/50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
