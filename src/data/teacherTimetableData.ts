import { 
  GradeLevel, 
  SubjectName, 
  TeacherProfile, 
  BellPeriodSlot, 
  TimetableSlot 
} from '../types';

/**
 * OFFICIAL SYSTEM AUTHENTICATION & ACCESS CONTROL CONFIG
 * Credentials are cryptographic tokens / masked. Zero plaintext credentials in source.
 */
export const OFFICIAL_ADMIN_PASSWORD = '[PROTECTED_HASH]';

export const OFFICIAL_TEACHER_PASSWORDS: Record<string, string> = {
  elvis: '[PROTECTED_HASH]',
  fresiah: '[PROTECTED_HASH]',
  kelvin: '[PROTECTED_HASH]',
  liz: '[PROTECTED_HASH]',
  'tr-elvis': '[PROTECTED_HASH]',
  'tr-fresiah': '[PROTECTED_HASH]',
  'tr-kelvin': '[PROTECTED_HASH]',
  'tr-liz': '[PROTECTED_HASH]'
};

export const ADMIN_AUTH_CONFIG = {
  masterPassword: '[PROTECTED_HASH]',
  canEditTimetable: true
};

export const TEACHER_AUTH_CONFIG = {
  password: '[PROTECTED_HASH]',
  canEditTimetable: false
};

export const MASTER_ADMIN_PASSWORD = ADMIN_AUTH_CONFIG.masterPassword;
export const MASTER_TEACHER_PASSWORD = '[PROTECTED_HASH]';

export const ROLES_AND_PERMISSIONS = {
  ADMIN: {
    password: '[PROTECTED_HASH]',
    permissions: {
      textbooksAndResources: 'WRITE' as const,
      timetableOverrides: 'WRITE' as const,
      systemSettings: 'WRITE' as const
    }
  },
  TEACHERS: {
    passwords: {
      elvis: '[PROTECTED_HASH]',
      fresiah: '[PROTECTED_HASH]',
      kelvin: '[PROTECTED_HASH]',
      liz: '[PROTECTED_HASH]'
    },
    permissions: {
      textbooksAndResources: 'READ_ONLY' as const,
      timetableOverrides: 'READ_ONLY' as const,
      personalDashboard: 'READ_WRITE' as const
    }
  }
};

export const RESOURCE_INPUT_TYPES = [
  {
    type: 'PDF_ATTACHMENT',
    allowedExtensions: ['.pdf'],
    maxFileSizeMB: 50
  },
  {
    type: 'RAW_TEXT_AI_COPY',
    format: 'markdown',
    supportFormattedNotes: true
  }
] as const;

export interface TimeSlotConfig {
  id: number;
  start: string;
  end: string;
  label: string;
  isBreak?: boolean;
}

/**
 * EXACT OFFICIAL TIME SLOTS SPECIFICATION
 */
export const TIME_SLOTS_CONFIG: TimeSlotConfig[] = [
  { id: 1, start: '08:10', end: '08:50', label: 'Lesson 1' },
  { id: 2, start: '08:50', end: '09:20', label: 'Lesson 2' },
  { id: 3, start: '09:20', end: '10:10', label: 'Lesson 3' },
  { id: 0, start: '10:10', end: '10:40', label: 'Break', isBreak: true },
  { id: 4, start: '10:40', end: '11:20', label: 'Lesson 4' },
  { id: 5, start: '11:20', end: '12:00', label: 'Lesson 5' },
  { id: 6, start: '12:00', end: '12:40', label: 'Lesson 6' },
  { id: 0, start: '12:40', end: '13:20', label: 'Lunch', isBreak: true },
  { id: 7, start: '13:20', end: '14:00', label: 'Lesson 7' },
  { id: 8, start: '14:00', end: '14:40', label: 'Lesson 8' },
  { id: 0, start: '14:40', end: '17:00', label: 'Games', isBreak: true }
];

/**
 * COMPLETE TEACHER PROFILES & ASSIGNED SUBJECTS / GRADES
 */
export const TEACHER_PROFILES: TeacherProfile[] = [
  {
    id: 'tr-elvis',
    name: 'MR ELVIS',
    title: 'Mr. Elvis',
    role: 'Creative Arts, Social Studies & Mathematics Specialist',
    tscNumber: 'TSC/492810/2016',
    phone: '0798 193966',
    email: 'elvis@littleroses.ac.ke',
    avatarColor: 'bg-blue-600',
    accentColor: '#1d4ed8',
    bio: 'Lead Teacher for Creative Arts & Social Studies, Upper Primary Mathematics coordinator.',
    assignments: [
      {
        subject: 'Creative Arts',
        grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
        gradeSummary: 'Grades 1–6'
      },
      {
        subject: 'Social Studies',
        grades: ['Grade 4', 'Grade 5', 'Grade 6'],
        gradeSummary: 'Grades 4–6'
      },
      {
        subject: 'Mathematics',
        grades: ['Grade 4', 'Grade 5', 'Grade 6'],
        gradeSummary: 'Grades 4–6'
      }
    ]
  },
  {
    id: 'tr-fresiah',
    name: 'MADAM FRESIAH',
    title: 'Madam Fresiah',
    role: 'Senior Mathematics, Science & C.R.E Specialist',
    tscNumber: 'TSC/421908/2015',
    phone: '0722 789012',
    email: 'fresiah@littleroses.ac.ke',
    avatarColor: 'bg-emerald-600',
    accentColor: '#059669',
    bio: 'Senior Science Teacher, Lower/Mid Primary Mathematics and Christian Religious Education Coordinator.',
    assignments: [
      {
        subject: 'Mathematics',
        grades: ['Grade 1', 'Grade 3', 'Grade 4'],
        gradeSummary: 'Grades 1, 3, 4'
      },
      {
        subject: 'Science',
        grades: ['Grade 4', 'Grade 5', 'Grade 6'],
        gradeSummary: 'Grades 4–6'
      },
      {
        subject: 'CRE',
        grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
        gradeSummary: 'Grades 1–6'
      }
    ]
  },
  {
    id: 'tr-kelvin',
    name: 'MR KELVIN',
    title: 'Mr. Kelvin',
    role: 'Headteacher & Senior English / Agriculture Master',
    tscNumber: 'TSC/384920/2012',
    phone: '0798 193966',
    email: 'roseslittle3@gmail.com',
    avatarColor: 'bg-indigo-700',
    accentColor: '#4338ca',
    bio: 'Headteacher, Little Roses Academy. Senior English Language master and Practical Agriculture lead.',
    assignments: [
      {
        subject: 'English',
        grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
        gradeSummary: 'Grades 1–6'
      },
      {
        subject: 'Agriculture',
        grades: ['Grade 4', 'Grade 5', 'Grade 6'],
        gradeSummary: 'Grades 4–6'
      }
    ]
  },
  {
    id: 'tr-liz',
    name: 'MADAM LIZ',
    title: 'Madam Liz',
    role: 'Senior Kiswahili & Early Years Lead Teacher',
    tscNumber: 'TSC/518290/2019',
    phone: '0714 567890',
    email: 'liz@littleroses.ac.ke',
    avatarColor: 'bg-rose-600',
    accentColor: '#e11d48',
    bio: 'Senior Kiswahili Language educator across primary levels and Grade 2 class leader.',
    assignments: [
      {
        subject: 'Kiswahili',
        grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
        gradeSummary: 'Grades 1–6'
      },
      {
        subject: 'Mathematics',
        grades: ['Grade 2'],
        gradeSummary: 'Grade 2'
      },
      {
        subject: 'Environmental Activities',
        grades: ['Grade 1', 'Grade 2', 'Grade 3'],
        gradeSummary: 'Grades 1–3'
      }
    ]
  }
];

/**
 * EXACT BELL SCHEDULE PERIOD SLOTS SPECIFICATION:
 * Lesson 1: 8:10 AM – 8:50 AM
 * Lesson 2: 8:50 AM – 9:20 AM
 * Lesson 3: 9:20 AM – 10:10 AM
 * Break: 10:10 AM – 10:40 AM
 * Lesson 4: 10:40 AM – 11:20 AM
 * Lesson 5: 11:20 AM – 12:00 PM
 * Lesson 6: 12:00 PM – 12:40 PM
 * Lunch: 12:40 PM – 1:20 PM
 * Lesson 7: 1:20 PM – 2:00 PM
 * Lesson 8: 2:00 PM – 2:40 PM
 * Games: 2:40 PM onwards
 */
export const BELL_SCHEDULE_SLOTS: BellPeriodSlot[] = [
  {
    id: 'slot-1',
    periodNumber: 1,
    label: 'Lesson 1',
    startTime: '08:10',
    endTime: '08:50',
    displayTime: '8:10 AM – 8:50 AM',
    durationMinutes: 40
  },
  {
    id: 'slot-2',
    periodNumber: 2,
    label: 'Lesson 2',
    startTime: '08:50',
    endTime: '09:20',
    displayTime: '8:50 AM – 9:20 AM',
    durationMinutes: 30
  },
  {
    id: 'slot-3',
    periodNumber: 3,
    label: 'Lesson 3',
    startTime: '09:20',
    endTime: '10:10',
    displayTime: '9:20 AM – 10:10 AM',
    durationMinutes: 50
  },
  {
    id: 'slot-break',
    periodNumber: 0,
    label: 'Break',
    startTime: '10:10',
    endTime: '10:40',
    displayTime: '10:10 AM – 10:40 AM',
    durationMinutes: 30,
    isBreak: true,
    breakType: 'tea'
  },
  {
    id: 'slot-4',
    periodNumber: 4,
    label: 'Lesson 4',
    startTime: '10:40',
    endTime: '11:20',
    displayTime: '10:40 AM – 11:20 AM',
    durationMinutes: 40
  },
  {
    id: 'slot-5',
    periodNumber: 5,
    label: 'Lesson 5',
    startTime: '11:20',
    endTime: '12:00',
    displayTime: '11:20 AM – 12:00 PM',
    durationMinutes: 40
  },
  {
    id: 'slot-6',
    periodNumber: 6,
    label: 'Lesson 6',
    startTime: '12:00',
    endTime: '12:40',
    displayTime: '12:00 PM – 12:40 PM',
    durationMinutes: 40
  },
  {
    id: 'slot-lunch',
    periodNumber: 0,
    label: 'Lunch',
    startTime: '12:40',
    endTime: '13:20',
    displayTime: '12:40 PM – 1:20 PM',
    durationMinutes: 40,
    isBreak: true,
    breakType: 'lunch'
  },
  {
    id: 'slot-7',
    periodNumber: 7,
    label: 'Lesson 7',
    startTime: '13:20',
    endTime: '14:00',
    displayTime: '1:20 PM – 2:00 PM',
    durationMinutes: 40
  },
  {
    id: 'slot-8',
    periodNumber: 8,
    label: 'Lesson 8',
    startTime: '14:00',
    endTime: '14:40',
    displayTime: '2:00 PM – 2:40 PM',
    durationMinutes: 40
  },
  {
    id: 'slot-games',
    periodNumber: 0,
    label: 'Games',
    startTime: '14:40',
    endTime: '17:00',
    displayTime: '2:40 PM – 5:00 PM',
    durationMinutes: 140,
    isBreak: true,
    breakType: 'games'
  }
];

export const SCHOOL_DAYS: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

/**
 * MASTER TEACHER TIMETABLE MAPPING
 * Maps each teacher directly to their subjects & grades across all 5 school days and 8 periods.
 */
export const MASTER_TEACHER_SCHEDULE: TimetableSlot[] = [
  // ==========================================
  // MR ELVIS: Creative Arts (G1-6), Social Studies (G4-6), Mathematics (G4-6)
  // ==========================================
  // Monday
  { id: 'tt-elv-m-1', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 6', day: 'Monday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Mathematics', room: 'Room 6A' },
  { id: 'tt-elv-m-2', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 5', day: 'Monday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Social Studies', room: 'Room 5A' },
  { id: 'tt-elv-m-3', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 4', day: 'Monday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Creative Arts', room: 'Arts Studio' },
  { id: 'tt-elv-m-4', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 5', day: 'Monday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Mathematics', room: 'Room 5A' },
  { id: 'tt-elv-m-5', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 1', day: 'Monday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Creative Arts', room: 'Room 1A' },
  { id: 'tt-elv-m-6', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 6', day: 'Monday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'Social Studies', room: 'Room 6A' },
  { id: 'tt-elv-m-7', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 4', day: 'Monday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Mathematics', room: 'Room 4A' },
  { id: 'tt-elv-m-8', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 2', day: 'Monday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Creative Arts', room: 'Arts Studio' },

  // Tuesday
  { id: 'tt-elv-t-1', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 4', day: 'Tuesday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Social Studies', room: 'Room 4A' },
  { id: 'tt-elv-t-2', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 5', day: 'Tuesday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Creative Arts', room: 'Arts Studio' },
  { id: 'tt-elv-t-3', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 6', day: 'Tuesday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Mathematics', room: 'Room 6A' },
  { id: 'tt-elv-t-4', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 3', day: 'Tuesday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Creative Arts', room: 'Room 3A' },
  { id: 'tt-elv-t-5', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 5', day: 'Tuesday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Mathematics', room: 'Room 5A' },
  { id: 'tt-elv-t-6', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 6', day: 'Tuesday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'Creative Arts', room: 'Arts Studio' },
  { id: 'tt-elv-t-7', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 5', day: 'Tuesday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Social Studies', room: 'Room 5A' },
  { id: 'tt-elv-t-8', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 4', day: 'Tuesday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Mathematics', room: 'Room 4A' },

  // Wednesday
  { id: 'tt-elv-w-1', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 5', day: 'Wednesday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Mathematics', room: 'Room 5A' },
  { id: 'tt-elv-w-2', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 4', day: 'Wednesday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Creative Arts', room: 'Arts Studio' },
  { id: 'tt-elv-w-3', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 6', day: 'Wednesday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Social Studies', room: 'Room 6A' },
  { id: 'tt-elv-w-4', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 6', day: 'Wednesday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Mathematics', room: 'Room 6A' },
  { id: 'tt-elv-w-5', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 2', day: 'Wednesday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Creative Arts', room: 'Arts Studio' },
  { id: 'tt-elv-w-6', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 4', day: 'Wednesday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'Social Studies', room: 'Room 4A' },
  { id: 'tt-elv-w-7', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 1', day: 'Wednesday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Creative Arts', room: 'Room 1A' },
  { id: 'tt-elv-w-8', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 4', day: 'Wednesday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Mathematics', room: 'Room 4A' },

  // Thursday
  { id: 'tt-elv-th-1', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 6', day: 'Thursday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Mathematics', room: 'Room 6A' },
  { id: 'tt-elv-th-2', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 5', day: 'Thursday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Social Studies', room: 'Room 5A' },
  { id: 'tt-elv-th-3', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 6', day: 'Thursday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Creative Arts', room: 'Arts Studio' },
  { id: 'tt-elv-th-4', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 3', day: 'Thursday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Creative Arts', room: 'Room 3A' },
  { id: 'tt-elv-th-5', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 4', day: 'Thursday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Mathematics', room: 'Room 4A' },
  { id: 'tt-elv-th-6', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 6', day: 'Thursday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'Social Studies', room: 'Room 6A' },
  { id: 'tt-elv-th-7', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 5', day: 'Thursday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Mathematics', room: 'Room 5A' },
  { id: 'tt-elv-th-8', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 5', day: 'Thursday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Creative Arts', room: 'Arts Studio' },

  // Friday
  { id: 'tt-elv-f-1', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 4', day: 'Friday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Social Studies', room: 'Room 4A' },
  { id: 'tt-elv-f-2', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 5', day: 'Friday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Mathematics', room: 'Room 5A' },
  { id: 'tt-elv-f-3', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 1', day: 'Friday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Creative Arts', room: 'Room 1A' },
  { id: 'tt-elv-f-4', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 6', day: 'Friday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Mathematics', room: 'Room 6A' },
  { id: 'tt-elv-f-5', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 4', day: 'Friday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Creative Arts', room: 'Arts Studio' },
  { id: 'tt-elv-f-6', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 4', day: 'Friday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'Mathematics', room: 'Room 4A' },
  { id: 'tt-elv-f-7', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 6', day: 'Friday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Social Studies', room: 'Room 6A' },
  { id: 'tt-elv-f-8', teacherId: 'tr-elvis', teacherName: 'MR ELVIS', grade: 'Grade 2', day: 'Friday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Creative Arts', room: 'Arts Studio' },

  // ==========================================
  // MADAM FRESIAH: Mathematics (G1, 3, 4), Science (G4-6), C.R.E (G1-6)
  // ==========================================
  // Monday
  { id: 'tt-fre-m-1', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 1', day: 'Monday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Mathematics', room: 'Room 1A' },
  { id: 'tt-fre-m-2', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 3', day: 'Monday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Mathematics', room: 'Room 3A' },
  { id: 'tt-fre-m-3', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 5', day: 'Monday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-m-4', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 6', day: 'Monday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-m-5', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 4', day: 'Monday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-m-6', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 2', day: 'Monday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'CRE', room: 'Room 2A' },
  { id: 'tt-fre-m-7', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 3', day: 'Monday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'CRE', room: 'Room 3A' },
  { id: 'tt-fre-m-8', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 1', day: 'Monday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'CRE', room: 'Room 1A' },

  // Tuesday
  { id: 'tt-fre-t-1', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 3', day: 'Tuesday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Mathematics', room: 'Room 3A' },
  { id: 'tt-fre-t-2', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 1', day: 'Tuesday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Mathematics', room: 'Room 1A' },
  { id: 'tt-fre-t-3', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 4', day: 'Tuesday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-t-4', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 6', day: 'Tuesday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'CRE', room: 'Room 6A' },
  { id: 'tt-fre-t-5', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 5', day: 'Tuesday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-t-6', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 4', day: 'Tuesday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'CRE', room: 'Room 4A' },
  { id: 'tt-fre-t-7', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 6', day: 'Tuesday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-t-8', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 5', day: 'Tuesday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'CRE', room: 'Room 5A' },

  // Wednesday
  { id: 'tt-fre-w-1', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 1', day: 'Wednesday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Mathematics', room: 'Room 1A' },
  { id: 'tt-fre-w-2', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 6', day: 'Wednesday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-w-3', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 3', day: 'Wednesday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Mathematics', room: 'Room 3A' },
  { id: 'tt-fre-w-4', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 5', day: 'Wednesday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'CRE', room: 'Room 5A' },
  { id: 'tt-fre-w-5', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 4', day: 'Wednesday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-w-6', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 6', day: 'Wednesday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'CRE', room: 'Room 6A' },
  { id: 'tt-fre-w-7', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 5', day: 'Wednesday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-w-8', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 3', day: 'Wednesday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'CRE', room: 'Room 3A' },

  // Thursday
  { id: 'tt-fre-th-1', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 3', day: 'Thursday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Mathematics', room: 'Room 3A' },
  { id: 'tt-fre-th-2', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 1', day: 'Thursday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Mathematics', room: 'Room 1A' },
  { id: 'tt-fre-th-3', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 4', day: 'Thursday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-th-4', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 5', day: 'Thursday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-th-5', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 6', day: 'Thursday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-th-6', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 2', day: 'Thursday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'CRE', room: 'Room 2A' },
  { id: 'tt-fre-th-7', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 4', day: 'Thursday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'CRE', room: 'Room 4A' },
  { id: 'tt-fre-th-8', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 6', day: 'Thursday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'CRE', room: 'Room 6A' },

  // Friday
  { id: 'tt-fre-f-1', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 1', day: 'Friday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Mathematics', room: 'Room 1A' },
  { id: 'tt-fre-f-2', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 3', day: 'Friday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Mathematics', room: 'Room 3A' },
  { id: 'tt-fre-f-3', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 5', day: 'Friday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-f-4', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 4', day: 'Friday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-f-5', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 6', day: 'Friday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Science', room: 'Science Lab' },
  { id: 'tt-fre-f-6', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 1', day: 'Friday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'CRE', room: 'Room 1A' },
  { id: 'tt-fre-f-7', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 5', day: 'Friday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'CRE', room: 'Room 5A' },
  { id: 'tt-fre-f-8', teacherId: 'tr-fresiah', teacherName: 'MADAM FRESIAH', grade: 'Grade 6', day: 'Friday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'CRE', room: 'Room 6A' },

  // ==========================================
  // MR KELVIN: English (G1-6), Agriculture (G4-6)
  // ==========================================
  // Monday
  { id: 'tt-kel-m-1', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 5', day: 'Monday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'English', room: 'Room 5A' },
  { id: 'tt-kel-m-2', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 6', day: 'Monday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'English', room: 'Room 6A' },
  { id: 'tt-kel-m-3', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 2', day: 'Monday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'English', room: 'Room 2A' },
  { id: 'tt-kel-m-4', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 4', day: 'Monday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'English', room: 'Room 4A' },
  { id: 'tt-kel-m-5', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 3', day: 'Monday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'English', room: 'Room 3A' },
  { id: 'tt-kel-m-6', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 1', day: 'Monday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'English', room: 'Room 1A' },
  { id: 'tt-kel-m-7', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 6', day: 'Monday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Agriculture', room: 'Agri Plot / Room 6A' },
  { id: 'tt-kel-m-8', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 5', day: 'Monday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Agriculture', room: 'Agri Plot' },

  // Tuesday
  { id: 'tt-kel-t-1', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 6', day: 'Tuesday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'English', room: 'Room 6A' },
  { id: 'tt-kel-t-2', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 4', day: 'Tuesday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'English', room: 'Room 4A' },
  { id: 'tt-kel-t-3', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 5', day: 'Tuesday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'English', room: 'Room 5A' },
  { id: 'tt-kel-t-4', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 1', day: 'Tuesday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'English', room: 'Room 1A' },
  { id: 'tt-kel-t-5', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 2', day: 'Tuesday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'English', room: 'Room 2A' },
  { id: 'tt-kel-t-6', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 3', day: 'Tuesday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'English', room: 'Room 3A' },
  { id: 'tt-kel-t-7', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 4', day: 'Tuesday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Agriculture', room: 'Agri Plot' },
  { id: 'tt-kel-t-8', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 6', day: 'Tuesday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Agriculture', room: 'Room 6A' },

  // Wednesday
  { id: 'tt-kel-w-1', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 2', day: 'Wednesday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'English', room: 'Room 2A' },
  { id: 'tt-kel-w-2', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 1', day: 'Wednesday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'English', room: 'Room 1A' },
  { id: 'tt-kel-w-3', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 4', day: 'Wednesday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'English', room: 'Room 4A' },
  { id: 'tt-kel-w-4', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 3', day: 'Wednesday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'English', room: 'Room 3A' },
  { id: 'tt-kel-w-5', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 6', day: 'Wednesday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'English', room: 'Room 6A' },
  { id: 'tt-kel-w-6', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 5', day: 'Wednesday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'Agriculture', room: 'Agri Plot' },
  { id: 'tt-kel-w-7', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 4', day: 'Wednesday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Agriculture', room: 'Room 4A' },
  { id: 'tt-kel-w-8', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 5', day: 'Wednesday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'English', room: 'Room 5A' },

  // Thursday
  { id: 'tt-kel-th-1', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 4', day: 'Thursday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'English', room: 'Room 4A' },
  { id: 'tt-kel-th-2', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 3', day: 'Thursday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'English', room: 'Room 3A' },
  { id: 'tt-kel-th-3', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 5', day: 'Thursday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Agriculture', room: 'Agri Plot' },
  { id: 'tt-kel-th-4', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 6', day: 'Thursday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'English', room: 'Room 6A' },
  { id: 'tt-kel-th-5', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 5', day: 'Thursday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'English', room: 'Room 5A' },
  { id: 'tt-kel-th-6', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 4', day: 'Thursday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'Agriculture', room: 'Agri Plot' },
  { id: 'tt-kel-th-7', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 1', day: 'Thursday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'English', room: 'Room 1A' },
  { id: 'tt-kel-th-8', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 2', day: 'Thursday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'English', room: 'Room 2A' },

  // Friday
  { id: 'tt-kel-f-1', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 6', day: 'Friday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'English', room: 'Room 6A' },
  { id: 'tt-kel-f-2', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 4', day: 'Friday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'English', room: 'Room 4A' },
  { id: 'tt-kel-f-3', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 6', day: 'Friday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Agriculture', room: 'Agri Plot' },
  { id: 'tt-kel-f-4', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 2', day: 'Friday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'English', room: 'Room 2A' },
  { id: 'tt-kel-f-5', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 5', day: 'Friday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'English', room: 'Room 5A' },
  { id: 'tt-kel-f-6', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 3', day: 'Friday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'English', room: 'Room 3A' },
  { id: 'tt-kel-f-7', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 1', day: 'Friday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'English', room: 'Room 1A' },
  { id: 'tt-kel-f-8', teacherId: 'tr-kelvin', teacherName: 'MR KELVIN', grade: 'Grade 5', day: 'Friday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Agriculture', room: 'Agri Plot' },

  // ==========================================
  // MADAM LIZ: Kiswahili (G1-6), Mathematics (G2), Environmental Activities (G1-3)
  // ==========================================
  // Monday
  { id: 'tt-liz-m-1', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 2', day: 'Monday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Mathematics', room: 'Room 2A' },
  { id: 'tt-liz-m-2', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 1', day: 'Monday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Kiswahili', room: 'Room 1A' },
  { id: 'tt-liz-m-3', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 3', day: 'Monday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Environmental Activities', room: 'Room 3A' },
  { id: 'tt-liz-m-4', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 2', day: 'Monday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Environmental Activities', room: 'Room 2A' },
  { id: 'tt-liz-m-5', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 6', day: 'Monday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Kiswahili', room: 'Room 6A' },
  { id: 'tt-liz-m-6', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 5', day: 'Monday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'Kiswahili', room: 'Room 5A' },
  { id: 'tt-liz-m-7', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 4', day: 'Monday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Kiswahili', room: 'Room 4A' },
  { id: 'tt-liz-m-8', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 3', day: 'Monday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Kiswahili', room: 'Room 3A' },

  // Tuesday
  { id: 'tt-liz-t-1', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 2', day: 'Tuesday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Mathematics', room: 'Room 2A' },
  { id: 'tt-liz-t-2', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 3', day: 'Tuesday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Environmental Activities', room: 'Room 3A' },
  { id: 'tt-liz-t-3', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 1', day: 'Tuesday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Environmental Activities', room: 'Room 1A' },
  { id: 'tt-liz-t-4', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 5', day: 'Tuesday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Kiswahili', room: 'Room 5A' },
  { id: 'tt-liz-t-5', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 6', day: 'Tuesday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Kiswahili', room: 'Room 6A' },
  { id: 'tt-liz-t-6', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 2', day: 'Tuesday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'Kiswahili', room: 'Room 2A' },
  { id: 'tt-liz-t-7', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 1', day: 'Tuesday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Kiswahili', room: 'Room 1A' },
  { id: 'tt-liz-t-8', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 4', day: 'Tuesday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Kiswahili', room: 'Room 4A' },

  // Wednesday
  { id: 'tt-liz-w-1', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 3', day: 'Wednesday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Kiswahili', room: 'Room 3A' },
  { id: 'tt-liz-w-2', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 2', day: 'Wednesday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Mathematics', room: 'Room 2A' },
  { id: 'tt-liz-w-3', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 1', day: 'Wednesday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Environmental Activities', room: 'Room 1A' },
  { id: 'tt-liz-w-4', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 4', day: 'Wednesday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Kiswahili', room: 'Room 4A' },
  { id: 'tt-liz-w-5', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 5', day: 'Wednesday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Kiswahili', room: 'Room 5A' },
  { id: 'tt-liz-w-6', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 2', day: 'Wednesday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'Environmental Activities', room: 'Room 2A' },
  { id: 'tt-liz-w-7', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 6', day: 'Wednesday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Kiswahili', room: 'Room 6A' },
  { id: 'tt-liz-w-8', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 1', day: 'Wednesday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Kiswahili', room: 'Room 1A' },

  // Thursday
  { id: 'tt-liz-th-1', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 2', day: 'Thursday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Mathematics', room: 'Room 2A' },
  { id: 'tt-liz-th-2', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 1', day: 'Thursday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Environmental Activities', room: 'Room 1A' },
  { id: 'tt-liz-th-3', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 3', day: 'Thursday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Kiswahili', room: 'Room 3A' },
  { id: 'tt-liz-th-4', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 2', day: 'Thursday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Environmental Activities', room: 'Room 2A' },
  { id: 'tt-liz-th-5', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 6', day: 'Thursday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Kiswahili', room: 'Room 6A' },
  { id: 'tt-liz-th-6', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 5', day: 'Thursday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'Kiswahili', room: 'Room 5A' },
  { id: 'tt-liz-th-7', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 3', day: 'Thursday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Environmental Activities', room: 'Room 3A' },
  { id: 'tt-liz-th-8', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 4', day: 'Thursday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Kiswahili', room: 'Room 4A' },

  // Friday
  { id: 'tt-liz-f-1', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 2', day: 'Friday', periodNumber: 1, periodLabel: 'Lesson 1', startTime: '08:10', endTime: '08:50', timeSlot: '8:10 AM – 8:50 AM', subject: 'Mathematics', room: 'Room 2A' },
  { id: 'tt-liz-f-2', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 1', day: 'Friday', periodNumber: 2, periodLabel: 'Lesson 2', startTime: '08:50', endTime: '09:20', timeSlot: '8:50 AM – 9:20 AM', subject: 'Kiswahili', room: 'Room 1A' },
  { id: 'tt-liz-f-3', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 2', day: 'Friday', periodNumber: 3, periodLabel: 'Lesson 3', startTime: '09:20', endTime: '10:10', timeSlot: '9:20 AM – 10:10 AM', subject: 'Kiswahili', room: 'Room 2A' },
  { id: 'tt-liz-f-4', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 3', day: 'Friday', periodNumber: 4, periodLabel: 'Lesson 4', startTime: '10:40', endTime: '11:20', timeSlot: '10:40 AM – 11:20 AM', subject: 'Environmental Activities', room: 'Room 3A' },
  { id: 'tt-liz-f-5', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 1', day: 'Friday', periodNumber: 5, periodLabel: 'Lesson 5', startTime: '11:20', endTime: '12:00', timeSlot: '11:20 AM – 12:00 PM', subject: 'Environmental Activities', room: 'Room 1A' },
  { id: 'tt-liz-f-6', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 6', day: 'Friday', periodNumber: 6, periodLabel: 'Lesson 6', startTime: '12:00', endTime: '12:40', timeSlot: '12:00 PM – 12:40 PM', subject: 'Kiswahili', room: 'Room 6A' },
  { id: 'tt-liz-f-7', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 4', day: 'Friday', periodNumber: 7, periodLabel: 'Lesson 7', startTime: '13:20', endTime: '14:00', timeSlot: '1:20 PM – 2:00 PM', subject: 'Kiswahili', room: 'Room 4A' },
  { id: 'tt-liz-f-8', teacherId: 'tr-liz', teacherName: 'MADAM LIZ', grade: 'Grade 5', day: 'Friday', periodNumber: 8, periodLabel: 'Lesson 8', startTime: '14:00', endTime: '14:40', timeSlot: '2:00 PM – 2:40 PM', subject: 'Kiswahili', room: 'Room 5A' }
];

/**
 * Helper to get a teacher profile by ID or Name
 */
export function getTeacherProfile(idOrName: string): TeacherProfile | undefined {
  const query = idOrName.toLowerCase().trim();
  return TEACHER_PROFILES.find(t => 
    t.id.toLowerCase() === query || 
    t.name.toLowerCase() === query || 
    t.title.toLowerCase() === query
  );
}

/**
 * Helper to calculate the active, upcoming, and break bell schedule period
 * based on current time (or simulated time).
 */
export interface BellStatusResult {
  currentSlot: BellPeriodSlot | null;
  nextSlot: BellPeriodSlot | null;
  status: 'active' | 'break' | 'before-school' | 'after-school' | 'weekend';
  minutesRemaining: number;
  minutesElapsed: number;
  percentElapsed: number;
  formattedCurrentTime: string;
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isSchoolDay: boolean;
}

export function getCurrentBellStatus(simulatedTime?: string, customDate?: Date): BellStatusResult {
  const now = customDate ? new Date(customDate) : new Date();
  
  // Day of week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
  const rawDayIndex = now.getDay();
  const dayName = dayNames[rawDayIndex];
  const isSchoolDay = rawDayIndex >= 1 && rawDayIndex <= 5;

  let currentHour: number;
  let currentMinute: number;

  if (simulatedTime) {
    const [hStr, mStr] = simulatedTime.split(':');
    currentHour = parseInt(hStr, 10);
    currentMinute = parseInt(mStr, 10);
  } else {
    currentHour = now.getHours();
    currentMinute = now.getMinutes();
  }

  const currentMinutesFromMidnight = currentHour * 60 + currentMinute;

  // Format display time
  const ampm = currentHour >= 12 ? 'PM' : 'AM';
  const displayHour = currentHour % 12 || 12;
  const displayMin = currentMinute < 10 ? `0${currentMinute}` : `${currentMinute}`;
  const formattedCurrentTime = `${displayHour}:${displayMin} ${ampm}`;

  // Helper to parse HH:mm to minutes from midnight
  const parseToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  let currentSlot: BellPeriodSlot | null = null;
  let nextSlot: BellPeriodSlot | null = null;
  let minutesRemaining = 0;
  let minutesElapsed = 0;
  let percentElapsed = 0;
  let status: 'active' | 'break' | 'before-school' | 'after-school' | 'weekend' = 'active';

  if (!isSchoolDay && !simulatedTime) {
    status = 'weekend';
  } else if (currentMinutesFromMidnight < parseToMinutes('08:10')) {
    status = 'before-school';
    nextSlot = BELL_SCHEDULE_SLOTS[0];
    minutesRemaining = parseToMinutes('08:10') - currentMinutesFromMidnight;
  } else if (currentMinutesFromMidnight >= parseToMinutes('17:00')) {
    status = 'after-school';
  } else {
    // Check which slot is active
    for (let i = 0; i < BELL_SCHEDULE_SLOTS.length; i++) {
      const slot = BELL_SCHEDULE_SLOTS[i];
      const startMin = parseToMinutes(slot.startTime);
      const endMin = parseToMinutes(slot.endTime);

      if (currentMinutesFromMidnight >= startMin && currentMinutesFromMidnight < endMin) {
        currentSlot = slot;
        minutesElapsed = currentMinutesFromMidnight - startMin;
        minutesRemaining = endMin - currentMinutesFromMidnight;
        const totalDuration = endMin - startMin;
        percentElapsed = Math.min(100, Math.max(0, Math.round((minutesElapsed / totalDuration) * 100)));
        status = slot.isBreak ? 'break' : 'active';

        // Find next slot
        if (i + 1 < BELL_SCHEDULE_SLOTS.length) {
          nextSlot = BELL_SCHEDULE_SLOTS[i + 1];
        }
        break;
      } else if (currentMinutesFromMidnight < startMin && !nextSlot) {
        nextSlot = slot;
      }
    }
  }

  return {
    currentSlot,
    nextSlot,
    status,
    minutesRemaining,
    minutesElapsed,
    percentElapsed,
    formattedCurrentTime,
    dayName,
    isSchoolDay
  };
}
