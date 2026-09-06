import React, { useState, useEffect } from 'react';
import { 
  CATSRootEngine, 
  CATClassLevel, 
  CATSubject, 
  CATStrand, 
  CATSubStrand, 
  CATQuestion,
  CATAttemptStatus,
  CBCRating,
  Student
} from '../../types';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Play, 
  RotateCcw, 
  Download, 
  Printer, 
  Check, 
  X, 
  Layers, 
  Filter, 
  GraduationCap, 
  AlertCircle,
  Edit3,
  Plus
} from 'lucide-react';
import { storage } from '../../services/storageService';
import { getCBCRatingFromScore } from '../../data/catsRootEngineData';

interface GlobalCBEEvaluationManagerProps {
  userRole?: 'teacher' | 'learner';
  defaultClassLevel?: string;
  selectedStudent?: Student;
  onAssessmentCompleted?: (subStrand: CATSubStrand, score: number) => void;
}

export const GlobalCBEEvaluationManager: React.FC<GlobalCBEEvaluationManagerProps> = ({
  userRole = 'teacher',
  defaultClassLevel,
  selectedStudent,
  onAssessmentCompleted
}) => {
  const [engine, setEngine] = useState<CATSRootEngine>(() => storage.getCATSRootEngine());
  const [selectedClassIndex, setSelectedClassIndex] = useState<number>(() => {
    if (defaultClassLevel) {
      const idx = engine.classes.findIndex(c => c.class_level.toLowerCase() === defaultClassLevel.toLowerCase());
      if (idx !== -1) return idx;
    }
    return engine.classes.length > 0 ? 0 : 0;
  });

  const [expandedSubStrandKey, setExpandedSubStrandKey] = useState<string | null>(null);

  // Active Assessment Taking Modal State
  const [activeTestSubStrand, setActiveTestSubStrand] = useState<{
    classLevel: string;
    subjectName: string;
    strandName: string;
    subStrand: CATSubStrand;
  } | null>(null);

  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setEngine(storage.getCATSRootEngine());
    });
    return unsub;
  }, []);

  // Update selected class if defaultClassLevel changes
  useEffect(() => {
    if (defaultClassLevel) {
      const idx = engine.classes.findIndex(c => c.class_level.toLowerCase() === defaultClassLevel.toLowerCase());
      if (idx !== -1) {
        setSelectedClassIndex(idx);
      }
    }
  }, [defaultClassLevel, engine]);

  const currentClass: CATClassLevel | undefined = engine.classes[selectedClassIndex];

  // Calculate stats for current class
  const totalSubStrands = currentClass
    ? currentClass.subjects.reduce((acc, sub) => acc + sub.strands.reduce((sAcc, str) => sAcc + str.sub_strands.length, 0), 0)
    : 0;

  const completedSubStrands = currentClass
    ? currentClass.subjects.reduce((acc, sub) => acc + sub.strands.reduce((sAcc, str) => sAcc + str.sub_strands.filter(st => st.status === 'COMPLETED').length, 0), 0)
    : 0;

  const totalScoreAttained = currentClass
    ? currentClass.subjects.reduce((acc, sub) => acc + sub.strands.reduce((sAcc, str) => sAcc + str.sub_strands.reduce((sc, st) => sc + st.cat_score, 0), 0), 0)
    : 0;

  const totalMaxScore = currentClass
    ? currentClass.subjects.reduce((acc, sub) => acc + sub.strands.reduce((sAcc, str) => sAcc + str.sub_strands.reduce((sc, st) => sc + st.max_score, 0), 0), 0)
    : 0;

  const classMeanPercentage = totalMaxScore > 0 ? Math.round((totalScoreAttained / totalMaxScore) * 100) : 0;
  const overallRating = getCBCRatingFromScore(totalScoreAttained, totalMaxScore || 100);

  // Handlers for starting and submitting interactive assessment
  const handleStartAssessment = (
    classLevel: string,
    subjectName: string,
    strandName: string,
    subStrand: CATSubStrand
  ) => {
    setActiveTestSubStrand({
      classLevel,
      subjectName,
      strandName,
      subStrand
    });
    setUserAnswers(subStrand.learnerAnswers || {});
    setTestSubmitted(subStrand.status === 'COMPLETED');
    setCalculatedScore(subStrand.cat_score);
    setFeedbackMessage(null);
  };

  const handleSelectOption = (qId: number, option: string) => {
    if (testSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmitAssessment = () => {
    if (!activeTestSubStrand) return;
    const questions = activeTestSubStrand.subStrand.cat_content.questions;
    if (questions.length === 0) return;

    let correctCount = 0;
    questions.forEach(q => {
      const selected = userAnswers[q.q_id];
      if (selected && selected.trim().toLowerCase() === q.correct_answer.trim().toLowerCase()) {
        correctCount += 1;
      }
    });

    const marksPerQuestion = activeTestSubStrand.subStrand.max_score / questions.length;
    const finalScore = Math.round(correctCount * marksPerQuestion * 10) / 10;
    
    setCalculatedScore(finalScore);
    setTestSubmitted(true);

    // Persist to storage
    storage.updateSubStrandScore(
      activeTestSubStrand.classLevel,
      activeTestSubStrand.subjectName,
      activeTestSubStrand.strandName,
      activeTestSubStrand.subStrand.sub_strand_name,
      finalScore,
      'COMPLETED',
      userAnswers
    );

    // Refresh state
    setEngine(storage.getCATSRootEngine());

    if (onAssessmentCompleted) {
      onAssessmentCompleted(activeTestSubStrand.subStrand, finalScore);
    }

    setFeedbackMessage(`Assessment submitted successfully! Score: ${finalScore} / ${activeTestSubStrand.subStrand.max_score}`);
  };

  const handleResetAttempt = (
    classLevel: string,
    subjectName: string,
    strandName: string,
    subStrandName: string
  ) => {
    if (window.confirm(`Reset evaluation status for "${subStrandName}" back to Not Attempted?`)) {
      storage.updateSubStrandScore(
        classLevel,
        subjectName,
        strandName,
        subStrandName,
        0,
        'NOT_ATTEMPTED',
        {}
      );
      setEngine(storage.getCATSRootEngine());
      if (activeTestSubStrand?.subStrand.sub_strand_name === subStrandName) {
        setUserAnswers({});
        setTestSubmitted(false);
        setCalculatedScore(0);
      }
    }
  };

  const handleExportCSV = () => {
    if (!currentClass) return;
    let csv = `Class Level,Subject,Strand,Sub-Strand,CAT Score,Max Score,Percentage,Status,Questions Count\n`;
    currentClass.subjects.forEach(sub => {
      sub.strands.forEach(str => {
        str.sub_strands.forEach(sst => {
          const pct = sst.max_score > 0 ? Math.round((sst.cat_score / sst.max_score) * 100) : 0;
          csv += `"${currentClass.class_level}","${sub.subject_name}","${str.strand_name}","${sst.sub_strand_name}",${sst.cat_score},${sst.max_score},${pct}%,"${sst.status}",${sst.cat_content.questions.length}\n`;
        });
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentClass.class_level}_CBE_Evaluation_Module.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg border border-blue-800/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-radial from-white/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                Kenya CBE / CBC Evaluator
              </span>
              <span className="text-xs text-blue-200/80">
                {engine.module_description}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
              Global CBE Evaluation Module
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
              Standardized Competency-Based Assessment rubric, strand evaluators, and interactive CAT questions aligned with the Kenya Institute of Curriculum Development (KICD).
            </p>
          </div>

          {/* Quick Class Performance Summary Card */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-white text-blue-950 flex flex-col items-center justify-center font-black shadow-inner">
              <span className="text-xs uppercase font-bold text-slate-400 leading-none">Mean</span>
              <span className="text-xl leading-none mt-1">{classMeanPercentage}%</span>
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-blue-200 uppercase tracking-wide">
                {currentClass?.class_level || 'Overview'} Progress
              </div>
              <div className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                <span>{completedSubStrands} / {totalSubStrands} Evaluated</span>
              </div>
              <div className="text-[11px] font-bold text-emerald-300 mt-0.5">
                {overallRating.label.split('(')[0]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CLASS LEVEL NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {engine.classes.map((cls, idx) => {
            const isSelected = selectedClassIndex === idx;
            const completedCount = cls.subjects.reduce(
              (acc, s) => acc + s.strands.reduce((stAcc, st) => stAcc + st.sub_strands.filter(sst => sst.status === 'COMPLETED').length, 0),
              0
            );
            const totalCount = cls.subjects.reduce(
              (acc, s) => acc + s.strands.reduce((stAcc, st) => stAcc + st.sub_strands.length, 0),
              0
            );

            return (
              <button
                key={cls.class_level}
                onClick={() => setSelectedClassIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{cls.class_level}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {completedCount}/{totalCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs"
            title="Download CSV report for current grade"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
            title="Print Evaluation Sheet"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN SUBJECT & STRAND EVALUATION CARDS */}
      {currentClass && currentClass.subjects.length > 0 ? (
        <div className="space-y-6">
          {currentClass.subjects.map((subject, subIdx) => {
            return (
              <div 
                key={`${currentClass.class_level}-${subject.subject_name}`}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Subject Header */}
                <div className="p-5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                        {currentClass.class_level} Subject Evaluation
                      </span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {subject.subject_name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {subject.strands.length} Strands
                    </span>
                  </div>
                </div>

                {/* Strands & Sub-Strands Container */}
                <div className="p-5 space-y-5">
                  {subject.strands.map((strand, strandIdx) => (
                    <div key={strand.strand_name} className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800 dark:text-slate-200">
                        <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>{strand.strand_name}</span>
                      </div>

                      {/* Sub-Strands Grid */}
                      <div className="grid grid-cols-1 gap-4">
                        {strand.sub_strands.map((subStrand) => {
                          const isExpanded = expandedSubStrandKey === `${subject.subject_name}-${subStrand.sub_strand_name}`;
                          const rating = getCBCRatingFromScore(subStrand.cat_score, subStrand.max_score);
                          const scorePct = subStrand.max_score > 0 ? Math.round((subStrand.cat_score / subStrand.max_score) * 100) : 0;

                          return (
                            <div
                              key={subStrand.sub_strand_name}
                              className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs hover:border-blue-400 dark:hover:border-blue-700 transition-all space-y-4"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                                      {subStrand.sub_strand_name}
                                    </h4>
                                    
                                    {/* Status Badge */}
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                      subStrand.status === 'COMPLETED'
                                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                        : subStrand.status === 'IN_PROGRESS'
                                        ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                                    }`}>
                                      {subStrand.status.replace('_', ' ')}
                                    </span>

                                    {/* CBC Performance Level Code */}
                                    {subStrand.status === 'COMPLETED' && (
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${rating.bg} ${rating.color}`}>
                                        {rating.code} ({scorePct}%)
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {subStrand.cat_content.instructions}
                                  </p>
                                </div>

                                {/* Score Display & Actions */}
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <div className="text-lg font-black text-slate-900 dark:text-white">
                                      {subStrand.cat_score} <span className="text-xs text-slate-400">/ {subStrand.max_score}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                                      {subStrand.cat_content.questions.length} Questions
                                    </div>
                                  </div>

                                  {/* Start Assessment Button */}
                                  <button
                                    onClick={() => handleStartAssessment(
                                      currentClass.class_level,
                                      subject.subject_name,
                                      strand.strand_name,
                                      subStrand
                                    )}
                                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition-all ${
                                      subStrand.status === 'COMPLETED'
                                        ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                                        : 'bg-blue-900 hover:bg-blue-800 text-white'
                                    }`}
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>{subStrand.status === 'COMPLETED' ? 'Review / Retake' : 'Take CAT'}</span>
                                  </button>

                                  {/* Reset Button (only if attempted) */}
                                  {subStrand.status === 'COMPLETED' && (
                                    <button
                                      onClick={() => handleResetAttempt(
                                        currentClass.class_level,
                                        subject.subject_name,
                                        strand.strand_name,
                                        subStrand.sub_strand_name
                                      )}
                                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                                      title="Reset Assessment Score"
                                    >
                                      <RotateCcw className="w-4 h-4" />
                                    </button>
                                  )}

                                  {/* Toggle Questions Drawer */}
                                  <button
                                    onClick={() => setExpandedSubStrandKey(isExpanded ? null : `${subject.subject_name}-${subStrand.sub_strand_name}`)}
                                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    title="View Marking Scheme & Questions"
                                  >
                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    scorePct >= 80 ? 'bg-emerald-500' :
                                    scorePct >= 65 ? 'bg-blue-500' :
                                    scorePct >= 50 ? 'bg-amber-500' :
                                    subStrand.status === 'COMPLETED' ? 'bg-rose-500' : 'bg-slate-300'
                                  }`}
                                  style={{ width: `${scorePct}%` }}
                                />
                              </div>

                              {/* EXPANDED QUESTIONS & MARKING SCHEME DRAWER */}
                              {isExpanded && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3 animate-fadeIn">
                                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-2">
                                    <span>Questions & Official Marking Scheme</span>
                                    <span>Max Score: {subStrand.max_score} pts</span>
                                  </div>

                                  <div className="space-y-3">
                                    {subStrand.cat_content.questions.map((q, qIndex) => (
                                      <div key={q.q_id} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                          <span className="font-extrabold text-slate-900 dark:text-white">
                                            Q{qIndex + 1}. {q.question}
                                          </span>
                                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                                            Ans: {q.correct_answer}
                                          </span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                          {q.options.map((opt) => {
                                            const isCorrect = opt.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
                                            return (
                                              <div 
                                                key={opt}
                                                className={`p-1.5 rounded text-[11px] font-semibold flex items-center gap-1 ${
                                                  isCorrect 
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold'
                                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                }`}
                                              >
                                                {isCorrect && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                                                <span>{opt}</span>
                                              </div>
                                            );
                                          })}
                                        </div>

                                        {q.explanation && (
                                          <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                                            💡 {q.explanation}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No subjects found for this grade level.
          </h3>
        </div>
      )}

      {/* INTERACTIVE ASSESSMENT TEST TAKER MODAL */}
      {activeTestSubStrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                    {activeTestSubStrand.classLevel} • {activeTestSubStrand.subjectName}
                  </span>
                  <span className="text-xs text-blue-200">
                    {activeTestSubStrand.strandName}
                  </span>
                </div>
                <h3 className="text-lg font-black mt-1">
                  {activeTestSubStrand.subStrand.sub_strand_name}
                </h3>
              </div>

              <button
                onClick={() => setActiveTestSubStrand(null)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Instructions */}
            <div className="p-4 bg-blue-50/80 dark:bg-blue-950/40 border-b border-blue-200/80 dark:border-blue-900/60 shrink-0">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-blue-900 dark:text-blue-300">
                    Evaluation Instructions:
                  </div>
                  <p className="text-xs text-blue-800 dark:text-blue-200 mt-0.5">
                    {activeTestSubStrand.subStrand.cat_content.instructions} Answer all questions below and click "Submit Assessment".
                  </p>
                </div>
              </div>
            </div>

            {/* Questions Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {feedbackMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{feedbackMessage}</span>
                </div>
              )}

              {activeTestSubStrand.subStrand.cat_content.questions.map((q, idx) => {
                const selectedOpt = userAnswers[q.q_id];
                const isSubmitted = testSubmitted;
                const isCorrect = selectedOpt && selectedOpt.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();

                return (
                  <div 
                    key={q.q_id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSubmitted
                        ? isCorrect
                          ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        Question {idx + 1}: {q.question}
                      </span>

                      {isSubmitted && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      )}
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map(option => {
                        const isChosen = selectedOpt === option;
                        const isTheCorrectAnswer = option.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();

                        let optionClass = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400';
                        if (isChosen && !isSubmitted) {
                          optionClass = 'bg-blue-900 text-white border-blue-900 font-bold';
                        } else if (isSubmitted) {
                          if (isTheCorrectAnswer) {
                            optionClass = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                          } else if (isChosen && !isTheCorrectAnswer) {
                            optionClass = 'bg-rose-600 text-white border-rose-600 line-through';
                          } else {
                            optionClass = 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent opacity-60';
                          }
                        }

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleSelectOption(q.q_id, option)}
                            disabled={isSubmitted}
                            className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-2 ${optionClass}`}
                          >
                            <span>{option}</span>
                            {isChosen && !isSubmitted && <Check className="w-3.5 h-3.5 text-white" />}
                            {isSubmitted && isTheCorrectAnswer && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && q.explanation && (
                      <div className="mt-2.5 text-[11px] text-slate-600 dark:text-slate-400 italic bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg">
                        💡 {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="text-xs">
                {testSubmitted ? (
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    Final Result: {calculatedScore} / {activeTestSubStrand.subStrand.max_score} pts
                  </span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">
                    {Object.keys(userAnswers).length} of {activeTestSubStrand.subStrand.cat_content.questions.length} answered
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {testSubmitted ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTestSubmitted(false);
                      setUserAnswers({});
                    }}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Retake
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitAssessment}
                    disabled={Object.keys(userAnswers).length === 0}
                    className="px-5 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Assessment</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTestSubStrand(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
