import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  School, 
  UserCheck, 
  Hash, 
  Calendar, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { SystemConfig, TermName } from '../../types';
import { storage } from '../../services/storageService';
import { INITIAL_SYSTEM_CONFIG } from '../../data/academicCalendarsData';

interface SchoolConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SystemConfig;
  onConfigUpdated?: (newConfig: SystemConfig) => void;
}

export const SchoolConfigModal: React.FC<SchoolConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated
}) => {
  const [schoolName, setSchoolName] = useState(config.school_metadata.school_name);
  const [headTeacherName, setHeadTeacherName] = useState(config.school_metadata.head_teacher_name);
  const [schoolCode, setSchoolCode] = useState(config.school_metadata.school_code_number);
  const [poBox, setPoBox] = useState(config.school_metadata.po_box || 'P.O. Box 3443 NAKURU');
  const [phone, setPhone] = useState(config.school_metadata.phone || '0798 193966');
  const [email, setEmail] = useState(config.school_metadata.email || 'info@littleroses.ac.ke');
  const [motto, setMotto] = useState(config.school_metadata.motto || 'Much from Little');
  const [county, setCounty] = useState(config.school_metadata.county || 'Nakuru County');
  const [subCounty, setSubCounty] = useState(config.school_metadata.sub_county || 'Nakuru East');
  const [isCodeEditable, setIsCodeEditable] = useState(config.school_metadata.is_code_editable);
  const [academicYear, setAcademicYear] = useState(config.active_academic_year);
  const [activeTerm, setActiveTerm] = useState<TermName>(config.active_term);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SystemConfig = {
      active_academic_year: Number(academicYear),
      active_term: activeTerm,
      school_metadata: {
        school_name: schoolName.trim() || 'Little Roses Academy',
        head_teacher_name: headTeacherName.trim() || 'Mr. Kelvin (Headteacher)',
        school_code_number: schoolCode.trim() || 'LRA-NAK-2026-001',
        po_box: poBox.trim() || 'P.O. Box 3443 NAKURU',
        phone: phone.trim() || '0798 193966',
        email: email.trim() || 'info@littleroses.ac.ke',
        motto: motto.trim() || 'Much from Little',
        county: county.trim() || 'Nakuru County',
        sub_county: subCounty.trim() || 'Nakuru East',
        is_code_editable: isCodeEditable,
      }
    };

    storage.saveSystemConfig(updated);
    if (onConfigUpdated) {
      onConfigUpdated(updated);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset system metadata to official defaults (2026 Term 3, Little Roses Academy, P.O. Box 3443 NAKURU)?')) {
      setSchoolName(INITIAL_SYSTEM_CONFIG.school_metadata.school_name);
      setHeadTeacherName(INITIAL_SYSTEM_CONFIG.school_metadata.head_teacher_name);
      setSchoolCode(INITIAL_SYSTEM_CONFIG.school_metadata.school_code_number);
      setPoBox(INITIAL_SYSTEM_CONFIG.school_metadata.po_box || 'P.O. Box 3443 NAKURU');
      setPhone(INITIAL_SYSTEM_CONFIG.school_metadata.phone || '0798 193966');
      setEmail(INITIAL_SYSTEM_CONFIG.school_metadata.email || 'info@littleroses.ac.ke');
      setMotto(INITIAL_SYSTEM_CONFIG.school_metadata.motto || 'Much from Little');
      setCounty(INITIAL_SYSTEM_CONFIG.school_metadata.county || 'Nakuru County');
      setSubCounty(INITIAL_SYSTEM_CONFIG.school_metadata.sub_county || 'Nakuru East');
      setIsCodeEditable(INITIAL_SYSTEM_CONFIG.school_metadata.is_code_editable);
      setAcademicYear(INITIAL_SYSTEM_CONFIG.active_academic_year);
      setActiveTerm(INITIAL_SYSTEM_CONFIG.active_term);
      storage.saveSystemConfig(INITIAL_SYSTEM_CONFIG);
      if (onConfigUpdated) {
        onConfigUpdated(INITIAL_SYSTEM_CONFIG);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Settings className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight">System Configuration & Metadata</h2>
              <p className="text-xs text-blue-200">Active Academic Year, Term & School Identifiers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 max-h-[78vh] overflow-y-auto space-y-4">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>System Configuration Successfully Updated & Synced!</span>
            </div>
          )}

          {/* Curriculum Framework Badge */}
          <div className="p-3 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-xl flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 block">Curriculum Framework</span>
                <span className="text-xs font-black text-white block">Revised / Rationalized Competency-Based Education (CBE)</span>
              </div>
            </div>
            <span className="text-[10px] bg-white/20 text-blue-100 font-mono px-2 py-0.5 rounded-md font-bold shrink-0">
              Grade 1 - 6 Rationalized
            </span>
          </div>

          {/* Academic Year & Active Term */}
          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" /> Academic Session
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                Live Active • 2026-09-02
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Active Academic Year
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value={2026}>2026 (Active Year)</option>
                  <option value={2027}>2027 (Projected)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Active Term
                </label>
                <select
                  value={activeTerm}
                  onChange={(e) => setActiveTerm(e.target.value as TermName)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3 (Active Term)</option>
                </select>
              </div>
            </div>
          </div>

          {/* School Metadata Fields */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <School className="w-4 h-4 text-slate-600 dark:text-slate-300" /> School Identifiers (Metadata)
            </h3>

            {/* School Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                School Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Editable School Name"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Shown across header banners, reports, timetables, and marksheets.
              </p>
            </div>

            {/* Head Teacher Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Head Teacher Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={headTeacherName}
                  onChange={(e) => setHeadTeacherName(e.target.value)}
                  placeholder="e.g. Editable Head Teacher Name"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Affixed to official CBC report card remarks and notifications.
              </p>
            </div>

            {/* Postal Address (P.O. Box) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Postal Address (P.O. Box)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={poBox}
                  onChange={(e) => setPoBox(e.target.value)}
                  placeholder="e.g. P.O. Box 3443 NAKURU"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Official school postal address printed on academic reports, receipts, and certificates.
              </p>
            </div>

            {/* Official Phone & Email Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0798 193966"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. info@littleroses.ac.ke"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* School Motto */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                School Motto / Slogan
              </label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                placeholder="e.g. Much from Little"
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* County & Sub-County */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  County
                </label>
                <input
                  type="text"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  placeholder="e.g. Nakuru County"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sub-County
                </label>
                <input
                  type="text"
                  value={subCounty}
                  onChange={(e) => setSubCounty(e.target.value)}
                  placeholder="e.g. Nakuru East"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* School Code Number & is_code_editable */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  School Code Number
                </label>
                <label className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCodeEditable}
                    onChange={(e) => setIsCodeEditable(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Allow Code Editing</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  disabled={!isCodeEditable}
                  placeholder="e.g. EDITABLE_SCHOOL_NO_001"
                  required
                  className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isCodeEditable
                      ? 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                />
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Official KNEC CBA examination registration center code.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all hover:shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
