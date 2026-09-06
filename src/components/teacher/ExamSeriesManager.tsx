import React, { useState } from 'react';
import { 
  ExamSeriesPaper, 
  ExamPublisher, 
  GradeLevel, 
  SubjectName, 
  STANDARD_SUBJECTS 
} from '../../types';
import { 
  Award, 
  Calendar, 
  Clock, 
  Download, 
  FileCheck, 
  Printer, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  BookOpen, 
  Plus, 
  Filter,
  Check
} from 'lucide-react';
import { storage } from '../../services/storageService';
import { EXAM_SERIES_CONFIG } from '../../data/academicCalendarsData';

interface ExamSeriesManagerProps {
  onOpenAssessments?: () => void;
}

export const ExamSeriesManager: React.FC<ExamSeriesManagerProps> = ({
  onOpenAssessments
}) => {
  const [examPapers, setExamPapers] = useState<ExamSeriesPaper[]>(() => storage.getExamSeries());
  const [selectedPublisher, setSelectedPublisher] = useState<string>('All');
  const [selectedSeriesType, setSelectedSeriesType] = useState<string>('All');
  const [selectedTerm, setSelectedTerm] = useState<string>('Term 3'); // Default to Active Term 3!
  const [scheduledNotification, setScheduledNotification] = useState<string | null>(null);
  const [activePreviewPaper, setActivePreviewPaper] = useState<ExamSeriesPaper | null>(null);

  const filteredPapers = examPapers.filter((p) => {
    const pubMatch = selectedPublisher === 'All' || p.publisherShort === selectedPublisher;
    const typeMatch = selectedSeriesType === 'All' || p.seriesType === selectedSeriesType;
    const termMatch = selectedTerm === 'All' || p.term === selectedTerm;
    return pubMatch && typeMatch && termMatch;
  });

  const handleSchedulePaper = (paper: ExamSeriesPaper) => {
    storage.scheduleExamToCalendar(paper);
    setExamPapers(storage.getExamSeries());
    setScheduledNotification(`Scheduled "${paper.title}" onto School Calendar!`);
    setTimeout(() => setScheduledNotification(null), 2500);
  };

  const handleScheduleAllTerm = () => {
    filteredPapers.forEach((paper) => {
      storage.scheduleExamToCalendar(paper);
    });
    setExamPapers(storage.getExamSeries());
    setScheduledNotification(`All ${filteredPapers.length} ${selectedTerm} examination sets successfully scheduled to the School Calendar!`);
    setTimeout(() => setScheduledNotification(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner: Official Exam Series Integration */}
      <div className="p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl border border-blue-900/60 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30">
                Exam Series Integration
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 4 National Publishers Verified
              </span>
              <span className="text-xs text-blue-300 font-bold">
                Active Term: Term 3 (2026)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              National Examination Series & Auto-Schedule Engine
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Standardized evaluation sets calibrated with official Ministry of Education syllabi, KPSEA rehearsal frameworks, and publisher auto-schedule rules.
            </p>
          </div>

          <button
            onClick={handleScheduleAllTerm}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-md transition-all whitespace-nowrap self-start lg:self-center"
          >
            <Calendar className="w-4 h-4" />
            <span>Auto-Schedule All to Calendar</span>
          </button>
        </div>

        {/* 4 Supported Publishers Grid */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {EXAM_SERIES_CONFIG.supported_publishers.map((pub) => {
            const shortName = pub.includes('Targeter') ? 'Targeter' :
                              pub.includes('Jesma') ? 'Jesma' :
                              pub.includes('Predictors') ? 'Predictors' : 'Signal & Spotlight';
            return (
              <div 
                key={pub}
                onClick={() => setSelectedPublisher(shortName)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  selectedPublisher === shortName 
                    ? 'bg-blue-600/30 border-blue-400 text-white shadow-xs'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="p-2 bg-white/10 rounded-xl">
                  <Award className="w-4 h-4 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold truncate">{pub}</div>
                  <div className="text-[10px] text-slate-400">Supported Publisher</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auto-Schedule Rules Card */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-slate-900 rounded-2xl border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 dark:text-blue-200">
              Official Auto-Schedule Rules
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-blue-900/40">
              <strong className="text-blue-900 dark:text-blue-300 block">Opener Exams:</strong>
              {EXAM_SERIES_CONFIG.auto_schedule_rules.opener_exams}
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-blue-900/40">
              <strong className="text-blue-900 dark:text-blue-300 block">Midterm Series:</strong>
              {EXAM_SERIES_CONFIG.auto_schedule_rules.midterm_series}
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-blue-900/40">
              <strong className="text-blue-900 dark:text-blue-300 block">Endterm Evaluations:</strong>
              {EXAM_SERIES_CONFIG.auto_schedule_rules.endterm_evaluations}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {scheduledNotification && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{scheduledNotification}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Publisher Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Targeter', 'Jesma', 'Predictors', 'Signal & Spotlight'].map((pub) => (
            <button
              key={pub}
              onClick={() => setSelectedPublisher(pub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedPublisher === pub
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {pub}
            </button>
          ))}
        </div>

        {/* Term & Type Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value="All">All Terms</option>
            <option value="Term 3">Term 3 (Active Term)</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 1">Term 1</option>
          </select>

          <select
            value={selectedSeriesType}
            onChange={(e) => setSelectedSeriesType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value="All">All Series Types</option>
            <option value="Opener">Opener Assessment</option>
            <option value="Midterm">Midterm Evaluation</option>
            <option value="Endterm">Endterm Comprehensive</option>
            <option value="KPSEA Trial">KPSEA Model Rehearsal</option>
          </select>
        </div>
      </div>

      {/* Exam Papers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPapers.map((paper) => {
          const isScheduled = paper.status === 'Scheduled';
          return (
            <div
              key={paper.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                      {paper.publisherShort}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {paper.seriesType}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {paper.term} ({paper.year})
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-slate-400 font-bold">
                    {paper.paperCode}
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  {paper.title}
                </h4>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1 font-bold text-blue-900 dark:text-blue-300">
                    <BookOpen className="w-3.5 h-3.5" /> {paper.grade} • {paper.subject}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {paper.durationMinutes} mins ({paper.totalMarks} Marks)
                  </span>
                </div>

                <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-500">Auto-Schedule Rule:</span> {paper.autoScheduleRule}
                  <div className="font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    Target Window: {paper.scheduledWeeks}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActivePreviewPaper(paper)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  View Paper Info
                </button>

                <div className="flex items-center gap-2">
                  {isScheduled ? (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-black">
                      <Check className="w-3.5 h-3.5" /> On Calendar
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSchedulePaper(paper)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule to Calendar</span>
                    </button>
                  )}

                  {onOpenAssessments && (
                    <button
                      onClick={onOpenAssessments}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      title="Enter Student Scores"
                    >
                      Record Marks
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAPER PREVIEW MODAL */}
      {activePreviewPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-scaleUp p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  {activePreviewPaper.publisher}
                </span>
                <h3 className="font-black text-lg text-slate-900 dark:text-white mt-1">
                  {activePreviewPaper.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePreviewPaper(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <div><strong>Grade:</strong> {activePreviewPaper.grade}</div>
                <div><strong>Subject:</strong> {activePreviewPaper.subject}</div>
                <div><strong>Time:</strong> {activePreviewPaper.durationMinutes} Minutes</div>
                <div><strong>Max Score:</strong> {activePreviewPaper.totalMarks} Marks</div>
                <div><strong>Term:</strong> {activePreviewPaper.term} ({activePreviewPaper.year})</div>
                <div><strong>Paper Code:</strong> {activePreviewPaper.paperCode}</div>
              </div>

              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/50 space-y-1">
                <div className="font-bold text-blue-900 dark:text-blue-200">Official Exam Administration Instructions:</div>
                <p className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
                  1. Check that all questions are printed clearly before commencement.<br />
                  2. Learners must not open the question paper until authorized by the invigilator.<br />
                  3. All working must be clearly shown in the spaces provided below each question.<br />
                  4. Synchronized marking schemes adhere to official CBC performance level rubrics.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  alert(`Official Marking Scheme for ${activePreviewPaper.paperCode} downloaded!`);
                  setActivePreviewPaper(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Marking Scheme</span>
              </button>
              <button
                onClick={() => {
                  handleSchedulePaper(activePreviewPaper);
                  setActivePreviewPaper(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule to Calendar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
