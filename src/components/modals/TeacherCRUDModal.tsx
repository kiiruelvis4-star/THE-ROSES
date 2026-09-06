import React, { useState } from 'react';
import { 
  GradeLevel, 
  SubjectName, 
  TermName, 
  SchemeOfWork, 
  LessonPlan, 
  RecordOfWork, 
  Assignment, 
  Quiz, 
  QuizQuestion, 
  ResourceItem, 
  CalendarEvent, 
  Student, 
  STANDARD_SUBJECTS 
} from '../../types';
import { getRationalizedSubjectsForGrade } from '../../data/cbeRationalizedCurriculumData';
import { storage } from '../../services/storageService';
import { X, Save, Plus, Trash2, Paperclip, UploadCloud, Sparkles, ShieldCheck, FileText } from 'lucide-react';

export type CRUDModalType = 
  | 'scheme' 
  | 'lesson' 
  | 'record' 
  | 'assignment' 
  | 'quiz' 
  | 'resource' 
  | 'event' 
  | 'student'
  | null;

interface TeacherCRUDModalProps {
  type: CRUDModalType;
  initialData?: any;
  onClose: () => void;
  isOpen?: boolean;
  onSave?: () => void;
}

const GRADES: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
const TERMS: TermName[] = ['Term 1', 'Term 2', 'Term 3'];

export const TeacherCRUDModal: React.FC<TeacherCRUDModalProps> = ({
  type,
  initialData,
  onClose,
  isOpen,
  onSave
}) => {
  if (isOpen === false || !type) return null;

  // Form states based on modal type
  // 1. SCHEME
  const [schemeGrade, setSchemeGrade] = useState<GradeLevel>(initialData?.grade || 'Grade 6');
  const [schemeSubject, setSchemeSubject] = useState<SubjectName>(initialData?.subject || 'Mathematics');
  const [schemeTerm, setSchemeTerm] = useState<TermName>(initialData?.term || 'Term 1');
  const [schemeWeek, setSchemeWeek] = useState<number>(initialData?.week || 1);
  const [schemeLesson, setSchemeLesson] = useState<number>(initialData?.lesson || 1);
  const [schemeStrand, setSchemeStrand] = useState<string>(initialData?.strand || '');
  const [schemeSubStrand, setSchemeSubStrand] = useState<string>(initialData?.subStrand || '');
  const [schemeOutcomes, setSchemeOutcomes] = useState<string>(initialData?.specificLearningOutcomes || '');
  const [schemeQuestions, setSchemeQuestions] = useState<string>(initialData?.keyInquiryQuestions || '');
  const [schemeExperiences, setSchemeExperiences] = useState<string>(initialData?.learningExperiences || '');
  const [schemeResources, setSchemeResources] = useState<string>(initialData?.learningResources || '');
  const [schemeAssess, setSchemeAssess] = useState<string>(initialData?.assessmentMethods || '');
  const [schemeRemarks, setSchemeRemarks] = useState<string>(initialData?.reflectionRemarks || '');

  // 2. LESSON PLAN
  const [lpStrand, setLpStrand] = useState(initialData?.strand || '');
  const [lpSubStrand, setLpSubStrand] = useState(initialData?.subStrand || '');
  const [lpIntro, setLpIntro] = useState(initialData?.introduction || '');
  const [lpDev, setLpDev] = useState(initialData?.lessonDevelopment || '');
  const [lpConc, setLpConc] = useState(initialData?.conclusion || '');
  const [lpDuration, setLpDuration] = useState<number>(initialData?.durationMinutes || 40);

  // 3. RECORD OF WORK
  const [recPlanned, setRecPlanned] = useState(initialData?.workPlanned || '');
  const [recCovered, setRecCovered] = useState(initialData?.workCovered || '');
  const [recChallenges, setRecChallenges] = useState(initialData?.challengesEncountered || '');
  const [recRemedial, setRecRemedial] = useState(initialData?.remedialAction || '');

  // 4. ASSIGNMENT
  const [asgTitle, setAsgTitle] = useState(initialData?.title || '');
  const [asgInstructions, setAsgInstructions] = useState(initialData?.instructions || '');
  const [asgDueDate, setAsgDueDate] = useState(initialData?.dueDate || '2026-03-15');
  const [asgMarks, setAsgMarks] = useState<number>(initialData?.totalMarks || 30);

  // 5. QUIZ
  const [quizTitle, setQuizTitle] = useState(initialData?.title || '');
  const [quizTime, setQuizTime] = useState<number>(initialData?.timeLimitMinutes || 10);
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialData?.questions || [
    {
      id: 'q-1',
      question: 'What is 450 rounded off to the nearest hundred?',
      options: ['400', '500', '450', '600'],
      correctAnswerIndex: 1,
      explanation: '450 is midway between 400 and 500, so it rounds up to 500.'
    }
  ]);

  // 6. RESOURCE
  const [resTitle, setResTitle] = useState(initialData?.title || '');
  const [resDesc, setResDesc] = useState(initialData?.description || '');
  const [resCategory, setResCategory] = useState(initialData?.category || 'Textbook');
  const [resInputType, setResInputType] = useState<'PDF_ATTACHMENT' | 'RAW_TEXT_AI_COPY'>(initialData?.inputType || 'PDF_ATTACHMENT');
  const [resFileName, setResFileName] = useState<string>(initialData?.fileName || '');
  const [resFileSize, setResFileSize] = useState<string>(initialData?.fileSize || '3.2 MB');
  const [resPdfDataUrl, setResPdfDataUrl] = useState<string>(initialData?.pdfDataUrl || '');
  const [resFileError, setResFileError] = useState<string | null>(null);
  const [resMarkdown, setResMarkdown] = useState<string>(initialData?.markdownContent || '');
  const [resPreviewMode, setResPreviewMode] = useState<boolean>(false);
  const [adminAuthInput, setAdminAuthInput] = useState<string>('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [isUnlockedAdmin, setIsUnlockedAdmin] = useState<boolean>(storage.isAdminAuthenticated());

  // 7. CALENDAR EVENT
  const [eventTitle, setEventTitle] = useState(initialData?.title || '');
  const [eventDate, setEventDate] = useState(initialData?.date || '2026-03-10');
  const [eventCategory, setEventCategory] = useState(initialData?.category || 'Term Date');
  const [eventDesc, setEventDesc] = useState(initialData?.description || '');

  // 8. STUDENT
  const [stName, setStName] = useState(initialData?.name || '');
  const [stAdm, setStAdm] = useState(initialData?.admissionNumber || `LRA/2026/${Math.floor(100 + Math.random() * 900)}`);
  const [stGrade, setStGrade] = useState<GradeLevel>(initialData?.grade || 'Grade 6');
  const [stGender, setStGender] = useState<'Male' | 'Female'>(initialData?.gender || 'Female');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'scheme') {
      const scheme: SchemeOfWork = {
        id: initialData?.id || `sch-${Date.now()}`,
        grade: schemeGrade,
        subject: schemeSubject,
        term: schemeTerm,
        week: schemeWeek,
        lesson: schemeLesson,
        strand: schemeStrand || 'Numbers & Operations',
        subStrand: schemeSubStrand || 'Fractions & Decimals',
        specificLearningOutcomes: schemeOutcomes || 'By the end of the lesson, the learner should be able to solve basic problems.',
        keyInquiryQuestions: schemeQuestions || 'How do we divide fractions in real life?',
        learningExperiences: schemeExperiences || 'Learners actively interact with realia in small groups to solve inquiry questions.',
        learningResources: schemeResources || 'CBC Textbook Page 45, Counters, Manila paper',
        assessmentMethods: schemeAssess || 'Oral questions, written quiz, observation',
        reflectionRemarks: schemeRemarks,
        attachments: initialData?.attachments || [{ name: 'Grade6_Curriculum_Guide.pdf', size: '2.4 MB', url: '#' }]
      };
      storage.saveScheme(scheme);
    } else if (type === 'lesson') {
      const plan: LessonPlan = {
        id: initialData?.id || `lp-${Date.now()}`,
        grade: schemeGrade,
        subject: schemeSubject,
        term: schemeTerm,
        week: schemeWeek,
        lessonNumber: schemeLesson,
        date: new Date().toISOString().slice(0, 10),
        durationMinutes: lpDuration,
        strand: lpStrand || 'Matter and Energy',
        subStrand: lpSubStrand || 'Conductors of Electricity',
        introduction: lpIntro || 'Review previous lesson by asking learners to name electrical appliances.',
        lessonDevelopment: lpDev || 'Guide learners in assembling dry cells, wires, and bulbs to test conductivity.',
        conclusion: lpConc || 'Summarize findings on the whiteboard and assign review homework.',
        coreCompetencies: ['Critical Thinking', 'Collaboration'],
        values: ['Integrity', 'Respect']
      };
      storage.saveLessonPlan(plan);
    } else if (type === 'record') {
      const rec: RecordOfWork = {
        id: initialData?.id || `rec-${Date.now()}`,
        grade: schemeGrade,
        subject: schemeSubject,
        term: schemeTerm,
        week: schemeWeek,
        lesson: schemeLesson,
        workPlanned: recPlanned || 'Addition of fractions with unlike denominators',
        workCovered: recCovered || 'All exercise items 1 through 10 fully completed by all learners',
        challengesEncountered: recChallenges || 'Some learners took extra time finding Lowest Common Multiples',
        remedialAction: recRemedial || 'Conducted 15 minutes morning remedial practice on LCM',
        teacherSignature: 'Tr. Jane Wangari',
        dateChecked: new Date().toISOString().slice(0, 10)
      };
      storage.saveRecordOfWork(rec);
    } else if (type === 'assignment') {
      const asg: Assignment = {
        id: initialData?.id || `asg-${Date.now()}`,
        title: asgTitle || 'CBC Weekly Practice Exercise',
        subject: schemeSubject,
        grade: schemeGrade,
        instructions: asgInstructions || 'Answer all questions on your ruled exercise book and show all work steps.',
        dueDate: asgDueDate,
        totalMarks: asgMarks,
        submissionsCount: initialData?.submissionsCount || 0,
        attachments: [{ name: 'Assignment_Questions.pdf', size: '1.2 MB', url: '#' }]
      };
      storage.saveAssignment(asg);
    } else if (type === 'quiz') {
      const qz: Quiz = {
        id: initialData?.id || `qz-${Date.now()}`,
        title: quizTitle || 'Weekly CBC Review Quiz',
        subject: schemeSubject,
        grade: schemeGrade,
        timeLimitMinutes: quizTime,
        questions: questions
      };
      storage.saveQuiz(qz);
    } else if (type === 'resource') {
      const res: ResourceItem = {
        id: initialData?.id || `res-${Date.now()}`,
        title: resTitle || 'CBC Learning Aid & Text Guide',
        subject: schemeSubject,
        grade: schemeGrade,
        category: resCategory,
        description: resDesc || 'Comprehensive curriculum support material and practice problems.',
        fileType: resInputType === 'PDF_ATTACHMENT' ? 'pdf' : 'markdown',
        inputType: resInputType,
        fileName: resFileName || (resInputType === 'PDF_ATTACHMENT' ? `${resTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf` : undefined),
        fileSize: resInputType === 'PDF_ATTACHMENT' ? resFileSize : `${Math.max(1, Math.ceil((resMarkdown.length || 200) / 1024))} KB`,
        pdfDataUrl: resPdfDataUrl,
        markdownContent: resInputType === 'RAW_TEXT_AI_COPY' ? resMarkdown : undefined,
        uploadedAt: new Date().toISOString().slice(0, 10),
        downloadUrl: '#',
        authorRole: 'ADMIN'
      };
      storage.saveResource(res);
    } else if (type === 'event') {
      const ev: CalendarEvent = {
        id: initialData?.id || `ev-${Date.now()}`,
        title: eventTitle || 'School Event',
        date: eventDate,
        category: eventCategory,
        description: eventDesc || 'Little Roses Academy academic calendar activity.'
      };
      storage.saveCalendarEvent(ev);
    } else if (type === 'student') {
      const newStudent: Student = {
        id: initialData?.id || `st-${Date.now()}`,
        admissionNumber: stAdm,
        name: stName || 'New Learner',
        grade: stGrade,
        gender: stGender,
        avatar: `https://images.unsplash.com/photo-${stGender === 'Female' ? '1534528741775-53994a69daeb' : '1539571696357-5a69c17a67c6'}?w=150&auto=format&fit=crop&q=80`,
        catMarks: initialData?.catMarks || {
          Mathematics: { cat1: 25, cat2: 26, endTerm: 88 },
          English: { cat1: 27, cat2: 28, endTerm: 90 },
          Kiswahili: { cat1: 24, cat2: 25, endTerm: 82 },
          Science: { cat1: 28, cat2: 27, endTerm: 91 },
          Agriculture: { cat1: 26, cat2: 25, endTerm: 85 },
          'Creative Arts': { cat1: 27, cat2: 28, endTerm: 89 },
          'Social Studies': { cat1: 25, cat2: 26, endTerm: 86 },
          CRE: { cat1: 28, cat2: 29, endTerm: 92 }
        }
      };
      storage.saveStudent(newStudent);
    }

    onSave?.();
    onClose();
  };

  const getTitle = () => {
    const isEdit = !!initialData?.id;
    if (type === 'scheme') return isEdit ? 'Edit Scheme of Work' : 'Create Scheme of Work';
    if (type === 'lesson') return isEdit ? 'Edit Lesson Plan' : 'Create Lesson Plan';
    if (type === 'record') return isEdit ? 'Edit Record of Work' : 'New Record of Work Covered';
    if (type === 'assignment') return isEdit ? 'Edit Homework Assignment' : 'Post Homework Assignment';
    if (type === 'quiz') return isEdit ? 'Edit Quiz Zone Challenge' : 'Create Quiz Zone Challenge';
    if (type === 'resource') return 'Upload Teaching Resource / Text';
    if (type === 'event') return 'Add Calendar Event';
    if (type === 'student') return isEdit ? 'Edit Student Details' : 'Enroll New Learner';
    return 'Manage Entry';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              LITTLE ROSES ACADEMY • CBC TEACHER ACTION
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white font-heading mt-0.5">
              {getTitle()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* COMMON SELECTORS FOR GRADE, SUBJECT, TERM */}
          {(type === 'scheme' || type === 'lesson' || type === 'record' || type === 'assignment' || type === 'quiz' || type === 'resource') && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Grade Level</label>
                <select
                  value={schemeGrade}
                  onChange={(e) => {
                    const newGrade = e.target.value as GradeLevel;
                    setSchemeGrade(newGrade);
                    const validSubs = getRationalizedSubjectsForGrade(newGrade);
                    if (!validSubs.includes(schemeSubject)) {
                      setSchemeSubject(validSubs[0] as SubjectName);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200"
                >
                  {GRADES.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject (Rationalized CBE)</label>
                <select
                  value={schemeSubject}
                  onChange={(e) => setSchemeSubject(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200"
                >
                  {getRationalizedSubjectsForGrade(schemeGrade).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Term</label>
                <select
                  value={schemeTerm}
                  onChange={(e) => setSchemeTerm(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200"
                >
                  {TERMS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TYPE: SCHEME OF WORK */}
          {type === 'scheme' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Week</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={schemeWeek}
                    onChange={(e) => setSchemeWeek(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lesson Number</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={schemeLesson}
                    onChange={(e) => setSchemeLesson(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Strand</label>
                  <input
                    type="text"
                    placeholder="e.g. Numbers & Operations"
                    value={schemeStrand}
                    onChange={(e) => setSchemeStrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Sub-Strand</label>
                  <input
                    type="text"
                    placeholder="e.g. Multiplication of Decimals"
                    value={schemeSubStrand}
                    onChange={(e) => setSchemeSubStrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Specific Learning Outcomes</label>
                <textarea
                  rows={2}
                  placeholder="By the end of the sub-strand, the learner should be able to..."
                  value={schemeOutcomes}
                  onChange={(e) => setSchemeOutcomes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Learning Experiences</label>
                <textarea
                  rows={2}
                  placeholder="Learners in pairs or groups manipulate real objects, solve problems, and demonstrate skills..."
                  value={schemeExperiences}
                  onChange={(e) => setSchemeExperiences(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Key Inquiry Questions</label>
                  <input
                    type="text"
                    placeholder="How do we calculate percentages?"
                    value={schemeQuestions}
                    onChange={(e) => setSchemeQuestions(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Learning Resources</label>
                  <input
                    type="text"
                    placeholder="KLB Mathematics Grade 6 pg 45, Manila charts, Realia"
                    value={schemeResources}
                    onChange={(e) => setSchemeResources(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assessment Methods</label>
                <input
                  type="text"
                  placeholder="Observation checklist, oral questioning, practical rubric, written test"
                  value={schemeAssess}
                  onChange={(e) => setSchemeAssess(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Teacher's Reflection & Remarks</label>
                <input
                  type="text"
                  placeholder="Lesson successfully delivered; 95% concept mastery achieved."
                  value={schemeRemarks}
                  onChange={(e) => setSchemeRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* TYPE: LESSON PLAN */}
          {type === 'lesson' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Strand</label>
                  <input
                    type="text"
                    placeholder="Strand title"
                    value={lpStrand}
                    onChange={(e) => setLpStrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Sub-Strand</label>
                  <input
                    type="text"
                    placeholder="Sub-strand topic"
                    value={lpSubStrand}
                    onChange={(e) => setLpSubStrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">1. Introduction (5 mins)</label>
                <textarea
                  rows={2}
                  value={lpIntro}
                  onChange={(e) => setLpIntro(e.target.value)}
                  placeholder="Warm-up questions, recalling previous knowledge..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">2. Lesson Development (25 mins)</label>
                <textarea
                  rows={3}
                  value={lpDev}
                  onChange={(e) => setLpDev(e.target.value)}
                  placeholder="Teacher demonstration, group exploration, learner activities..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">3. Conclusion (10 mins)</label>
                <textarea
                  rows={2}
                  value={lpConc}
                  onChange={(e) => setLpConc(e.target.value)}
                  placeholder="Summary plenary, formative assessment quiz, assignment..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* TYPE: RECORD OF WORK */}
          {type === 'record' && (
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Work Planned (from Scheme)</label>
                <textarea
                  rows={2}
                  value={recPlanned}
                  onChange={(e) => setRecPlanned(e.target.value)}
                  placeholder="Lesson objectives planned for this period..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Work Actually Covered</label>
                <textarea
                  rows={2}
                  value={recCovered}
                  onChange={(e) => setRecCovered(e.target.value)}
                  placeholder="Classroom content and exercises completed..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Challenges Encountered</label>
                  <input
                    type="text"
                    value={recChallenges}
                    onChange={(e) => setRecChallenges(e.target.value)}
                    placeholder="e.g. Power outage during projector demo"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Remedial Action Taken</label>
                  <input
                    type="text"
                    value={recRemedial}
                    onChange={(e) => setRecRemedial(e.target.value)}
                    placeholder="e.g. Physical group demonstrations conducted"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TYPE: ASSIGNMENT */}
          {type === 'assignment' && (
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Fractions & Decimal Conversion Practice"
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Instructions & Questions</label>
                <textarea
                  rows={4}
                  value={asgInstructions}
                  onChange={(e) => setAsgInstructions(e.target.value)}
                  placeholder="Specify question numbers, tasks, and rubric criteria..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={asgMarks}
                    onChange={(e) => setAsgMarks(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TYPE: QUIZ */}
          {type === 'quiz' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Quiz Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Ecosystems Challenge"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Limit (Mins)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={quizTime}
                    onChange={(e) => setQuizTime(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Questions Builder */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white uppercase text-[11px]">
                    Quiz Questions ({questions.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuestions(q => [
                        ...q,
                        {
                          id: `q-${Date.now()}`,
                          question: 'New question prompt...',
                          options: ['Option A', 'Option B', 'Option C', 'Option D'],
                          correctAnswerIndex: 0,
                          explanation: 'Explanation for correct answer.'
                        }
                      ]);
                    }}
                    className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                {questions.map((q, qIdx) => (
                  <div key={q.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500">Question #{qIdx + 1}</span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setQuestions(qs => qs.filter((_, i) => i !== qIdx))}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuestions(qs => qs.map((item, i) => i === qIdx ? { ...item, question: val } : item));
                      }}
                      placeholder="Question prompt..."
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold"
                    />

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            name={`correct-${qIdx}`}
                            checked={q.correctAnswerIndex === optIdx}
                            onChange={() => {
                              setQuestions(qs => qs.map((item, i) => i === qIdx ? { ...item, correctAnswerIndex: optIdx } : item));
                            }}
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const v = e.target.value;
                              setQuestions(qs => qs.map((item, i) => i === qIdx ? {
                                ...item,
                                options: item.options.map((o, oi) => oi === optIdx ? v : o)
                              } : item));
                            }}
                            className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                          />
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => {
                        const v = e.target.value;
                        setQuestions(qs => qs.map((item, i) => i === qIdx ? { ...item, explanation: v } : item));
                      }}
                      placeholder="Rationale / Explanation for learner..."
                      className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] italic"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TYPE: RESOURCE */}
          {type === 'resource' && (
            <div className="space-y-4">
              {/* Permission Banner for Textbooks & Resources */}
              {!isUnlockedAdmin ? (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <p className="font-bold text-amber-900 dark:text-amber-200">
                        Official Curriculum Resources • Staff: READ_ONLY | Admin: WRITE
                      </p>
                      <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 mt-0.5">
                        Publishing official school materials requires Administrator WRITE clearance. Enter the Admin Master Key to unlock publishing.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="password"
                      placeholder="Enter Admin Master Key"
                      value={adminAuthInput}
                      onChange={(e) => {
                        setAdminAuthInput(e.target.value);
                        setAdminAuthError(null);
                      }}
                      className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-lg text-xs font-mono flex-1 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (storage.verifyAdminPassword(adminAuthInput)) {
                          setIsUnlockedAdmin(true);
                          storage.setAdminAuthenticated(true);
                          setAdminAuthError(null);
                        } else {
                          setAdminAuthError('Invalid Admin Key. Please enter authorized administrator credentials.');
                        }
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all"
                    >
                      Unlock WRITE
                    </button>
                  </div>
                  {adminAuthError && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">{adminAuthError}</p>
                  )}
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs flex items-center justify-between text-emerald-900 dark:text-emerald-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Admin WRITE Clearance Unlocked
                  </span>
                  <span className="text-[10px] font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-300">
                    Permissions: WRITE
                  </span>
                </div>
              )}

              {/* Resource Input Type Switcher */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 text-xs">
                  Resource Input Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResInputType('PDF_ATTACHMENT')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-start transition-all ${
                      resInputType === 'PDF_ATTACHMENT'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>PDF Attachment</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                      Allowed: .pdf • Max: 50 MB
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResInputType('RAW_TEXT_AI_COPY')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-start transition-all ${
                      resInputType === 'RAW_TEXT_AI_COPY'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Raw Text / AI Copy</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                      Format: Markdown • Formatted Notes
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Resource Title</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 6 CBC Agriculture Revision Guide"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Grade</label>
                  <select
                    value={schemeGrade}
                    onChange={(e) => setSchemeGrade(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                  >
                    {GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
                  <select
                    value={schemeSubject}
                    onChange={(e) => setSchemeSubject(e.target.value as SubjectName)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                  >
                    {STANDARD_SUBJECTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                <select
                  value={resCategory}
                  onChange={(e) => setResCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                >
                  <option value="Textbook">Textbook</option>
                  <option value="Revision Paper">Revision Paper / Model Exam</option>
                  <option value="Teaching Aid">Teaching Aid / Diagram</option>
                  <option value="Lesson Notes">Lesson Notes</option>
                  <option value="Video Guide">Video Guide</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description & Topics Covered</label>
                <textarea
                  rows={2}
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  placeholder="Summary of chapters, competencies, or topics included..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs"
                />
              </div>

              {/* Conditional Input Fields based on inputType */}
              {resInputType === 'PDF_ATTACHMENT' ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                  <UploadCloud className="w-8 h-8 text-blue-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Upload Official PDF Document
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Maximum file size: <span className="font-bold">50 MB</span> • Allowed extension: <span className="font-mono font-bold">.pdf</span>
                  </p>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      setResFileError(null);
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (!file.name.toLowerCase().endsWith('.pdf')) {
                        setResFileError('Invalid file format: Only .pdf documents are allowed.');
                        return;
                      }

                      const sizeMB = file.size / (1024 * 1024);
                      if (sizeMB > 50) {
                        setResFileError(`File size exceeds 50 MB limit (${sizeMB.toFixed(1)} MB selected).`);
                        return;
                      }

                      setResFileName(file.name);
                      setResFileSize(sizeMB < 1 ? `${Math.round(file.size / 1024)} KB` : `${sizeMB.toFixed(1)} MB`);

                      const reader = new FileReader();
                      reader.onload = () => {
                        setResPdfDataUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="text-xs text-slate-500 mt-2 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-900 file:text-white cursor-pointer"
                  />

                  {resFileName && !resFileError && (
                    <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between font-mono">
                      <span>📄 {resFileName}</span>
                      <span className="font-bold">{resFileSize}</span>
                    </div>
                  )}

                  {resFileError && (
                    <div className="mt-2 p-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-700 dark:text-rose-300 text-xs font-bold">
                      {resFileError}
                    </div>
                  )}
                </div>
              ) : (
                /* RAW_TEXT_AI_COPY (Markdown with Formatted Notes Support) */
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block text-xs flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Markdown Content (Formatted Notes Supported)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const cbeNote = `# CBC Rationalized Notes: ${schemeSubject}
**Grade**: ${schemeGrade} • **Term**: ${schemeTerm} • **Little Roses Academy**

---

### Specific Learning Outcomes:
By the end of this lesson, the learner should be able to:
1. Identify and explain key concepts in real-life contexts.
2. Demonstrate collaborative problem-solving skills.
3. Apply values of integrity, responsibility, and environmental stewardship.

---

### Core Competencies:
- **Critical Thinking & Problem Solving**
- **Digital Literacy & Communication**
- **Learning to Learn**

---

### Key Inquiry Questions:
- *How does this concept solve challenges in our local Nakuru community?*

---

### Summary Table of Findings:
| Key Topic | Description | Practical Application |
| :--- | :--- | :--- |
| Concept 1 | Theoretical foundation | Applied in classroom activity |
| Concept 2 | Observation & recording | Field practice & projects |

---

### Reflection & Self-Assessment:
Learners successfully applied core skills during group practicals.`;
                          setResMarkdown(cbeNote);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800 transition-colors"
                      >
                        + Insert CBC Notes Template
                      </button>
                      <button
                        type="button"
                        onClick={() => setResPreviewMode(!resPreviewMode)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold"
                      >
                        {resPreviewMode ? 'Edit Raw Text' : 'Preview Formatted'}
                      </button>
                    </div>
                  </div>

                  {resPreviewMode ? (
                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl max-h-60 overflow-y-auto prose dark:prose-invert prose-xs text-xs font-sans">
                      <pre className="whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200 leading-relaxed">
                        {resMarkdown || 'No markdown content entered yet.'}
                      </pre>
                    </div>
                  ) : (
                    <textarea
                      rows={6}
                      value={resMarkdown}
                      onChange={(e) => setResMarkdown(e.target.value)}
                      placeholder="# Enter Markdown / Raw Text AI Notes here...&#10;&#10;## Key Concept&#10;- Sub-bullet 1&#10;- Sub-bullet 2&#10;&#10;| Column 1 | Column 2 |&#10;| --- | --- |"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* TYPE: STUDENT */}
          {type === 'student' && (
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Learner Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grace Wambui Mwangi"
                  value={stName}
                  onChange={(e) => setStName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Admission Number</label>
                  <input
                    type="text"
                    value={stAdm}
                    onChange={(e) => setStAdm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Grade Enrolled</label>
                  <select
                    value={stGrade}
                    onChange={(e) => setStGrade(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    {GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gender</label>
                <select
                  value={stGender}
                  onChange={(e) => setStGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
            </div>
          )}

          {/* TYPE: CALENDAR EVENT */}
          {type === 'event' && (
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. End of Term 1 Final Examinations"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="Term Date">Term Date</option>
                    <option value="Exams / CAT">Exams / CAT</option>
                    <option value="Co-Curricular">Co-Curricular</option>
                    <option value="Holiday">Holiday</option>
                    <option value="PTA Meeting">PTA Meeting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Event details, guidelines, venue..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
