import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  FileText, 
  Download, 
  Search, 
  Sparkles, 
  BookOpen, 
  Eye, 
  RefreshCw,
  File,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Copy,
  Check,
  X,
  Layers,
  Filter
} from 'lucide-react';
import { 
  UnifiedResource, 
  UnifiedResourceType, 
  UNIFIED_RESOURCE_TYPES, 
  GradeLevel, 
  TeacherProfile,
  STANDARD_SUBJECTS 
} from '../../types';
import { storage } from '../../services/storageService';
import { supabaseSync, SyncResult } from '../../services/supabaseSyncService';

interface TeacherResourcesViewProps {
  teacher: TeacherProfile;
}

const GRADES: (GradeLevel | 'All Grades')[] = ['All Grades', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

export const TeacherResourcesView: React.FC<TeacherResourcesViewProps> = ({ teacher }) => {
  const [resources, setResources] = useState<UnifiedResource[]>(() => {
    return storage.getUnifiedResources().filter(r => r.published);
  });

  const [selectedType, setSelectedType] = useState<UnifiedResourceType | 'All'>('All');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'All Grades'>('All Grades');
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync & Viewer states
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncResult | null>(null);
  const [activeReadingItem, setActiveReadingItem] = useState<UnifiedResource | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Sync on mount and subscribe to updates
  useEffect(() => {
    // Subscribe to storage changes
    const unsubStorage = storage.subscribe(() => {
      setResources(storage.getUnifiedResources().filter(r => r.published));
    });

    // Subscribe to Supabase sync notifications
    const unsubSync = supabaseSync.subscribe((res) => {
      setSyncStatus(res);
      setResources(storage.getUnifiedResources().filter(r => r.published));
    });

    // Run initial background sync
    handleSync();

    return () => {
      unsubStorage();
      unsubSync();
    };
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await supabaseSync.syncTeacherResources();
      setSyncStatus(res);
      setResources(storage.getUnifiedResources().filter(r => r.published));
    } catch (err) {
      console.warn('Sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyContent = () => {
    if (activeReadingItem?.rawTextContent) {
      navigator.clipboard.writeText(activeReadingItem.rawTextContent);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handlePrintDocument = () => {
    window.print();
  };

  // Filtered resources
  const filtered = resources.filter(r => {
    const matchesType = selectedType === 'All' || r.resourceType === selectedType;
    const matchesGrade = selectedGrade === 'All Grades' || r.grade === selectedGrade || r.grade === 'All Grades';
    const matchesSub = selectedSubject === 'All Subjects' || r.subject === selectedSubject || r.subject === 'All Subjects';
    
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      r.title.toLowerCase().includes(q) || 
      r.description.toLowerCase().includes(q) || 
      (r.rawTextContent && r.rawTextContent.toLowerCase().includes(q));

    return matchesType && matchesGrade && matchesSub && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Top Banner & Cloud Sync Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-2.5 py-0.5 rounded-full">
                Curriculum Resources
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Official Little Roses Academy Portal
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Teacher Resources
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Access official Schemes of Work, Lesson Plans, Teacher Notes, CATs, Assignments, Exams, and Timetables approved by Administration.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Sync Status Badge */}
            <div className="text-right hidden sm:block">
              <div className="text-[10px] uppercase font-bold text-slate-400">Cloud Sync Status</div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{syncStatus ? syncStatus.message : 'Offline Cache Active'}</span>
              </div>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Refresh and pull updates from Cloud"
            >
              <RefreshCw className={`w-4 h-4 text-blue-600 dark:text-blue-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Checking...' : 'Check for Updates'}</span>
            </button>
          </div>
        </div>

        {/* 8 Required Resource Type Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-5 border-t border-slate-100 dark:border-slate-800 pt-4 scrollbar-none">
          <button
            onClick={() => setSelectedType('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedType === 'All'
                ? 'bg-[#172554] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Resources ({resources.length})
          </button>
          {UNIFIED_RESOURCE_TYPES.map(type => {
            const count = resources.filter(r => r.resourceType === type).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedType === type
                    ? 'bg-[#172554] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{type}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedType === type ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grade, Subject & Search Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources, topics, or materials..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Grade Filter */}
        <div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as any)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
          >
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="All Subjects">All Subjects</option>
            {STANDARD_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    {item.resourceType}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.grade}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    {item.subject}
                  </span>
                </div>

                {item.term && (
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                    {item.term}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* File / Text Format Indicator */}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {item.inputType === 'FILE' ? (
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                    <File className="w-3.5 h-3.5" />
                    <span>{item.fileName || 'Attached Curriculum Document'}</span>
                    {item.fileSize && <span className="text-slate-400">({item.fileSize})</span>}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Readable Syllabus Document</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                Admin Approved • Ready Offline
              </span>

              <div>
                {item.inputType === 'RAW_TEXT' ? (
                  <button
                    onClick={() => setActiveReadingItem(item)}
                    className="px-3.5 py-1.5 bg-[#172554] hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read Document</span>
                  </button>
                ) : (
                  <a
                    href={item.fileDataUrl || '#'}
                    download={item.fileName || 'Little_Roses_Resource.pdf'}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="md:col-span-2 p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <FolderOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No resources in this category</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select another resource type or click "Check for Updates" to sync newly added materials.
            </p>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* FULL DOCUMENT READER MODAL FOR TEACHERS              */}
      {/* ==================================================== */}
      {activeReadingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#172554] p-5 text-white flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full">
                    {activeReadingItem.resourceType}
                  </span>
                  <span className="text-xs text-blue-200 font-medium">
                    {activeReadingItem.grade} • {activeReadingItem.subject}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  {activeReadingItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveReadingItem(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-800 dark:text-slate-200">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed">
                  {activeReadingItem.rawTextContent}
                </pre>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyContent}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied to Clipboard' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={handlePrintDocument}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
              </div>

              <button
                onClick={() => setActiveReadingItem(null)}
                className="px-4 py-2 bg-[#172554] text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
