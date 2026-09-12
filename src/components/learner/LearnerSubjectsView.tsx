import React, { useState, useEffect } from 'react';
import { 
  Student, 
  SubjectName 
} from '../../types';
import { 
  BookOpen, 
  ArrowLeft, 
  CheckCircle, 
  Layers, 
  Sparkles, 
  FileText, 
  Clock, 
  Compass,
  Award
} from 'lucide-react';
import { CBC_SUBJECT_COLORS } from '../../data/initialData';
import { getSubjectsForGrade, getSubjectScore } from '../../services/subjectOrder';

interface LearnerSubjectsViewProps {
  student: Student;
  onBack: () => void;
  onOpenQuizzesForSubject?: (subject: SubjectName) => void;
}

const SUBJECT_DETAILS: Record<string, { teacher: string; strandsCount: number; lessonsPerWeek: number; summary: string; coreStrands: string[] }> = {
  // Lower Primary (Grade 1 - 3) Ordered Subjects
  'Indigenous Language Activities': {
    teacher: 'Madam Liz',
    strandsCount: 4,
    lessonsPerWeek: 3,
    summary: 'Listening, speaking, cultural storytelling, indigenous songs, and mother tongue language communication.',
    coreStrands: ['Listening & Talking Fluently', 'Cultural Stories & Proverbs', 'Vocabulary & Expressions', 'Community Living Values']
  },
  'Kiswahili Language Activities': {
    teacher: 'Madam Liz & Tr. Mwangi',
    strandsCount: 4,
    lessonsPerWeek: 5,
    summary: 'Kusikiliza na kuzungumza, kusoma, kuandika maneno na sentensi, na sarufi ya msingi ya Kiswahili.',
    coreStrands: ['Kusikiliza na Kuzungumza', 'Kusoma kwa Sauti na Ufahamu', 'Kuandika na Maumbo ya Herufi', 'Sarufi na Msamiati']
  },
  'English Language Activities': {
    teacher: 'Mr. Kelvin & Tr. Grace',
    strandsCount: 4,
    lessonsPerWeek: 5,
    summary: 'Phonics, listening fluency, reading comprehension, handwriting, spelling, and vocabulary building.',
    coreStrands: ['Phonics & Word Blending', 'Listening & Spoken Fluency', 'Guided Reading Comprehension', 'Sentence Construction']
  },
  'Mathematical Activities': {
    teacher: 'Mr. Elvis & Madam Fresiah',
    strandsCount: 4,
    lessonsPerWeek: 5,
    summary: 'Pre-number activities, numbers and operations, measurement (time, money, length), and basic geometry.',
    coreStrands: ['Number Classification & Counting', 'Addition & Subtraction Concepts', 'Measurements (Length, Mass, Money)', 'Geometry & Patterns']
  },
  'Environmental Activities': {
    teacher: 'Madam Liz & Madam Fresiah',
    strandsCount: 4,
    lessonsPerWeek: 4,
    summary: 'Our school, home environment, plants, domestic animals, hygiene, weather, and water safety.',
    coreStrands: ['Living in Our Community', 'Caring for Plants & Animals', 'Health, Nutrition & Hygiene', 'Weather, Sky & Soil']
  },
  'Creative Activities': {
    teacher: 'Mr. Elvis & Tr. Alice',
    strandsCount: 4,
    lessonsPerWeek: 3,
    summary: 'Drawing, pattern coloring, modeling, paper craft, singing, dancing, and rhythmic movement.',
    coreStrands: ['Drawing & Paper Mache', 'Clay Modeling & Weaving', 'Kenyan Folk Songs & Chants', 'Rhythmic Movement & Dance']
  },
  'Religious Education Activities': {
    teacher: 'Madam Fresiah & Tr. Mary',
    strandsCount: 3,
    lessonsPerWeek: 3,
    summary: 'Creation, God’s love, moral living, kindness, prayer, church values, and loving our neighbors.',
    coreStrands: ['God the Creator & His Gifts', 'The Life of Jesus & Parables', 'Christian Moral Habits', 'Family & Community Fellowship']
  },

  // Upper Primary (Grade 4 - 6) Subjects
  'Mathematics': {
    teacher: 'Mr. Elvis & Madam Fresiah',
    strandsCount: 4,
    lessonsPerWeek: 5,
    summary: 'Numbers, algebra, measurements, geometry, data handling, and financial literacy.',
    coreStrands: ['Numbers & Operations', 'Measurements & Area', 'Geometry & Angles', 'Data Handling & Probability']
  },
  'English': {
    teacher: 'Mr. Kelvin & Tr. Grace',
    strandsCount: 4,
    lessonsPerWeek: 5,
    summary: 'Listening and speaking, reading comprehension, language structures, creative composition.',
    coreStrands: ['Listening & Speaking Fluency', 'Reading & Context Clues', 'Language Structures & Grammar', 'Creative Writing']
  },
  'Kiswahili': {
    teacher: 'Madam Liz & Tr. Mwangi',
    strandsCount: 4,
    lessonsPerWeek: 4,
    summary: 'Kusikiliza na kuongea, kusoma kwa ufahamu, sarufi ya ngeli, na utungaji wa insha.',
    coreStrands: ['Kusikiliza na Kuzungumza', 'Kusoma kwa Ufahamu', 'Sarufi na Matumizi ya Lugha', 'Kuandika Insha']
  },
  'Science and Technology': {
    teacher: 'Madam Fresiah',
    strandsCount: 5,
    lessonsPerWeek: 4,
    summary: 'Living things, human body systems, computing devices, matter and energy, environment.',
    coreStrands: ['Human Organ Systems', 'Plants & Animals Classification', 'Matter & Simple Machines', 'Basic Computing & Digital Safety']
  },
  'Science': {
    teacher: 'Madam Fresiah',
    strandsCount: 5,
    lessonsPerWeek: 4,
    summary: 'Living things, human body systems, matter and energy, earth and space science.',
    coreStrands: ['Human Organ Systems', 'Plants & Animals Classification', 'Matter & Simple Machines', 'Environmental Science']
  },
  'Agriculture and Nutrition': {
    teacher: 'Mr. Kelvin',
    strandsCount: 4,
    lessonsPerWeek: 4,
    summary: 'Soil conservation, crop production, animal welfare, food preparation, and nutrition.',
    coreStrands: ['Soil & Water Conservation', 'Crop Production & Nursery', 'Animal Care & Handling', 'Food Preparation & Preservation']
  },
  'Agriculture': {
    teacher: 'Mr. Kelvin',
    strandsCount: 4,
    lessonsPerWeek: 3,
    summary: 'Soil conservation, organic composting, vegetable gardening, and domestic livestock care.',
    coreStrands: ['Soil & Water Conservation', 'Crop Production & Nursery', 'Animal Production', 'Agri-Business & Marketing']
  },
  'Creative Arts': {
    teacher: 'Mr. Elvis',
    strandsCount: 4,
    lessonsPerWeek: 3,
    summary: 'Visual arts, Kenyan folk songs, instruments, dance choreography, and dramatic expressions.',
    coreStrands: ['Drawing & Painting', 'Folk Music & Indigenous Instruments', 'Rhythm & Choreography', 'Fabric Arts & Craft']
  },
  'Social Studies': {
    teacher: 'Mr. Elvis',
    strandsCount: 4,
    lessonsPerWeek: 3,
    summary: 'Physical environment of Eastern Africa, weather and climate, citizen rights and governance.',
    coreStrands: ['Physical Geography of Kenya', 'People and Population', 'Culture & Social Organization', 'Good Governance & Leadership']
  },
  'Religious Education': {
    teacher: 'Madam Fresiah',
    strandsCount: 3,
    lessonsPerWeek: 3,
    summary: 'Creation and stewardship, Christian moral values, faith in community, church fellowship.',
    coreStrands: ['Creation & Stewardship', 'The Holy Bible & Teachings', 'Christian Moral Living', 'Church and Society']
  },
  'CRE': {
    teacher: 'Madam Fresiah',
    strandsCount: 3,
    lessonsPerWeek: 3,
    summary: 'Creation and stewardship, Christian moral values, faith in community, church fellowship.',
    coreStrands: ['Creation & Stewardship', 'The Holy Bible & Teachings', 'Christian Moral Living', 'Church and Society']
  }
};

export const LearnerSubjectsView: React.FC<LearnerSubjectsViewProps> = ({
  student,
  onBack,
  onOpenQuizzesForSubject
}) => {
  // Ordered subjects based on student grade level
  const orderedSubjects = getSubjectsForGrade(student.grade);
  const [selectedSubject, setSelectedSubject] = useState<SubjectName>(orderedSubjects[0]);

  // Keep selected subject in sync when grade changes
  useEffect(() => {
    if (!orderedSubjects.includes(selectedSubject)) {
      setSelectedSubject(orderedSubjects[0]);
    }
  }, [student.grade, orderedSubjects, selectedSubject]);

  const info = SUBJECT_DETAILS[selectedSubject] || {
    teacher: 'Assigned Teacher',
    strandsCount: 4,
    lessonsPerWeek: 5,
    summary: 'Core competency learning area aligning with KICD curriculum designs.',
    coreStrands: ['Strand 1: Concepts & Practice', 'Strand 2: Application & Skills', 'Strand 3: Projects & Activities', 'Strand 4: Evaluation & Reflection']
  };

  const marks = getSubjectScore(student.catMarks, selectedSubject);
  const subPct = Math.round((marks.cat1 / 30) * 20 + (marks.cat2 / 30) * 20 + (marks.endTerm / 100) * 60);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
              My CBC Learning Subjects
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Curriculum designs, core competency strands, and assigned subject teachers for {student.grade}.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 w-fit">
            {orderedSubjects.length} KICD Ordered Subjects
          </span>
        </div>
      </div>

      {/* Subject Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {orderedSubjects.map((sub, idx) => {
          const isSelected = selectedSubject === sub;
          const colors = CBC_SUBJECT_COLORS[sub as any] || { accent: 'bg-blue-500', bg: 'bg-blue-50' };
          const details = SUBJECT_DETAILS[sub];

          return (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-500'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10">
                  #{idx + 1}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-rose-400' : colors.accent}`} />
              </div>
              <div className="text-xs font-extrabold mt-1.5 leading-snug line-clamp-2">{sub}</div>
              <div className={`text-[11px] mt-1 truncate ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                {details?.teacher || 'Subject Teacher'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Card Detail */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-xs">
                {student.grade} Curriculum
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                {selectedSubject}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Lead Instructor: <strong>{info.teacher}</strong> • {info.lessonsPerWeek} Lessons per week
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current CAT Total</span>
              <span className="text-lg font-black text-blue-900 dark:text-blue-300">{subPct}%</span>
            </div>
          </div>
        </div>

        {/* Overview description */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-bold text-slate-900 dark:text-white block mb-1">Subject Scope & Objectives:</span>
          {info.summary}
        </div>

        {/* Key CBC Strands */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Core Curriculum Strands & Sub-Strands:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {info.coreStrands.map((strand, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3 text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{strand}</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Competency Mastered</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
