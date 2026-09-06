import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Share2, 
  Save, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  FileText, 
  User, 
  Sparkles, 
  Stamp, 
  Calendar, 
  Hash, 
  ShieldCheck,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { DocumentTemplate, SavedDocument, DocumentSettings } from './DocumentTypes';
import { Student, StaffMember, SystemConfig } from '../../../types';
import { DocumentViewerA4 } from './DocumentViewerA4';

interface DocumentCreatorProps {
  template: DocumentTemplate;
  students: Student[];
  staffList: StaffMember[];
  systemConfig: SystemConfig;
  documentSettings: DocumentSettings;
  initialDocument?: SavedDocument | null;
  onBack: () => void;
  onSaveDocument: (doc: SavedDocument) => void;
}

export const DocumentCreator: React.FC<DocumentCreatorProps> = ({
  template,
  students,
  staffList,
  systemConfig,
  documentSettings,
  initialDocument,
  onBack,
  onSaveDocument
}) => {
  // Mode: split (side-by-side on desktop), form-only, preview-only
  const [activeViewMode, setActiveViewMode] = useState<'split' | 'form' | 'preview'>('split');

  // Selected targets
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialDocument?.targetId || (students.length > 0 ? students[0].id : '')
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    initialDocument?.targetId || (staffList.length > 0 ? staffList[0].id : '')
  );

  // Auto-generate reference number
  const generateRef = () => {
    const year = systemConfig.active_academic_year || 2026;
    const prefix = documentSettings.numberingPrefix || 'LRA';
    const dept = template.referencePrefix ? template.referencePrefix.replace(`${prefix}/`, '') : 'DOC';
    const seq = String(documentSettings.nextSequence).padStart(3, '0');
    return `${prefix}/${dept}/${year}/${seq}`;
  };

  // Form Fields State
  const [docRef, setDocRef] = useState<string>(
    initialDocument?.referenceNumber || generateRef()
  );
  const [docDate, setDocDate] = useState<string>(
    initialDocument?.date || new Date().toISOString().split('T')[0]
  );
  const [subject, setSubject] = useState<string>(
    initialDocument?.subject || template.defaultSubject
  );
  const [recipientName, setRecipientName] = useState<string>(
    initialDocument?.recipientName || ''
  );
  const [recipientTitle, setRecipientTitle] = useState<string>(
    initialDocument?.recipientTitle || ''
  );
  const [recipientAddress, setRecipientAddress] = useState<string>(
    initialDocument?.recipientAddress || ''
  );
  const [bodyText, setBodyText] = useState<string>(
    initialDocument?.bodyText || template.defaultBody
  );
  const [headTeacherName, setHeadTeacherName] = useState<string>(
    initialDocument?.headTeacherName || systemConfig.school_metadata.head_teacher_name || documentSettings.defaultHeadTeacherName || 'Mr. Kelvin Kiiru'
  );
  const [headTeacherTitle, setHeadTeacherTitle] = useState<string>(
    initialDocument?.headTeacherTitle || documentSettings.defaultHeadTeacherTitle || 'Headteacher / Principal'
  );
  const [includeStamp, setIncludeStamp] = useState<boolean>(
    initialDocument?.includeStamp ?? documentSettings.showDigitalStamp
  );
  const [includeSignature, setIncludeSignature] = useState<boolean>(
    initialDocument?.includeSignature ?? documentSettings.showDigitalSignature
  );
  const [watermark, setWatermark] = useState<string>(
    initialDocument?.watermark || documentSettings.watermarkText || ''
  );

  // Custom data for dynamic inputs
  const [customData, setCustomData] = useState<Record<string, any>>(
    initialDocument?.customData || {}
  );

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  // Resolve target objects
  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const selectedStaff = staffList.find(s => s.id === selectedStaffId);

  // Auto-populate recipient details when target changes
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const target = students.find(s => s.id === studentId);
    if (target) {
      if (template.category === 'official-letters') {
        setRecipientName(`To Parent/Guardian of ${target.name}`);
        setRecipientTitle(`Class / Grade: ${target.grade}`);
        setRecipientAddress(`${systemConfig.school_metadata.school_name}, Nakuru`);
      }
    }
  };

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaffId(staffId);
    const target = staffList.find(s => s.id === staffId);
    if (target) {
      setRecipientName(target.name);
      setRecipientTitle(`${target.role} • TSC No: ${target.tscNumber || 'N/A'}`);
      setRecipientAddress(`Faculty Department, ${systemConfig.school_metadata.school_name}`);
    }
  };

  // Compile active document object for preview and saving
  const currentDocument: SavedDocument = {
    id: initialDocument?.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    title: template.title,
    category: template.category,
    templateId: template.id,
    referenceNumber: docRef,
    date: docDate,
    targetId: template.targetType === 'student' ? selectedStudentId : template.targetType === 'staff' ? selectedStaffId : undefined,
    targetName: template.targetType === 'student' ? selectedStudent?.name : template.targetType === 'staff' ? selectedStaff?.name : undefined,
    targetGrade: template.targetType === 'student' ? selectedStudent?.grade : undefined,
    targetType: template.targetType,
    createdBy: headTeacherName,
    status: initialDocument?.status || 'generated',
    subject,
    recipientName,
    recipientTitle,
    recipientAddress,
    bodyText,
    customData,
    headTeacherName,
    headTeacherTitle,
    includeStamp,
    includeSignature,
    watermark,
    createdAt: initialDocument?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Actions
  const handleSave = () => {
    onSaveDocument(currentDocument);
    showToast(`Document "${template.title}" saved to institutional archive!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Standard window.print allows direct "Save as PDF" with 100% fidelity
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentDocument, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${docRef.replace(/\//g, '_')}_${template.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Document exported as JSON file.');
  };

  const handleShare = async () => {
    const summary = `${systemConfig.school_metadata.school_name}\n${template.title} [Ref: ${docRef}]\nSubject: ${subject}\nDate: ${docDate}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: template.title,
          text: summary
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(summary);
    showToast('Document summary copied to clipboard.');
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            title="Return to Template Catalogue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                {template.category.replace(/-/g, ' ')}
              </span>
              <span className="font-mono text-xs text-slate-500 font-bold">{docRef}</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5 font-heading">
              {template.title}
            </h2>
          </div>
        </div>

        {/* Action Buttons: Preview, Edit, Print, PDF, Export, Share, Save */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* View Mode Toggle (Desktop only) */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveViewMode('form')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeViewMode === 'form'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 inline mr-1" />
              Editor
            </button>
            <button
              onClick={() => setActiveViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeViewMode === 'split'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setActiveViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeViewMode === 'preview'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              A4 Preview
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            title="Print A4 Document"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            title="Save as PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            title="Export JSON"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            title="Share Document"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            title="Save Document to History"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save to Archive</span>
          </button>
        </div>
      </div>

      {/* Main Work Area: Form & Live A4 Preview */}
      <div className={`grid gap-6 ${activeViewMode === 'split' ? 'lg:grid-cols-12' : 'grid-cols-1'}`}>
        {/* LEFT COLUMN: DOCUMENT CREATOR FORM */}
        {(activeViewMode === 'form' || activeViewMode === 'split') && (
          <div className={`${activeViewMode === 'split' ? 'lg:col-span-5' : 'w-full'} space-y-5 no-print`}>
            {/* Auto-Population Target Picker */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-black text-slate-900 dark:text-white text-sm">
                    Auto-Populate from EduHub Registry
                  </h3>
                </div>
              </div>

              {template.targetType === 'student' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Select Registered Learner:
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={e => handleStudentSelect(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} • {s.grade}
                      </option>
                    ))}
                  </select>
                  {selectedStudent && (
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 space-y-0.5">
                      <div>Parent/Guardian: <strong>{selectedStudent.parentName || 'Parent'}</strong></div>
                      <div>Contact: <span className="font-mono">{selectedStudent.parentPhone || '0700 000000'}</span></div>
                      <div>Term Attendance: <strong className="font-mono">{selectedStudent.attendanceRate || 96}%</strong></div>
                    </div>
                  )}
                </div>
              )}

              {template.targetType === 'staff' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Select Faculty / Staff Member:
                  </label>
                  <select
                    value={selectedStaffId}
                    onChange={e => handleStaffSelect(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {staffList.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} • {st.role} (TSC: {st.tscNumber || 'N/A'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Administrative Reference Number & Date */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Reference Number:
                  </label>
                  <input
                    type="text"
                    value={docRef}
                    onChange={e => setDocRef(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Official Date:
                  </label>
                  <input
                    type="date"
                    value={docDate}
                    onChange={e => setDocDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Recipient & Subject Customization */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                Recipient & Subject Details
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Document Subject Line (RE:):
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. OFFER OF ADMISSION AND ENROLLMENT PLACEMENT"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Recipient Name / Addressee:
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    placeholder="e.g. Mr. & Mrs. Kamau / The Branch Manager"
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Recipient Title / Subtext:
                  </label>
                  <input
                    type="text"
                    value={recipientTitle}
                    onChange={e => setRecipientTitle(e.target.value)}
                    placeholder="e.g. Parent of Austin Otieno (Grade 4)"
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Document Content / Body Editor */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 dark:text-white text-sm">
                  Document Body / Terms & Message
                </h3>
                <button
                  type="button"
                  onClick={() => setBodyText(template.defaultBody)}
                  className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                >
                  Reset to Template Default
                </button>
              </div>

              <textarea
                value={bodyText}
                onChange={e => setBodyText(e.target.value)}
                rows={10}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white leading-relaxed font-sans focus:ring-2 focus:ring-emerald-500 resize-y"
                placeholder="Type official communication paragraphs..."
              />
            </div>

            {/* Verification Signoff & Official Seal Controls */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                Executive Attestation & Security
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Headteacher Name:
                  </label>
                  <input
                    type="text"
                    value={headTeacherName}
                    onChange={e => setHeadTeacherName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Official Title:
                  </label>
                  <input
                    type="text"
                    value={headTeacherTitle}
                    onChange={e => setHeadTeacherTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeStamp}
                    onChange={e => setIncludeStamp(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Include Official Rubber Stamp</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSignature}
                    onChange={e => setIncludeSignature(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Include Digital Signature</span>
                </label>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Security Watermark Text (Optional):
                </label>
                <input
                  type="text"
                  value={watermark}
                  onChange={e => setWatermark(e.target.value)}
                  placeholder="e.g. OFFICIAL / CONFIDENTIAL"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: REALISTIC A4 PREVIEW */}
        {(activeViewMode === 'preview' || activeViewMode === 'split') && (
          <div className={`${activeViewMode === 'split' ? 'lg:col-span-7' : 'w-full'} flex flex-col items-center`}>
            {/* Sheet Banner Indicator */}
            <div className="w-full flex items-center justify-between pb-2 text-xs text-slate-500 dark:text-slate-400 font-semibold no-print">
              <span>A4 Document Preview (210mm × 297mm)</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                Standard Print Resolution: 300 DPI
              </span>
            </div>

            {/* Document Render Container with Paper Shadow */}
            <div className="w-full overflow-x-auto p-2 sm:p-4 bg-slate-200/70 dark:bg-slate-950 rounded-2xl border border-slate-300 dark:border-slate-800 flex justify-center">
              <DocumentViewerA4
                documentData={currentDocument}
                template={template}
                student={selectedStudent}
                staff={selectedStaff}
                systemConfig={systemConfig}
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl shadow-xl border border-slate-700 dark:border-slate-200 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
