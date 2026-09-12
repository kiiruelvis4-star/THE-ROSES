import { GradeLevel, SubjectName } from '../types';

/**
 * Official Kenya KICD Rationalized CBC Subject Ordering
 * 
 * Lower Primary (Grade 1, Grade 2, Grade 3):
 * 1. Indigenous Language Activities (Mother Tongue)
 * 2. Kiswahili Language Activities
 * 3. English Language Activities
 * 4. Mathematical Activities
 * 5. Environmental Activities
 * 6. Creative Activities
 * 7. Religious Education Activities (CRE / IRE / HRE)
 * 
 * Upper Primary (Grade 4, Grade 5, Grade 6):
 * 1. English
 * 2. Kiswahili
 * 3. Mathematics
 * 4. Science and Technology
 * 5. Agriculture and Nutrition
 * 6. Social Studies
 * 7. Creative Arts
 * 8. Religious Education (CRE / IRE)
 */

export const GRADE_1_TO_3_ORDERED_SUBJECTS: SubjectName[] = [
  'Indigenous Language Activities',
  'Kiswahili Language Activities',
  'English Language Activities',
  'Mathematical Activities',
  'Environmental Activities',
  'Creative Activities',
  'Religious Education Activities'
];

export const GRADE_4_TO_6_ORDERED_SUBJECTS: SubjectName[] = [
  'English',
  'Kiswahili',
  'Mathematics',
  'Science and Technology',
  'Agriculture and Nutrition',
  'Social Studies',
  'Creative Arts',
  'Religious Education'
];

// Fallback / standard subjects
export const DEFAULT_ORDERED_SUBJECTS: SubjectName[] = [
  'Mathematics',
  'English',
  'Kiswahili',
  'Science',
  'Agriculture',
  'Creative Arts',
  'Social Studies',
  'CRE'
];

/**
 * Returns strictly ordered CBC subjects for a given grade.
 * For Grade 1, 2, and 3, returns the canonical Lower Primary subjects in strict sequence.
 */
export function getSubjectsForGrade(grade?: string | GradeLevel | null): SubjectName[] {
  if (!grade) return DEFAULT_ORDERED_SUBJECTS;
  const g = grade.trim();
  if (g === 'Grade 1' || g === 'Grade 2' || g === 'Grade 3') {
    return [...GRADE_1_TO_3_ORDERED_SUBJECTS];
  }
  if (g === 'Grade 4' || g === 'Grade 5' || g === 'Grade 6') {
    return [...GRADE_4_TO_6_ORDERED_SUBJECTS];
  }
  return DEFAULT_ORDERED_SUBJECTS;
}

/**
 * Normalizes subject names so marks stored under variant keys (e.g. 'Mathematics' vs 'Mathematical Activities')
 * can be resolved transparently.
 */
const SUBJECT_ALIASES: Record<string, string[]> = {
  'Mathematical Activities': ['Mathematics', 'Math', 'Mathematical Activities'],
  'Mathematics': ['Mathematics', 'Mathematical Activities', 'Math'],
  'English Language Activities': ['English', 'English Language', 'English Language Activities'],
  'English': ['English', 'English Language Activities', 'English Language'],
  'Kiswahili Language Activities': ['Kiswahili', 'Kiswahili Language Activities', 'Kiswahili Lugha'],
  'Kiswahili': ['Kiswahili', 'Kiswahili Language Activities', 'Kiswahili Lugha'],
  'Environmental Activities': ['Environmental Activities', 'Science', 'Integrated Science', 'Environment'],
  'Creative Activities': ['Creative Activities', 'Creative Arts', 'Art and Craft', 'Music'],
  'Creative Arts': ['Creative Arts', 'Creative Activities', 'Art and Craft'],
  'Religious Education Activities': ['Religious Education Activities', 'Religious Education', 'CRE', 'IRE', 'HRE', 'C.R.E'],
  'Religious Education': ['Religious Education', 'Religious Education Activities', 'CRE', 'C.R.E'],
  'CRE': ['CRE', 'Religious Education Activities', 'Religious Education', 'C.R.E'],
  'Science and Technology': ['Science and Technology', 'Science', 'Integrated Science'],
  'Science': ['Science', 'Science and Technology', 'Integrated Science'],
  'Agriculture and Nutrition': ['Agriculture and Nutrition', 'Agriculture', 'Home Science'],
  'Agriculture': ['Agriculture', 'Agriculture and Nutrition'],
  'Social Studies': ['Social Studies', 'Social Studies & Life Skills'],
  'Indigenous Language Activities': ['Indigenous Language Activities', 'Mother Tongue', 'Native Language']
};

export function getSubjectScore(catMarks: Record<string, any> | undefined, subject: string) {
  if (!catMarks) return { cat1: 0, cat2: 0, endTerm: 0 };
  if (catMarks[subject]) return catMarks[subject];

  const aliases = SUBJECT_ALIASES[subject] || [subject];
  for (const alias of aliases) {
    if (catMarks[alias]) return catMarks[alias];
  }
  return { cat1: 0, cat2: 0, endTerm: 0 };
}
