import React, { useState, useEffect } from 'react';
import { 
  TermName, 
  GradeLevel, 
  SubjectName, 
  SchemeOfWork, 
  LessonPlan, 
  RecordOfWork, 
  BlankLessonPlanSheet,
  SystemConfig
} from '../../types';
import { 
  BookOpen, 
  FileText, 
  ClipboardCheck, 
  Plus, 
  Calendar, 
  Paperclip, 
  Edit3, 
  Trash2, 
  Download, 
  Printer, 
  CheckCircle,
  Clock,
  Sparkles,
  Table,
  LayoutGrid,
  Copy,
  Eye,
  ArrowRight,
  ShieldCheck,
  School,
  UserCheck,
  Users,
  UploadCloud
} from 'lucide-react';
import { storage } from '../../services/storageService';
import { LessonPlanSheetModal } from './LessonPlanSheetModal';
import { RawSchemeQuickUpload } from './RawSchemeQuickUpload';
import { getRationalizedSubjectsForGrade } from '../../data/cbeRationalizedCurriculumData';

interface SchemesAndLessonsViewProps {
  schemes: SchemeOfWork[];
  lessons: LessonPlan[];
  records: RecordOfWork[];
  initialSubTab?: 'schemes' | 'lessons' | 'records' | 'rawUpload';
  onOpenCreateModal: (type: 'scheme' | 'lesson' | 'record') => void;
  onOpenEditModal: (type: 'scheme' | 'lesson' | 'record', item: any) => void;
}

const TERMS: TermName[] = ['Term 1', 'Term 2', 'Term 3'];
const GRADES: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

export const SchemesAndLessonsView: React.FC<SchemesAndLessonsViewProps> = ({
  schemes: initialSchemes,
  lessons: initialLessons,
  records: initialRecords,
  initialSubTab = 'schemes',
  onOpenCreateModal,
  onOpenEditModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schemes' | 'lessons' | 'records' | 'rawUpload'>(initialSubTab);
  
  // System config state
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => storage.getSystemConfig());

  // Filters
  const [selectedTerm, setSelectedTerm] = useState<TermName>(systemConfig.active_term || 'Term 3');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Grade 1');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  
  // Schemes View Mode: table vs cards
  const [schemeViewMode, setSchemeViewMode] = useState<'table' | 'cards'>('table');
  
  // Lesson Plans sub-mode: Blank CBE Sheets (4-part) vs Quick Lesson Notes
  const [lessonPlanMode, setLessonPlanMode] = useState<'sheets' | 'notes'>('sheets');

  // Blank Lesson Plan Sheets state
  const [lessonPlanSheets, setLessonPlanSheets] = useState<BlankLessonPlanSheet[]>(() => storage.getLessonPlanSheets());
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [selectedSheetForEdit, setSelectedSheetForEdit] = useState<BlankLessonPlanSheet | null>(null);

  // Sync state on updates
  const refreshSheets = () => {
    setLessonPlanSheets(storage.getLessonPlanSheets());
  };

  useEffect(() => {
    setSystemConfig(storage.getSystemConfig());
    refreshSheets();
  }, []);

  // Available subjects for the selected grade under Revised CBE
  const availableSubjects = getRationalizedSubjectsForGrade(selectedGrade);

  // Reset selectedSubject if not valid for current grade
  useEffect(() => {
    if (selectedSubject !== 'All' && !availableSubjects.includes(selectedSubject)) {
      setSelectedSubject('All');
    }
  }, [selectedGrade, availableSubjects, selectedSubject]);

  // Filter items
  const filteredSchemes = initialSchemes.filter(s => 
    s.term === selectedTerm && 
    s.grade === selectedGrade && 
    (selectedSubject === 'All' || s.subject === selectedSubject)
  );

  const filteredLegacyLessons = initialLessons.filter(l => 
    l.term === selectedTerm && 
    l.grade === selectedGrade && 
    (selectedSubject === 'All' || l.subject === selectedSubject)
  );

  const filteredSheets = lessonPlanSheets.filter(sheet => {
    const admin = sheet.administrative_details;
    const matchTerm = !admin.term || admin.term === selectedTerm;
    const matchGrade = !admin.grade_level || admin.grade_level === selectedGrade;
    const matchSubject = selectedSubject === 'All' || admin.learning_area_subject === selectedSubject;
    return matchTerm && matchGrade && matchSubject;
  });

  const filteredRecords = initialRecords.filter(r => 
    r.term === selectedTerm && 
    r.grade === selectedGrade && 
    (selectedSubject === 'All' || r.subject === selectedSubject)
  );

  // Delete handlers
  const handleDeleteLegacy = (type: 'scheme' | 'lesson' | 'record', id: string) => {
    if (confirm(`Are you sure you want to delete this ${type} entry?`)) {
      if (type === 'scheme') storage.deleteScheme(id);
      if (type === 'lesson') storage.deleteLessonPlan(id);
      if (type === 'record') storage.deleteRecordOfWork(id);
    }
  };

  const handleDeleteSheet = (sheetId: string) => {
    if (confirm('Are you sure you want to delete this CBE Lesson Plan Sheet?')) {
      storage.deleteLessonPlanSheet(sheetId);
      refreshSheets();
    }
  };

  const handleDuplicateSheet = (sheet: BlankLessonPlanSheet) => {
    const cloned = storage.createBlankLessonPlanSheet({
      administrative_details: {
        ...sheet.administrative_details,
        lesson_number: (sheet.administrative_details.lesson_number || 1) + 1
      },
      curriculum_alignment: { ...sheet.curriculum_alignment },
      lesson_development_steps: [...sheet.lesson_development_steps],
      post_lesson_reflection: { ...sheet.post_lesson_reflection }
    });
    refreshSheets();
    setSelectedSheetForEdit(cloned);
    setIsSheetModalOpen(true);
  };

  // Convert a Scheme of Work entry into a full CBE Lesson Plan Sheet
  const handleConvertSchemeToLessonPlan = (scheme: SchemeOfWork) => {
    const newSheet = storage.createBlankLessonPlanSheet({
      administrative_details: {
        school_name: systemConfig.school_metadata.school_name,
        school_code: systemConfig.school_metadata.school_code_number,
        teacher_name: 'Tr. M. Wanjiku',
        tsc_number: 'TSC/892341/KE',
        date: new Date().toISOString().slice(0, 10),
        time: '35 mins',
        roll_enrolment: { boys: 16, girls: 16, total: 32 },
        grade_level: scheme.grade,
        learning_area_subject: scheme.subject,
        term: scheme.term,
        week: scheme.week,
        lesson_number: scheme.lesson
      },
      curriculum_alignment: {
        strand: scheme.strand,
        sub_strand: scheme.subStrand,
        specific_learning_outcomes: {
          knowledge_understanding: scheme.specificLearningOutcomes,
          skills: scheme.learningExperiences || 'Learners actively manipulate concrete realia, interact in pairs, and demonstrate competencies.',
          attitudes_values: 'Cultivate respect, integrity, and collaborative curiosity.'
        },
        key_inquiry_questions: [scheme.keyInquiryQuestions],
        core_competencies_to_develop: ['Communication and Collaboration', 'Critical Thinking and Problem Solving'],
        values: ['Respect', 'Responsibility', 'Integrity'],
        pertinent_and_contemporary_issues_pcis: ['Environmental awareness and life skills'],
        learning_resources: [scheme.learningResources]
      }
    });
    refreshSheets();
    setSelectedSheetForEdit(newSheet);
    setIsSheetModalOpen(true);
  };

  // CSV Exporters
  const exportSchemesCSV = () => {
    const headers = [
      'Week',
      'Lesson',
      'Grade',
      'Subject',
      'Term',
      'Strand',
      'Sub-Strand',
      'Specific Learning Outcomes (SLOs)',
      'Key Inquiry Questions (KIQs)',
      'Learning Experiences',
      'Learning Resources',
      'Assessment Methods',
      'Reflection'
    ];
    const rows = filteredSchemes.map(s => [
      `"${s.week}"`,
      `"${s.lesson}"`,
      `"${s.grade}"`,
      `"${s.subject}"`,
      `"${s.term}"`,
      `"${(s.strand || '').replace(/"/g, '""')}"`,
      `"${(s.subStrand || '').replace(/"/g, '""')}"`,
      `"${(s.specificLearningOutcomes || '').replace(/"/g, '""')}"`,
      `"${(s.keyInquiryQuestions || '').replace(/"/g, '""')}"`,
      `"${(s.learningExperiences || '').replace(/"/g, '""')}"`,
      `"${(s.learningResources || '').replace(/"/g, '""')}"`,
      `"${(s.assessmentMethods || '').replace(/"/g, '""')}"`,
      `"${(s.reflectionRemarks || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CBE_Schemes_Of_Work_${selectedGrade}_${selectedTerm}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportLessonPlansCSV = () => {
    const headers = [
      'ID',
      'Grade',
      'Subject',
      'Term',
      'Week',
      'Lesson',
      'Date',
      'Duration',
      'Roll Total',
      'Boys',
      'Girls',
      'Strand',
      'Sub-Strand',
      'SLO Knowledge',
      'SLO Skills',
      'SLO Values',
      'Key Inquiry Questions',
      'Step 1 Introduction',
      'Step 2 Discovery',
      'Step 3 Application',
      'Step 4 Summary',
      'Step 5 Extended/Assessment'
    ];
    const rows = filteredSheets.map(s => [
      `"${s.id}"`,
      `"${s.administrative_details.grade_level}"`,
      `"${s.administrative_details.learning_area_subject}"`,
      `"${s.administrative_details.term}"`,
      `"${s.administrative_details.week}"`,
      `"${s.administrative_details.lesson_number}"`,
      `"${s.administrative_details.date}"`,
      `"${s.administrative_details.time}"`,
      `"${s.administrative_details.roll_enrolment.total}"`,
      `"${s.administrative_details.roll_enrolment.boys}"`,
      `"${s.administrative_details.roll_enrolment.girls}"`,
      `"${(s.curriculum_alignment.strand || '').replace(/"/g, '""')}"`,
      `"${(s.curriculum_alignment.sub_strand || '').replace(/"/g, '""')}"`,
      `"${(s.curriculum_alignment.specific_learning_outcomes.knowledge_understanding || '').replace(/"/g, '""')}"`,
      `"${(s.curriculum_alignment.specific_learning_outcomes.skills || '').replace(/"/g, '""')}"`,
      `"${(s.curriculum_alignment.specific_learning_outcomes.attitudes_values || '').replace(/"/g, '""')}"`,
      `"${(s.curriculum_alignment.key_inquiry_questions.join('; ') || '').replace(/"/g, '""')}"`,
      `"${(s.lesson_development_steps[0]?.teacher_activity || '').replace(/"/g, '""')}"`,
      `"${(s.lesson_development_steps[1]?.teacher_activity || '').replace(/"/g, '""')}"`,
      `"${(s.lesson_development_steps[2]?.teacher_activity || '').replace(/"/g, '""')}"`,
      `"${(s.lesson_development_steps[3]?.teacher_activity || '').replace(/"/g, '""')}"`,
      `"${(s.lesson_development_steps[4]?.teacher_activity || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CBE_Lesson_Plan_Sheets_${selectedGrade}_${selectedTerm}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* 1. REVISED CBE SYSTEM CONFIGURATION BANNER */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-blue-900/60 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-400 text-slate-950 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Revised / Rationalized CBE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-800/80 text-blue-200 border border-blue-700/50">
                Grade 1 - 6 Coverage
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white">
                Academic Year {systemConfig.active_academic_year} • {systemConfig.active_term}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight font-heading">
              CBE Professional Documents & Schemes of Work Engine
            </h1>
            <p className="text-xs text-blue-200/90 max-w-3xl leading-relaxed">
              Standardized termly schemes across all rationalized learning areas with complete 10-column KICD alignment, plus official 35-minute blank instructional lesson plan sheets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-blue-200 font-bold">
                <School className="w-3.5 h-3.5 text-amber-400" />
                <span>{systemConfig.school_metadata.school_name}</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                Code: {systemConfig.school_metadata.school_code_number}
              </p>
            </div>
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-blue-200 font-bold">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Head Teacher:</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {systemConfig.school_metadata.head_teacher_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP ACTIONS & PRIMARY TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Module Sub-Tabs (Schemes of Work, Lesson Plans, Records of Work) */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 max-w-xl shadow-xs">
          <button
            onClick={() => setActiveSubTab('schemes')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'schemes'
                ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Schemes of Work</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">
              {filteredSchemes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('lessons')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'lessons'
                ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Lesson Plans</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              {filteredSheets.length + filteredLegacyLessons.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('records')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'records'
                ? 'bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Records of Work</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold">
              {filteredRecords.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('rawUpload')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'rawUpload'
                ? 'bg-[#1a237e] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-sky-400" />
            <span className="whitespace-nowrap">Raw Schemes & Notes</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-200 dark:bg-sky-950 text-sky-900 dark:text-sky-300 font-bold">
              Live Clock
            </span>
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeSubTab === 'schemes' && (
            <>
              {/* Table / Card View Toggle */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setSchemeViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    schemeViewMode === 'table'
                      ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="10-Column KICD Table View"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">10-Col Table</span>
                </button>
                <button
                  onClick={() => setSchemeViewMode('cards')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    schemeViewMode === 'cards'
                      ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Detailed Cards View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cards</span>
                </button>
              </div>

              <button
                onClick={exportSchemesCSV}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
                title="Export Schemes to CSV"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.print()}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors no-print"
                title="Print Document"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenCreateModal('scheme')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>New Scheme of Work</span>
              </button>
            </>
          )}

          {activeSubTab === 'lessons' && (
            <>
              <button
                onClick={exportLessonPlansCSV}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
                title="Export Lesson Plans to CSV"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.print()}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors no-print"
                title="Print Document"
              >
                <Printer className="w-4 h-4" />
              </button>
              {/* PRIMARY USER ACTION: Add Blank Lesson Plan Sheet */}
              <button
                onClick={() => {
                  setSelectedSheetForEdit(null);
                  setIsSheetModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-95"
                title="Create a new 35-minute blank CBE instructional lesson plan sheet"
              >
                <Plus className="w-4 h-4" />
                <span>Add Blank Lesson Plan Sheet</span>
              </button>
            </>
          )}

          {activeSubTab === 'records' && (
            <>
              <button
                onClick={() => window.print()}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors no-print"
                title="Print Document"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenCreateModal('record')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>New Record of Work</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3. DUAL-TIER FILTER BAR (Term, Grade & Rationalized Subject Pills) */}
      {activeSubTab !== 'rawUpload' && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            {/* Term Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold uppercase text-slate-400 mr-1">Term:</span>
              {TERMS.map((term) => (
                <button
                  key={term}
                  onClick={() => setSelectedTerm(term)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    selectedTerm === term
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Grade Level Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-xs font-extrabold uppercase text-slate-400 mr-1">Grade:</span>
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    selectedGrade === g
                      ? 'bg-indigo-900 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Rationalized Subject Pills */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>
                Rationalized Subjects for {selectedGrade} ({['Grade 1', 'Grade 2', 'Grade 3'].includes(selectedGrade) ? 'Lower Primary: 7 Areas' : 'Upper Primary: 8 Areas'}):
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400">
                Active Subject: {selectedSubject}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setSelectedSubject('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
                  selectedSubject === 'All'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                All Subjects
              </button>
              {availableSubjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors ${
                    selectedSubject === sub
                      ? 'bg-blue-900 text-white dark:bg-blue-700 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. CONTENT: RAW SCHEMES QUICK UPLOAD (OFFLINE NOTEPAD & LIVE CLOCK)  */}
      {/* ==================================================================== */}
      {activeSubTab === 'rawUpload' && (
        <RawSchemeQuickUpload teacherName={storage.getActiveTeacherProfile().name} />
      )}

      {/* ==================================================================== */}
      {/* 4. CONTENT: SCHEMES OF WORK ENGINE                                   */}
      {/* ==================================================================== */}
      {activeSubTab === 'schemes' && (
        <div className="space-y-4">
          {filteredSchemes.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                No Schemes of Work recorded for {selectedGrade} • {selectedTerm}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Click "New Scheme of Work" to add KICD competency strands, SLOs, KIQs, learning experiences, and assessment methods.
              </p>
            </div>
          ) : schemeViewMode === 'table' ? (
            /* 10-COLUMN KICD CBE STANDARD TABLE VIEW */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    KICD 10-Column Schemes of Work Register ({selectedGrade} • {selectedTerm})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Week, Lesson, Strand, Sub-Strand, SLOs, KIQs, Experiences, Resources, Assessment, Reflection
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {filteredSchemes.length} Lessons Scheduled
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 uppercase font-black text-[10px] tracking-wider">
                      <th className="p-3 w-12 text-center">Wk</th>
                      <th className="p-3 w-12 text-center">Lsn</th>
                      <th className="p-3 w-36">Subject</th>
                      <th className="p-3 w-36">Strand & SubStrand</th>
                      <th className="p-3 min-w-[200px]">Specific Learning Outcomes (SLOs)</th>
                      <th className="p-3 min-w-[150px]">Key Inquiry Questions (KIQs)</th>
                      <th className="p-3 min-w-[200px]">Learning Experiences</th>
                      <th className="p-3 min-w-[140px]">Learning Resources</th>
                      <th className="p-3 min-w-[140px]">Assessment</th>
                      <th className="p-3 min-w-[150px]">Reflection / Remarks</th>
                      <th className="p-3 w-28 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filteredSchemes.map((scheme) => (
                      <tr key={scheme.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
                        <td className="p-3 text-center font-black text-blue-900 dark:text-blue-300">
                          {scheme.week}
                        </td>
                        <td className="p-3 text-center font-black text-slate-600 dark:text-slate-400">
                          {scheme.lesson}
                        </td>
                        <td className="p-3">
                          <span className="font-extrabold text-slate-900 dark:text-white block">
                            {scheme.subject}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {scheme.grade} • {scheme.term}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            {scheme.strand}
                          </span>
                          <span className="text-slate-500 text-[11px]">
                            {scheme.subStrand}
                          </span>
                        </td>
                        <td className="p-3 leading-relaxed">
                          {scheme.specificLearningOutcomes}
                        </td>
                        <td className="p-3 italic text-slate-600 dark:text-slate-400">
                          {scheme.keyInquiryQuestions}
                        </td>
                        <td className="p-3 leading-relaxed text-slate-800 dark:text-slate-200">
                          {scheme.learningExperiences || (
                            <span className="italic text-slate-400">Learners collaborate in groups manipulating realia.</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                          {scheme.learningResources}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                          {scheme.assessmentMethods}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 italic text-[11px]">
                          {scheme.reflectionRemarks || '—'}
                        </td>
                        <td className="p-3 text-right pr-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Convert to Blank Lesson Plan Sheet */}
                            <button
                              onClick={() => handleConvertSchemeToLessonPlan(scheme)}
                              className="p-1.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-900"
                              title="Generate Blank CBE Lesson Plan Sheet from this Scheme"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">Lesson Sheet</span>
                            </button>
                            <button
                              onClick={() => onOpenEditModal('scheme', scheme)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                              title="Edit Scheme"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLegacy('scheme', scheme.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                              title="Delete Scheme"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* DETAILED CARD VIEW */
            filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-black text-xs">
                      Week {scheme.week} • Lesson {scheme.lesson}
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-base">
                      {scheme.subject}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">({scheme.grade} • {scheme.term})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleConvertSchemeToLessonPlan(scheme)}
                      className="px-3 py-1.5 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Convert to Lesson Plan Sheet</span>
                    </button>
                    <button
                      onClick={() => onOpenEditModal('scheme', scheme)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLegacy('scheme', scheme.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Strand & Sub-Strand</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{scheme.strand}</p>
                    <p className="text-slate-600 dark:text-slate-400">{scheme.subStrand}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Specific Learning Outcomes (SLOs)</span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">{scheme.specificLearningOutcomes}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Key Inquiry Questions (KIQs)</span>
                    <p className="italic text-slate-700 dark:text-slate-300 mt-0.5">{scheme.keyInquiryQuestions}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Learning Experiences</span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                      {scheme.learningExperiences || 'Learners actively interact with realia in small groups.'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Learning Resources</span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{scheme.learningResources}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Assessment Methods</span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{scheme.assessmentMethods}</p>
                  </div>
                </div>

                {scheme.reflectionRemarks && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Teacher's Reflection & Remarks:</span>
                    <p className="text-slate-600 dark:text-slate-400 italic">"{scheme.reflectionRemarks}"</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. CONTENT: LESSON PLANS (Blank CBE Sheets + Quick Lesson Notes)     */}
      {/* ==================================================================== */}
      {activeSubTab === 'lessons' && (
        <div className="space-y-5">
          {/* Sub-toggle: Blank 35-min Sheets vs Legacy Quick Notes */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setLessonPlanMode('sheets')}
                className={`px-3 py-1.5 rounded-lg font-black transition-all flex items-center gap-1.5 ${
                  lessonPlanMode === 'sheets'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Official CBE 35-Min Blank Sheets ({filteredSheets.length})</span>
              </button>
              <button
                onClick={() => setLessonPlanMode('notes')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  lessonPlanMode === 'notes'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Quick Lesson Notes ({filteredLegacyLessons.length})</span>
              </button>
            </div>

            <span className="text-[11px] font-bold text-slate-400">
              {lessonPlanMode === 'sheets' ? '35-Minute Standard 4-Part Structure' : 'General Outline Notes'}
            </span>
          </div>

          {/* VIEW: OFFICIAL 35-MIN CBE LESSON PLAN SHEETS */}
          {lessonPlanMode === 'sheets' && (
            <div className="space-y-4">
              {filteredSheets.length === 0 ? (
                <div className="text-center py-14 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-6 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    No Blank Lesson Plan Sheets for {selectedGrade} • {selectedTerm}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Click <strong>"Add Blank Lesson Plan Sheet"</strong> to configure a full 35-minute competency lesson sheet with Administrative Details, Curriculum Alignment, 5-Step Lesson Development, and Post-Lesson Reflection.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedSheetForEdit(null);
                      setIsSheetModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Blank Lesson Plan Sheet</span>
                  </button>
                </div>
              ) : (
                filteredSheets.map((sheet) => {
                  const admin = sheet.administrative_details;
                  const align = sheet.curriculum_alignment;
                  const steps = sheet.lesson_development_steps;
                  const refl = sheet.post_lesson_reflection;

                  return (
                    <div
                      key={sheet.id}
                      className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all"
                    >
                      {/* Sheet Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                              {admin.grade_level} • {admin.learning_area_subject}
                            </span>
                            <span className="text-xs font-bold text-slate-500">
                              Week {admin.week}, Lesson {admin.lesson_number} • {admin.time}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1">
                              <Users className="w-3 h-3 text-slate-400" />
                              Roll: {admin.roll_enrolment.total} (B: {admin.roll_enrolment.boys}, G: {admin.roll_enrolment.girls})
                            </span>
                          </div>
                          <h2 className="text-base font-black text-slate-900 dark:text-white font-heading">
                            {align.strand} : {align.sub_strand}
                          </h2>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() => {
                              setSelectedSheetForEdit(sheet);
                              setIsSheetModalOpen(true);
                            }}
                            className="p-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-900"
                            title="Edit Lesson Plan Sheet"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Edit Sheet</span>
                          </button>
                          <button
                            onClick={() => handleDuplicateSheet(sheet)}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
                            title="Duplicate Sheet"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSheet(sheet.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs"
                            title="Delete Sheet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Triad of Specific Learning Outcomes */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200/60 dark:border-blue-900/60">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 dark:text-blue-300 block mb-1">
                            1. Knowledge & Understanding
                          </span>
                          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                            {align.specific_learning_outcomes.knowledge_understanding}
                          </p>
                        </div>

                        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/60">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
                            2. Practical Skills
                          </span>
                          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                            {align.specific_learning_outcomes.skills}
                          </p>
                        </div>

                        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-2xl border border-amber-200/60 dark:border-amber-900/60">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-1">
                            3. Attitudes & Values
                          </span>
                          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                            {align.specific_learning_outcomes.attitudes_values}
                          </p>
                        </div>
                      </div>

                      {/* 5-Step Lesson Development Timeline Overview */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                          5-Step Instructional Flow (35 Minutes)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                          {steps.map((st) => (
                            <div
                              key={st.step_number}
                              className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-black text-slate-900 dark:text-white text-[11px]">
                                  Step {st.step_number}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white dark:bg-slate-700 rounded font-bold text-slate-600 dark:text-slate-300">
                                  {st.duration}
                                </span>
                              </div>
                              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block truncate">
                                {st.step_name}
                              </span>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                                {st.teacher_activity}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reflection & Remarks */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="font-bold text-slate-600 dark:text-slate-300">Teacher Reflection: </span>
                          <span className="italic text-slate-500">
                            {refl.successes_and_strengths || 'Session fully achieved; learners demonstrated core competencies.'}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 shrink-0">
                          TSC: {admin.tsc_number} • Date: {admin.date}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* VIEW: QUICK LESSON NOTES (LEGACY 3-STEP OUTLINES) */}
          {lessonPlanMode === 'notes' && (
            <div className="space-y-4">
              {filteredLegacyLessons.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                    No Quick Lesson Notes recorded for {selectedGrade} • {selectedTerm}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Click "Add Blank Lesson Plan Sheet" above to use the official 4-part CBE generator.
                  </p>
                </div>
              ) : (
                filteredLegacyLessons.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                            {plan.date} • {plan.durationMinutes} mins
                          </span>
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {plan.subject}: {plan.strand}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Sub-strand: {plan.subStrand} | Week {plan.week}, Lesson {plan.lessonNumber}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenEditModal('lesson', plan)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLegacy('lesson', plan.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Lesson Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-blue-700 dark:text-blue-400 block mb-1">1. Introduction (5 mins)</span>
                        <p className="text-slate-600 dark:text-slate-300">{plan.introduction}</p>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">2. Lesson Development (25 mins)</span>
                        <p className="text-slate-600 dark:text-slate-300">{plan.lessonDevelopment}</p>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">3. Conclusion (5 mins)</span>
                        <p className="text-slate-600 dark:text-slate-300">{plan.conclusion}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. CONTENT: RECORDS OF WORK                                          */}
      {/* ==================================================================== */}
      {activeSubTab === 'records' && (
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
              <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                No Records of Work covered for {selectedGrade} • {selectedTerm}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Click "New Record of Work" to log completed lessons, syllabus coverage, and remedial actions.
              </p>
            </div>
          ) : (
            filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-extrabold text-xs">
                      Week {rec.week} • Lesson {rec.lesson}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {rec.subject} ({rec.grade} • {rec.term})
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenEditModal('record', rec)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLegacy('record', rec.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Work Planned</span>
                    <p className="text-slate-700 dark:text-slate-200">{rec.workPlanned}</p>
                  </div>
                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/60 dark:border-emerald-900/60">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block mb-1">Work Actually Covered</span>
                    <p className="text-slate-700 dark:text-slate-200">{rec.workCovered}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Challenges Encountered</span>
                    <p className="text-slate-600 dark:text-slate-400 italic">"{rec.challengesEncountered}"</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Remedial Action Taken</span>
                    <p className="text-slate-600 dark:text-slate-400 italic">"{rec.remedialAction}"</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Teacher Signature: <strong className="text-slate-800 dark:text-slate-200">{rec.teacherSignature}</strong></span>
                  <span>Date Checked: <strong className="text-slate-800 dark:text-slate-200">{rec.dateChecked}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 7. MODAL: OFFICIAL BLANK CBE LESSON PLAN SHEET (4-PART STRUCTURE) */}
      <LessonPlanSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => {
          setIsSheetModalOpen(false);
          setSelectedSheetForEdit(null);
        }}
        initialSheet={selectedSheetForEdit}
        onSaved={refreshSheets}
      />
    </div>
  );
};
