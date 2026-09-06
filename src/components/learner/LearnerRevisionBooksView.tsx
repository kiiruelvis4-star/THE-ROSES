import React, { useState } from 'react';
import { Student, ResourceItem, STANDARD_SUBJECTS, SubjectName } from '../../types';
import { 
  BookOpen, 
  ArrowLeft, 
  Download, 
  Search, 
  FileText, 
  Sparkles, 
  GraduationCap 
} from 'lucide-react';

interface LearnerRevisionBooksViewProps {
  student: Student;
  resources: ResourceItem[];
  onBack: () => void;
}

export const LearnerRevisionBooksView: React.FC<LearnerRevisionBooksViewProps> = ({
  student,
  resources,
  onBack
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectName | 'All'>('All');
  const [search, setSearch] = useState('');

  const gradeResources = resources.filter(r => 
    r.grade === student.grade &&
    (selectedSubject === 'All' || r.subject === selectedSubject) &&
    (r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDownload = (title: string, size: string) => {
    alert(`Opening revision guide:\n"${title}" (${size})\nPublished by Little Roses Academy Academic Board.`);
  };

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
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <span>Revision Books & E-Library</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          CBC curriculum textbooks, model past papers, and study guides for {student.grade}.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search revision notes, textbooks, topic summaries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Subjects horizontal pill strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <button
            onClick={() => setSelectedSubject('All')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedSubject === 'All'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Subjects
          </button>
          {STANDARD_SUBJECTS.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedSubject === sub
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Revision Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gradeResources.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                    {item.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    {item.category}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-400">{item.fileSize}</span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{item.title}</span>
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Free Offline Access</span>
              <button
                onClick={() => handleDownload(item.title, item.fileSize)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Read / Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
