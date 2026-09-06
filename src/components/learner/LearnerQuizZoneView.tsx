import React, { useState, useEffect } from 'react';
import { Student, Quiz, QuizQuestion } from '../../types';
import { 
  HelpCircle, 
  ArrowLeft, 
  Clock, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  Sparkles,
  Trophy
} from 'lucide-react';

interface LearnerQuizZoneViewProps {
  student: Student;
  quizzes: Quiz[];
  onBack: () => void;
}

export const LearnerQuizZoneView: React.FC<LearnerQuizZoneViewProps> = ({
  student,
  quizzes,
  onBack
}) => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const gradeQuizzes = quizzes.filter(q => q.grade === student.grade);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserScore(0);
    setIsQuizComplete(false);
    setTimeLeft(quiz.timeLimitMinutes * 60);
  };

  // Timer effect
  useEffect(() => {
    if (!activeQuiz || isQuizComplete) return;
    if (timeLeft <= 0) {
      setIsQuizComplete(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, isQuizComplete, timeLeft]);

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || !activeQuiz) return;
    setIsAnswerSubmitted(true);
    const q = activeQuiz.questions[currentQuestionIndex];
    if (selectedOption === q.correctAnswerIndex) {
      setUserScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    if (currentQuestionIndex + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div>
        <button
          onClick={() => {
            if (activeQuiz && !isQuizComplete) {
              if (confirm('Leave current quiz? Progress will be reset.')) {
                setActiveQuiz(null);
              }
            } else {
              onBack();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> {activeQuiz ? 'Exit Quiz Zone' : 'Back to Dashboard'}
        </button>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-rose-600" />
          <span>Little Roses Quiz Zone</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Gamified challenges and rapid CBC revision quizzes for {student.grade}.
        </p>
      </div>

      {/* QUIZ LIST IF NO ACTIVE QUIZ */}
      {!activeQuiz && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gradeQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-extrabold text-xs">
                    {quiz.subject}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {quiz.timeLimitMinutes} Mins
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-3">
                  {quiz.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {quiz.questions.length} questions included in this session.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Earn 100 Points
                </span>

                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVE QUIZ GAME ENGINE */}
      {activeQuiz && !isQuizComplete && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 space-y-6 animate-scaleUp">
          {/* Top Bar: Progress and Timer */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase">
                Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
              </span>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                {activeQuiz.subject} • {activeQuiz.title}
              </h3>
            </div>

            <div className={`px-3 py-1.5 rounded-xl font-mono font-black text-xs flex items-center gap-1.5 ${
              timeLeft < 60 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              <Clock className="w-4 h-4" />
              {formatTimer(timeLeft)}
            </div>
          </div>

          {/* Question Text */}
          {(() => {
            const q = activeQuiz.questions[currentQuestionIndex];
            return (
              <div className="space-y-4">
                <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                  {q.question}
                </p>

                {/* Multiple choice options */}
                <div className="space-y-2.5">
                  {q.options.map((opt, idx) => {
                    let btnStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-800 dark:text-slate-200';

                    if (selectedOption === idx) {
                      btnStyle = 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-900 dark:text-blue-200 font-bold';
                    }

                    if (isAnswerSubmitted) {
                      if (idx === q.correctAnswerIndex) {
                        btnStyle = 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (selectedOption === idx && idx !== q.correctAnswerIndex) {
                        btnStyle = 'bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/5 font-mono font-bold flex items-center justify-center text-xs">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isAnswerSubmitted && idx === q.correctAnswerIndex && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {isAnswerSubmitted && selectedOption === idx && idx !== q.correctAnswerIndex && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback and Explanation */}
                {isAnswerSubmitted && (
                  <div className={`p-4 rounded-xl text-xs space-y-1 ${
                    selectedOption === q.correctAnswerIndex
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border border-rose-200'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {selectedOption === q.correctAnswerIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Splendid! Correct Answer!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Not quite. Let's learn:</span>
                        </>
                      )}
                    </div>
                    <p className="opacity-90">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Confirm Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>{currentQuestionIndex + 1 < activeQuiz.questions.length ? 'Next Question' : 'View Final Score'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUIZ COMPLETION SUMMARY */}
      {isQuizComplete && activeQuiz && (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-8 text-center space-y-5 animate-scaleUp">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Quiz Completed</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-1">
              Well Done, {student.name}!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {activeQuiz.title} ({activeQuiz.subject})
            </p>
          </div>

          {/* Score Badge */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-4xl font-black text-blue-900 dark:text-blue-400">
              {userScore} / {activeQuiz.questions.length}
            </div>
            <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {Math.round((userScore / activeQuiz.questions.length) * 100)}% Performance Rating
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleStartQuiz(activeQuiz)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button
              onClick={() => setActiveQuiz(null)}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Return to Quizzes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
