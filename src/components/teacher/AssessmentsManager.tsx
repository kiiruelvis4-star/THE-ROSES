import React, { useState } from 'react';
import { 
  GradeLevel, 
  SubjectName, 
  Student, 
  STANDARD_SUBJECTS 
} from '../../types';
import { 
  Award, 
  TrendingUp, 
  Save, 
  Printer, 
  Download, 
  CheckCircle2, 
  ExternalLink,
  Edit2,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { storage } from '../../services/storageService';
import { calculateStudentOverallPercentage, getCBCRating, CBC_SUBJECT_COLORS } from '../../data/initialData';
import { GlobalCBEEvaluationManager } from '../common/GlobalCBEEvaluationManager';

interface AssessmentsManagerProps {
  students: Student[];
  onOpenLearnerDashboard: (studentId: string) => void;
}

const GRADES: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

export const AssessmentsManager: React.FC<AssessmentsManagerProps> = ({
  students,
  onOpenLearnerDashboard
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Grade 6');
  const [selectedSubject, setSelectedSubject] = useState<SubjectName>('Mathematics');
  const [assessmentViewMode, setAssessmentViewMode] = useState<'by-subject' | 'by-student-matrix' | 'cbe-root-engine'>('cbe-root-engine');
  const [saveIndicator, setSaveIndicator] = useState<string | null>(null);

  const gradeStudents = students.filter(s => s.grade === selectedGrade);

  const handleScoreChange = (
    studentId: string, 
    subject: SubjectName, 
    field: 'cat1' | 'cat2' | 'endTerm', 
    val: string
  ) => {
    const num = Math.max(0, parseInt(val) || 0);
    storage.updateStudentCAT(studentId, subject, field, num);
    setSaveIndicator(`Saved for ${studentId}`);
    setTimeout(() => setSaveIndicator(null), 1500);
  };

  const handleExportCSV = () => {
    let csv = `Admission No,Learner Name,Grade,Subject,CAT 1 (30),CAT 2 (30),End Term (100),Total %,CBC Rating\n`;
    gradeStudents.forEach(st => {
      const marks = st.catMarks[selectedSubject] || { cat1: 0, cat2: 0, endTerm: 0 };
      const subPct = Math.round((marks.cat1 / 30) * 20 + (marks.cat2 / 30) * 20 + (marks.endTerm / 100) * 60);
      const rating = getCBCRating(subPct);
      csv += `"${st.admissionNumber}","${st.name}","${st.grade}","${selectedSubject}",${marks.cat1},${marks.cat2},${marks.endTerm},${subPct}%,"${rating.code}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedGrade}_${selectedSubject}_CAT_Marks_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <span>CATs & CBC Assessment Sync</span>
            {saveIndicator && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Synced!
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Editing marks immediately updates the learner's live progress percentage and report card.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
            title="Print Marksheet"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grade Selector Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {GRADES.map(g => (
          <button
            key={g}
            onClick={() => setSelectedGrade(g)}
            className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all ${
              selectedGrade === g
                ? 'bg-blue-900 border-blue-900 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Mode Switcher & Subject Pill Selector */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase text-slate-400">View Style:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setAssessmentViewMode('cbe-root-engine')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  assessmentViewMode === 'cbe-root-engine'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Global CBE Engine (Grades 1–6)</span>
              </button>
              <button
                onClick={() => setAssessmentViewMode('by-subject')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  assessmentViewMode === 'by-subject'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Continuous Marksheet
              </button>
              <button
                onClick={() => setAssessmentViewMode('by-student-matrix')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  assessmentViewMode === 'by-student-matrix'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Overall Progress Matrix
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Formula: CAT1 (20%) + CAT2 (20%) + End Term (60%)</span>
          </div>
        </div>

        {/* Subjects bar if in by-subject mode */}
        {assessmentViewMode === 'by-subject' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STANDARD_SUBJECTS.map((sub) => {
              const isSel = selectedSubject === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSel
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW 0: GLOBAL CBE EVALUATION MODULE (cats_root_engine) */}
      {assessmentViewMode === 'cbe-root-engine' && (
        <GlobalCBEEvaluationManager 
          defaultClassLevel={selectedGrade}
          userRole="teacher"
        />
      )}

      {/* VIEW 1: SUBJECT MARKSHEET TABLE */}
      {assessmentViewMode === 'by-subject' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white text-base">
                {selectedGrade} • {selectedSubject} Continuous Assessment Marksheet
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {gradeStudents.length} Learners Enrolled
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px]">
                  <th className="p-3">#</th>
                  <th className="p-3">Learner Name</th>
                  <th className="p-3 text-center">CAT 1 <span className="text-slate-400 font-normal">(/30)</span></th>
                  <th className="p-3 text-center">CAT 2 <span className="text-slate-400 font-normal">(/30)</span></th>
                  <th className="p-3 text-center">End Term <span className="text-slate-400 font-normal">(/100)</span></th>
                  <th className="p-3 text-center font-black">Subject Total %</th>
                  <th className="p-3 text-center">CBC Level</th>
                  <th className="p-3 text-right">Learner Portal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {gradeStudents.map((st, index) => {
                  const marks = st.catMarks[selectedSubject] || { cat1: 0, cat2: 0, endTerm: 0 };
                  const subPct = Math.round((marks.cat1 / 30) * 20 + (marks.cat2 / 30) * 20 + (marks.endTerm / 100) * 60);
                  const rating = getCBCRating(subPct);

                  return (
                    <tr key={st.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
                      <td className="p-3 font-mono text-slate-400 font-medium">{index + 1}</td>
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {st.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {st.admissionNumber} • {st.gender}
                        </div>
                      </td>

                      {/* CAT 1 input */}
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={marks.cat1}
                          onChange={(e) => handleScoreChange(st.id, selectedSubject, 'cat1', e.target.value)}
                          className="w-14 text-center py-1 px-1.5 font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>

                      {/* CAT 2 input */}
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={marks.cat2}
                          onChange={(e) => handleScoreChange(st.id, selectedSubject, 'cat2', e.target.value)}
                          className="w-14 text-center py-1 px-1.5 font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>

                      {/* End Term input */}
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={marks.endTerm}
                          onChange={(e) => handleScoreChange(st.id, selectedSubject, 'endTerm', e.target.value)}
                          className="w-16 text-center py-1 px-1.5 font-black bg-blue-50 dark:bg-blue-950/50 border border-blue-300 dark:border-blue-800 rounded-lg text-blue-900 dark:text-blue-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>

                      {/* Total Pct */}
                      <td className="p-3 text-center">
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {subPct}%
                        </span>
                      </td>

                      {/* CBC Rating */}
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${rating.bg}`}>
                          {rating.code}
                        </span>
                      </td>

                      {/* Quick jump to learner portal */}
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onOpenLearnerDashboard(st.id)}
                          className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg inline-flex items-center gap-1 font-bold text-xs"
                          title="Open Learner View"
                        >
                          View <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: OVERALL MATRIX (ALL 8 SUBJECTS) */}
      {assessmentViewMode === 'by-student-matrix' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="font-extrabold text-slate-900 dark:text-white text-base">
              {selectedGrade} • Comprehensive CBC Subject Performance Matrix
            </span>
            <span className="text-xs text-slate-500">Live Computed Overall Progress</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 text-[10px] uppercase">
                  <th className="p-3">Learner</th>
                  {STANDARD_SUBJECTS.map(sub => (
                    <th key={sub} className="p-2 text-center whitespace-nowrap">{sub.slice(0, 4)}.</th>
                  ))}
                  <th className="p-3 text-center bg-blue-50 dark:bg-blue-950 font-black">Overall %</th>
                  <th className="p-3 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {gradeStudents.map((st) => {
                  const overallPct = calculateStudentOverallPercentage(st);
                  const rating = getCBCRating(overallPct);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div 
                          onClick={() => onOpenLearnerDashboard(st.id)}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer flex items-center gap-1"
                        >
                          {st.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{st.admissionNumber}</div>
                      </td>

                      {STANDARD_SUBJECTS.map(sub => {
                        const m = st.catMarks[sub] || { cat1: 0, cat2: 0, endTerm: 0 };
                        const sPct = Math.round((m.cat1 / 30) * 20 + (m.cat2 / 30) * 20 + (m.endTerm / 100) * 60);
                        return (
                          <td key={sub} className="p-2 text-center font-semibold text-slate-700 dark:text-slate-300">
                            {sPct}%
                          </td>
                        );
                      })}

                      <td className="p-3 text-center bg-blue-50/80 dark:bg-blue-950/40">
                        <span className="font-black text-sm text-blue-900 dark:text-blue-300">
                          {overallPct}%
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${rating.bg}`}>
                          {rating.code}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
