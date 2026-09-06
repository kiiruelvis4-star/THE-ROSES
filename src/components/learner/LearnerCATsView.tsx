import React, { useState } from 'react';
import { 
  Student, 
  SubjectName, 
  STANDARD_SUBJECTS 
} from '../../types';
import { 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ArrowLeft,
  Sparkles,
  BarChart2,
  Printer,
  Layers
} from 'lucide-react';
import { calculateStudentOverallPercentage, getCBCRating, CBC_SUBJECT_COLORS } from '../../data/initialData';
import { GlobalCBEEvaluationManager } from '../common/GlobalCBEEvaluationManager';

interface LearnerCATsViewProps {
  student: Student;
  onBack: () => void;
}

export const LearnerCATsView: React.FC<LearnerCATsViewProps> = ({
  student,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'continuous-scores' | 'cbe-evaluator'>('continuous-scores');
  const [selectedSubject, setSelectedSubject] = useState<SubjectName>('Mathematics');

  const overallPct = calculateStudentOverallPercentage(student);
  const overallRating = getCBCRating(overallPct);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
            Continuous Assessment Tests (CATs)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Learner Scorecards & Performance Tracking for {student.name} ({student.grade})
          </p>
        </div>

        {/* Overall Status Card */}
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-900 text-white font-black text-base flex items-center justify-center shadow-inner">
            {overallPct}%
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">Term 1 Performance</div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">{overallRating.label}</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
        <button
          onClick={() => setActiveTab('continuous-scores')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'continuous-scores'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Continuous Scores Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('cbe-evaluator')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'cbe-evaluator'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Interactive CBE Strands Evaluator</span>
        </button>
      </div>

      {/* TAB 1: CONTINUOUS SCORES VIEW */}
      {activeTab === 'continuous-scores' && (
        <div className="space-y-6 animate-fadeIn">

      {/* Subject Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STANDARD_SUBJECTS.map((sub) => {
          const marks = student.catMarks[sub] || { cat1: 0, cat2: 0, endTerm: 0 };
          const subPct = Math.round((marks.cat1 / 30) * 20 + (marks.cat2 / 30) * 20 + (marks.endTerm / 100) * 60);
          const rating = getCBCRating(subPct);
          const colors = CBC_SUBJECT_COLORS[sub];
          const isSelected = selectedSubject === sub;

          return (
            <div
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-500'
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isSelected ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'}`}>
                  {sub}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : `${rating.bg} text-white`}`}>
                  {rating.code}
                </span>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black">{subPct}%</span>
                <span className={`text-[11px] font-semibold ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                  CAT1: {marks.cat1}/30 • CAT2: {marks.cat2}/30
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isSelected ? 'bg-white' : colors.accent}`}
                  style={{ width: `${subPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Subject In-depth breakdown */}
      {selectedSubject && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Selected Subject Assessment:</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading mt-0.5">
                {selectedSubject} Detailed Scorecard
              </h3>
            </div>

            {(() => {
              const m = student.catMarks[selectedSubject] || { cat1: 0, cat2: 0, endTerm: 0 };
              const sPct = Math.round((m.cat1 / 30) * 20 + (m.cat2 / 30) * 20 + (m.endTerm / 100) * 60);
              const r = getCBCRating(sPct);
              return (
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${r.bg}`}>
                    {r.label}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* 3 Pillars of Assessment */}
          {(() => {
            const m = student.catMarks[selectedSubject] || { cat1: 0, cat2: 0, endTerm: 0 };
            const cat1Pct = Math.round((m.cat1 / 30) * 100);
            const cat2Pct = Math.round((m.cat2 / 30) * 100);
            const endTermPct = m.endTerm;

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CAT 1 */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">CAT 1 (Week 4)</span>
                    <span className="text-[10px] font-semibold text-slate-400">Weight: 20%</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{m.cat1}</span>
                    <span className="text-xs text-slate-400">/ 30 marks ({cat1Pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${cat1Pct}%` }} />
                  </div>
                </div>

                {/* CAT 2 */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">CAT 2 (Week 8)</span>
                    <span className="text-[10px] font-semibold text-slate-400">Weight: 20%</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{m.cat2}</span>
                    <span className="text-xs text-slate-400">/ 30 marks ({cat2Pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${cat2Pct}%` }} />
                  </div>
                </div>

                {/* End Term */}
                <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200/70 dark:border-blue-900/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase">End-Term Assessment</span>
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">Weight: 60%</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-blue-900 dark:text-blue-200">{m.endTerm}</span>
                    <span className="text-xs text-blue-700 dark:text-blue-300">/ 100 marks ({endTermPct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${endTermPct}%` }} />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* CBC Rubric Key */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs space-y-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[11px] block">
              CBC Competency Grading Scale Guide:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                EE: 80% - 100% (Exceeding Expectations)
              </div>
              <div className="p-2 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">
                ME: 65% - 79% (Meeting Expectations)
              </div>
              <div className="p-2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                AE: 50% - 64% (Approaching Expectations)
              </div>
              <div className="p-2 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold">
                BE: 0% - 49% (Below Expectations)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )}

  {/* TAB 2: INTERACTIVE CBE EVALUATOR (cats_root_engine) */}
  {activeTab === 'cbe-evaluator' && (
    <GlobalCBEEvaluationManager
      userRole="learner"
      defaultClassLevel={student.grade}
      selectedStudent={student}
    />
  )}
</div>
);
};
