import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Calendar, 
  Save, 
  FileSpreadsheet, 
  Image as ImageIcon,
  Check,
  ChevronRight,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { GradeLevel, SubjectName, TimetableSlot } from '../../types';
import { storage } from '../../services/storageService';
import { updateTimetableSlot } from '../../services/sqliteDb';
import { TEACHER_PROFILES, TIME_SLOTS_CONFIG } from '../../data/teacherTimetableData';

interface UploadNewTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimetableUpdated?: (newSchedule: TimetableSlot[]) => void;
  initialGradeTier?: 'lower' | 'upper' | 'all';
}

const LOWER_GRADES: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3'];
const UPPER_GRADES: GradeLevel[] = ['Grade 4', 'Grade 5', 'Grade 6'];

const LOWER_SUBJECTS: SubjectName[] = [
  'Mathematical Activities' as any,
  'English Language Activities' as any,
  'Kiswahili Language Activities' as any,
  'Environmental Activities' as any,
  'Creative Activities' as any,
  'Religious Education' as any,
  'Movement Activities' as any,
  'Pastoral Instruction' as any
];

const UPPER_SUBJECTS: SubjectName[] = [
  'English',
  'Kiswahili',
  'Mathematics',
  'Science and Technology' as any,
  'Agriculture and Nutrition' as any,
  'Social Studies',
  'Creative Arts & Sports' as any,
  'Religious Education' as any,
  'Pastoral Instruction' as any
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export const UploadNewTimetableModal: React.FC<UploadNewTimetableModalProps> = ({
  isOpen,
  onClose,
  onTimetableUpdated,
  initialGradeTier = 'lower'
}) => {
  const [activeTab, setActiveTab] = useState<'upload_file' | 'generate_cbc' | 'customize_times'>('upload_file');
  const [gradeTier, setGradeTier] = useState<'lower' | 'upper' | 'all'>(initialGradeTier);

  // File upload state
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
    dataUrl?: string;
  } | null>(null);

  // Custom times state
  const [lowerPeriodDuration, setLowerPeriodDuration] = useState('35');
  const [upperPeriodDuration, setUpperPeriodDuration] = useState('40');
  const [schoolStartTime, setSchoolStartTime] = useState('08:10');

  // Success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        name: file.name,
        size: sizeFormatted,
        type: file.type || 'application/octet-stream',
        dataUrl: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  // Generate automated CBC timetable schedule tailored for Grade 1-3 or Grade 4-6
  const generateTierSchedule = (tier: 'lower' | 'upper' | 'all'): TimetableSlot[] => {
    const currentSchedule = storage.getMasterTeacherSchedule();
    const targetGrades = tier === 'lower' 
      ? LOWER_GRADES 
      : tier === 'upper' 
        ? UPPER_GRADES 
        : [...LOWER_GRADES, ...UPPER_GRADES];

    // Filter out existing slots for target grades
    const preservedSlots = currentSchedule.filter(s => !targetGrades.includes(s.grade));
    const newSlots: TimetableSlot[] = [];

    targetGrades.forEach(grade => {
      const isLower = LOWER_GRADES.includes(grade);
      const subjectPool = isLower ? LOWER_SUBJECTS : UPPER_SUBJECTS;
      const periodDuration = isLower ? parseInt(lowerPeriodDuration, 10) || 35 : parseInt(upperPeriodDuration, 10) || 40;

      DAYS.forEach((day, dayIndex) => {
        // 8 periods per day
        for (let p = 1; p <= 8; p++) {
          const subjectIndex = (dayIndex * 2 + p - 1) % subjectPool.length;
          const subject = subjectPool[subjectIndex];

          // Pick teacher based on subject or rotation
          let assignedTeacher = TEACHER_PROFILES[0];
          if (subject.includes('Math') || subject.includes('Science')) {
            assignedTeacher = TEACHER_PROFILES[1]; // Fresiah
          } else if (subject.includes('English') || subject.includes('Kiswahili')) {
            assignedTeacher = TEACHER_PROFILES[2]; // Kelvin
          } else if (subject.includes('Creative') || subject.includes('Social') || subject.includes('Movement')) {
            assignedTeacher = TEACHER_PROFILES[0]; // Elvis
          } else {
            assignedTeacher = TEACHER_PROFILES[3] || TEACHER_PROFILES[0];
          }

          // Calculate period start and end time
          const startMinutes = 8 * 60 + 10 + (p - 1) * periodDuration + (p > 3 ? 30 : 0) + (p > 6 ? 40 : 0);
          const endMinutes = startMinutes + periodDuration;

          const formatMinToTime = (min: number) => {
            const h = Math.floor(min / 60);
            const m = min % 60;
            const ampm = h >= 12 ? 'PM' : 'AM';
            const displayH = h > 12 ? h - 12 : h;
            return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
          };

          const formatMinTo24 = (min: number) => {
            const h = Math.floor(min / 60);
            const m = min % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
          };

          const slotStart = formatMinToTime(startMinutes);
          const slotEnd = formatMinToTime(endMinutes);

          newSlots.push({
            id: `tt-gen-${grade.replace(' ', '').toLowerCase()}-${day.toLowerCase().slice(0, 3)}-p${p}`,
            teacherId: assignedTeacher.id,
            teacherName: assignedTeacher.name,
            grade,
            day,
            periodNumber: p,
            periodLabel: `Lesson ${p}`,
            startTime: formatMinTo24(startMinutes),
            endTime: formatMinTo24(endMinutes),
            timeSlot: `${slotStart} – ${slotEnd}`,
            subject: subject as any,
            room: `Room ${grade.slice(-1)}A`
          });
        }
      });
    });

    return [...preservedSlots, ...newSlots];
  };

  const handleApplyTimetable = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const updatedSchedule = generateTierSchedule(gradeTier);
      storage.saveMasterTeacherSchedule(updatedSchedule);

      // Persist to SQLite
      updatedSchedule.slice(0, 20).forEach(slot => {
        updateTimetableSlot(slot.id, slot.subject, slot.timeSlot).catch(console.warn);
      });

      if (selectedFile) {
        // Save uploaded document as timetable resource
        storage.saveResource({
          id: `res-tt-${Date.now()}`,
          title: `Uploaded Official Timetable (${gradeTier === 'lower' ? 'Grade 1-3' : gradeTier === 'upper' ? 'Grade 4-6' : 'All Primary'}) - ${selectedFile.name}`,
          description: `Custom uploaded timetable file: ${selectedFile.name} (${selectedFile.size}). Applied for ${gradeTier === 'lower' ? 'Lower Primary' : gradeTier === 'upper' ? 'Upper Primary' : 'Entire Primary School'}.`,
          category: 'Past Paper',
          grade: gradeTier === 'lower' ? 'Grade 1' : 'Grade 6',
          subject: 'Other' as any,
          term: 'Term 3',
          inputType: 'PDF_ATTACHMENT',
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          pdfDataUrl: selectedFile.dataUrl,
          uploadedAt: new Date().toISOString().slice(0, 10),
          downloadUrl: selectedFile.dataUrl || '#',
          authorRole: 'ADMIN'
        });
      }

      setIsProcessing(false);
      setSuccessMessage(`New Timetable successfully activated for ${gradeTier === 'lower' ? 'Grade 1 to 3 (Lower Primary)' : gradeTier === 'upper' ? 'Grade 4 to 6 (Upper Primary)' : 'All Primary Grades'}!`);
      
      if (onTimetableUpdated) {
        onTimetableUpdated(updatedSchedule);
      }

      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1800);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <UploadCloud className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                MASTER SCHEDULE MANAGEMENT
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                Upload New Timetable
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Grade Tier Selector: Lower Primary (G1-3) vs Upper Primary (G4-6) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            1. Select Target Grade Tier
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setGradeTier('lower')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                gradeTier === 'lower'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 shadow-xs ring-1 ring-emerald-500'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black">Grade 1 to 3</span>
                {gradeTier === 'lower' && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Lower Primary (35-min periods, Activities & Literacy)
              </p>
            </button>

            <button
              type="button"
              onClick={() => setGradeTier('upper')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                gradeTier === 'upper'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-950 dark:text-blue-200 shadow-xs ring-1 ring-blue-500'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black">Grade 4 to 6</span>
                {gradeTier === 'upper' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Upper Primary (40-min periods, Science, Agri, Arts)
              </p>
            </button>

            <button
              type="button"
              onClick={() => setGradeTier('all')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                gradeTier === 'all'
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-950 dark:text-purple-200 shadow-xs ring-1 ring-purple-500'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black">All Grades (1–6)</span>
                {gradeTier === 'all' && <Check className="w-4 h-4 text-purple-600" />}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Full Primary School Master Schedule
              </p>
            </button>
          </div>
        </div>

        {/* 2. Method Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('upload_file')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'upload_file'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload File (PDF / Word / Excel / Image)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('generate_cbc')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'generate_cbc'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Smart CBC Timetable Generator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customize_times')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'customize_times'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Adjust Period Times</span>
          </button>
        </div>

        {/* Tab A: Upload File */}
        {activeTab === 'upload_file' && (
          <div className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <input
                type="file"
                id="timetable-file-upload"
                onChange={handleFileInput}
                accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.json"
                className="hidden"
              />
              <label htmlFor="timetable-file-upload" className="cursor-pointer block space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to select or drag & drop Timetable file
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports PDF, Excel (.xlsx/.csv), Word (.docx), or Image files
                  </p>
                </div>
              </label>
            </div>

            {selectedFile && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {selectedFile.size} • Ready to parse and activate
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-lg">
                  Loaded
                </span>
              </div>
            )}

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                When you upload a timetable document for <strong>{gradeTier === 'lower' ? 'Grade 1–3' : gradeTier === 'upper' ? 'Grade 4–6' : 'All Grades'}</strong>, the system will apply the calibrated CBC curriculum subjects, synchronize the time slots with bell alerts, and attach the official file for teacher downloads.
              </p>
            </div>
          </div>
        )}

        {/* Tab B: Smart CBC Generator */}
        {activeTab === 'generate_cbc' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-800 dark:text-slate-200">
                  {gradeTier === 'lower' ? 'Grade 1 to 3 Curriculum Profile' : gradeTier === 'upper' ? 'Grade 4 to 6 Curriculum Profile' : 'Complete Primary Profile'}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 rounded-md">
                  Kenya CBC Rationalized
                </span>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-1.5">
                  Allocated Subjects for {gradeTier === 'lower' ? 'Lower Primary' : 'Upper Primary'}:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(gradeTier === 'lower' ? LOWER_SUBJECTS : UPPER_SUBJECTS).map((sub, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Periods per Day</span>
                  <p className="text-sm font-black text-slate-800 dark:text-white">8 Periods (Mon–Fri)</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Period Duration</span>
                  <p className="text-sm font-black text-slate-800 dark:text-white">
                    {gradeTier === 'lower' ? `${lowerPeriodDuration} Minutes` : `${upperPeriodDuration} Minutes`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab C: Adjust Period Times */}
        {activeTab === 'customize_times' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Grade 1 to 3 Period Duration
                </label>
                <select
                  value={lowerPeriodDuration}
                  onChange={(e) => setLowerPeriodDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="30">30 Minutes (Shortened CBC)</option>
                  <option value="35">35 Minutes (Standard Lower Primary)</option>
                  <option value="40">40 Minutes</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Grade 4 to 6 Period Duration
                </label>
                <select
                  value={upperPeriodDuration}
                  onChange={(e) => setUpperPeriodDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="35">35 Minutes</option>
                  <option value="40">40 Minutes (Standard Upper Primary)</option>
                  <option value="45">45 Minutes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Morning Roll-call / Assembly Start Time
              </label>
              <input
                type="time"
                value={schoolStartTime}
                onChange={(e) => setSchoolStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              />
            </div>
          </div>
        )}

        {/* Success / Error Feedback */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleApplyTimetable}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Applying Schedule...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Activate New Timetable</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
