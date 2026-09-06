export type GradeLevel = 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5' | 'Grade 6';

// Standard 8 CBC Subject categories for general records
export type SubjectName =
  | 'Mathematics'
  | 'English'
  | 'Kiswahili'
  | 'Science'
  | 'Agriculture'
  | 'Creative Arts'
  | 'Social Studies'
  | 'CRE'
  | 'Science and Technology'
  | 'Agriculture and Nutrition'
  | 'Religious Education'
  | 'Indigenous Language Activities'
  | 'English Language Activities'
  | 'Kiswahili Language Activities'
  | 'Mathematical Activities'
  | 'Religious Education Activities'
  | 'Environmental Activities'
  | 'Creative Activities';

export const STANDARD_SUBJECTS: SubjectName[] = [
  'Mathematics',
  'English',
  'Kiswahili',
  'Science',
  'Agriculture',
  'Creative Arts',
  'Social Studies',
  'CRE',
];

// Revised / Rationalized Competency-Based Education (CBE) Grade Coverage Subjects
export type LowerPrimarySubject =
  | 'Indigenous Language Activities'
  | 'English Language Activities'
  | 'Kiswahili Language Activities'
  | 'Mathematical Activities'
  | 'Religious Education Activities'
  | 'Environmental Activities'
  | 'Creative Activities';

export type UpperPrimarySubject =
  | 'English'
  | 'Kiswahili'
  | 'Mathematics'
  | 'Science and Technology'
  | 'Agriculture and Nutrition'
  | 'Social Studies'
  | 'Creative Arts'
  | 'Religious Education';

export type RationalizedSubject = LowerPrimarySubject | UpperPrimarySubject;

export const RATIONALIZED_LOWER_PRIMARY_SUBJECTS: LowerPrimarySubject[] = [
  'Indigenous Language Activities',
  'English Language Activities',
  'Kiswahili Language Activities',
  'Mathematical Activities',
  'Religious Education Activities',
  'Environmental Activities',
  'Creative Activities'
];

export const RATIONALIZED_UPPER_PRIMARY_SUBJECTS: UpperPrimarySubject[] = [
  'English',
  'Kiswahili',
  'Mathematics',
  'Science and Technology',
  'Agriculture and Nutrition',
  'Social Studies',
  'Creative Arts',
  'Religious Education'
];

export type TermName = 'Term 1' | 'Term 2' | 'Term 3';

export type CBCRating = 'EE' | 'ME' | 'AE' | 'BE'; // Exceeding Expectations, Meeting Expectations, Approaching Expectations, Below Expectations

export type AppScreen = 'splash' | 'portal-select' | 'teacher' | 'learner' | 'admin';
export type UserRole = 'teacher' | 'learner' | 'admin';

export interface StaffMember {
  id: string;
  name: string;
  tscNumber: string;
  role: string;
  primaryGrade: GradeLevel | 'All Grades';
  specialization: string[];
  phone: string;
  email: string;
  joinedYear: number;
  status: 'Active' | 'On Leave';
}

export interface TeacherSubjectAssignment {
  subject: SubjectName | string;
  grades: GradeLevel[];
  gradeSummary: string; // e.g. "Grades 1–6" or "Grades 4–6"
}

export interface TeacherProfile {
  id: string; // 'tr-elvis', 'tr-fresiah', 'tr-kelvin', 'tr-liz'
  name: string; // 'MR ELVIS', 'MADAM FRESIAH', 'MR KELVIN', 'MADAM LIZ'
  title: string; // 'Mr. Elvis', 'Madam Fresiah'
  role: string;
  tscNumber: string;
  phone: string;
  email: string;
  avatarColor: string; // e.g. 'bg-blue-600'
  accentColor: string;
  assignments: TeacherSubjectAssignment[];
  bio?: string;
}

export interface BellPeriodSlot {
  id: string;
  periodNumber: number; // 1, 2, 3, 0, 4, 5, 6, 0, 7, 8, 0
  label: string; // 'Lesson 1', 'Lesson 2', 'Lesson 3', 'Break', 'Lesson 4', 'Lesson 5', 'Lesson 6', 'Lunch', 'Lesson 7', 'Lesson 8', 'Games'
  startTime: string; // "08:10", "08:50", "09:20", "10:10", "10:40", "11:20", "12:00", "12:40", "13:20", "14:00", "14:40"
  endTime: string;   // "08:50", "09:20", "10:10", "10:40", "11:20", "12:00", "12:40", "13:20", "14:00", "14:40", "16:00"
  displayTime: string; // "8:10 AM – 8:50 AM", etc.
  durationMinutes: number;
  isBreak?: boolean;
  breakType?: 'tea' | 'lunch' | 'games';
}

export type AdminTab =
  | 'overview'
  | 'staff'
  | 'learners'
  | 'documents'
  | 'curriculum'
  | 'resources'
  | 'timetable'
  | 'notices'
  | 'settings';

export interface Student {
  id: string;
  admissionNumber: string;
  name: string;
  gender: 'Male' | 'Female';
  grade: GradeLevel;
  avatar?: string;
  avatarUrl?: string;
  parentName?: string;
  parentPhone?: string;
  emergencyContact?: string;
  dob?: string;
  attendanceRate?: number; // percentage
  teacherRemarks?: string;
  headteacherRemarks?: string;
  catMarks: Partial<Record<SubjectName, {
    cat1: number; // out of 30 or 100
    cat2: number;
    endTerm: number;
  }>>;
}

export interface SchemeOfWork {
  id: string;
  grade: GradeLevel;
  subject: SubjectName;
  term: TermName;
  week: number;
  lesson: number;
  strand: string;
  subStrand: string;
  specificLearningOutcomes: string;
  keyInquiryQuestions: string;
  learningExperiences?: string;
  learningResources: string;
  assessmentMethods: string;
  reflectionRemarks: string;
  attachments?: { name: string; size: string; url?: string }[];
  updatedAt?: string;
}

export interface LessonPlan {
  id: string;
  grade: GradeLevel;
  subject: SubjectName;
  term: TermName;
  week: number;
  lessonNumber: number;
  date: string;
  durationMinutes: number;
  strand: string;
  subStrand: string;
  specificLearningOutcomes?: string;
  keyInquiryQuestions?: string;
  coreCompetencies: string[];
  values: string[];
  organizationOfLearning?: string;
  introduction: string;
  lessonDevelopment: string;
  conclusion: string;
  summaryRemarks?: string;
  attachments?: { name: string; size: string; url?: string }[];
}

export interface RecordOfWork {
  id: string;
  grade: GradeLevel;
  subject: SubjectName;
  term: TermName;
  week: number;
  lesson: number;
  workPlanned: string;
  workCovered: string;
  challengesEncountered: string;
  remedialAction: string;
  teacherSignature: string;
  dateChecked: string;
}

export interface Assignment {
  id: string;
  title: string;
  grade: GradeLevel;
  subject: SubjectName;
  term?: TermName;
  dueDate: string;
  totalMarks: number;
  instructions: string;
  attachments?: { name: string; size: string; url?: string }[];
  submissionsCount?: number;
  createdAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex?: number;
  correctIndex?: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  grade: GradeLevel;
  subject: SubjectName;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  createdAt?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  grade: GradeLevel;
  subject: SubjectName;
  category: 'Textbook' | 'Revision Paper' | 'Teaching Aid' | 'Lesson Notes' | 'Video Guide' | string;
  fileType?: 'pdf' | 'doc' | 'image' | 'video' | 'link' | 'markdown';
  inputType?: 'PDF_ATTACHMENT' | 'RAW_TEXT_AI_COPY';
  fileSize: string;
  description: string;
  downloadUrl?: string;
  uploadedAt: string;
  fileName?: string;
  pdfDataUrl?: string;
  markdownContent?: string;
  authorRole?: 'ADMIN' | 'TEACHER';
}

export interface TimetableSlot {
  id: string;
  grade: GradeLevel;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  timeSlot: string;
  periodNumber: number;
  periodLabel?: string;
  startTime?: string;
  endTime?: string;
  subject: SubjectName | 'Morning Assembly' | 'Break' | 'Lunch' | 'Games / Clubs' | 'Pastoral / Guidance' | string;
  teacherName: string;
  teacherId?: string;
  room: string;
  isBreak?: boolean;
  breakType?: 'tea' | 'lunch' | 'games';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  category: 'Term Date' | 'Exams / CAT' | 'Co-Curricular' | 'Holiday' | 'PTA Meeting' | string;
  description: string;
  term?: TermName;
  academicYear?: number;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  author: string;
  priority: 'High' | 'Normal' | 'Urgent';
  targetAudience: 'All' | 'Teachers' | 'Learners' | 'Parents';
  content: string;
}

export type ActiveScreen = 'splash' | 'portal_select' | 'teacher_main' | 'learner_main';
export type TeacherTab = 
  | 'home'
  | 'classes'
  | 'schemes'
  | 'lessons'
  | 'records'
  | 'assessments'
  | 'knec'
  | 'exams'
  | 'assignments'
  | 'quizzes'
  | 'resources'
  | 'timetable'
  | 'calendar'
  | 'reports';

export type LearnerTab =
  | 'home'
  | 'subjects'
  | 'cats'
  | 'strands'
  | 'assignments'
  | 'revision'
  | 'quizzes'
  | 'results'
  | 'progress'
  | 'notices'
  | 'calendar';

export interface SchoolMetadata {
  school_name: string;
  head_teacher_name: string;
  school_code_number: string;
  is_code_editable: boolean;
  po_box?: string;
  phone?: string;
  email?: string;
  motto?: string;
  county?: string;
  sub_county?: string;
}

export interface ClockSettings {
  displaySeconds: boolean;
  format: 'HH:MM:SS' | string;
  syncSource: 'device_local_time' | string;
}

export interface AdminPermissions {
  textbooksAndResources: 'WRITE' | 'READ_ONLY';
  timetableOverrides: 'WRITE' | 'READ_ONLY';
  systemSettings: 'WRITE' | 'READ_ONLY';
}

export interface TeacherPermissions {
  textbooksAndResources: 'READ_ONLY' | 'WRITE';
  timetableOverrides: 'READ_ONLY' | 'WRITE';
  personalDashboard: 'READ_WRITE' | 'READ_ONLY';
}

export interface RolesAndPermissionsConfig {
  ADMIN: {
    password: string;
    permissions: AdminPermissions;
  };
  TEACHERS: {
    passwords: {
      elvis: string;
      fresiah: string;
      kelvin: string;
      liz: string;
      [key: string]: string;
    };
    permissions: TeacherPermissions;
  };
}

export interface ResourceInputTypeConfig {
  type: 'PDF_ATTACHMENT' | 'RAW_TEXT_AI_COPY' | string;
  allowedExtensions?: string[];
  maxFileSizeMB?: number;
  format?: 'markdown' | string;
  supportFormattedNotes?: boolean;
}

export interface SystemConfig {
  appName?: string;
  version?: string;
  clockSettings?: ClockSettings;
  rolesAndPermissions?: RolesAndPermissionsConfig;
  resourceInputTypes?: ResourceInputTypeConfig[];
  framework?: string;
  current_date?: string;
  academic_year?: number;
  active_academic_year: number;
  active_term: TermName;
  school_metadata: SchoolMetadata;
}

// ---------------------------------------------------------------------------
// Revised / Rationalized CBE Blank Lesson Plan Sheet Specification
// ---------------------------------------------------------------------------
export interface LessonPlanAdministrativeDetails {
  school_name: string;
  school_code: string;
  teacher_name: string;
  tsc_number: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "35 mins"
  roll_enrolment: {
    boys: number;
    girls: number;
    total: number;
  };
  grade_level: string; // Grade 1 to Grade 6
  learning_area_subject: string;
  term: string; // e.g. "Term 3"
  week: number;
  lesson_number: number;
}

export interface SpecificLearningOutcomesTriad {
  knowledge_understanding: string;
  skills: string;
  attitudes_values: string;
}

export interface LessonPlanCurriculumAlignment {
  strand: string;
  sub_strand: string;
  specific_learning_outcomes: SpecificLearningOutcomesTriad;
  key_inquiry_questions: string[];
  core_competencies_to_develop: string[];
  values: string[];
  pertinent_and_contemporary_issues_pcis: string[];
  learning_resources: string[];
}

export interface LessonDevelopmentStep {
  step_number: number;
  step_name: string;
  duration: string;
  teacher_activity: string;
  learner_activity: string;
  assessment_mode: string;
}

export interface PostLessonReflection {
  successes_and_strengths: string;
  challenges_observed: string;
  remedial_and_next_steps: string;
}

export interface BlankLessonPlanSheet {
  id: string;
  administrative_details: LessonPlanAdministrativeDetails;
  curriculum_alignment: LessonPlanCurriculumAlignment;
  lesson_development_steps: LessonDevelopmentStep[];
  post_lesson_reflection: PostLessonReflection;
  createdAt?: string;
  updatedAt?: string;
}

export interface TermCalendarDates {
  start: string;
  end: string;
  mid_term?: string;
  mid_term_break?: string;
  knec_projects_portal_opens?: string;
  knec_projects_portal_auto_sync?: string;
  kpsea_exam_dates?: string;
  kpsea_national_window?: string;
  exam_series?: string[];
}

export interface AcademicYearSchedule {
  term_1: TermCalendarDates;
  term_2: TermCalendarDates;
  term_3: TermCalendarDates;
}

export interface AcademicCalendarsConfig {
  year_2026: AcademicYearSchedule;
  year_2027_projected: AcademicYearSchedule;
}

export type KNECGradeLevel = 'Grade 3' | 'Grade 4' | 'Grade 5' | 'Grade 6';

export interface KNECPerformanceLevel {
  level: 1 | 2 | 3 | 4;
  ratingCode: CBCRating;
  name: string;
  scoreRange: string;
  description: string;
  criteria: string[];
}

export interface KNECProjectModule {
  id: string;
  grade: KNECGradeLevel;
  subject: SubjectName;
  title: string;
  term: TermName;
  cbaCode: string;
  durationWeeks: number;
  status: 'Ready' | 'In Progress' | 'Uploaded' | 'Draft';
  taskInstructions: {
    objective: string;
    learnerGuidelines: string[];
    materialsRequired: string[];
    safetyPrecautions: string[];
    keyInquiryQuestions: string[];
    submissionEvidence: string[];
  };
  markingGuidelines: {
    rubrics: KNECPerformanceLevel[];
    teacherNotes: string;
  };
  portfolioUpload: {
    portalUrl: string;
    expectedFormat: 'CSV' | 'Excel' | 'PDF';
    fields: string[];
    sampleRecord: Record<string, string | number>;
  };
}

export type ExamPublisher = 
  | 'Targeter Series (Opener, Midterm, Endterm)'
  | 'Jesma Exams Series'
  | 'Predictors Series'
  | 'Signal & Spotlight Evaluation Papers';

export interface ExamSeriesPaper {
  id: string;
  title: string;
  publisher: ExamPublisher;
  publisherShort: 'Targeter' | 'Jesma' | 'Predictors' | 'Signal & Spotlight';
  seriesType: 'Opener' | 'Midterm' | 'Endterm' | 'KPSEA Trial';
  grade: GradeLevel;
  subject: SubjectName;
  term: TermName;
  year: number;
  autoScheduleRule: string;
  scheduledWeeks: string;
  totalMarks: number;
  durationMinutes: number;
  paperCode: string;
  hasMarkingScheme: boolean;
  status: 'Scheduled' | 'Completed' | 'Pending' | 'Ready';
}

// Global CBE Evaluation Module Engine (cats_root_engine)
export type CATAttemptStatus = 'NOT_ATTEMPTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface CATQuestion {
  q_id: number;
  question: string;
  options: string[];
  correct_answer: string;
  score: number;
  explanation?: string;
}

export interface CATContent {
  instructions: string;
  questions: CATQuestion[];
}

export interface CATSubStrand {
  sub_strand_name: string;
  cat_score: number;
  max_score: number;
  status: CATAttemptStatus;
  cat_content: CATContent;
  completedAt?: string;
  learnerAnswers?: Record<number, string>;
}

export interface CATStrand {
  strand_name: string;
  sub_strands: CATSubStrand[];
}

export interface CATSubject {
  subject_name: string;
  strands: CATStrand[];
}

export interface CATClassLevel {
  class_level: string; // e.g. "Grade 1", "Grade 2", etc.
  subjects: CATSubject[];
}

export interface CATSRootEngine {
  module_description: string;
  classes: CATClassLevel[];
}
