import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  UserPlus, 
  Copy, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { Student, GradeLevel } from '../../types';
import { storage } from '../../services/storageService';

interface BulkStudentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
  defaultGrade?: GradeLevel;
}

interface ParsedLearner {
  admissionNumber: string;
  name: string;
  grade: GradeLevel;
  gender: 'Male' | 'Female';
  parentName: string;
  parentPhone: string;
  isValid: boolean;
  errors: string[];
}

export const BulkStudentImportModal: React.FC<BulkStudentImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultGrade = 'Grade 1'
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'single'>('paste');
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);

  // Single learner state
  const [singleAdmNo, setSingleAdmNo] = useState('');
  const [singleName, setSingleName] = useState('');
  const [singleGrade, setSingleGrade] = useState<GradeLevel>(defaultGrade);
  const [singleGender, setSingleGender] = useState<'Male' | 'Female'>('Male');
  const [singleParent, setSingleParent] = useState('');
  const [singlePhone, setSinglePhone] = useState('');
  const [singleAddress, setSingleAddress] = useState('');

  if (!isOpen) return null;

  const sampleTemplate = `LRA-2026-101, Amani Wanjiku, ${defaultGrade}, Female, Sarah Wanjiku, 0712 345678
LRA-2026-102, Brian Kiprono, ${defaultGrade}, Male, John Kiprono, 0722 456789
LRA-2026-103, Faith Chebet, ${defaultGrade}, Female, Mary Chebet, 0733 567890
LRA-2026-104, Dalton Ngugi, ${defaultGrade}, Male, Peter Ngugi, 0714 678901
LRA-2026-105, Joy Wangari, ${defaultGrade}, Female, Grace Wangari, 0725 789012`;

  const handleFillSample = () => {
    setRawText(sampleTemplate);
  };

  // Parse lines
  const parseRows = (): ParsedLearner[] => {
    if (!rawText.trim()) return [];
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const existingStudents = storage.getStudents();
    const existingAdmNos = new Set(existingStudents.map(s => s.admissionNumber.toUpperCase().trim()));

    const result: ParsedLearner[] = [];
    let counter = existingStudents.length + 101;

    lines.forEach((line, index) => {
      // Split by comma or tab
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      const cleanParts = parts.map(p => p.trim());

      const errors: string[] = [];
      let admNo = '';
      let name = '';
      let grade: GradeLevel = defaultGrade;
      let gender: 'Male' | 'Female' = 'Male';
      let parentName = 'Parent / Guardian';
      let parentPhone = '0700 000000';

      if (cleanParts.length >= 2) {
        // If first part looks like an Admission No (e.g., LRA-...)
        if (/^(LRA|ADM|STD|[A-Z]{2,4}[-/\s]?\d+)/i.test(cleanParts[0])) {
          admNo = cleanParts[0].toUpperCase();
          name = cleanParts[1] || '';
          if (cleanParts[2]) {
            const g = cleanParts[2].trim();
            if (['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].includes(g)) {
              grade = g as GradeLevel;
            }
          }
          if (cleanParts[3]) {
            const g = cleanParts[3].toLowerCase();
            gender = (g.startsWith('f') || g === 'girl') ? 'Female' : 'Male';
          }
          if (cleanParts[4]) parentName = cleanParts[4];
          if (cleanParts[5]) parentPhone = cleanParts[5];
        } else {
          // Format without adm no: Name, Grade, Gender, Parent, Phone
          name = cleanParts[0];
          admNo = `LRA-2026-${String(counter++).padStart(3, '0')}`;
          if (cleanParts[1]) {
            const g = cleanParts[1].trim();
            if (['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].includes(g)) {
              grade = g as GradeLevel;
            }
          }
          if (cleanParts[2]) {
            const g = cleanParts[2].toLowerCase();
            gender = (g.startsWith('f') || g === 'girl') ? 'Female' : 'Male';
          }
          if (cleanParts[3]) parentName = cleanParts[3];
          if (cleanParts[4]) parentPhone = cleanParts[4];
        }
      } else if (cleanParts.length === 1 && cleanParts[0]) {
        // Just name provided
        name = cleanParts[0];
        admNo = `LRA-2026-${String(counter++).padStart(3, '0')}`;
      }

      if (!name) errors.push('Missing student full name');
      if (existingAdmNos.has(admNo.toUpperCase().trim())) {
        errors.push(`Admission number ${admNo} already exists in records`);
      }

      result.push({
        admissionNumber: admNo,
        name,
        grade,
        gender,
        parentName,
        parentPhone,
        isValid: errors.length === 0,
        errors
      });
    });

    return result;
  };

  const parsedLearners = parseRows();
  const validLearners = parsedLearners.filter(l => l.isValid);

  const handleBulkImport = async () => {
    if (validLearners.length === 0) return;
    setIsProcessing(true);

    try {
      const addedStudents: Student[] = [];
      for (const item of validLearners) {
        const newStudent: Student = {
          id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          admissionNumber: item.admissionNumber,
          name: item.name,
          grade: item.grade,
          gender: item.gender,
          parentName: item.parentName,
          parentPhone: item.parentPhone,
          emergencyContact: item.parentPhone,
          attendanceRate: 100,
          catMarks: {
            'Mathematics': { cat1: 0, cat2: 0, endTerm: 0 },
            'English': { cat1: 0, cat2: 0, endTerm: 0 },
            'Kiswahili': { cat1: 0, cat2: 0, endTerm: 0 },
            'Science': { cat1: 0, cat2: 0, endTerm: 0 },
            'Creative Arts': { cat1: 0, cat2: 0, endTerm: 0 },
            'CRE': { cat1: 0, cat2: 0, endTerm: 0 }
          }
        };
        storage.saveStudent(newStudent);
        addedStudents.push(newStudent);
      }

      setImportResult({
        success: true,
        message: `Successfully imported ${addedStudents.length} new learners into the school registry!`
      });
      setIsProcessing(false);
      setTimeout(() => {
        onSuccess(addedStudents.length);
        onClose();
      }, 1200);
    } catch (e: any) {
      setIsProcessing(false);
      setImportResult({
        success: false,
        message: e?.message || 'Failed to complete bulk student import'
      });
    }
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleName.trim()) return;

    const adm = singleAdmNo.trim() || `LRA-2026-${String(storage.getStudents().length + 101).padStart(3, '0')}`;
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      admissionNumber: adm,
      name: singleName.trim(),
      grade: singleGrade,
      gender: singleGender,
      parentName: singleParent.trim() || 'Parent / Guardian',
      parentPhone: singlePhone.trim() || '0700 000000',
      emergencyContact: singlePhone.trim() || '0700 000000',
      homeAddress: singleAddress.trim(),
      attendanceRate: 100,
      catMarks: {
        'Mathematics': { cat1: 0, cat2: 0, endTerm: 0 },
        'English': { cat1: 0, cat2: 0, endTerm: 0 },
        'Kiswahili': { cat1: 0, cat2: 0, endTerm: 0 },
        'Science': { cat1: 0, cat2: 0, endTerm: 0 },
        'Creative Arts': { cat1: 0, cat2: 0, endTerm: 0 },
        'CRE': { cat1: 0, cat2: 0, endTerm: 0 }
      }
    };

    storage.saveStudent(newStudent);
    onSuccess(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/40 border border-blue-400/40 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-heading tracking-tight flex items-center gap-2">
                Add & Bulk Import Learners
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                  Admin Privileges
                </span>
              </h2>
              <p className="text-xs text-blue-200">
                Register students with unique admission numbers and parent contacts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'paste'
                ? 'bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Bulk Paste / Spreadsheet Import
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'single'
                ? 'bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Add Single Learner
          </button>
        </div>

        {/* Tab 1: Bulk Paste */}
        {activeTab === 'paste' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Format: <code>ADM NO, FULL NAME, GRADE, GENDER, PARENT NAME, PHONE</code></span>
              </div>
              <button
                type="button"
                onClick={handleFillSample}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Fill Sample Data
              </button>
            </div>

            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste student rows here from Excel, Google Sheets, or CSV...
Example:
LRA-2026-101, Amani Wanjiku, Grade 1, Female, Sarah Wanjiku, 0712345678
LRA-2026-102, Brian Kiprono, Grade 1, Male, John Kiprono, 0722345678"
              rows={7}
              className="w-full p-3.5 text-xs font-mono rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden transition-all"
            />

            {/* Parsed Live Preview */}
            {parsedLearners.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Detected Learners ({parsedLearners.length}):</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {validLearners.length} valid ready to import
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {parsedLearners.map((item, i) => (
                    <div
                      key={i}
                      className={`p-2.5 flex items-center justify-between ${
                        item.isValid ? 'bg-white dark:bg-slate-900' : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.isValid ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {item.name} <span className="font-normal text-slate-500">({item.grade} • {item.gender})</span>
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Adm: {item.admissionNumber} • Parent: {item.parentName} ({item.parentPhone})
                          </p>
                        </div>
                      </div>
                      {item.errors.length > 0 && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-900/60 px-2 py-0.5 rounded-md">
                          {item.errors[0]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {importResult && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  importResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}
              >
                {importResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{importResult.message}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                disabled={isProcessing || validLearners.length === 0}
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-950/20 flex items-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Import {validLearners.length} Learners
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Single Learner Form */}
        {activeTab === 'single' && (
          <form onSubmit={handleSingleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  placeholder="e.g. Joy Wangari"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Unique Admission Number
                </label>
                <input
                  type="text"
                  value={singleAdmNo}
                  onChange={(e) => setSingleAdmNo(e.target.value)}
                  placeholder="Auto-generated if blank (e.g. LRA-2026-108)"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Grade Level *
                </label>
                <select
                  value={singleGrade}
                  onChange={(e) => setSingleGrade(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gender *
                </label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={singleGender === 'Male'}
                      onChange={() => setSingleGender('Male')}
                      className="text-blue-600"
                    />
                    Male (Boy)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={singleGender === 'Female'}
                      onChange={() => setSingleGender('Female')}
                      className="text-blue-600"
                    />
                    Female (Girl)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  value={singleParent}
                  onChange={(e) => setSingleParent(e.target.value)}
                  placeholder="e.g. Mary Wangari"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parent Phone Number
                </label>
                <input
                  type="text"
                  value={singlePhone}
                  onChange={(e) => setSinglePhone(e.target.value)}
                  placeholder="e.g. 0722 123456"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Home Address / Location (Optional)
              </label>
              <input
                type="text"
                value={singleAddress}
                onChange={(e) => setSingleAddress(e.target.value)}
                placeholder="e.g. Section 58, Nakuru"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-950/20 flex items-center gap-2 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Register Student
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
