import React, { useState } from 'react';
import { 
  Student, 
  SubjectName, 
  STANDARD_SUBJECTS 
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

interface LearnerSubjectsViewProps {
  student: Student;
  onBack: () => void;
  onOpenQuizzesForSubject?: (subject: SubjectName) => void;
}

const SUBJECT_DETAILS: Record<string, { teacher: string; strandsCount: number; lessonsPerWeek: number; summary: string; coreStrands: string[] }> = {
  'Mathematics': {
    teacher: 'Tr. Jane Wangari',
    strandsCount: 4,
    lessonsPerWeek: 5,
    summary: 'Numbers, algebra, measurements, geometry, data handling, and financial literacy.',
    coreStrands: ['Numbers & Operations', 'Measurements & Area', 'Geometry & Angles', 'Data Handling & Probability']
  },
  'English': {
    teacher: 'Tr. Kelvin M.',
    strandsCount: 4,
    lessonsPerWeek: 5,
    summary: 'Listening and speaking, reading comprehension, language structures, creative composition.',
    coreStrands: ['Listening & Speaking Fluency', 'Reading & Context Clues', 'Language Structures & Grammar', 'Creative Writing']
  },
  'Kiswahili': {
    teacher: 'Tr. Mwangi S.',
    strandsCount: 4,
    lessonsPerWeek: 4,
    summary: 'Kusikiliza na kuongea, kusoma kwa ufahamu, sarufi ya ngeli, na utungaji wa insha.',
    coreStrands: ['Kusikiliza na Kuzungumza', 'Kusoma kwa Ufahamu', 'Sarufi na Matumizi ya Lugha', 'Kuandika Insha']
  },
  'Science': {
    teacher: 'Tr. Jane Wangari',
    strandsCount: 5,
    lessonsPerWeek: 4,
    summary: 'Living things, human body systems, matter and energy, earth and space science.',
    coreStrands: ['Human Organ Systems', 'Plants & Animals Classification', 'Matter & Simple Machines', 'Environmental Science']
  },
  'Agriculture': {
    teacher: 'Tr. Kibet J.',
    strandsCount: 4,
    lessonsPerWeek: 3,
    summary: 'Soil conservation, organic composting, vegetable gardening, and domestic livestock care.',
    coreStrands: ['Soil & Water Conservation', 'Crop Production & Nursery', 'Animal Production', 'Agri-Business & Marketing']
  },
  'Creative Arts': {
    teacher: 'Tr. Alice N.',
    strandsCount: 4,
    lessonsPerWeek: 3,
    summary: 'Visual arts, Kenyan folk songs, instruments, dance choreography, and dramatic expressions.',
    coreStrands: ['Drawing & Painting', 'Folk Music & Indigenous Instruments', 'Rhythm & Choreography', 'Fabric Arts & Craft']
  },
  'Social Studies': {
    teacher: 'Tr. Otieno B.',
    strandsCount: 4,
    lessonsPerWeek: 3,
    summary: 'Physical environment of Eastern Africa, weather and climate, citizen rights and governance.',
    coreStrands: ['Physical Geography of Kenya', 'People and Population', 'Culture & Social Organization', 'Good Governance & Leadership']
  },
  'CRE': {
    teacher: 'Tr. Mary W.',
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
  const [selectedSubject, setSelectedSubject] = useState<SubjectName>('Mathematics');

  const info = SUBJECT_DETAILS[selectedSubject] || {
    teacher: 'Assigned Teacher',
    strandsCount: 4,
    lessonsPerWeek: 5,
    summary: 'Core competency learning area aligning with KICD curriculum designs.',
    coreStrands: ['Strand 1: Concepts & Practice', 'Strand 2: Application & Skills', 'Strand 3: Projects & Activities', 'Strand 4: Evaluation & Reflection']
  };
  const marks = student.catMarks[selectedSubject] || { cat1: 0, cat2: 0, endTerm: 0 };
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
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
          My CBC Learning Subjects
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Curriculum designs, core competency strands, and assigned subject teachers for {student.grade}.
        </p>
      </div>

      {/* Subject Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STANDARD_SUBJECTS.map((sub) => {
          const isSelected = selectedSubject === sub;
          const colors = CBC_SUBJECT_COLORS[sub];
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
                <span className="text-xs font-extrabold truncate">{sub}</span>
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-rose-400' : colors.accent}`} />
              </div>
              <div className={`text-[11px] mt-1 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                {SUBJECT_DETAILS[sub].teacher}
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
