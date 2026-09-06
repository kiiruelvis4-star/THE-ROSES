import React from 'react';
import { Student } from '../../types';
import { 
  Target, 
  ArrowLeft, 
  CheckCircle, 
  Award, 
  Brain, 
  Share2, 
  Laptop, 
  Users, 
  ShieldCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface LearnerStrandsViewProps {
  student: Student;
  onBack: () => void;
}

const CORE_COMPETENCIES = [
  {
    name: 'Communication and Collaboration',
    icon: Users,
    level: 'Exceeding Expectations (4)',
    score: 92,
    code: 'EE',
    remarks: 'Articulates ideas with clarity in English and Kiswahili group debates; leads team assignments effectively.'
  },
  {
    name: 'Critical Thinking and Problem Solving',
    icon: Brain,
    level: 'Exceeding Expectations (4)',
    score: 88,
    code: 'EE',
    remarks: 'Demonstrates strong analytical skills during Mathematics problem sessions and Science inquiry trials.'
  },
  {
    name: 'Creativity and Imagination',
    icon: Sparkles,
    level: 'Meeting Expectations (3)',
    score: 79,
    code: 'ME',
    remarks: 'Shows great originality in Creative Arts drawing and traditional folk song performances.'
  },
  {
    name: 'Digital Literacy',
    icon: Laptop,
    level: 'Exceeding Expectations (4)',
    score: 85,
    code: 'EE',
    remarks: 'Navigates educational software on tablet devices quickly and conducts supervised web research.'
  },
  {
    name: 'Citizenship and Values',
    icon: ShieldCheck,
    level: 'Exceeding Expectations (4)',
    score: 95,
    code: 'EE',
    remarks: 'Exemplifies integrity, respect for school property, and kindness to peers.'
  },
  {
    name: 'Learning to Learn',
    icon: BookOpen,
    level: 'Meeting Expectations (3)',
    score: 76,
    code: 'ME',
    remarks: 'Consistently completes revision exercises independently and seeks teacher guidance when needed.'
  },
  {
    name: 'Self-Efficacy & Leadership',
    icon: Target,
    level: 'Exceeding Expectations (4)',
    score: 90,
    code: 'EE',
    remarks: 'Confident in public speaking and takes personal responsibility for assigned classroom duties.'
  }
];

export const LearnerStrandsView: React.FC<LearnerStrandsViewProps> = ({
  student,
  onBack
}) => {
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
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading flex items-center gap-2">
          <Target className="w-6 h-6 text-rose-600" />
          <span>CBC Core Competencies & Strand Assessment</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Formative evaluation of foundational competencies and values for {student.name} ({student.grade}).
        </p>
      </div>

      {/* Competencies Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CORE_COMPETENCIES.map((comp, idx) => {
          const Icon = comp.icon;
          const isEE = comp.code === 'EE';

          return (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isEE ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {comp.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Core CBC Competency Pillar {idx + 1}
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-black text-white ${isEE ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                  {comp.code} ({comp.score}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isEE ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${comp.score}%` }}
                />
              </div>

              {/* Teacher Remarks for competency */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                "{comp.remarks}"
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
