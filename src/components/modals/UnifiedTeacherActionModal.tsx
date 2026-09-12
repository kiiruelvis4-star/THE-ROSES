import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Paperclip, 
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  Award,
  Clock,
  UserCheck,
  ClipboardCheck,
  FileCheck,
  HelpCircle,
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  Copy,
  CalendarDays,
  Check,
  FileSpreadsheet
} from 'lucide-react';
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
  CalendarEvent, 
  Student, 
  ExamSeriesPaper,
  TeacherDocumentItem 
} from '../../types';
import { getRationalizedSubjectsForGrade } from '../../data/cbeRationalizedCurriculumData';
import { storage } from '../../services/storageService';

export type UnifiedTeacherActionType = 
  | 'upload'
  | 'raw'
  | 'scheme'
  | 'lesson'
  | 'cat'
  | 'record'
  | 'assignment'
  | 'quiz'
  | 'event'
  | 'student';

interface UnifiedTeacherActionModalProps {
  isOpen: boolean;
  initialType?: UnifiedTeacherActionType;
  initialData?: any;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const GRADES: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
const TERMS: TermName[] = ['Term 1', 'Term 2', 'Term 3'];

export const UnifiedTeacherActionModal: React.FC<UnifiedTeacherActionModalProps> = ({
  isOpen,
  initialType = 'upload',
  initialData,
  onClose,
  onSuccess
}) => {
  const [activeType, setActiveType] = useState<UnifiedTeacherActionType>(initialType);

  // Sync initial type when prop changes
  useEffect(() => {
    if (initialType) {
      setActiveType(initialType);
    }
  }, [initialType, isOpen]);

  // Common metadata state
  const [grade, setGrade] = useState<GradeLevel>(initialData?.grade || 'Grade 6');
  const availableSubjects = getRationalizedSubjectsForGrade(grade);
  const [subject, setSubject] = useState<SubjectName>(initialData?.subject || availableSubjects[0] as SubjectName);
  const [term, setTerm] = useState<TermName>(initialData?.term || 'Term 1');
  const [week, setWeek] = useState<number>(initialData?.week || 1);
  const [lessonNumber, setLessonNumber] = useState<number>(initialData?.lesson || initialData?.lessonNumber || 1);

  // Feedback state
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Reset subject when grade changes if not valid
  useEffect(() => {
    const validSubs = getRationalizedSubjectsForGrade(grade);
    if (!validSubs.includes(subject)) {
      setSubject(validSubs[0] as SubjectName);
    }
  }, [grade]);

  // =========================================================================
  // 1. UPLOAD STATE
  // =========================================================================
  const [uploadCategory, setUploadCategory] = useState<'scheme' | 'lesson' | 'cat' | 'record' | 'handout'>('scheme');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string; dataUrl: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // =========================================================================
  // 2. RAW DATA STATE & LIVE CLOCK
  // =========================================================================
  const [rawCategory, setRawCategory] = useState<'scheme' | 'lesson' | 'cat' | 'record' | 'notes'>('scheme');
  const [rawTitle, setRawTitle] = useState('');
  const [rawText, setRawText] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Live offline ticking clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick Template Injectors for Raw Data
  const insertTemplate = (templateType: 'scheme' | 'lesson' | 'cat' | 'record') => {
    if (templateType === 'scheme') {
      setRawCategory('scheme');
      setRawText(
`# SCHEME OF WORK: ${grade} ${subject} (${term})
Week: ${week} | Lesson: ${lessonNumber}
Strand: Numbers & Operations
Sub-Strand: Fractions & Decimals
Specific Learning Outcomes (SLOs):
  1. Learners identify equivalent fractions using realia and counters.
  2. Learners demonstrate division of simple fractions in collaborative pairs.
Key Inquiry Questions (KIQs):
  - Why do we multiply by the reciprocal when dividing fractions?
Learning Experiences:
  - Learners use strip paper, bottle tops, and peer discussion to model real-world fractions.
Learning Resources:
  - KICD Rationalized CBC Textbook Page 42, Manila paper, scissors, counters.
Assessment Methods:
  - Oral observation, pair evaluation, short written review.
Reflection / Remarks:
  - 85% of learners met the threshold competency. 5 learners guided in morning remedial.`
      );
      if (!rawTitle) setRawTitle(`${grade} ${subject} Week ${week} Scheme of Work`);
    } else if (templateType === 'lesson') {
      setRawCategory('lesson');
      setRawText(
`# 35-MINUTE INSTRUCTIONAL CBE LESSON PLAN
Grade: ${grade} | Learning Area: ${subject}
Term: ${term} | Week: ${week} | Lesson: ${lessonNumber}
Time: 35 Minutes | Roll: 32 (Boys: 16, Girls: 16)
Strand: Scientific Investigation & Observation
Sub-Strand: Conductors of Heat & Electricity
Core Competencies: Critical Thinking, Communication and Collaboration
Values: Respect, Responsibility, Teamwork
Pertinent & Contemporary Issues (PCIs): Environmental Safety & Energy Conservation

1. Introduction (5 Mins):
   - Review prior knowledge on common household electrical appliances.
   - Pose Key Inquiry Question: "Which household materials allow electricity to flow?"

2. Lesson Development / Discovery (20 Mins):
   - Step 1: Guide learners in small groups of 4 with dry cells, connecting wires, and 3V bulbs.
   - Step 2: Learners test copper wire, plastic ruler, iron nail, and wooden stick.
   - Step 3: Record findings in observation table in exercise books.

3. Conclusion & Reflection (10 Mins):
   - Synthesize conductor vs insulator criteria on whiteboard.
   - Assign 2-question home review exploration.`
      );
      if (!rawTitle) setRawTitle(`${grade} ${subject} 35-Min Lesson Plan`);
    } else if (templateType === 'cat') {
      setRawCategory('cat');
      setRawText(
`# CONTINUOUS ASSESSMENT TEST (CAT 1)
School: Little Roses Academy
Learning Area: ${subject} | Level: ${grade}
Term: ${term} | Total Marks: 30 | Time Allowed: 40 Minutes

INSTRUCTIONS TO LEARNERS:
1. Write your name and admission number clearly.
2. Answer all questions in the spaces provided.
3. Show all working steps clearly.

SECTION A: COMPETENCY BASED QUESTIONS (15 Marks)
1. Write 45,670 in words. (2 marks)
2. Round off 8,945 to the nearest hundred. (2 marks)
3. In a school library, there are 1,240 storybooks and 3,120 textbooks. How many books are there in total? (3 marks)
4. State two safety rules observed in the science laboratory. (4 marks)
5. Explain the importance of teamwork when planting seedlings. (4 marks)

SECTION B: APPLICATION & PROBLEM SOLVING (15 Marks)
6. A farmer harvested 45 bags of maize. He sold 28 bags and kept the rest.
   a) How many bags were kept? (3 marks)
   b) If each bag was sold for KES 2,500, calculate total revenue. (4 marks)
7. Draw and label a basic electrical circuit showing dry cell, switch, and bulb. (8 marks)

MARKING RUBRIC / EXPECTED ANSWERS:
- Exceeding Expectations (27 - 30 Marks): Accurate calculations, neat circuit diagram, precise scientific rationale.
- Meeting Expectations (18 - 26 Marks): Correct answers with minor computational slips.
- Approaching Expectations (12 - 17 Marks): Partial understanding; requires prompt in word problems.
- Below Expectations (0 - 11 Marks): Intensive remedial guidance required.`
      );
      if (!rawTitle) setRawTitle(`${grade} ${subject} CAT 1 Test Paper`);
    } else if (templateType === 'record') {
      setRawCategory('record');
      setRawText(
`# RECORD OF WORK COVERED
Grade: ${grade} | Subject: ${subject}
Term: ${term} | Week: ${week} | Lesson: ${lessonNumber}
Work Planned:
  - Rationalized Division of Decimals with two-step problem solving.
Work Covered:
  - Examples 1 to 4 completed on board; Exercise 4B items 1 to 8 completed by all learners.
Challenges Encountered:
  - Some learners struggled with alignment of decimal points during column subtraction.
Remedial Action Taken:
  - Conducted 10-minute targeted board review using color-coded chalk for decimal places.`
      );
      if (!rawTitle) setRawTitle(`${grade} ${subject} Record of Work Covered`);
    }
  };

  // =========================================================================
  // 3. STRUCTURED SCHEME STATE
  // =========================================================================
  const [schemeStrand, setSchemeStrand] = useState(initialData?.strand || '');
  const [schemeSubStrand, setSchemeSubStrand] = useState(initialData?.subStrand || '');
  const [schemeOutcomes, setSchemeOutcomes] = useState(initialData?.specificLearningOutcomes || '');
  const [schemeQuestions, setSchemeQuestions] = useState(initialData?.keyInquiryQuestions || '');
  const [schemeExperiences, setSchemeExperiences] = useState(initialData?.learningExperiences || '');
  const [schemeResources, setSchemeResources] = useState(initialData?.learningResources || '');
  const [schemeAssess, setSchemeAssess] = useState(initialData?.assessmentMethods || '');
  const [schemeRemarks, setSchemeRemarks] = useState(initialData?.reflectionRemarks || '');

  // =========================================================================
  // 4. STRUCTURED LESSON STATE
  // =========================================================================
  const [lpStrand, setLpStrand] = useState(initialData?.strand || '');
  const [lpSubStrand, setLpSubStrand] = useState(initialData?.subStrand || '');
  const [lpIntro, setLpIntro] = useState(initialData?.introduction || '');
  const [lpDev, setLpDev] = useState(initialData?.lessonDevelopment || '');
  const [lpConc, setLpConc] = useState(initialData?.conclusion || '');
  const [lpDuration, setLpDuration] = useState<number>(initialData?.durationMinutes || 35);

  // =========================================================================
  // 5. STRUCTURED CAT / EXAM STATE
  // =========================================================================
  const [catTitle, setCatTitle] = useState(initialData?.title || '');
  const [catSeriesType, setCatSeriesType] = useState<'Opener' | 'Midterm' | 'Endterm' | 'KPSEA Trial'>('Midterm');
  const [catPublisher, setCatPublisher] = useState<'Targeter' | 'Jesma' | 'Predictors' | 'Signal & Spotlight'>('Targeter');
  const [catTotalMarks, setCatTotalMarks] = useState<number>(initialData?.totalMarks || 30);
  const [catDuration, setCatDuration] = useState<number>(initialData?.durationMinutes || 40);
  const [catAutoSchedule, setCatAutoSchedule] = useState(true);

  // =========================================================================
  // 6. RECORD OF WORK STATE
  // =========================================================================
  const [recPlanned, setRecPlanned] = useState(initialData?.workPlanned || '');
  const [recCovered, setRecCovered] = useState(initialData?.workCovered || '');
  const [recChallenges, setRecChallenges] = useState(initialData?.challengesEncountered || '');
  const [recRemedial, setRecRemedial] = useState(initialData?.remedialAction || '');

  // =========================================================================
  // 7. ASSIGNMENT STATE
  // =========================================================================
  const [asgTitle, setAsgTitle] = useState(initialData?.title || '');
  const [asgInstructions, setAsgInstructions] = useState(initialData?.instructions || '');
  const [asgDueDate, setAsgDueDate] = useState(initialData?.dueDate || new Date().toISOString().slice(0, 10));
  const [asgMarks, setAsgMarks] = useState<number>(initialData?.totalMarks || 30);

  // =========================================================================
  // 8. QUIZ STATE
  // =========================================================================
  const [quizTitle, setQuizTitle] = useState(initialData?.title || '');
  const [quizTime, setQuizTime] = useState<number>(initialData?.timeLimitMinutes || 10);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(initialData?.questions || [
    {
      id: 'q-1',
      question: 'What is 450 rounded off to the nearest hundred?',
      options: ['400', '500', '450', '600'],
      correctAnswerIndex: 1,
      explanation: '450 is midway between 400 and 500, so it rounds up to 500.'
    }
  ]);

  // =========================================================================
  // 9. EVENT STATE
  // =========================================================================
  const [eventTitle, setEventTitle] = useState(initialData?.title || '');
  const [eventDate, setEventDate] = useState(initialData?.date || new Date().toISOString().slice(0, 10));
  const [eventStartTime, setEventStartTime] = useState(initialData?.startTime || '08:00');
  const [eventEndTime, setEventEndTime] = useState(initialData?.endTime || '10:00');
  const [eventLocation, setEventLocation] = useState(initialData?.location || 'School Assembly Grounds');
  const [eventCategory, setEventCategory] = useState(initialData?.category || 'Academic');
  const [eventDesc, setEventDesc] = useState(initialData?.description || '');

  // =========================================================================
  // 10. STUDENT STATE
  // =========================================================================
  const [stName, setStName] = useState(initialData?.name || '');
  const [stAdm, setStAdm] = useState(initialData?.admissionNumber || `LRA/2026/${Math.floor(100 + Math.random() * 900)}`);
  const [stGender, setStGender] = useState<'Male' | 'Female'>(initialData?.gender || 'Female');

  if (!isOpen) return null;

  // File picker handler
  const handleFileProcess = (file: File) => {
    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        name: file.name,
        size: sizeFormatted,
        type: file.type || 'application/octet-stream',
        dataUrl: reader.result as string
      });
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  // =========================================================================
  // SUBMIT / SAVE DISPATCHER
  // =========================================================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeTeacher = storage.getActiveTeacherProfile();
    const teacherName = activeTeacher?.name || 'Teacher Elvis';

    try {
      // 1. UPLOAD DOCUMENT
      if (activeType === 'upload') {
        if (!selectedFile) {
          alert('Please choose or drop a document (.pdf, .docx, .xlsx, or image) to upload.');
          return;
        }

        const effectiveTitle = uploadTitle.trim() || selectedFile.name.replace(/\.[^/.]+$/, '');

        // Save into Teacher Documents repository
        const docRecord: TeacherDocumentItem = {
          id: `tdoc-${Date.now()}`,
          title: effectiveTitle,
          category: uploadCategory,
          grade,
          subject,
          term,
          week,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          fileDataUrl: selectedFile.dataUrl,
          uploadedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          teacherName,
          description: uploadDescription || `Uploaded file for ${grade} ${subject}`
        };
        storage.saveTeacherDocument(docRecord);

        // Also integrate into specific sub-system
        if (uploadCategory === 'scheme') {
          storage.saveScheme({
            id: `sch-up-${Date.now()}`,
            grade,
            subject,
            term,
            week,
            lesson: lessonNumber,
            strand: effectiveTitle,
            subStrand: `Uploaded Document: ${selectedFile.name}`,
            specificLearningOutcomes: 'CBC Learning Outcomes aligned with uploaded KICD scheme.',
            keyInquiryQuestions: 'How do we demonstrate competencies in this strand?',
            learningExperiences: 'Learners interact with practical realia and exercise guided tasks.',
            learningResources: `Uploaded Document: ${selectedFile.name} (${selectedFile.size})`,
            assessmentMethods: 'Formative observation, oral inquiry, written assessment',
            reflectionRemarks: 'Document successfully attached and activated for term schedule.',
            attachments: [{ name: selectedFile.name, size: selectedFile.size, url: selectedFile.dataUrl }]
          });
        } else if (uploadCategory === 'lesson') {
          storage.saveLessonPlan({
            id: `lp-up-${Date.now()}`,
            grade,
            subject,
            term,
            week,
            lessonNumber,
            date: new Date().toISOString().slice(0, 10),
            durationMinutes: 35,
            strand: effectiveTitle,
            subStrand: `Uploaded File: ${selectedFile.name}`,
            coreCompetencies: ['Critical Thinking', 'Problem Solving', 'Collaboration'],
            values: ['Responsibility', 'Respect', 'Integrity'],
            introduction: 'Review of prior knowledge and introduction of key inquiry question.',
            lessonDevelopment: 'Facilitated experiential discovery using uploaded curriculum document.',
            conclusion: 'Learner reflection and summary of competencies.',
            attachments: [{ name: selectedFile.name, size: selectedFile.size, url: selectedFile.dataUrl }]
          });
        } else if (uploadCategory === 'cat') {
          const newPaper: ExamSeriesPaper = {
            id: `exam-up-${Date.now()}`,
            title: effectiveTitle,
            publisher: 'Targeter Educational Publishers' as any,
            publisherShort: 'Targeter',
            seriesType: 'Midterm',
            grade,
            subject,
            term,
            year: 2026,
            autoScheduleRule: `Term ${term.slice(-1)} Week ${week}`,
            scheduledWeeks: `Week ${week}`,
            totalMarks: 30,
            durationMinutes: 40,
            paperCode: `CAT-${subject.slice(0, 3).toUpperCase()}-${grade.slice(-1)}`,
            hasMarkingScheme: true,
            status: 'Ready'
          };
          storage.saveExamSeriesPaper(newPaper);
          if (catAutoSchedule) {
            storage.scheduleExamToCalendar(newPaper);
          }
        } else if (uploadCategory === 'record') {
          storage.saveRecordOfWork({
            id: `rec-up-${Date.now()}`,
            grade,
            subject,
            term,
            week,
            lesson: lessonNumber,
            workPlanned: `Curriculum unit from uploaded document: ${effectiveTitle}`,
            workCovered: `File content covered with ${grade} learners`,
            challengesEncountered: 'None noted',
            remedialAction: 'Guided follow-up practice provided',
            teacherSignature: teacherName,
            dateChecked: new Date().toISOString().slice(0, 10)
          });
        }

        const msg = `Document "${selectedFile.name}" uploaded successfully for ${grade} ${subject}!`;
        setSuccessToast(msg);
        if (onSuccess) onSuccess(msg);
        setTimeout(() => onClose(), 1200);
        return;
      }

      // 2. RAW DATA INPUT
      if (activeType === 'raw') {
        if (!rawText.trim()) {
          alert('Please enter or paste your raw data into the editor.');
          return;
        }

        const effectiveTitle = rawTitle.trim() || `${grade} ${subject} Raw Data`;

        // Save into raw schemes repository
        storage.saveRawScheme(`[${rawCategory.toUpperCase()}] ${grade} - ${subject} (${term}, Wk ${week})\nTitle: ${effectiveTitle}\n\n${rawText}`, teacherName);

        // Also save to teacher documents for unified viewing
        storage.saveTeacherDocument({
          id: `tdoc-raw-${Date.now()}`,
          title: effectiveTitle,
          category: rawCategory === 'notes' ? 'handout' : rawCategory,
          grade,
          subject,
          term,
          week,
          fileName: `${effectiveTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`,
          fileSize: `${Math.max(1, Math.round(rawText.length / 1024))} KB`,
          fileType: 'text/plain',
          rawText: rawText,
          uploadedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          teacherName,
          description: `Raw teacher input: ${rawCategory.toUpperCase()}`
        });

        // Sub-system integration
        if (rawCategory === 'scheme') {
          storage.saveScheme({
            id: `sch-raw-${Date.now()}`,
            grade,
            subject,
            term,
            week,
            lesson: lessonNumber,
            strand: effectiveTitle,
            subStrand: `Raw Entry (Wk ${week})`,
            specificLearningOutcomes: rawText.slice(0, 200),
            keyInquiryQuestions: 'Key inquiry questions defined in raw text scheme.',
            learningExperiences: 'Active learner exploration as described in raw document.',
            learningResources: 'Standard KICD approved textbooks and concrete realia.',
            assessmentMethods: 'Oral questions, observation, portfolio check',
            reflectionRemarks: `Saved via Raw Editor by ${teacherName}`
          });
        } else if (rawCategory === 'lesson') {
          storage.saveLessonPlan({
            id: `lp-raw-${Date.now()}`,
            grade,
            subject,
            term,
            week,
            lessonNumber,
            date: new Date().toISOString().slice(0, 10),
            durationMinutes: 35,
            strand: effectiveTitle,
            subStrand: `Raw Lesson Plan Note`,
            coreCompetencies: ['Critical Thinking', 'Problem Solving'],
            values: ['Responsibility', 'Integrity'],
            introduction: 'Direct instructional review.',
            lessonDevelopment: rawText.slice(0, 300),
            conclusion: 'Wrap up and homework allocation.'
          });
        } else if (rawCategory === 'cat') {
          const examPaper: ExamSeriesPaper = {
            id: `exam-raw-${Date.now()}`,
            title: effectiveTitle,
            publisher: 'Targeter Educational Publishers' as any,
            publisherShort: 'Targeter',
            seriesType: 'Midterm',
            grade,
            subject,
            term,
            year: 2026,
            autoScheduleRule: `Term ${term.slice(-1)} Week ${week}`,
            scheduledWeeks: `Week ${week}`,
            totalMarks: 30,
            durationMinutes: 40,
            paperCode: `CAT-${subject.slice(0, 3).toUpperCase()}-${grade.slice(-1)}`,
            hasMarkingScheme: true,
            status: 'Ready'
          };
          storage.saveExamSeriesPaper(examPaper);
          if (catAutoSchedule) {
            storage.scheduleExamToCalendar(examPaper);
          }
        }

        const msg = `Raw data saved successfully for ${grade} ${subject}!`;
        setSuccessToast(msg);
        if (onSuccess) onSuccess(msg);
        setTimeout(() => onClose(), 1200);
        return;
      }

      // 3. STRUCTURED SCHEME
      if (activeType === 'scheme') {
        const scheme: SchemeOfWork = {
          id: initialData?.id || `sch-${Date.now()}`,
          grade,
          subject,
          term,
          week,
          lesson: lessonNumber,
          strand: schemeStrand || 'Numbers & Operations',
          subStrand: schemeSubStrand || 'Fractions & Decimals',
          specificLearningOutcomes: schemeOutcomes || 'By the end of the lesson, the learner should be able to solve basic problems.',
          keyInquiryQuestions: schemeQuestions || 'How do we demonstrate competencies in this strand?',
          learningExperiences: schemeExperiences || 'Learners actively interact with realia in small groups to solve inquiry questions.',
          learningResources: schemeResources || 'CBC Textbook Page 45, Counters, Manila paper',
          assessmentMethods: schemeAssess || 'Oral questions, written review, observation',
          reflectionRemarks: schemeRemarks || 'Competency met successfully.'
        };
        storage.saveScheme(scheme);
        const msg = `Scheme of Work saved for ${grade} ${subject}!`;
        setSuccessToast(msg);
        if (onSuccess) onSuccess(msg);
        setTimeout(() => onClose(), 900);
        return;
      }

      // 4. STRUCTURED LESSON
      if (activeType === 'lesson') {
        const plan: LessonPlan = {
          id: initialData?.id || `lp-${Date.now()}`,
          grade,
          subject,
          term,
          week,
          lessonNumber,
          date: new Date().toISOString().slice(0, 10),
          durationMinutes: lpDuration,
          strand: lpStrand || 'Scientific Inquiry',
          subStrand: lpSubStrand || 'Observations and Properties',
          introduction: lpIntro || 'Review previous lesson by asking inquiry questions.',
          lessonDevelopment: lpDev || 'Guide learners in small pairs to explore core concepts with realia.',
          conclusion: lpConc || 'Summarize key findings on whiteboard and assign review.',
          coreCompetencies: ['Critical Thinking', 'Collaboration'],
          values: ['Integrity', 'Respect']
        };
        storage.saveLessonPlan(plan);
        const msg = `Lesson Plan saved for ${grade} ${subject}!`;
        setSuccessToast(msg);
        if (onSuccess) onSuccess(msg);
        setTimeout(() => onClose(), 900);
        return;
      }

      // 5. STRUCTURED CAT / EXAM
      if (activeType === 'cat') {
        const titleEffective = catTitle.trim() || `${grade} ${subject} Continuous Assessment Test (CAT 1)`;
        const newPaper: ExamSeriesPaper = {
          id: initialData?.id || `cat-${Date.now()}`,
          title: titleEffective,
          publisher: (catPublisher === 'Targeter' ? 'Targeter Educational Publishers' :
                      catPublisher === 'Jesma' ? 'Jesma Publishers & Education Boosters' :
                      catPublisher === 'Predictors' ? 'The Predictors National Assessment Panel' :
                      'Signal & Spotlight Curriculum Publishers') as any,
          publisherShort: catPublisher,
          seriesType: catSeriesType,
          grade,
          subject,
          term,
          year: 2026,
          autoScheduleRule: `Term ${term.slice(-1)} Week ${week}`,
          scheduledWeeks: `Week ${week}`,
          totalMarks: catTotalMarks,
          durationMinutes: catDuration,
          paperCode: `CAT-${subject.slice(0, 3).toUpperCase()}-${grade.slice(-1)}`,
          hasMarkingScheme: true,
          status: 'Ready'
        };
        storage.saveExamSeriesPaper(newPaper);
        if (catAutoSchedule) {
          storage.scheduleExamToCalendar(newPaper);
        }
        const msg = `CAT Assessment "${titleEffective}" created and scheduled!`;
        setSuccessToast(msg);
        if (onSuccess) onSuccess(msg);
        setTimeout(() => onClose(), 900);
        return;
      }

      // 6. RECORD OF WORK
      if (activeType === 'record') {
        const rec: RecordOfWork = {
          id: initialData?.id || `rec-${Date.now()}`,
          grade,
          subject,
          term,
          week,
          lesson: lessonNumber,
          workPlanned: recPlanned || 'Addition of fractions with unlike denominators',
          workCovered: recCovered || 'All exercise items completed by all learners',
          challengesEncountered: recChallenges || 'Some learners took extra time finding LCM',
          remedialAction: recRemedial || 'Conducted 15 minutes targeted morning remedial practice',
          teacherSignature: teacherName,
          dateChecked: new Date().toISOString().slice(0, 10)
        };
        storage.saveRecordOfWork(rec);
        const msg = `Record of Work saved for ${grade} ${subject}!`;
        setSuccessToast(msg);
        if (onSuccess) onSuccess(msg);
        setTimeout(() => onClose(), 900);
        return;
      }

      // 7. ASSIGNMENT
      if (activeType === 'assignment') {
        const asg: Assignment = {
          id: initialData?.id || `asg-${Date.now()}`,
          title: asgTitle || 'CBC Weekly Practice Exercise',
          subject,
          grade,
          instructions: asgInstructions || 'Answer all questions on your ruled exercise book and show all work steps.',
          dueDate: asgDueDate,
          totalMarks: asgMarks,
          submissionsCount: initialData?.submissionsCount || 0
        };
        storage.saveAssignment(asg);
        const msg = `Assignment "${asg.title}" posted!`;
        setSuccessToast(msg);
        if (onSuccess) onSuccess(msg);
        setTimeout(() => onClose(), 900);
        return;
      }

      // 8. QUIZ
      if (activeType === 'quiz') {
        const qz: Quiz = {
          id: initialData?.id || `qz-${Date.now()}`,
          title: quizTitle || 'Weekly CBC Review Quiz',
          subject,
          grade,
          timeLimitMinutes: quizTime,
          questions: quizQuestions
        };
        storage.saveQuiz(qz);
        const msg = `Quiz Challenge "${qz.title}" created!`;
        setSuccessToast(msg);
        if (onSuccess) onSuccess(msg);
        setTimeout(() => onClose(), 900);
        return;
      }

      // 9. EVENT
      if (activeType === 'event') {
        const ev: CalendarEvent = {
          id: initialData?.id || `ev-${Date.now()}`,
          title: eventTitle || 'School Activity',
          date: eventDate,
          startTime: eventStartTime,
          endTime: eventEndTime,
          location: eventLocation,
          category: eventCategory,
          description: eventDesc || 'Little Roses Academy academic calendar event.'
        };
        storage.saveCalendarEvent(ev);
        const msg = `Calendar Event "${ev.title}" added!`;
        setSuccessToast(msg);
        if (onSuccess) onSuccess(msg);
        setTimeout(() => onClose(), 900);
        return;
      }

      // 10. STUDENT
      if (activeType === 'student') {
        const newStudent: Student = {
          id: initialData?.id || `st-${Date.now()}`,
          admissionNumber: stAdm,
          name: stName || 'New Learner',
          grade,
          gender: stGender,
          avatar: `https://images.unsplash.com/photo-${stGender === 'Female' ? '1534528741775-53994a69daeb' : '1539571696357-5a69c17a67c6'}?w=150&auto=format&fit=crop&q=80`,
          catMarks: initialData?.catMarks || {
            Mathematics: { cat1: 25, cat2: 26, endTerm: 88 },
            English: { cat1: 27, cat2: 28, endTerm: 90 },
            Kiswahili: { cat1: 24, cat2: 25, endTerm: 82 }
          }
        };
        storage.saveStudent(newStudent);
        const msg = `Learner "${newStudent.name}" enrolled!`;
        setSuccessToast(msg);
        if (onSuccess) onSuccess(msg);
        setTimeout(() => onClose(), 900);
        return;
      }
    } catch (err: any) {
      alert(`Error saving: ${err?.message || 'An unexpected error occurred.'}`);
    }
  };

  const TABS_CONFIG = [
    { id: 'upload' as UnifiedTeacherActionType, label: 'Upload Document', icon: Upload, highlight: true },
    { id: 'raw' as UnifiedTeacherActionType, label: 'Raw Data & Live Clock', icon: FileText, highlight: true },
    { id: 'scheme' as UnifiedTeacherActionType, label: 'Scheme of Work', icon: BookOpen },
    { id: 'lesson' as UnifiedTeacherActionType, label: 'Lesson Plan', icon: FileCheck },
    { id: 'cat' as UnifiedTeacherActionType, label: 'CAT / Exam Paper', icon: FileSpreadsheet, badge: 'Exams' },
    { id: 'record' as UnifiedTeacherActionType, label: 'Record of Work', icon: ClipboardCheck },
    { id: 'assignment' as UnifiedTeacherActionType, label: 'Assignment', icon: Layers },
    { id: 'quiz' as UnifiedTeacherActionType, label: 'Quiz Challenge', icon: HelpCircle },
    { id: 'event' as UnifiedTeacherActionType, label: 'Calendar Event', icon: Calendar },
    { id: 'student' as UnifiedTeacherActionType, label: 'Enroll Learner', icon: Users }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-blue-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-200 shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded-full border border-blue-700/50">
                  LITTLE ROSES ACADEMY • TEACHER ACTION
                </span>
                <span className="text-[10px] font-bold text-slate-300 hidden sm:inline">
                  CBC Curriculum Suite
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-heading tracking-tight mt-0.5">
                Teacher Creation & Document Hub
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRIMARY ACTION TABS (UPLOAD, RAW DATA, SCHEMES, LESSONS, CATS, ETC.) */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-100 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar shrink-0">
          {TABS_CONFIG.map((t) => {
            const Icon = t.icon;
            const isSelected = activeType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveType(t.id);
                  setSuccessToast(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  isSelected
                    ? t.highlight 
                      ? 'bg-blue-900 text-white shadow-md ring-2 ring-blue-500/50' 
                      : 'bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-300 shadow-sm border border-slate-200 dark:border-slate-700'
                    : t.highlight
                      ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 hover:bg-blue-200'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{t.label}</span>
                {t.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SUCCESS NOTIFICATION BANNER */}
        {successToast && (
          <div className="bg-emerald-500 text-white p-3 text-xs font-bold flex items-center justify-between shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-100" />
              <span>{successToast}</span>
            </div>
            <span className="text-[10px] uppercase font-mono opacity-80">Saved to Storage</span>
          </div>
        )}

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* COMMON METADATA BAR (GRADE, SUBJECT, TERM, WEEK) */}
          {activeType !== 'student' && activeType !== 'event' && (
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Grade Level
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  {GRADES.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Learning Area / Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectName)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  {availableSubjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Academic Term
                </label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value as TermName)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  {TERMS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Week & Lesson
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={week}
                    onChange={(e) => setWeek(parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-center"
                    title="Week number"
                  />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={lessonNumber}
                    onChange={(e) => setLessonNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-center"
                    title="Lesson number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 1: UPLOAD DOCUMENT (FILES: SCHEMES, LESSONS, CATS, TEACHER DOCS) */}
          {/* ================================================================= */}
          {activeType === 'upload' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm">
                      Upload Teacher Document or Learning Material
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Directly upload Schemes of Work, Lesson Plans, CATs & Exam Papers, Records, or General Handouts.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Category:</span>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-blue-900 dark:text-blue-300"
                  >
                    <option value="scheme">Scheme of Work</option>
                    <option value="lesson">Lesson Plan</option>
                    <option value="cat">CAT / Exam Paper</option>
                    <option value="record">Record of Work</option>
                    <option value="handout">General Teacher Document</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title / Description
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${grade} ${subject} Term ${term.slice(-1)} ${uploadCategory === 'cat' ? 'CAT 1 Examination Paper' : 'Curriculum Document'}`}
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              {/* Drag & Drop File Box */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all ${
                  isDragOver
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40'
                    : selectedFile
                      ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                      : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">
                        {selectedFile.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        File Size: {selectedFile.size} • Ready for upload into {uploadCategory.toUpperCase()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 hover:text-rose-700 text-xs font-bold transition-colors"
                    >
                      Change Document
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                      <Paperclip className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Supports PDF (.pdf), Word (.docx, .doc), Excel (.xlsx, .csv), and scans/images
                      </p>
                    </div>
                    <label className="inline-block cursor-pointer px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-all active:scale-95 shadow-sm">
                      Select Document File
                      <input
                        type="file"
                        onChange={handleFileInputChange}
                        accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {uploadCategory === 'cat' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold">
                    <CalendarDays className="w-4 h-4" />
                    <span>Auto-schedule this CAT / Exam paper to Academic Calendar</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={catAutoSchedule}
                    onChange={(e) => setCatAutoSchedule(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-blue-600"
                  />
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: RAW DATA & DIRECT TEXT EDITOR + LIVE CLOCK                 */}
          {/* ================================================================= */}
          {activeType === 'raw' && (
            <div className="space-y-4">
              {/* Live Clock & Timestamp Header */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-amber-400 font-mono font-black text-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-amber-300 tracking-wider">
                        {currentTime}
                      </span>
                      <span className="text-[10px] text-slate-300">
                        • {currentDate}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-blue-200">
                      Offline Teacher Raw Input & Scratchpad
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-300">Target Category:</span>
                  <select
                    value={rawCategory}
                    onChange={(e) => setRawCategory(e.target.value as any)}
                    className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-xl font-bold text-white text-xs"
                  >
                    <option value="scheme" className="text-slate-900">Scheme of Work</option>
                    <option value="lesson" className="text-slate-900">Lesson Plan</option>
                    <option value="cat" className="text-slate-900">CAT / Exam Questions</option>
                    <option value="record" className="text-slate-900">Record of Work</option>
                    <option value="notes" className="text-slate-900">General Notes</option>
                  </select>
                </div>
              </div>

              {/* Template Quick Insert Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-500">Insert Template:</span>
                <button
                  type="button"
                  onClick={() => insertTemplate('scheme')}
                  className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 text-blue-900 dark:text-blue-300 text-[11px] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Scheme (10-Col)</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertTemplate('lesson')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>35-Min Lesson Plan</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertTemplate('cat')}
                  className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>CAT 1 Test Paper</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertTemplate('record')}
                  className="px-2.5 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 text-[11px] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Record of Work</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Title or Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Term 1 Fractions & Decimals Review..."
                  value={rawTitle}
                  onChange={(e) => setRawTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Raw Data Content (Paste text, markdown, questions, or syllabus excerpt)
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {rawText.length} chars • {rawText.split('\n').length} lines
                  </span>
                </div>
                <textarea
                  rows={10}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste or type raw curriculum data, schemes, lesson plans, CAT examination questions, marking guides, or teacher notes here..."
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-xs text-slate-900 dark:text-slate-100 leading-relaxed outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: STRUCTURED SCHEME OF WORK (10-COLUMN KICD)                 */}
          {/* ================================================================= */}
          {activeType === 'scheme' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Specific Learning Outcomes (SLOs)
                </label>
                <textarea
                  rows={2}
                  value={schemeOutcomes}
                  onChange={(e) => setSchemeOutcomes(e.target.value)}
                  placeholder="By the end of the lesson, the learner should be able to..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Key Inquiry Questions (KIQs)
                </label>
                <input
                  type="text"
                  value={schemeQuestions}
                  onChange={(e) => setSchemeQuestions(e.target.value)}
                  placeholder="e.g. How does multiplying decimals differ from whole numbers?"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Learning Experiences</label>
                  <textarea
                    rows={2}
                    value={schemeExperiences}
                    onChange={(e) => setSchemeExperiences(e.target.value)}
                    placeholder="Learners work in pairs with place-value charts..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Learning Resources</label>
                  <textarea
                    rows={2}
                    value={schemeResources}
                    onChange={(e) => setSchemeResources(e.target.value)}
                    placeholder="KICD Approved Textbooks, Counters, Digital Devices..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assessment Methods</label>
                  <input
                    type="text"
                    value={schemeAssess}
                    onChange={(e) => setSchemeAssess(e.target.value)}
                    placeholder="Oral questions, written exercises, observation"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Reflection / Remarks</label>
                  <input
                    type="text"
                    value={schemeRemarks}
                    onChange={(e) => setSchemeRemarks(e.target.value)}
                    placeholder="Lesson completed successfully"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: STRUCTURED LESSON PLAN (35-MIN CBE)                        */}
          {/* ================================================================= */}
          {activeType === 'lesson' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Strand</label>
                  <input
                    type="text"
                    value={lpStrand}
                    onChange={(e) => setLpStrand(e.target.value)}
                    placeholder="e.g. Science & Living Things"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Sub-Strand</label>
                  <input
                    type="text"
                    value={lpSubStrand}
                    onChange={(e) => setLpSubStrand(e.target.value)}
                    placeholder="e.g. Classification of Invertebrates"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  1. Introduction (5 Mins)
                </label>
                <textarea
                  rows={2}
                  value={lpIntro}
                  onChange={(e) => setLpIntro(e.target.value)}
                  placeholder="Review prior knowledge and introduce key inquiry question..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  2. Lesson Development & Discovery (20 Mins)
                </label>
                <textarea
                  rows={3}
                  value={lpDev}
                  onChange={(e) => setLpDev(e.target.value)}
                  placeholder="Step-by-step learner activities, handling realia, pair discussions..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  3. Conclusion & Reflection (10 Mins)
                </label>
                <textarea
                  rows={2}
                  value={lpConc}
                  onChange={(e) => setLpConc(e.target.value)}
                  placeholder="Summarize concepts on board, review learner observations, homework..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: CAT / EXAM PAPER BUILDER                                  */}
          {/* ================================================================= */}
          {activeType === 'cat' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-black text-amber-900 dark:text-amber-300 text-sm">
                    Continuous Assessment Test (CAT) / Examination Paper
                  </h3>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-400">
                    Create and schedule official termly assessment tests, Mid-Term CATs, and KPSEA practice papers.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
                  Assessment Engine
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assessment Title</label>
                  <input
                    type="text"
                    value={catTitle}
                    onChange={(e) => setCatTitle(e.target.value)}
                    placeholder={`e.g. ${grade} ${subject} CAT 1 Examination Paper`}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Exam Series Type</label>
                  <select
                    value={catSeriesType}
                    onChange={(e) => setCatSeriesType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="Opener">Opener Assessment</option>
                    <option value="Midterm">Mid-Term CAT 1</option>
                    <option value="Endterm">End-Term Assessment</option>
                    <option value="KPSEA Trial">KPSEA Mock Trial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Publisher Format</label>
                  <select
                    value={catPublisher}
                    onChange={(e) => setCatPublisher(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Targeter">Targeter Publishers</option>
                    <option value="Jesma">Jesma Boosters</option>
                    <option value="Predictors">Predictors Panel</option>
                    <option value="Signal & Spotlight">Signal & Spotlight</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={catTotalMarks}
                    onChange={(e) => setCatTotalMarks(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={catDuration}
                    onChange={(e) => setCatDuration(parseInt(e.target.value) || 40)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Automatically sync this CAT into Master Academic Calendar</span>
                </div>
                <input
                  type="checkbox"
                  checked={catAutoSchedule}
                  onChange={(e) => setCatAutoSchedule(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: RECORD OF WORK COVERED                                    */}
          {/* ================================================================= */}
          {activeType === 'record' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Work Planned</label>
                <textarea
                  rows={2}
                  value={recPlanned}
                  onChange={(e) => setRecPlanned(e.target.value)}
                  placeholder="e.g. Addition of fractions with unlike denominators..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Work Covered</label>
                <textarea
                  rows={2}
                  value={recCovered}
                  onChange={(e) => setRecCovered(e.target.value)}
                  placeholder="e.g. Exercise 4 items 1 through 8 completed successfully by all learners..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Challenges Encountered</label>
                  <input
                    type="text"
                    value={recChallenges}
                    onChange={(e) => setRecChallenges(e.target.value)}
                    placeholder="e.g. Identifying LCM for 3 denominators"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Remedial Action</label>
                  <input
                    type="text"
                    value={recRemedial}
                    onChange={(e) => setRecRemedial(e.target.value)}
                    placeholder="e.g. Conducted 10-min morning pair practice"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: ASSIGNMENT                                                 */}
          {/* ================================================================= */}
          {activeType === 'assignment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assignment Title</label>
                  <input
                    type="text"
                    value={asgTitle}
                    onChange={(e) => setAsgTitle(e.target.value)}
                    placeholder="e.g. Weekly Math Review: Percentages"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Instructions</label>
                <textarea
                  rows={3}
                  value={asgInstructions}
                  onChange={(e) => setAsgInstructions(e.target.value)}
                  placeholder="Answer all questions in your ruled exercise book and show all calculation steps clearly."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Total Marks</label>
                <input
                  type="number"
                  value={asgMarks}
                  onChange={(e) => setAsgMarks(parseInt(e.target.value) || 30)}
                  className="w-32 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: QUIZ ZONE CHALLENGE                                        */}
          {/* ================================================================= */}
          {activeType === 'quiz' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Quiz Title</label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g. Science Quick Challenge: Plant Organs"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Limit (Minutes)</label>
                  <input
                    type="number"
                    value={quizTime}
                    onChange={(e) => setQuizTime(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Questions ({quizQuestions.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizQuestions([
                        ...quizQuestions,
                        {
                          id: `q-${Date.now()}`,
                          question: 'New question text here...',
                          options: ['Option A', 'Option B', 'Option C', 'Option D'],
                          correctAnswerIndex: 0,
                          explanation: 'Explanation for correct answer.'
                        }
                      ]);
                    }}
                    className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                {quizQuestions.map((q, idx) => (
                  <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-blue-900 dark:text-blue-300">
                        Q{idx + 1}.
                      </span>
                      {quizQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setQuizQuestions(quizQuestions.filter(x => x.id !== q.id))}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const next = [...quizQuestions];
                        next[idx].question = e.target.value;
                        setQuizQuestions(next);
                      }}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctAnswerIndex === oIdx}
                            onChange={() => {
                              const next = [...quizQuestions];
                              next[idx].correctAnswerIndex = oIdx;
                              setQuizQuestions(next);
                            }}
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const next = [...quizQuestions];
                              next[idx].options[oIdx] = e.target.value;
                              setQuizQuestions(next);
                            }}
                            className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 9: CALENDAR EVENT                                             */}
          {/* ================================================================= */}
          {activeType === 'event' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Event Title</label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Science Fair & Interschool Exhibition"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Location</label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="School Hall"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Details regarding attendance, attire, and materials..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 10: ENROLL LEARNER                                            */}
          {/* ================================================================= */}
          {activeType === 'student' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Learner Full Name</label>
                  <input
                    type="text"
                    value={stName}
                    onChange={(e) => setStName(e.target.value)}
                    placeholder="e.g. Brian Kipchumba"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Admission Number</label>
                  <input
                    type="text"
                    value={stAdm}
                    onChange={(e) => setStAdm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Grade Level</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    {GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
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
            </div>
          )}

          {/* FORM ACTIONS FOOTER */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                Mode: <strong className="text-slate-700 dark:text-slate-200 uppercase">{activeType}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>
                  {activeType === 'upload' ? 'Upload & Save Document' :
                   activeType === 'raw' ? 'Save Raw Data' :
                   activeType === 'cat' ? 'Save & Schedule CAT' :
                   activeType === 'student' ? 'Enroll Learner' :
                   'Save Entry'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
