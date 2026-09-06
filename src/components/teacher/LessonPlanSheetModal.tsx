import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Printer, 
  Download, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  FileText, 
  School, 
  User, 
  Clock, 
  Calendar, 
  Users, 
  BookOpen, 
  Lightbulb, 
  ShieldCheck, 
  Heart,
  HelpCircle,
  Award
} from 'lucide-react';
import { 
  BlankLessonPlanSheet, 
  GradeLevel, 
  LessonDevelopmentStep 
} from '../../types';
import { 
  CBE_CORE_COMPETENCIES, 
  CBE_VALUES, 
  CBE_PCIS_SUGGESTIONS, 
  CBE_DEFAULT_LEARNING_RESOURCES,
  getRationalizedSubjectsForGrade,
  createBlankLessonPlanTemplate 
} from '../../data/cbeRationalizedCurriculumData';
import { storage } from '../../services/storageService';

interface LessonPlanSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSheet?: BlankLessonPlanSheet | null;
  onSaved?: (savedSheet: BlankLessonPlanSheet) => void;
}

const GRADES: GradeLevel[] = [
  'Grade 1', 
  'Grade 2', 
  'Grade 3', 
  'Grade 4', 
  'Grade 5', 
  'Grade 6'
];

const TERMS = ['Term 1', 'Term 2', 'Term 3'];

export const LessonPlanSheetModal: React.FC<LessonPlanSheetModalProps> = ({
  isOpen,
  onClose,
  initialSheet,
  onSaved
}) => {
  const systemConfig = storage.getSystemConfig();

  const [sheet, setSheet] = useState<BlankLessonPlanSheet>(() => {
    if (initialSheet) return initialSheet;
    return createBlankLessonPlanTemplate(systemConfig);
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<'admin' | 'alignment' | 'steps' | 'reflection'>('admin');
  const [newKIQ, setNewKIQ] = useState('');

  // Re-initialize if initialSheet changes
  useEffect(() => {
    if (initialSheet) {
      setSheet(initialSheet);
    } else if (isOpen) {
      setSheet(createBlankLessonPlanTemplate(systemConfig));
    }
  }, [initialSheet, isOpen]);

  if (!isOpen) return null;

  const currentGrade = (sheet.administrative_details.grade_level as GradeLevel) || 'Grade 1';
  const availableSubjects = getRationalizedSubjectsForGrade(currentGrade);

  // Administrative detail updates
  const updateAdmin = (field: string, value: any) => {
    setSheet(prev => {
      const updatedAdmin = { ...prev.administrative_details, [field]: value };
      if (field === 'boys' || field === 'girls') {
        const b = field === 'boys' ? (Number(value) || 0) : prev.administrative_details.roll_enrolment.boys;
        const g = field === 'girls' ? (Number(value) || 0) : prev.administrative_details.roll_enrolment.girls;
        updatedAdmin.roll_enrolment = {
          boys: b,
          girls: g,
          total: b + g
        };
      }
      return {
        ...prev,
        administrative_details: updatedAdmin
      };
    });
  };

  // Grade change handler: automatically adjust learning area subject if not valid for the new grade
  const handleGradeChange = (newGrade: GradeLevel) => {
    const subjects = getRationalizedSubjectsForGrade(newGrade);
    const currSubject = sheet.administrative_details.learning_area_subject;
    const newSubject = subjects.includes(currSubject) ? currSubject : subjects[0];
    
    setSheet(prev => ({
      ...prev,
      administrative_details: {
        ...prev.administrative_details,
        grade_level: newGrade,
        learning_area_subject: newSubject
      }
    }));
  };

  // Curriculum Alignment updates
  const updateAlignment = (field: string, value: any) => {
    setSheet(prev => ({
      ...prev,
      curriculum_alignment: {
        ...prev.curriculum_alignment,
        [field]: value
      }
    }));
  };

  const updateSLO = (field: 'knowledge_understanding' | 'skills' | 'attitudes_values', value: string) => {
    setSheet(prev => ({
      ...prev,
      curriculum_alignment: {
        ...prev.curriculum_alignment,
        specific_learning_outcomes: {
          ...prev.curriculum_alignment.specific_learning_outcomes,
          [field]: value
        }
      }
    }));
  };

  // Toggle competency
  const toggleCompetency = (comp: string) => {
    setSheet(prev => {
      const exists = prev.curriculum_alignment.core_competencies_to_develop.includes(comp);
      const updated = exists 
        ? prev.curriculum_alignment.core_competencies_to_develop.filter(c => c !== comp)
        : [...prev.curriculum_alignment.core_competencies_to_develop, comp];
      return {
        ...prev,
        curriculum_alignment: {
          ...prev.curriculum_alignment,
          core_competencies_to_develop: updated
        }
      };
    });
  };

  // Toggle value
  const toggleValue = (val: string) => {
    setSheet(prev => {
      const exists = prev.curriculum_alignment.values.includes(val);
      const updated = exists 
        ? prev.curriculum_alignment.values.filter(v => v !== val)
        : [...prev.curriculum_alignment.values, val];
      return {
        ...prev,
        curriculum_alignment: {
          ...prev.curriculum_alignment,
          values: updated
        }
      };
    });
  };

  // Toggle or add learning resource
  const toggleResource = (res: string) => {
    setSheet(prev => {
      const exists = prev.curriculum_alignment.learning_resources.includes(res);
      const updated = exists 
        ? prev.curriculum_alignment.learning_resources.filter(r => r !== res)
        : [...prev.curriculum_alignment.learning_resources, res];
      return {
        ...prev,
        curriculum_alignment: {
          ...prev.curriculum_alignment,
          learning_resources: updated
        }
      };
    });
  };

  // Add / remove KIQs
  const handleAddKIQ = () => {
    if (!newKIQ.trim()) return;
    setSheet(prev => ({
      ...prev,
      curriculum_alignment: {
        ...prev.curriculum_alignment,
        key_inquiry_questions: [...prev.curriculum_alignment.key_inquiry_questions, newKIQ.trim()]
      }
    }));
    setNewKIQ('');
  };

  const handleRemoveKIQ = (idx: number) => {
    setSheet(prev => ({
      ...prev,
      curriculum_alignment: {
        ...prev.curriculum_alignment,
        key_inquiry_questions: prev.curriculum_alignment.key_inquiry_questions.filter((_, i) => i !== idx)
      }
    }));
  };

  // Update step
  const updateStep = (index: number, field: keyof LessonDevelopmentStep, value: string) => {
    setSheet(prev => {
      const steps = [...prev.lesson_development_steps];
      steps[index] = { ...steps[index], [field]: value };
      return { ...prev, lesson_development_steps: steps };
    });
  };

  // Reflection updates
  const updateReflection = (field: 'successes_and_strengths' | 'challenges_observed' | 'remedial_and_next_steps', value: string) => {
    setSheet(prev => ({
      ...prev,
      post_lesson_reflection: {
        ...prev.post_lesson_reflection,
        [field]: value
      }
    }));
  };

  // Save handler
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    storage.saveLessonPlanSheet(sheet);
    if (onSaved) onSaved(sheet);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  // Reset to blank template
  const handleResetToBlank = () => {
    if (confirm('Reset form fields to a clean Blank Lesson Plan Sheet template?')) {
      const blank = createBlankLessonPlanTemplate(systemConfig);
      setSheet(blank);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sheet, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Lesson_Plan_${sheet.administrative_details.grade_level}_${sheet.administrative_details.learning_area_subject}_W${sheet.administrative_details.week}_L${sheet.administrative_details.lesson_number}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-4 max-h-[95vh] flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border-b border-blue-800 no-print gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl">
              <FileText className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[10px] font-black uppercase tracking-wider">
                  CBE Lesson Plan Generator
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  35-Minute Rationalized Template
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight font-heading mt-0.5">
                Official Blank Lesson Plan Sheet
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handlePrint}
              type="button"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              title="Print Lesson Plan Sheet"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleExportJSON}
              type="button"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              title="Export as JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            <button
              onClick={handleResetToBlank}
              type="button"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
              title="Reset to Blank Template"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECTION SWITCHER PILLS (No-print) */}
        <div className="flex items-center gap-1 p-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-print">
          <button
            type="button"
            onClick={() => setActiveSection('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSection === 'admin'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>1. Administrative Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('alignment')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSection === 'alignment'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>2. Curriculum Alignment & SLOs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('steps')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSection === 'steps'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>3. Lesson Steps (35 Mins)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('reflection')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSection === 'reflection'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>4. Post-Lesson Reflection</span>
          </button>
        </div>

        {/* PRINT BANNER (Visible on Print) */}
        <div className="hidden print:block p-4 border-b border-slate-900 text-center">
          <h1 className="text-xl font-black uppercase tracking-wider">{sheet.administrative_details.school_name}</h1>
          <p className="text-xs font-bold">REVISED / RATIONALIZED COMPETENCY-BASED EDUCATION (CBE) LESSON PLAN SHEET</p>
          <p className="text-[10px] text-slate-600">School Code: {sheet.administrative_details.school_code} | Duration: {sheet.administrative_details.time}</p>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* SECTION 1: ADMINISTRATIVE DETAILS */}
          {(activeSection === 'admin' || window.matchMedia?.('print')?.matches) && (
            <div className="p-5 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 text-xs font-black">
                    1
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Administrative Details
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  TSC & Institutional Metadata
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* School Name */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    School Name
                  </label>
                  <input
                    type="text"
                    value={sheet.administrative_details.school_name}
                    onChange={(e) => updateAdmin('school_name', e.target.value)}
                    placeholder="e.g. Editable School Name"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  />
                </div>

                {/* School Code */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    School Code
                  </label>
                  <input
                    type="text"
                    value={sheet.administrative_details.school_code}
                    onChange={(e) => updateAdmin('school_code', e.target.value)}
                    placeholder="e.g. EDITABLE_SCHOOL_NO_001"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  />
                </div>

                {/* Teacher Name */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Teacher Name
                  </label>
                  <input
                    type="text"
                    value={sheet.administrative_details.teacher_name}
                    onChange={(e) => updateAdmin('teacher_name', e.target.value)}
                    placeholder="e.g. Tr. M. Wanjiku"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  />
                </div>

                {/* TSC Number */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    TSC Number
                  </label>
                  <input
                    type="text"
                    value={sheet.administrative_details.tsc_number}
                    onChange={(e) => updateAdmin('tsc_number', e.target.value)}
                    placeholder="e.g. TSC/892341/KE"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={sheet.administrative_details.date}
                    onChange={(e) => updateAdmin('date', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  />
                </div>

                {/* Time / Duration */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Time / Duration
                  </label>
                  <input
                    type="text"
                    value={sheet.administrative_details.time}
                    onChange={(e) => updateAdmin('time', e.target.value)}
                    placeholder="35 mins"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  />
                </div>

                {/* Grade Level */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Grade Level
                  </label>
                  <select
                    value={sheet.administrative_details.grade_level}
                    onChange={(e) => handleGradeChange(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                  >
                    {GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Learning Area / Subject */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Learning Area (Rationalized CBE)
                  </label>
                  <select
                    value={sheet.administrative_details.learning_area_subject}
                    onChange={(e) => updateAdmin('learning_area_subject', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-blue-900 dark:text-blue-300"
                  >
                    {availableSubjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Term */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Academic Term
                  </label>
                  <select
                    value={sheet.administrative_details.term}
                    onChange={(e) => updateAdmin('term', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  >
                    {TERMS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Week */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Week Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={sheet.administrative_details.week}
                    onChange={(e) => updateAdmin('week', Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  />
                </div>

                {/* Lesson Number */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Lesson Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={sheet.administrative_details.lesson_number}
                    onChange={(e) => updateAdmin('lesson_number', Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  />
                </div>

                {/* Roll Enrolment (Boys, Girls, Total) */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Roll Enrolment (Boys / Girls / Total)
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <input
                      type="number"
                      min="0"
                      value={sheet.administrative_details.roll_enrolment.boys}
                      onChange={(e) => updateAdmin('boys', e.target.value)}
                      placeholder="Boys"
                      title="Boys"
                      className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold text-blue-700 dark:text-blue-300"
                    />
                    <input
                      type="number"
                      min="0"
                      value={sheet.administrative_details.roll_enrolment.girls}
                      onChange={(e) => updateAdmin('girls', e.target.value)}
                      placeholder="Girls"
                      title="Girls"
                      className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold text-rose-700 dark:text-rose-300"
                    />
                    <div 
                      title="Auto Total (Boys + Girls)" 
                      className="w-full px-2 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-center font-black text-emerald-800 dark:text-emerald-300 flex items-center justify-center"
                    >
                      {sheet.administrative_details.roll_enrolment.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CURRICULUM ALIGNMENT */}
          {(activeSection === 'alignment' || window.matchMedia?.('print')?.matches) && (
            <div className="p-5 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 text-xs font-black">
                    2
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Curriculum Alignment & Specific Learning Outcomes (SLOs)
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  Strands, Competencies, Values & Realia
                </span>
              </div>

              {/* Strand & Sub-strand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Strand
                  </label>
                  <input
                    type="text"
                    value={sheet.curriculum_alignment.strand}
                    onChange={(e) => updateAlignment('strand', e.target.value)}
                    placeholder="e.g. Numbers / Natural Environment / Crop Production"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Sub-Strand
                  </label>
                  <input
                    type="text"
                    value={sheet.curriculum_alignment.sub_strand}
                    onChange={(e) => updateAlignment('sub_strand', e.target.value)}
                    placeholder="e.g. Addition and Subtraction up to 20"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* SLO Triad: Knowledge/Understanding, Skills, Attitudes/Values */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                  Specific Learning Outcomes (SLOs) Triad
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Knowledge & Understanding */}
                  <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/80 dark:border-blue-900 space-y-1">
                    <span className="font-bold text-blue-900 dark:text-blue-300 block text-[11px] uppercase">
                      a) Knowledge & Understanding
                    </span>
                    <textarea
                      rows={3}
                      value={sheet.curriculum_alignment.specific_learning_outcomes.knowledge_understanding}
                      onChange={(e) => updateSLO('knowledge_understanding', e.target.value)}
                      placeholder="By the end of the lesson, the learner should be able to..."
                      className="w-full p-2 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 rounded-lg text-slate-800 dark:text-slate-200 text-xs"
                    />
                  </div>

                  {/* Skills */}
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-900 space-y-1">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 block text-[11px] uppercase">
                      b) Skills
                    </span>
                    <textarea
                      rows={3}
                      value={sheet.curriculum_alignment.specific_learning_outcomes.skills}
                      onChange={(e) => updateSLO('skills', e.target.value)}
                      placeholder="By the end of the lesson, the learner should be able to..."
                      className="w-full p-2 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 rounded-lg text-slate-800 dark:text-slate-200 text-xs"
                    />
                  </div>

                  {/* Attitudes & Values */}
                  <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-900 space-y-1">
                    <span className="font-bold text-amber-900 dark:text-amber-300 block text-[11px] uppercase">
                      c) Attitudes & Values
                    </span>
                    <textarea
                      rows={3}
                      value={sheet.curriculum_alignment.specific_learning_outcomes.attitudes_values}
                      onChange={(e) => updateSLO('attitudes_values', e.target.value)}
                      placeholder="By the end of the lesson, the learner should be able to..."
                      className="w-full p-2 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 rounded-lg text-slate-800 dark:text-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Key Inquiry Questions (KIQs) */}
              <div className="space-y-2 pt-2 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  Key Inquiry Questions (KIQs)
                </label>
                <div className="space-y-1.5">
                  {sheet.curriculum_alignment.key_inquiry_questions.map((kiq, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={kiq}
                        onChange={(e) => {
                          const updated = [...sheet.curriculum_alignment.key_inquiry_questions];
                          updated[idx] = e.target.value;
                          updateAlignment('key_inquiry_questions', updated);
                        }}
                        placeholder="e.g. How do we determine the total count when two sets merge?"
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveKIQ(idx)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newKIQ}
                      onChange={(e) => setNewKIQ(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddKIQ(); }}}
                      placeholder="Type a new key inquiry question and press Add..."
                      className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddKIQ}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded-xl font-bold text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add KIQ
                    </button>
                  </div>
                </div>
              </div>

              {/* Core Competencies (Chips toggle) */}
              <div className="space-y-2 pt-2 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  Core Competencies to Develop (Select applicable)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CBE_CORE_COMPETENCIES.map((comp) => {
                    const active = sheet.curriculum_alignment.core_competencies_to_develop.includes(comp);
                    return (
                      <button
                        type="button"
                        key={comp}
                        onClick={() => toggleCompetency(comp)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs ${
                          active
                            ? 'bg-indigo-900 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {active && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{comp}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Values & PCIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                {/* Values */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Values
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CBE_VALUES.map((val) => {
                      const active = sheet.curriculum_alignment.values.includes(val);
                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => toggleValue(val)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                            active
                              ? 'bg-rose-900 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${active ? 'fill-white' : 'text-slate-400'}`} />
                          <span>{val}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PCIs */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Pertinent & Contemporary Issues (PCIs)
                  </label>
                  <input
                    type="text"
                    value={sheet.curriculum_alignment.pertinent_and_contemporary_issues_pcis.join(', ')}
                    onChange={(e) => updateAlignment('pertinent_and_contemporary_issues_pcis', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="e.g. Environmental Conservation, Health & Hygiene, Child Rights"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                  <div className="flex flex-wrap gap-1">
                    {CBE_PCIS_SUGGESTIONS.slice(0, 3).map((pci) => (
                      <button
                        key={pci}
                        type="button"
                        onClick={() => {
                          const current = sheet.curriculum_alignment.pertinent_and_contemporary_issues_pcis.filter(Boolean);
                          if (!current.includes(pci)) {
                            updateAlignment('pertinent_and_contemporary_issues_pcis', [...current, pci]);
                          }
                        }}
                        className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-md text-slate-600 dark:text-slate-400"
                      >
                        + {pci}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Resources */}
              <div className="space-y-2 pt-2 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  Learning Resources & Realia
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CBE_DEFAULT_LEARNING_RESOURCES.map((res) => {
                    const active = sheet.curriculum_alignment.learning_resources.includes(res);
                    return (
                      <button
                        type="button"
                        key={res}
                        onClick={() => toggleResource(res)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                          active
                            ? 'bg-blue-900 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {res}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: LESSON DEVELOPMENT STEPS (35 MINS) */}
          {(activeSection === 'steps' || window.matchMedia?.('print')?.matches) && (
            <div className="p-5 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 text-xs font-black">
                    3
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Lesson Development Steps (35 Minutes Breakdown)
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  Total: 35 Minutes
                </span>
              </div>

              {/* 5-Step Development Table / Cards */}
              <div className="space-y-4">
                {sheet.lesson_development_steps.map((step, idx) => (
                  <div 
                    key={step.step_number}
                    className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-900 text-white flex items-center justify-center font-black text-xs">
                          {step.step_number}
                        </span>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {step.step_name}
                        </h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-[11px] self-start sm:self-auto">
                        Duration: {step.duration}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {/* Teacher Activity */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">
                          Teacher Activity
                        </label>
                        <textarea
                          rows={3}
                          value={step.teacher_activity}
                          onChange={(e) => updateStep(idx, 'teacher_activity', e.target.value)}
                          placeholder="Teacher guides, models, asks, demonstrates..."
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs"
                        />
                      </div>

                      {/* Learner Activity */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">
                          Learner Activity
                        </label>
                        <textarea
                          rows={3}
                          value={step.learner_activity}
                          onChange={(e) => updateStep(idx, 'learner_activity', e.target.value)}
                          placeholder="Learners observe, discuss in pairs, practice with counters..."
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs"
                        />
                      </div>

                      {/* Assessment Mode */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">
                          Assessment Mode
                        </label>
                        <input
                          type="text"
                          value={step.assessment_mode}
                          onChange={(e) => updateStep(idx, 'assessment_mode', e.target.value)}
                          placeholder="Observation / Questioning / Written check"
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs"
                        />
                        <div className="flex flex-wrap gap-1 pt-1">
                          {['Oral check', 'Observation', 'Written task', 'Peer rubric'].map(mode => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => updateStep(idx, 'assessment_mode', mode)}
                              className="text-[10px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300"
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: POST-LESSON REFLECTION */}
          {(activeSection === 'reflection' || window.matchMedia?.('print')?.matches) && (
            <div className="p-5 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 text-xs font-black">
                    4
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Post-Lesson Reflection & Teacher Evaluation
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  Continuous Professional Reflection
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Successes and Strengths */}
                <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 block text-xs uppercase tracking-wide">
                    Successes & Strengths Observed
                  </span>
                  <textarea
                    rows={4}
                    value={sheet.post_lesson_reflection.successes_and_strengths}
                    onChange={(e) => updateReflection('successes_and_strengths', e.target.value)}
                    placeholder="e.g. 90% of learners mastered combining single digit numbers with tangible counters..."
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs"
                  />
                </div>

                {/* Challenges Observed */}
                <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-1.5">
                  <span className="font-bold text-rose-900 dark:text-rose-300 block text-xs uppercase tracking-wide">
                    Challenges & Learning Gaps
                  </span>
                  <textarea
                    rows={4}
                    value={sheet.post_lesson_reflection.challenges_observed}
                    onChange={(e) => updateReflection('challenges_observed', e.target.value)}
                    placeholder="e.g. 3 learners hesitated with regrouping on the ten-frame..."
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs"
                  />
                </div>

                {/* Remedial and Next Steps */}
                <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800 space-y-1.5">
                  <span className="font-bold text-blue-900 dark:text-blue-300 block text-xs uppercase tracking-wide">
                    Remedial & Next Instructional Steps
                  </span>
                  <textarea
                    rows={4}
                    value={sheet.post_lesson_reflection.remedial_and_next_steps}
                    onChange={(e) => updateReflection('remedial_and_next_steps', e.target.value)}
                    placeholder="e.g. Peer pairing during morning remedial drills; reinforce with tactile bead strings..."
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SIGNATURE SECTION (PRINT ONLY) */}
          <div className="hidden print:grid grid-cols-2 gap-8 pt-8 text-xs border-t border-slate-400 mt-6">
            <div>
              <p className="font-bold">Teacher's Signature: _______________________</p>
              <p className="mt-1">Date: {sheet.administrative_details.date}</p>
            </div>
            <div>
              <p className="font-bold">Head Teacher's Signature: _______________________</p>
              <p className="mt-1">Date Checked: _______________________</p>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                Lesson Plan Sheet Saved Successfully!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Lesson Plan Sheet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
