import React, { useState } from 'react';
import { 
  ResourceItem, 
  GradeLevel, 
  SubjectName, 
  STANDARD_SUBJECTS 
} from '../../types';
import { 
  FolderOpen, 
  Plus, 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  ExternalLink, 
  FileCheck, 
  Sparkles, 
  BookOpen, 
  Film, 
  UploadCloud, 
  ShieldCheck, 
  Lock, 
  Copy, 
  Check, 
  X, 
  Eye, 
  KeyRound,
  FileCode2
} from 'lucide-react';
import { storage } from '../../services/storageService';

interface ResourcesManagerProps {
  resources: ResourceItem[];
  onOpenUploadModal: () => void;
}

const GRADES: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
const CATEGORIES = ['All', 'Textbook', 'Revision Paper', 'Teaching Aid', 'Lesson Notes', 'Video Guide'] as const;

export const ResourcesManager: React.FC<ResourcesManagerProps> = ({
  resources,
  onOpenUploadModal
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'All'>('All');
  const [selectedSubject, setSelectedSubject] = useState<SubjectName | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Permissions States
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => storage.isAdminAuthenticated());
  const [showAdminUnlockModal, setShowAdminUnlockModal] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminUnlockError, setAdminUnlockError] = useState<string | null>(null);

  // Markdown Reader Modal State
  const [activeReadingResource, setActiveReadingResource] = useState<ResourceItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = resources.filter(r => {
    const matchesGrade = selectedGrade === 'All' || r.grade === selectedGrade;
    const matchesSub = selectedSubject === 'All' || r.subject === selectedSubject;
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.markdownContent && r.markdownContent.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesSub && matchesCat && matchesSearch;
  });

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminUnlockError(null);
    if (storage.verifyAdminPassword(adminPasswordInput)) {
      storage.setAdminAuthenticated(true);
      setIsAdminUnlocked(true);
      setShowAdminUnlockModal(false);
      setAdminPasswordInput('');
    } else {
      setAdminUnlockError('Invalid Administrator Key. Please enter authorized admin credentials.');
    }
  };

  const handleUploadClick = () => {
    if (isAdminUnlocked) {
      onOpenUploadModal();
    } else {
      setShowAdminUnlockModal(true);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (!isAdminUnlocked) {
      setShowAdminUnlockModal(true);
      return;
    }
    if (confirm(`Remove official curriculum resource "${title}"?`)) {
      storage.deleteResource(id);
    }
  };

  const handleCopyMarkdown = (item: ResourceItem) => {
    const content = item.markdownContent || `# ${item.title}\n\n${item.description}\n\n- Grade: ${item.grade}\n- Subject: ${item.subject}`;
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handleDownload = (res: ResourceItem) => {
    if (res.pdfDataUrl) {
      const link = document.createElement('a');
      link.href = res.pdfDataUrl;
      link.download = res.fileName || `${res.title.replace(/\s+/g, '_')}.pdf`;
      link.click();
    } else if (res.markdownContent) {
      const blob = new Blob([res.markdownContent], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${res.title.replace(/\s+/g, '_')}.md`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      alert(`Downloading Little Roses Academy Resource:\n"${res.title}" (${res.fileSize})`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header with Permissions Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
              Curriculum Textbooks & Digital Resources
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-bold">
              v2.0.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Official CBC curriculum designs, PDF textbooks (≤50MB), and formatted AI Markdown lesson notes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Permissions Status Indicator */}
          {isAdminUnlocked ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin: WRITE Enabled</span>
            </span>
          ) : (
            <button
              onClick={() => setShowAdminUnlockModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors"
              title="Click to authenticate as Administrator"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Staff: READ-ONLY</span>
              <span className="text-[10px] underline font-normal ml-0.5">Unlock WRITE</span>
            </button>
          )}

          <button
            onClick={handleUploadClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Resource</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, markdown notes, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Grades (1 - 6)</option>
              {GRADES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Subjects</option>
              {STANDARD_SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category horizontal pill strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">No resources found</p>
          <p className="text-xs text-slate-500 mt-1">Upload official textbooks (.pdf ≤50MB) or create raw text AI notes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const isMarkdown = item.inputType === 'RAW_TEXT_AI_COPY' || Boolean(item.markdownContent);
            const isPdf = item.inputType === 'PDF_ATTACHMENT' || (!isMarkdown && item.fileType === 'pdf');

            return (
              <div
                key={item.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-xs">
                        {item.grade}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                        {item.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                        {item.category}
                      </span>

                      {/* Format Badge */}
                      {isMarkdown ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> RAW_TEXT_AI_COPY
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5" /> PDF_ATTACHMENT
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0">
                      {item.fileSize}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-3 flex items-center gap-2">
                    {isMarkdown ? (
                      <FileCode2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                    <span>{item.title}</span>
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>

                  {item.fileName && (
                    <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1">
                      <span>File:</span> <span className="text-slate-600 dark:text-slate-300 font-bold">{item.fileName}</span>
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs gap-2">
                  <span className="text-slate-400 text-[11px] shrink-0">Added: {item.uploadedAt}</span>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {isMarkdown ? (
                      <>
                        <button
                          onClick={() => setActiveReadingResource(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition-colors"
                          title="Read formatted markdown notes"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Read Notes</span>
                        </button>

                        <button
                          onClick={() => handleCopyMarkdown(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
                          title="Copy raw markdown content"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Markdown</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : null}

                    <button
                      onClick={() => handleDownload(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
                      title={isPdf ? 'Download PDF' : 'Download Resource'}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs transition-colors"
                      title="Delete Resource (Admin WRITE clearance required)"
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

      {/* Admin Unlock Modal for Resources WRITE Permissions */}
      {showAdminUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-700 to-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-extrabold text-base">Admin Clearance Required</h3>
                  <p className="text-xs text-amber-200">Textbooks & Curriculum Materials: WRITE Gate</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminUnlockModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminUnlock} className="p-6 space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold">Staff Role Constraint:</p>
                <p className="text-[11px] mt-0.5">
                  Teachers have READ-ONLY permission on official textbooks & resources. Enter Administrator master credentials to unlock WRITE privileges.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Administrator Key
                </label>
                <input
                  type="password"
                  autoFocus
                  value={adminPasswordInput}
                  onChange={(e) => {
                    setAdminPasswordInput(e.target.value);
                    setAdminUnlockError(null);
                  }}
                  placeholder="Enter administrator master key"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                />
                {adminUnlockError && (
                  <p className="text-xs text-rose-600 font-bold mt-1.5">{adminUnlockError}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminUnlockModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all"
                >
                  Unlock WRITE Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Markdown Notes Reader Modal */}
      {activeReadingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-300" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">{activeReadingResource.title}</h3>
                  <p className="text-xs text-indigo-200">
                    {activeReadingResource.grade} • {activeReadingResource.subject} • {activeReadingResource.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyMarkdown(activeReadingResource)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1"
                  title="Copy full markdown text"
                >
                  {copiedId === activeReadingResource.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === activeReadingResource.id ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setActiveReadingResource(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200">
                {activeReadingResource.markdownContent || activeReadingResource.description}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Format: Markdown • RAW_TEXT_AI_COPY</span>
              <button
                onClick={() => setActiveReadingResource(null)}
                className="px-4 py-1.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
