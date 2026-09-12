import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Sun,
  Flame,
  Check
} from 'lucide-react';
import { storage } from '../../services/storageService';
import { OFFICIAL_ACADEMIC_CALENDARS } from '../../data/academicCalendarsData';

interface CalendarViewProps {
  events: CalendarEvent[];
  isTeacher?: boolean;
  onOpenAddEventModal?: () => void;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string; border: string; badge: string }> = {
  'Term Date': { 
    bg: 'bg-blue-50 dark:bg-blue-950/70', 
    text: 'text-blue-800 dark:text-blue-300', 
    dot: 'bg-blue-600', 
    border: 'border-blue-300 dark:border-blue-800',
    badge: 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
  },
  'Exams / CAT': { 
    bg: 'bg-rose-50 dark:bg-rose-950/70', 
    text: 'text-rose-800 dark:text-rose-300', 
    dot: 'bg-rose-600', 
    border: 'border-rose-300 dark:border-rose-800',
    badge: 'bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-100'
  },
  'Co-Curricular': { 
    bg: 'bg-emerald-50 dark:bg-emerald-950/70', 
    text: 'text-emerald-800 dark:text-emerald-300', 
    dot: 'bg-emerald-600', 
    border: 'border-emerald-300 dark:border-emerald-800',
    badge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100'
  },
  'Holiday': { 
    bg: 'bg-amber-50 dark:bg-amber-950/70', 
    text: 'text-amber-800 dark:text-amber-300', 
    dot: 'bg-amber-600', 
    border: 'border-amber-300 dark:border-amber-800',
    badge: 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
  },
  'PTA Meeting': { 
    bg: 'bg-purple-50 dark:bg-purple-950/70', 
    text: 'text-purple-800 dark:text-purple-300', 
    dot: 'bg-purple-600', 
    border: 'border-purple-300 dark:border-purple-800',
    badge: 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100'
  }
};

const HOURS = [
  '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', 
  '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', 
  '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  isTeacher = false,
  onOpenAddEventModal
}) => {
  const [systemConfig] = useState<SystemConfig>(() => storage.getSystemConfig());
  
  // Real-time live date and clock (updates every second)
  const [liveNow, setLiveNow] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calendar navigated viewing date (defaults to current date)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda' | 'official_calendars'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
    } else if (viewMode === 'day') {
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setCurrentDate(prevDay);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
    } else if (viewMode === 'day') {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
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

  const getEventsForDay = (dayNumber: number, targetMonth = month, targetYear = year) => {
    const formattedDate = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
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

  // Google Calendar Week calculations
  const getWeekDays = () => {
    const curr = new Date(currentDate);
    const dayOfWeek = curr.getDay(); // 0 is Sunday
    const startOfWeek = new Date(curr);
    startOfWeek.setDate(curr.getDate() - dayOfWeek);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays();

  // Helper to parse hour to position
  const getHourOffsetPercent = (timeStr?: string) => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
    if (!match) return 0;
    let h = parseInt(match[1], 10);
    const m = match[2] ? parseInt(match[2], 10) : 0;
    const ampm = match[3]?.toUpperCase();

    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;

    const totalMinutesFrom7AM = (h * 60 + m) - (7 * 60);
    const maxMinutes = 11 * 60; // 7 AM to 6 PM = 11 hrs
    const percent = Math.max(0, Math.min(100, (totalMinutesFrom7AM / maxMinutes) * 100));
    return percent;
  };

  // Current red line position for live clock
  const currentHour = liveNow.getHours();
  const currentMinute = liveNow.getMinutes();
  const liveTotalMinFrom7AM = (currentHour * 60 + currentMinute) - (7 * 60);
  const liveRedLinePercent = Math.max(0, Math.min(100, (liveTotalMinFrom7AM / (11 * 60)) * 100));
  const isTimeInView = liveTotalMinFrom7AM >= 0 && liveTotalMinFrom7AM <= (11 * 60);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Google Calendar Header */}
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
            <span>Academic Calendar & Schedule</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time Google Calendar engine with daily automatic transitions, hourly time indicators, and official term dates.
          </p>
        </div>

        {/* Live Clock & Action */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Live Real-Time Clock Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-800 rounded-xl border border-slate-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-left">
              <div className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                Live Clock
              </div>
              <div className="text-xs font-mono font-black text-emerald-400">
                {liveNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          </div>

          {isTeacher && onOpenAddEventModal && (
            <button
              onClick={onOpenAddEventModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Google Calendar Controls Bar: Today, Navigation, Month Title, Mode Switcher, and Filters */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Navigation Group */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 transition-all active:scale-95 shadow-2xs"
          >
            Today
          </button>
          <div className="flex items-center">
            <button
              onClick={handlePrev}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-heading ml-1">
            {monthNames[month]} {year}
          </h3>
          <span className="text-xs text-slate-400 font-medium hidden lg:inline">
            • {liveNow.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* View Mode & Category Filter */}
        <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
          {/* View Modes (Google Calendar Style) */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('month')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'agenda'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setViewMode('official_calendars')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'official_calendars'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Official MOE
            </button>
          </div>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
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

      {/* VIEW 1: GOOGLE CALENDAR MONTH GRID */}
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
              <div key={`empty-${idx}`} className="min-h-[95px] sm:min-h-[115px] p-1.5 bg-slate-50/50 dark:bg-slate-950/40 text-slate-300 dark:text-slate-700" />
            ))}

            {/* Days in current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayEvents = getEventsForDay(dayNum);
              // Live day check: updates automatically as the day changes!
              const isToday = liveNow.getDate() === dayNum && 
                              liveNow.getMonth() === month && 
                              liveNow.getFullYear() === year;

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`min-h-[95px] sm:min-h-[115px] p-1.5 transition-colors flex flex-col justify-between ${
                    isToday 
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500 inset-0' 
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isToday ? 'bg-blue-600 text-white font-black shadow-xs' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[9px] font-mono font-bold text-slate-400">
                        {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                      </span>
                    )}
                  </div>

                  {/* Day Events stack with start time */}
                  <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-[80px]">
                    {dayEvents.map((ev) => {
                      const style = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES['Term Date'];
                      return (
                        <div
                          key={ev.id}
                          className={`p-1 rounded text-[10px] font-semibold truncate ${style.bg} ${style.text} border ${style.border} flex items-center gap-1 shadow-2xs`}
                          title={`${ev.startTime ? `[${ev.startTime}] ` : ''}${ev.title} - ${ev.description} (${ev.location || 'School'})`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
                          {ev.startTime && (
                            <span className="font-mono text-[9px] font-bold opacity-80 shrink-0">
                              {ev.startTime.replace(':00', '')}
                            </span>
                          )}
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

      {/* VIEW 2: GOOGLE CALENDAR WEEK VIEW (With hourly grid and real-time red line) */}
      {viewMode === 'week' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          {/* Week Day Headers */}
          <div className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-700 min-w-[700px] bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10">
            <div className="p-2 text-center text-xs font-bold text-slate-400 border-r border-slate-200 dark:border-slate-700">
              Time (GMT+3)
            </div>
            {weekDays.map((d, i) => {
              const isToday = liveNow.getDate() === d.getDate() && 
                              liveNow.getMonth() === d.getMonth() && 
                              liveNow.getFullYear() === d.getFullYear();
              return (
                <div 
                  key={i} 
                  className={`p-2 text-center border-r border-slate-200 dark:border-slate-700 ${
                    isToday ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300' : ''
                  }`}
                >
                  <div className="text-[10px] uppercase font-extrabold text-slate-500">
                    {d.toLocaleDateString(undefined, { weekday: 'short' })}
                  </div>
                  <div className={`text-sm font-black mx-auto w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                    isToday ? 'bg-blue-600 text-white' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Week Hours Grid with Events and Live Red Indicator */}
          <div className="min-w-[700px] relative">
            {HOURS.map((hour, hIdx) => (
              <div key={hIdx} className="grid grid-cols-8 border-b border-slate-100 dark:border-slate-800/60 min-h-[56px]">
                {/* Time Axis */}
                <div className="p-2 text-[10px] font-mono font-bold text-slate-400 border-r border-slate-200 dark:border-slate-700 text-right pr-3 -mt-2.5">
                  {hour}
                </div>

                {/* 7 Columns for each Day */}
                {weekDays.map((d, dIdx) => {
                  const dayEvents = getEventsForDay(d.getDate(), d.getMonth(), d.getFullYear());
                  const isToday = liveNow.getDate() === d.getDate() && 
                                  liveNow.getMonth() === d.getMonth() && 
                                  liveNow.getFullYear() === d.getFullYear();

                  // Events matching this hour
                  const hourNumber = (hIdx + 7); // 7 AM is index 0
                  const matchingEvents = dayEvents.filter(ev => {
                    if (!ev.startTime) return hIdx === 1; // Default 08:00 AM slot
                    const match = ev.startTime.match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
                    if (!match) return false;
                    let h = parseInt(match[1], 10);
                    const ampm = match[3]?.toUpperCase();
                    if (ampm === 'PM' && h < 12) h += 12;
                    if (ampm === 'AM' && h === 12) h = 0;
                    return h === hourNumber;
                  });

                  return (
                    <div 
                      key={dIdx} 
                      className={`border-r border-slate-100 dark:border-slate-800/60 p-1 relative min-h-[56px] ${
                        isToday ? 'bg-blue-50/20 dark:bg-blue-950/10' : ''
                      }`}
                    >
                      {matchingEvents.map(ev => {
                        const style = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES['Term Date'];
                        return (
                          <div
                            key={ev.id}
                            className={`p-1.5 rounded-lg text-[10px] font-semibold ${style.bg} ${style.text} border ${style.border} shadow-xs mb-1`}
                          >
                            <div className="font-mono text-[9px] font-bold opacity-75">
                              {ev.startTime || '08:00 AM'}
                            </div>
                            <div className="font-extrabold truncate">{ev.title}</div>
                            {ev.location && (
                              <div className="text-[8px] opacity-70 truncate flex items-center gap-0.5 mt-0.5">
                                <MapPin className="w-2.5 h-2.5" />
                                <span>{ev.location}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Google Calendar Real-Time Red Indicator Line across Today column */}
            {isTimeInView && (
              <div 
                className="absolute left-0 right-0 pointer-events-none z-20 flex items-center"
                style={{ top: `${liveRedLinePercent}%` }}
              >
                <div className="w-[12.5%] flex justify-end pr-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-sm animate-ping" />
                </div>
                <div className="h-[2px] bg-rose-600 flex-1 shadow-sm relative">
                  <span className="absolute -top-3 right-2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                    Now ({liveNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: GOOGLE CALENDAR DAY VIEW (Hourly detail for selected date) */}
      {viewMode === 'day' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Day View Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                {currentDate.getDate()}
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h4>
                <p className="text-xs text-slate-500">
                  {getEventsForDay(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear()).length} scheduled items
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={handlePrev}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold rounded-xl text-xs"
              >
                Today
              </button>
              <button
                onClick={handleNext}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hourly Timeline for the Day */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 relative">
            {HOURS.map((hour, hIdx) => {
              const hourNumber = hIdx + 7;
              const dayEvents = getEventsForDay(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());
              const matchingEvents = dayEvents.filter(ev => {
                if (!ev.startTime) return hIdx === 1; // Default 08:00 AM
                const match = ev.startTime.match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
                if (!match) return false;
                let h = parseInt(match[1], 10);
                const ampm = match[3]?.toUpperCase();
                if (ampm === 'PM' && h < 12) h += 12;
                if (ampm === 'AM' && h === 12) h = 0;
                return h === hourNumber;
              });

              return (
                <div key={hIdx} className="flex min-h-[64px] hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="w-24 p-3 text-xs font-mono font-bold text-slate-400 text-right shrink-0 border-r border-slate-100 dark:border-slate-800">
                    {hour}
                  </div>
                  <div className="flex-1 p-2 space-y-2">
                    {matchingEvents.map(ev => {
                      const style = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES['Term Date'];
                      return (
                        <div
                          key={ev.id}
                          className={`p-3 rounded-xl border ${style.border} ${style.bg} ${style.text} shadow-xs flex items-start justify-between gap-3`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-white/70 dark:bg-slate-900/60 shadow-2xs">
                                {ev.startTime || '08:00 AM'} {ev.endTime ? `– ${ev.endTime}` : ''}
                              </span>
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                {ev.title}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${style.badge}`}>
                                {ev.category}
                              </span>
                            </div>
                            <p className="text-xs opacity-90 leading-relaxed">
                              {ev.description}
                            </p>
                            {ev.location && (
                              <div className="flex items-center gap-1 text-[11px] opacity-75 font-medium">
                                <MapPin className="w-3 h-3" />
                                <span>{ev.location}</span>
                              </div>
                            )}
                          </div>

                          {isTeacher && (
                            <button
                              onClick={() => handleDeleteEvent(ev.id, ev.title)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* VIEW 4: SCHEDULE / AGENDA LIST */}
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
                    <div className={`p-3 rounded-xl ${style.bg} ${style.text} shrink-0 text-center min-w-[68px]`}>
                      <div className="text-[10px] uppercase font-bold tracking-wider">
                        {new Date(ev.date).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div className="text-lg font-black leading-none mt-0.5">
                        {new Date(ev.date).getDate()}
                      </div>
                      <div className="text-[9px] font-mono mt-1 opacity-80">
                        {new Date(ev.date).getFullYear()}
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

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-mono font-bold">
                            {ev.startTime ? `${ev.startTime} ${ev.endTime ? `– ${ev.endTime}` : ''}` : 'All Day'}
                          </span>
                        </div>

                        {ev.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{ev.location}</span>
                          </div>
                        )}

                        <div className="text-slate-400">
                          Date: {ev.date} {ev.endDate ? `to ${ev.endDate}` : ''}
                        </div>
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

      {/* VIEW 5: OFFICIAL ACADEMIC CALENDARS (2026 & 2027 PROJECTED) */}
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
    </div>
  );
};
