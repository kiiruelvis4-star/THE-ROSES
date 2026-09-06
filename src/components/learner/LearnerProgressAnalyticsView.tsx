import React from 'react';
import { Student, STANDARD_SUBJECTS } from '../../types';
import { 
  TrendingUp, 
  ArrowLeft, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BarChart3, 
  Target,
  Zap
} from 'lucide-react';
import { calculateStudentOverallPercentage, getCBCRating, CBC_SUBJECT_COLORS } from '../../data/initialData';

interface LearnerProgressAnalyticsViewProps {
  student: Student;
  onBack: () => void;
}

export const LearnerProgressAnalyticsView: React.FC<LearnerProgressAnalyticsViewProps> = ({
  student,
  onBack
}) => {
  const overallPct = calculateStudentOverallPercentage(student);
  const overallRating = getCBCRating(overallPct);

  // Analyze subject performances
  const subjectScores = STANDARD_SUBJECTS.map(sub => {
    const marks = student.catMarks[sub] || { cat1: 0, cat2: 0, endTerm: 0 };
    const pct = Math.round((marks.cat1 / 30) * 20 + (marks.cat2 / 30) * 20 + (marks.endTerm / 100) * 60);
    return { subject: sub, score: pct, rating: getCBCRating(pct) };
  });

  const sortedScores = [...subjectScores].sort((a, b) => b.score - a.score);
  const topStrengths = sortedScores.slice(0, 3);
  const focusAreas = sortedScores.slice(-2);

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
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <span>Learner Growth & Progress Analytics</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Cognitive trajectory, subject mastery breakdown, and personalized recommendations for {student.name}.
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-black text-xl flex items-center justify-center shrink-0">
            {overallPct}%
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Term 1 Mean Score</span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
              {overallRating.label}
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +4.2% from Baseline
            </span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xl flex items-center justify-center shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Mastery Level</span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
              Grade {student.grade} Leader
            </h3>
            <span className="text-xs text-slate-500 font-medium mt-0.5">
              Top 5% in Little Roses Cohort
            </span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-black text-xl flex items-center justify-center shrink-0">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Streak</span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
              18 Days
            </h3>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              Daily Quiz & Reading Streak
            </span>
          </div>
        </div>
      </div>

      {/* Visual Subject Mastery Bar Chart */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-heading flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span>Subject Proficiency Distribution</span>
        </h3>

        <div className="space-y-3 pt-2">
          {subjectScores.map(item => (
            <div key={item.subject} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200">{item.subject}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${item.rating.bg}`}>
                    {item.rating.code}
                  </span>
                  <span className="text-slate-900 dark:text-white font-black">{item.score}%</span>
                </div>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.score >= 80 ? 'bg-emerald-500' :
                    item.score >= 65 ? 'bg-blue-600' :
                    item.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Targeted Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Strengths */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Top Academic Strengths</span>
          </div>
          <div className="space-y-2">
            {topStrengths.map((s, idx) => (
              <div key={idx} className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">{s.subject}</span>
                <span className="font-black text-emerald-700 dark:text-emerald-300">{s.score}% (Exceeding)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Focus Areas */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-sm">
            <Target className="w-5 h-5" />
            <span>Teacher Guided Focus Areas</span>
          </div>
          <div className="space-y-2">
            {focusAreas.map((f, idx) => (
              <div key={idx} className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{f.subject}</span>
                  <span className="font-bold text-blue-700 dark:text-blue-300">{f.score}%</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Recommended: Complete 2 practice quizzes in the Quiz Zone this week.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
