import React, { useState } from 'react';
import { CalendarEvent, SystemConfig } from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Clock, 
  MapPin, 
  Tag, 
  Sparkles,
  Layers,
  Filter,
  BookOpen,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { storage } from '../../services/storageService';
import { OFFICIAL_ACADEMIC_CALENDARS } from '../../data/academicCalendarsData';

interface CalendarViewProps {
  events: CalendarEvent[];
  isTeacher?: boolean;
  onOpenAddEventModal?: () => void;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  'Term Date': { bg: 'bg-blue-100 dark:bg-blue-950/70', text: 'text-blue-800 dark:text-blue-300', dot: 'bg-blue-600', border: 'border-blue-300 dark:border-blue-800' },
  'Exams / CAT': { bg: 'bg-rose-100 dark:bg-rose-950/70', text: 'text-rose-800 dark:text-rose-300', dot: 'bg-rose-600', border: 'border-rose-300 dark:border-rose-800' },
  'Co-Curricular': { bg: 'bg-emerald-100 dark:bg-emerald-950/70', text: 'text-emerald-800 dark:text-emerald-300', dot: 'bg-emerald-600', border: 'border-emerald-300 dark:border-emerald-800' },
  'Holiday': { bg: 'bg-amber-100 dark:bg-amber-950/70', text: 'text-amber-800 dark:text-amber-300', dot: 'bg-amber-600', border: 'border-amber-300 dark:border-amber-800' },
  'PTA Meeting': { bg: 'bg-purple-100 dark:bg-purple-950/70', text: 'text-purple-800 dark:text-purple-300', dot: 'bg-purple-600', border: 'border-purple-300 dark:border-purple-800' }
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  isTeacher = false,
  onOpenAddEventModal
}) => {
  const [systemConfig] = useState<SystemConfig>(() => storage.getSystemConfig());
  // Default to August/September 2026 for Term 3 (Active Term)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 1)); // Sept 2026
  const [viewMode, setViewMode] = useState<'month' | 'agenda' | 'official_calendars'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleJumpToTerm = (y: number, m: number) => {
    setCurrentDate(new Date(y, m, 1));
    if (viewMode === 'official_calendars') {
      setViewMode('month');
    }
  };

  const filteredEvents = events.filter(e => {
    return selectedCategory === 'All' || e.category === selectedCategory;
  });

  const getEventsForDay = (dayNumber: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    return filteredEvents.filter(e => {
      if (e.date === formattedDate) return true;
      if (e.endDate && e.date <= formattedDate && e.endDate >= formattedDate) return true;
      return false;
    });
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Remove event "${title}" from calendar?`)) {
      storage.deleteCalendarEvent(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Google Calendar Styled Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              Active Session: {systemConfig.active_academic_year} • {systemConfig.active_term}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {systemConfig.school_metadata.school_name}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            <span>Academic Calendar & Official Term Dates</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Interactive term schedules, examinations, KPSEA national windows, and 2026/2027 calendar milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isTeacher && onOpenAddEventModal && (
            <button
              onClick={onOpenAddEventModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          )}
        </div>
      </div>

      {/* Quick Term Navigation & Calendar Mode Pill Bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Quick Term Jump Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-extrabold uppercase text-slate-400 mr-1 hidden sm:inline">
            Quick Jump:
          </span>
          <button
            onClick={() => handleJumpToTerm(2026, 0)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:border-blue-500 text-xs"
          >
            2026 Term 1
          </button>
          <button
            onClick={() => handleJumpToTerm(2026, 4)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:border-blue-500 text-xs"
          >
            2026 Term 2
          </button>
          <button
            onClick={() => handleJumpToTerm(2026, 8)}
            className="px-2.5 py-1 rounded-lg bg-blue-900 text-white font-black text-xs shadow-xs"
          >
            2026 Term 3 (Active)
          </button>
          <button
            onClick={() => handleJumpToTerm(2027, 0)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 text-xs"
          >
            2027 Projected
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'month' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Month Grid
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'agenda' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Agenda
          </button>
          <button
            onClick={() => setViewMode('official_calendars')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
              viewMode === 'official_calendars' ? 'bg-blue-900 text-white shadow-xs' : 'text-blue-700 dark:text-blue-300'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Official Calendars</span>
          </button>
        </div>
      </div>

      {/* Calendar Navigation Bar (when in month or agenda mode) */}
      {viewMode !== 'official_calendars' && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(new Date(2026, 8, 2))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Current Active Term
            </button>
            <div className="flex items-center">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-heading ml-1">
              {monthNames[month]} {year}
            </h3>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Categories</option>
              <option value="Term Date">Term Dates</option>
              <option value="Exams / CAT">Exams & CATs</option>
              <option value="Co-Curricular">Co-Curricular / Sports</option>
              <option value="Holiday">Holidays & Breaks</option>
              <option value="PTA Meeting">PTA & Consultations</option>
            </select>
          </div>
        </div>
      )}

      {/* VIEW 3: OFFICIAL ACADEMIC CALENDARS (2026 & 2027 PROJECTED) */}
      {viewMode === 'official_calendars' && (
        <div className="space-y-6">
          {/* 2026 Official Calendar Box */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-900 text-white rounded-xl">
                  <CalendarDays className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Official Academic Calendar 2026 (Active Year)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Approved by Ministry of Education & Kenya National Examinations Council
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Active Year: 2026
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Term 1 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Term 1 (2026)</h4>
                  <span className="text-[10px] font-bold text-slate-400">Completed</span>
                </div>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <div><strong>Start:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2026.term_1.start}</div>
                  <div><strong>Mid-Term:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2026.term_1.mid_term}</div>
                  <div><strong>End:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2026.term_1.end}</div>
                </div>
              </div>

              {/* Term 2 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Term 2 (2026)</h4>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">CBA Portal Opened</span>
                </div>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <div><strong>Start:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2026.term_2.start}</div>
                  <div className="text-amber-700 dark:text-amber-300 font-bold">
                    <strong>KNEC Projects Portal:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2026.term_2.knec_projects_portal_opens}
                  </div>
                  <div><strong>Mid-Term:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2026.term_2.mid_term}</div>
                  <div><strong>End:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2026.term_2.end}</div>
                </div>
              </div>

              {/* Term 3 (Active) */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border-2 border-blue-600 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-blue-900 dark:text-blue-200">Term 3 (2026)</h4>
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded-md text-[10px] font-black">
                    Live Active
                  </span>
                </div>
                <div className="text-xs space-y-1 text-blue-950 dark:text-blue-200">
                  <div><strong>Start:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2026.term_3.start}</div>
                  <div><strong>End:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2026.term_3.end}</div>
                  <div className="pt-1 text-rose-700 dark:text-rose-400 font-black">
                    <strong>KPSEA Exam Dates:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2026.term_3.kpsea_exam_dates}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2027 Projected Calendar Box */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-indigo-900 text-white rounded-xl">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Year 2027 Projected Academic Calendar
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Projected scheduling rules, exam series integration, and automated portal rollover
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                Projected Model
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Term 1 2027 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Term 1 (2027 Projected)</h4>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <div><strong>Start:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2027_projected.term_1.start}</div>
                  <div><strong>Mid-Term:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2027_projected.term_1.mid_term_break}</div>
                  <div><strong>End:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2027_projected.term_1.end}</div>
                  <div className="pt-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Exam Series: {OFFICIAL_ACADEMIC_CALENDARS.year_2027_projected.term_1.exam_series.join(', ')}
                  </div>
                </div>
              </div>

              {/* Term 2 2027 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Term 2 (2027 Projected)</h4>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <div><strong>Start:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2027_projected.term_2.start}</div>
                  <div className="text-amber-700 dark:text-amber-300 font-bold">
                    <strong>KNEC Projects Auto-Sync:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2027_projected.term_2.knec_projects_portal_auto_sync}
                  </div>
                  <div><strong>Mid-Term:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2027_projected.term_2.mid_term_break}</div>
                  <div><strong>End:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2027_projected.term_2.end}</div>
                </div>
              </div>

              {/* Term 3 2027 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Term 3 (2027 Projected)</h4>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <div><strong>Start:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2027_projected.term_3.start}</div>
                  <div><strong>End:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2027_projected.term_3.end}</div>
                  <div className="pt-1 text-rose-700 dark:text-rose-400 font-bold">
                    <strong>KPSEA Window:</strong> {OFFICIAL_ACADEMIC_CALENDARS.year_2027_projected.term_3.kpsea_national_window}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: MONTH GRID (Google Calendar Layout) */}
      {viewMode === 'month' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Day of Week Header */}
          <div className="grid grid-cols-7 bg-slate-100 dark:bg-slate-800/80 text-center py-2.5 text-xs font-extrabold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="min-h-[90px] sm:min-h-[110px] p-1.5 bg-slate-50/50 dark:bg-slate-950/40 text-slate-300 dark:text-slate-700" />
            ))}

            {/* Days in current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayEvents = getEventsForDay(dayNum);
              const isToday = year === 2026 && month === 8 && dayNum === 2; // Simulated local reference date 2026-09-02

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`min-h-[90px] sm:min-h-[110px] p-1.5 transition-colors flex flex-col justify-between ${
                    isToday ? 'bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-500 inset-0' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isToday ? 'bg-blue-600 text-white font-black shadow-xs' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[9px] font-mono font-bold text-slate-400 hidden sm:inline">
                        {dayEvents.length} ev
                      </span>
                    )}
                  </div>

                  {/* Day Events stack */}
                  <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-[70px]">
                    {dayEvents.map((ev) => {
                      const style = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES['Term Date'];
                      return (
                        <div
                          key={ev.id}
                          className={`p-1 rounded text-[10px] font-semibold truncate ${style.bg} ${style.text} border ${style.border} flex items-center gap-1 shadow-2xs`}
                          title={`${ev.title} - ${ev.description}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
                          <span className="truncate">{ev.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: AGENDA LIST */}
      {viewMode === 'agenda' && (
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">No events found in this category</p>
            </div>
          ) : (
            filteredEvents.map((ev) => {
              const style = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES['Term Date'];
              return (
                <div
                  key={ev.id}
                  className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-xl ${style.bg} ${style.text} shrink-0 text-center min-w-[64px]`}>
                      <div className="text-[10px] uppercase font-bold tracking-wider">
                        {new Date(ev.date).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div className="text-lg font-black leading-none mt-0.5">
                        {new Date(ev.date).getDate()}
                      </div>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {ev.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${style.bg} ${style.text} border ${style.border}`}>
                          {ev.category}
                        </span>
                        {ev.term && (
                          <span className="text-[10px] font-semibold text-slate-400">
                            • {ev.term}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {ev.description}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {ev.date} {ev.endDate ? `to ${ev.endDate}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isTeacher && (
                    <button
                      onClick={() => handleDeleteEvent(ev.id, ev.title)}
                      className="self-end sm:self-center p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
