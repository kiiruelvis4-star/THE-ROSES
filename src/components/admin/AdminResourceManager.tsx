import React, { useState, useEffect } from 'react';
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
  UploadCloud, 
  ShieldCheck, 
  Copy, 
  Check, 
  X, 
  Eye, 
  Edit3, 
  RefreshCw,
  Globe,
  File,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Calendar,
  Lock,
  FileUp
} from 'lucide-react';
import { 
  UnifiedResource, 
  UnifiedResourceType, 
  UNIFIED_RESOURCE_TYPES, 
  GradeLevel, 
  SubjectName, 
  TermName,
  STANDARD_SUBJECTS 
} from '../../types';
import { storage } from '../../services/storageService';
import { supabaseSync, SyncResult } from '../../services/supabaseSyncService';

const GRADES: (GradeLevel | 'All Grades')[] = ['All Grades', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
const TERMS: (TermName | 'All Terms')[] = ['All Terms', 'Term 1', 'Term 2', 'Term 3'];

export const AdminResourceManager: React.FC = () => {
  const [resources, setResources] = useState<UnifiedResource[]>(() => storage.getUnifiedResources());
  const [selectedType, setSelectedType] = useState<UnifiedResourceType | 'All'>('All');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'All Grades'>('All Grades');
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [selectedTerm, setSelectedTerm] = useState<TermName | 'All Terms'>('All Terms');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Published' | 'Draft'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<UnifiedResource | null>(null);
  const [readingItem, setReadingItem] = useState<UnifiedResource | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<UnifiedResourceType>('Schemes of Work');
  const [formGrade, setFormGrade] = useState<GradeLevel | 'All Grades'>('Grade 6');
  const [formSubject, setFormSubject] = useState<SubjectName | 'All Subjects'>('Mathematics');
  const [formTerm, setFormTerm] = useState<TermName>('Term 1');
  const [formDescription, setFormDescription] = useState('');
  const [formInputType, setFormInputType] = useState<'FILE' | 'RAW_TEXT'>('RAW_TEXT');
  const [formFileName, setFormFileName] = useState('');
  const [formFileSize, setFormFileSize] = useState('');
  const [formFileType, setFormFileType] = useState<'pdf' | 'doc' | 'docx' | 'image' | 'other'>('pdf');
  const [formFileDataUrl, setFormFileDataUrl] = useState('');
  const [formRawText, setFormRawText] = useState('');
  const [formPublished, setFormPublished] = useState<boolean>(true);
  const [selectedPhysicalFile, setSelectedPhysicalFile] = useState<File | null>(null);

  // Subscribe to reactive updates
  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setResources(storage.getUnifiedResources());
    });
    return () => unsub();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormType('Schemes of Work');
    setFormGrade('Grade 6');
    setFormSubject('Mathematics');
    setFormTerm('Term 1');
    setFormDescription('');
    setFormInputType('RAW_TEXT');
    setFormFileName('');
    setFormFileSize('');
    setFormFileType('pdf');
    setFormFileDataUrl('');
    setFormRawText('');
    setFormPublished(true);
    setSelectedPhysicalFile(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (item: UnifiedResource) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormType(item.resourceType);
    setFormGrade(item.grade);
    setFormSubject(item.subject);
    setFormTerm(item.term || 'Term 1');
    setFormDescription(item.description || '');
    setFormInputType(item.inputType);
    setFormFileName(item.fileName || '');
    setFormFileSize(item.fileSize || '');
    setFormFileType(item.fileType || 'pdf');
    setFormFileDataUrl(item.fileDataUrl || '');
    setFormRawText(item.rawTextContent || '');
    setFormPublished(item.published);
    setSelectedPhysicalFile(null);
    setIsEditorOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedPhysicalFile(file);
    setFormFileName(file.name);
    setFormFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') setFormFileType('pdf');
    else if (ext === 'doc' || ext === 'docx') setFormFileType('docx');
    else if (['png', 'jpg', 'jpeg'].includes(ext || '')) setFormFileType('image');
    else setFormFileType('other');

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      setFormFileDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const resourceToSave: UnifiedResource = {
      id: editingItem ? editingItem.id : `res-${Date.now()}`,
      title: formTitle.trim(),
      resourceType: formType,
      grade: formGrade,
      subject: formSubject,
      term: formTerm,
      description: formDescription.trim(),
      inputType: formInputType,
      fileName: formInputType === 'FILE' ? formFileName : undefined,
      fileSize: formInputType === 'FILE' ? formFileSize : undefined,
      fileType: formInputType === 'FILE' ? formFileType : undefined,
      fileDataUrl: formInputType === 'FILE' ? formFileDataUrl : undefined,
      storagePath: editingItem?.storagePath,
      rawTextContent: formInputType === 'RAW_TEXT' ? formRawText : undefined,
      published: formPublished,
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorName: 'School Administrator',
      authorRole: 'ADMIN',
      version: editingItem ? (editingItem.version || 1) + 1 : 1
    };

    setIsSyncing(true);
    const result = await supabaseSync.saveResource(resourceToSave, selectedPhysicalFile || undefined);
    setIsSyncing(false);
    setSelectedPhysicalFile(null);
    setSyncNotice(result.message);
    setTimeout(() => setSyncNotice(null), 4000);

    setResources(storage.getUnifiedResources());
    setIsEditorOpen(false);
  };

  const handleDelete = async (id: string) => {
    const result = await supabaseSync.deleteResource(id);
    setResources(storage.getUnifiedResources());
    setDeleteConfirmationId(null);
    setSyncNotice(result.message || 'Resource removed.');
    setTimeout(() => setSyncNotice(null), 3000);
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await supabaseSync.togglePublishResource(id, !current);
    setResources(storage.getUnifiedResources());
    setSyncNotice(current ? 'Resource set to Draft (hidden from teachers)' : 'Resource Published to teachers!');
    setTimeout(() => setSyncNotice(null), 3000);
  };

  const handleSyncCloud = async () => {
    setIsSyncing(true);
    const cloudItems = await supabaseSync.fetchAdminResources();
    setResources(cloudItems);
    setIsSyncing(false);
    setSyncNotice('Cloud synchronization complete!');
    setTimeout(() => setSyncNotice(null), 3000);
  };

  // Filtered resources
  const filtered = resources.filter(r => {
    const matchesType = selectedType === 'All' || r.resourceType === selectedType;
    const matchesGrade = selectedGrade === 'All Grades' || r.grade === selectedGrade;
    const matchesSub = selectedSubject === 'All Subjects' || r.subject === selectedSubject;
    const matchesTerm = selectedTerm === 'All Terms' || r.term === selectedTerm;
    const matchesStatus = selectedStatus === 'All' || 
      (selectedStatus === 'Published' && r.published) || 
      (selectedStatus === 'Draft' && !r.published);
    
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      r.title.toLowerCase().includes(q) || 
      r.description.toLowerCase().includes(q) || 
      (r.rawTextContent && r.rawTextContent.toLowerCase().includes(q)) ||
      (r.fileName && r.fileName.toLowerCase().includes(q));

    return matchesType && matchesGrade && matchesSub && matchesTerm && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header with Metrics & Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                Unified Resource Control
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Admin Central Hub
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Teacher Resources Management
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 max-w-2xl">
              Add, edit, publish, or upload PDF files and raw text materials. All resources are synchronized to the Supabase Cloud and cached locally for 100% offline teacher access.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleSyncCloud}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Sync with Supabase Cloud"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>

            <button
              id="admin-add-resource-btn"
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Resource</span>
            </button>
          </div>
        </div>

        {/* Sync feedback notification */}
        {syncNotice && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncNotice}</span>
          </div>
        )}

        {/* Resource Type Tabs Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-5 border-t border-slate-100 dark:border-slate-800 pt-4 scrollbar-none">
          <button
            onClick={() => setSelectedType('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedType === 'All'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Types ({resources.length})
          </button>
          {UNIFIED_RESOURCE_TYPES.map(type => {
            const count = resources.filter(r => r.resourceType === type).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedType === type
                    ? 'bg-emerald-700 text-white shadow-sm'
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

      {/* Secondary Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, keywords or content..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Grade */}
        <div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as any)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
          >
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Term */}
        <div>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value as any)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
          >
            {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Status */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="All">All Status (Published & Draft)</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only (Unpublished)</option>
          </select>
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              item.published
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                : 'bg-slate-50/70 dark:bg-slate-900/50 border-dashed border-amber-300 dark:border-amber-800'
            }`}
          >
            <div>
              {/* Card Meta Badges */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    {item.resourceType}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.grade}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    {item.subject}
                  </span>
                  {item.term && (
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      • {item.term}
                    </span>
                  )}
                </div>

                {/* Published Status Pill */}
                <button
                  onClick={() => handleTogglePublish(item.id, item.published)}
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all ${
                    item.published
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-200'
                  }`}
                  title="Click to toggle publish/unpublish"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${item.published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>{item.published ? 'Published' : 'Draft / Unpublished'}</span>
                </button>
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

              {/* Format indicator */}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {item.inputType === 'FILE' ? (
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                    <File className="w-3.5 h-3.5" />
                    <span>File: {item.fileName || 'Uploaded Document'}</span>
                    {item.fileSize && <span className="text-slate-400">({item.fileSize})</span>}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Raw Text Document</span>
                    <span className="text-slate-400">({item.rawTextContent?.length || 0} chars)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                {item.inputType === 'RAW_TEXT' ? (
                  <button
                    onClick={() => setReadingItem(item)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Read</span>
                  </button>
                ) : (
                  <a
                    href={item.fileDataUrl || '#'}
                    download={item.fileName || 'resource'}
                    className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Download</span>
                  </a>
                )}

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit</span>
                </button>
              </div>

              <div>
                {deleteConfirmationId === item.id ? (
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-rose-600 font-bold">Confirm?</span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[11px] font-bold"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmationId(null)}
                      className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md text-[11px]"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmationId(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="md:col-span-2 p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <FolderOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No resources found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Adjust your filters or click "Add New Resource" to create one.
            </p>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* RESOURCE EDITOR MODAL (ADD / EDIT)                    */}
      {/* ==================================================== */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="bg-[#172554] p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  Admin Central Control
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  {editingItem ? 'Edit Curriculum Resource' : 'Add New Teacher Resource'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveResource} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Grade 6 Mathematics Term 1 Schemes of Work"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Resource Type & Grade Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Resource Type *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as UnifiedResourceType)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {UNIFIED_RESOURCE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Grade Level *
                  </label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject & Term Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject Area
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="All Subjects">All Subjects</option>
                    {STANDARD_SUBJECTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Term / Period
                  </label>
                  <select
                    value={formTerm}
                    onChange={(e) => setFormTerm(e.target.value as TermName)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Summary / Instructions for Teachers
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short description, syllabus objectives, or teacher usage notes..."
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>

              {/* Input Mode Selector: FILE vs RAW TEXT */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Content Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormInputType('RAW_TEXT')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      formInputType === 'RAW_TEXT'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Raw Text / Document</div>
                      <div className="text-[10px] text-slate-500">Paste text, tables & notes directly</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormInputType('FILE')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      formInputType === 'FILE'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-950 dark:text-blue-100 ring-1 ring-blue-600'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <FileUp className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Upload PDF / Document</div>
                      <div className="text-[10px] text-slate-500">Attach PDF, Word doc or sheet</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Content Inputs */}
              {formInputType === 'RAW_TEXT' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Text / Document Body (Markdown supported)
                  </label>
                  <textarea
                    rows={8}
                    required={formInputType === 'RAW_TEXT'}
                    value={formRawText}
                    onChange={(e) => setFormRawText(e.target.value)}
                    placeholder="Type or paste formatted scheme, lesson plan, teacher revision notes, assessment questions or timetable..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                  />
                </div>
              ) : (
                <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-2">
                  <input
                    type="file"
                    id="file-upload-input"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload-input"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Choose File (PDF, DOC, DOCX)</span>
                  </label>

                  {formFileName ? (
                    <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ Attached: {formFileName} ({formFileSize})
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      Supports official PDF curriculum guides, mock papers, and printable notes up to 15MB.
                    </p>
                  )}
                </div>
              )}

              {/* Published Toggle */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Publish to Teacher Portal
                  </span>
                  <p className="text-[11px] text-slate-500">
                    If unchecked, this resource remains a Draft visible only to Administrators.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSyncing ? 'Saving & Syncing...' : 'Save & Publish Resource'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* FULL DOCUMENT READER MODAL                           */}
      {/* ==================================================== */}
      {readingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
            <div className="bg-[#172554] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  {readingItem.resourceType} • {readingItem.grade}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  {readingItem.title}
                </h3>
              </div>
              <button
                onClick={() => setReadingItem(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 font-sans text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                {readingItem.rawTextContent}
              </pre>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Published by {readingItem.authorName} ({new Date(readingItem.updatedAt).toLocaleDateString()})
              </span>
              <button
                onClick={() => setReadingItem(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl text-xs font-bold"
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
