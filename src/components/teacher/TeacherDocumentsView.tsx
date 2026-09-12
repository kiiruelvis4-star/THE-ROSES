import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Eye, 
  Plus, 
  FileSpreadsheet, 
  BookOpen, 
  FileCheck, 
  Award, 
  Clock, 
  CheckCircle2, 
  File,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { TeacherDocumentItem, GradeLevel, TermName, SubjectName } from '../../types';
import { storage } from '../../services/storageService';

interface TeacherDocumentsViewProps {
  onOpenUploadModal: () => void;
  onOpenRawModal: () => void;
}

const GRADES: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
const TERMS: TermName[] = ['Term 1', 'Term 2', 'Term 3'];

export const TeacherDocumentsView: React.FC<TeacherDocumentsViewProps> = ({
  onOpenUploadModal,
  onOpenRawModal
}) => {
  const [documents, setDocuments] = useState<TeacherDocumentItem[]>(() => storage.getTeacherDocuments());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const [viewingRawDoc, setViewingRawDoc] = useState<TeacherDocumentItem | null>(null);

  // Sync when storage updates
  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setDocuments(storage.getTeacherDocuments());
    });
    return () => unsub();
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the document repository?`)) {
      storage.deleteTeacherDocument(id);
      setDocuments(storage.getTeacherDocuments());
    }
  };

  const handleDownload = (doc: TeacherDocumentItem) => {
    if (doc.fileDataUrl) {
      const link = document.createElement('a');
      link.href = doc.fileDataUrl;
      link.download = doc.fileName || `${doc.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (doc.rawText) {
      const blob = new Blob([doc.rawText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.fileName || doc.title}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert('This document contains metadata and notes only.');
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesGrade = selectedGrade === 'all' || doc.grade === selectedGrade;
    const matchesTerm = selectedTerm === 'all' || doc.term === selectedTerm;

    return matchesSearch && matchesCategory && matchesGrade && matchesTerm;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'scheme':
        return { label: 'Scheme of Work', bg: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900', icon: BookOpen };
      case 'lesson':
        return { label: 'Lesson Plan', bg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900', icon: FileCheck };
      case 'cat':
      case 'exam':
        return { label: 'CAT / Exam Paper', bg: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900', icon: Award };
      case 'record':
        return { label: 'Record of Work', bg: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900', icon: Clock };
      default:
        return { label: 'Teacher Document', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700', icon: FileText };
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-blue-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-800 text-blue-200 border border-blue-600/40">
                OFFICIAL TEACHER ARCHIVE
              </span>
              <span className="text-[10px] text-slate-300 font-mono">
                {documents.length} Stored Documents
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              Teacher Documents, Uploads & Raw Repository
            </h1>
            <p className="text-xs text-blue-200 max-w-2xl leading-relaxed">
              Centralized repository for all uploaded Schemes of Work, Lesson Plans, CAT & Exam Papers, Records of Work, and raw curriculum text.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={onOpenRawModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black transition-all border border-white/20"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Paste Raw Data</span>
            </button>
            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents by title, subject, file name, or teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Categories</option>
              <option value="scheme">Schemes of Work</option>
              <option value="lesson">Lesson Plans</option>
              <option value="cat">CATs & Exams</option>
              <option value="record">Records of Work</option>
              <option value="handout">Handouts & Notes</option>
            </select>

            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Grades</option>
              {GRADES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Terms</option>
              {TERMS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DOCUMENTS GRID */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              No Documents Match Your Filter
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Upload PDF or Word documents for schemes, lesson plans, CAT exam papers, or paste raw syllabus data.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document Now</span>
            </button>
            <button
              onClick={onOpenRawModal}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Paste Raw Data</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const badge = getCategoryBadge(doc.category);
            const BadgeIcon = badge.icon;
            const isRaw = !!doc.rawText && !doc.fileDataUrl;

            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${badge.bg}`}>
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>

                    <span className="text-[11px] font-bold text-slate-400">
                      {doc.grade} • {doc.term}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] font-bold text-blue-900 dark:text-blue-300 mt-0.5">
                      {doc.subject} {doc.week ? `• Week ${doc.week}` : ''}
                    </p>
                    {doc.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {doc.description}
                      </p>
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                        {doc.fileName}
                      </span>
                    </div>
                    <span className="text-slate-400 shrink-0 font-mono text-[10px]">
                      {doc.fileSize}
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block">
                      Uploaded by {doc.teacherName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {doc.uploadedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {doc.rawText && (
                      <button
                        onClick={() => setViewingRawDoc(doc)}
                        className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-xl transition-colors"
                        title="View Raw Content"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {(doc.fileDataUrl || doc.rawText) && (
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(doc.id, doc.title)}
                      className="p-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RAW TEXT VIEWER MODAL */}
      {viewingRawDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {viewingRawDoc.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {viewingRawDoc.grade} • {viewingRawDoc.subject} • {viewingRawDoc.term}
                </p>
              </div>
              <button
                onClick={() => setViewingRawDoc(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Close
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {viewingRawDoc.rawText}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleDownload(viewingRawDoc)}
                className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export as .txt File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
