import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Save, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  Paperclip, 
  Sparkles,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';
import { GradeLevel, SubjectName } from '../../types';
import { getSubjectsForGrade } from '../../services/subjectOrder';
import { storage } from '../../services/storageService';

interface RawDataAndDocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  initialCategory?: 'scheme' | 'lesson' | 'exam' | 'raw_paste';
}

export const RawDataAndDocumentUploadModal: React.FC<RawDataAndDocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialCategory = 'scheme'
}) => {
  const [activeTab, setActiveTab] = useState<'upload_doc' | 'edit_raw'>('upload_doc');
  const [category, setCategory] = useState<'scheme' | 'lesson' | 'exam' | 'record'>(
    initialCategory === 'raw_paste' ? 'scheme' : initialCategory
  );
  const [grade, setGrade] = useState<GradeLevel>('Grade 1');
  const subjects = getSubjectsForGrade(grade);
  const [subject, setSubject] = useState<SubjectName>(subjects[0]);
  const [title, setTitle] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [week, setWeek] = useState('1');

  // File upload state
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string; dataUrl: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Raw text state
  const [rawText, setRawText] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        name: file.name,
        size: sizeFormatted,
        type: file.type || 'application/octet-stream',
        dataUrl: reader.result as string
      });
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && activeTab === 'upload_doc') {
      alert('Please choose a document to upload (.pdf, .docx, or image).');
      return;
    }
    if (!rawText.trim() && activeTab === 'edit_raw') {
      alert('Please enter or paste raw data.');
      return;
    }

    setIsUploading(true);

    try {
      if (activeTab === 'upload_doc' && selectedFile) {
        // Save as attached scheme or lesson or exam in storage
        if (category === 'scheme') {
          storage.saveScheme({
            id: `sch-${Date.now()}`,
            grade,
            subject,
            term: term as any,
            week: Number(week) || 1,
            lesson: 1,
            strand: title || `${subject} Unit`,
            subStrand: `Document: ${selectedFile.name}`,
            specificLearningOutcomes: 'CBC Learning Outcomes aligned with KICD standards.',
            keyInquiryQuestions: 'How do we demonstrate competencies in this strand?',
            learningResources: `Uploaded Document: ${selectedFile.name} (${selectedFile.size})`,
            assessmentMethods: 'Formative observation, oral inquiry, written assessment',
            reflectionRemarks: 'Document uploaded for term implementation.',
            attachments: [{ name: selectedFile.name, size: selectedFile.size, url: selectedFile.dataUrl }]
          });
        } else if (category === 'lesson') {
          storage.saveLessonPlan({
            id: `lp-${Date.now()}`,
            grade,
            subject,
            term: term as any,
            week: Number(week) || 1,
            lessonNumber: 1,
            date: new Date().toISOString().split('T')[0],
            durationMinutes: 35,
            strand: title || `${subject} Lesson Plan`,
            subStrand: `Uploaded File: ${selectedFile.name}`,
            coreCompetencies: ['Critical Thinking', 'Problem Solving', 'Communication'],
            values: ['Responsibility', 'Respect', 'Integrity'],
            introduction: 'Review of previous knowledge and introduction of key inquiry question.',
            lessonDevelopment: 'Step-by-step facilitation using uploaded curriculum document.',
            conclusion: 'Learner reflection and summary of lesson concepts.',
            attachments: [{ name: selectedFile.name, size: selectedFile.size, url: selectedFile.dataUrl }]
          });
        } else {
          // General document upload saved to raw schemes or exams
          storage.saveRawScheme(`DOCUMENT: ${selectedFile.name}\nCATEGORY: ${category.toUpperCase()}\nGRADE: ${grade}\nSUBJECT: ${subject}\nTITLE: ${title}\nDATE: ${new Date().toLocaleDateString()}`);
        }

        onSuccess(`Document "${selectedFile.name}" successfully uploaded and attached to ${grade} ${subject}!`);
      } else {
        // Raw text save
        storage.saveRawScheme(`[${category.toUpperCase()}] ${grade} - ${subject} (${term}, Week ${week})\nTitle: ${title}\n\n${rawText}`);
        onSuccess(`Raw data saved successfully for ${grade} ${subject}!`);
      }

      setIsUploading(false);
      onClose();
    } catch (err: any) {
      setIsUploading(false);
      alert(`Error saving: ${err?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/40 border border-blue-400/40 flex items-center justify-center text-white">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-heading tracking-tight">
                Upload Document & Edit Raw Data
              </h2>
              <p className="text-xs text-blue-200">
                Direct teacher upload for Schemes of Work, Lesson Plans & Exams
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload_doc')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'upload_doc'
                ? 'bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Paperclip className="w-4 h-4" />
            Upload File (.pdf, .docx, images)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('edit_raw')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'edit_raw'
                ? 'bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Direct Raw Text Editor
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveDocument} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Metadata selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                <option value="scheme">Scheme of Work</option>
                <option value="lesson">Lesson Plan</option>
                <option value="exam">Revision & Exam</option>
                <option value="record">Record of Work</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Grade Level
              </label>
              <select
                value={grade}
                onChange={(e) => {
                  const g = e.target.value as GradeLevel;
                  setGrade(g);
                  const newSubjects = getSubjectsForGrade(g);
                  setSubject(newSubjects[0]);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject ({grade.includes('1') || grade.includes('2') || grade.includes('3') ? 'Ordered' : 'Core'})
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectName)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document / Strand Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Numbers & Operations Term 1 or Term 1 Opening Exam"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Term & Week
              </label>
              <div className="flex gap-2">
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-1/2 px-2 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden"
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
                <select
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                  className="w-1/2 px-2 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden"
                >
                  {Array.from({ length: 14 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>Wk {i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Upload File Body */}
          {activeTab === 'upload_doc' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose Document to Upload
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50 dark:bg-slate-950/40">
                <input
                  type="file"
                  id="teacher-doc-upload"
                  accept=".pdf,.docx,.doc,.txt,.csv,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="teacher-doc-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline">
                      Click to browse
                    </span>
                    <span className="text-xs text-slate-500"> or drag and drop files</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports PDF, DOCX, DOC, CSV, PNG, JPG (up to 15MB)
                  </p>
                </label>
              </div>

              {selectedFile && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {selectedFile.size} • Ready to upload
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Edit Raw Text Body */}
          {activeTab === 'edit_raw' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Raw Data Content (Paste schemes, lesson notes, learning outcomes, or exam questions)
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your raw curriculum text here...
Strand: Numbers & Operations
Sub-strand: Whole Numbers up to 1000
Specific Learning Outcomes: By the end of the lesson, the learner should be able to...
Key Inquiry Question: Why is place value important in counting?
Learning Experiences: Learners in groups work with place value charts and abacus..."
                rows={8}
                className="w-full p-3.5 text-xs font-mono rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-950/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              {activeTab === 'upload_doc' ? 'Upload Document' : 'Save Raw Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
