import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Mail, 
  GraduationCap, 
  Users, 
  Briefcase, 
  CreditCard, 
  Megaphone, 
  FileCode, 
  Archive, 
  Search, 
  Plus, 
  Settings, 
  ArrowRight, 
  Eye, 
  Printer, 
  Sparkles,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { 
  DocumentCategory, 
  DocumentTemplate, 
  SavedDocument, 
  DocumentSettings 
} from './DocumentTypes';
import { 
  DOCUMENT_CATEGORIES, 
  INITIAL_DOCUMENT_TEMPLATES, 
  DEFAULT_DOCUMENT_SETTINGS 
} from './documentTemplatesData';
import { Student, StaffMember, SystemConfig } from '../../../types';
import { DocumentCreator } from './DocumentCreator';
import { DocumentHistoryView } from './DocumentHistoryView';
import { DocumentSettingsModal } from './DocumentSettingsModal';
import { DocumentViewerA4 } from './DocumentViewerA4';

interface DocumentCentreProps {
  students: Student[];
  staffList: StaffMember[];
  systemConfig: SystemConfig;
}

const STORAGE_KEY_DOCS = 'littleroses_saved_documents';
const STORAGE_KEY_SETTINGS = 'littleroses_document_settings';

export const DocumentCentre: React.FC<DocumentCentreProps> = ({
  students,
  staffList,
  systemConfig
}) => {
  // State
  const [activeTab, setActiveTab] = useState<DocumentCategory | 'history'>('official-letters');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [activeDocument, setActiveDocument] = useState<SavedDocument | null>(null);
  const [quickPreviewTemplate, setQuickPreviewTemplate] = useState<DocumentTemplate | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Persistence: Saved Documents
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DOCS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored documents', e);
    }

    // Seed with a few initial institutional documents for demonstration
    return [
      {
        id: 'doc_init_001',
        title: 'Admission Letter',
        category: 'official-letters',
        templateId: 'admission-letter',
        referenceNumber: 'LRA/ADM/2026/089',
        date: '2026-01-08',
        targetId: students[0]?.id || '1',
        targetName: students[0]?.name || 'Faith Achieng',
        targetGrade: students[0]?.grade || 'Grade 4',
        targetType: 'student',
        createdBy: 'Mr. Kelvin Kiiru',
        status: 'signed',
        subject: 'OFFER OF ADMISSION AND ENROLLMENT PLACEMENT',
        recipientName: `To Parent/Guardian of ${students[0]?.name || 'Faith Achieng'}`,
        recipientTitle: `Class / Grade: ${students[0]?.grade || 'Grade 4'}`,
        bodyText: `Following your application and review by the Admissions Board of Little Roses Academy, we are pleased to confirm formal admission for the 2026 Academic Year.`,
        customData: {},
        headTeacherName: 'Mr. Kelvin Kiiru',
        headTeacherTitle: 'Headteacher / Principal',
        includeStamp: true,
        includeSignature: true,
        watermark: 'LITTLE ROSES ACADEMY',
        createdAt: '2026-01-08T08:30:00Z',
        updatedAt: '2026-01-08T08:30:00Z'
      },
      {
        id: 'doc_init_002',
        title: 'Student Report Card',
        category: 'academic-documents',
        templateId: 'student-report-card',
        referenceNumber: 'LRA/REP/2026/092',
        date: '2026-08-04',
        targetId: students[1]?.id || '2',
        targetName: students[1]?.name || 'Austin Otieno',
        targetGrade: students[1]?.grade || 'Grade 4',
        targetType: 'student',
        createdBy: 'Mr. Kelvin Kiiru',
        status: 'generated',
        subject: 'CBC SUMMATIVE & FORMATIVE LEARNER REPORT CARD',
        recipientName: `Parent of ${students[1]?.name || 'Austin Otieno'}`,
        bodyText: `Term 2 comprehensive evaluation of CBC rationalized learning areas and co-curricular achievements.`,
        customData: {},
        headTeacherName: 'Mr. Kelvin Kiiru',
        headTeacherTitle: 'Headteacher / Principal',
        includeStamp: true,
        includeSignature: true,
        watermark: 'OFFICIAL RECORD',
        createdAt: '2026-08-04T10:15:00Z',
        updatedAt: '2026-08-04T10:15:00Z'
      }
    ];
  });

  // Persistence: Settings
  const [docSettings, setDocSettings] = useState<DocumentSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return {
      ...DEFAULT_DOCUMENT_SETTINGS,
      defaultHeadTeacherName: systemConfig.school_metadata.head_teacher_name || DEFAULT_DOCUMENT_SETTINGS.defaultHeadTeacherName,
      schoolPhone: systemConfig.school_metadata.phone || DEFAULT_DOCUMENT_SETTINGS.schoolPhone,
      schoolEmail: systemConfig.school_metadata.email || DEFAULT_DOCUMENT_SETTINGS.schoolEmail,
      schoolCode: systemConfig.school_metadata.school_code_number || DEFAULT_DOCUMENT_SETTINGS.schoolCode
    };
  });

  // Save documents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(savedDocuments));
    } catch (e) {
      console.error('Error saving documents to local storage', e);
    }
  }, [savedDocuments]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(docSettings));
    } catch (e) {
      console.error('Error saving document settings to local storage', e);
    }
  }, [docSettings]);

  // Save a new or edited document
  const handleSaveDocument = (doc: SavedDocument) => {
    setSavedDocuments(prev => {
      const exists = prev.some(item => item.id === doc.id);
      if (exists) {
        return prev.map(item => (item.id === doc.id ? doc : item));
      }
      return [doc, ...prev];
    });

    // Increment next sequence counter
    setDocSettings(prev => ({
      ...prev,
      nextSequence: prev.nextSequence + 1
    }));
  };

  // Delete document
  const handleDeleteDocument = (docId: string) => {
    setSavedDocuments(prev => prev.filter(d => d.id !== docId));
  };

  // Open Document from History
  const handleOpenArchivedDocument = (doc: SavedDocument) => {
    const template = INITIAL_DOCUMENT_TEMPLATES.find(t => t.id === doc.templateId) || {
      id: doc.templateId,
      title: doc.title,
      category: doc.category,
      description: doc.title,
      defaultSubject: doc.subject,
      referencePrefix: doc.referenceNumber.split('/')[1] || 'DOC',
      targetType: doc.targetType,
      layout: 'letter',
      defaultBody: doc.bodyText
    };
    setSelectedTemplate(template);
    setActiveDocument(doc);
  };

  // Quick Print Document directly
  const handlePrintDocument = (doc: SavedDocument) => {
    const template = INITIAL_DOCUMENT_TEMPLATES.find(t => t.id === doc.templateId);
    setSelectedTemplate(template || null);
    setActiveDocument(doc);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Filter templates
  const currentCategoryTemplates = INITIAL_DOCUMENT_TEMPLATES.filter(
    t => t.category === activeTab
  );

  const searchedTemplates = searchQuery.trim()
    ? INITIAL_DOCUMENT_TEMPLATES.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.referencePrefix.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentCategoryTemplates;

  // Icon selector helper
  const getCategoryIcon = (id: DocumentCategory) => {
    switch (id) {
      case 'official-letters': return <Mail className="w-4 h-4" />;
      case 'academic-documents': return <GraduationCap className="w-4 h-4" />;
      case 'student-documents': return <Users className="w-4 h-4" />;
      case 'staff-documents': return <Briefcase className="w-4 h-4" />;
      case 'finance-documents': return <CreditCard className="w-4 h-4" />;
      case 'school-communication': return <Megaphone className="w-4 h-4" />;
      case 'forms-templates': return <FileCode className="w-4 h-4" />;
    }
  };

  // If Creator Mode is active, render the full Document Creator component
  if (selectedTemplate) {
    return (
      <DocumentCreator
        template={selectedTemplate}
        students={students}
        staffList={staffList}
        systemConfig={systemConfig}
        documentSettings={docSettings}
        initialDocument={activeDocument}
        onBack={() => {
          setSelectedTemplate(null);
          setActiveDocument(null);
        }}
        onSaveDocument={handleSaveDocument}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 rounded-3xl text-white shadow-xl border border-emerald-800/50">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Institutional Document Management System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              Document Centre
            </h1>
            <p className="text-sm text-emerald-100/80 leading-relaxed font-normal">
              Official school letterheads, academic reports, learner admission dossiers, staff contracts, and financial receipts for Little Roses Academy.
            </p>
          </div>

          {/* Quick Metrics & Settings Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all backdrop-blur-sm cursor-pointer"
              title="Configure Document Numbering & Signatories"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Document Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
            >
              <Archive className="w-4 h-4" />
              <span>Archived Documents ({savedDocuments.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative Watermark Emblem in Background */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none select-none">
          <GraduationCap className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DOCUMENT_CATEGORIES.map(cat => {
          const isActive = activeTab === cat.id;
          const count = INITIAL_DOCUMENT_TEMPLATES.filter(t => t.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-900 text-white shadow-md shadow-emerald-950/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.name}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}

        {/* Document History Tab */}
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-emerald-900 text-white shadow-md shadow-emerald-950/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>Archives & History</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
            activeTab === 'history' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}>
            {savedDocuments.length}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'history' ? (
        <DocumentHistoryView
          documents={savedDocuments}
          onOpenDocument={handleOpenArchivedDocument}
          onDeleteDocument={handleDeleteDocument}
          onPrintDocument={handlePrintDocument}
        />
      ) : (
        <div className="space-y-6">
          {/* Category Search & Description */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base font-heading">
                {DOCUMENT_CATEGORIES.find(c => c.id === activeTab)?.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {DOCUMENT_CATEGORIES.find(c => c.id === activeTab)?.description}
              </p>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search templates in category..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {searchedTemplates.map(tpl => (
              <div
                key={tpl.id}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Tags */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {tpl.referencePrefix}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                      Target: {tpl.targetType}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {tpl.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setQuickPreviewTemplate(tpl)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick Preview</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTemplate(tpl);
                      setActiveDocument(null);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition-all group-hover:scale-102 cursor-pointer"
                  >
                    <span>Create</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Preview Modal */}
      {quickPreviewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn overflow-y-auto">
          <div className="bg-slate-100 dark:bg-slate-950 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Template Preview: {quickPreviewTemplate.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Official Little Roses Academy Institutional Template • Layout: {quickPreviewTemplate.layout}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const tpl = quickPreviewTemplate;
                    setQuickPreviewTemplate(null);
                    setSelectedTemplate(tpl);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Use This Template</span>
                </button>
                <button
                  onClick={() => setQuickPreviewTemplate(null)}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* A4 Sheet Container */}
            <div className="max-h-[70vh] overflow-y-auto p-4 flex justify-center bg-slate-200/60 dark:bg-slate-900 rounded-2xl">
              <DocumentViewerA4
                documentData={{
                  title: quickPreviewTemplate.title,
                  category: quickPreviewTemplate.category,
                  referenceNumber: `${quickPreviewTemplate.referencePrefix}/2026/001`,
                  subject: quickPreviewTemplate.defaultSubject,
                  bodyText: quickPreviewTemplate.defaultBody,
                  date: new Date().toLocaleDateString('en-GB'),
                  headTeacherName: docSettings.defaultHeadTeacherName,
                  headTeacherTitle: docSettings.defaultHeadTeacherTitle,
                  includeStamp: docSettings.showDigitalStamp,
                  includeSignature: docSettings.showDigitalSignature
                }}
                template={quickPreviewTemplate}
                student={students[0]}
                staff={staffList[0]}
                systemConfig={systemConfig}
              />
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <DocumentSettingsModal
        settings={docSettings}
        systemConfig={systemConfig}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={setDocSettings}
      />
    </div>
  );
};
