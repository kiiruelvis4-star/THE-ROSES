import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  FileText, 
  Settings, 
  ShieldCheck, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Download, 
  Upload, 
  RefreshCw, 
  ArrowRight, 
  Calendar, 
  BookOpen, 
  AlertCircle, 
  ChevronRight, 
  Filter, 
  Sparkles, 
  Save, 
  X,
  CreditCard,
  TrendingUp,
  Award,
  MapPin,
  Clock,
  Printer,
  FileCheck,
  KeyRound,
  Shield,
  Lock
} from 'lucide-react';
import { 
  Student, 
  StaffMember, 
  GradeLevel, 
  AdminTab, 
  SystemConfig, 
  Notice, 
  SchemeOfWork,
  ResourceItem
} from '../../types';
import { storage } from '../../services/storageService';
import { SchoolLogo } from '../SchoolLogo';
import { SchoolConfigModal } from '../modals/SchoolConfigModal';
import { ResourcesManager } from '../teacher/ResourcesManager';
import { TeacherCRUDModal } from '../modals/TeacherCRUDModal';
import { BulkAddLearnersModal } from './BulkAddLearnersModal';
import { deleteLearner, bulkDeleteLearners } from '../../services/sqliteDb';
import { DocumentCentre } from './documents/DocumentCentre';
import { EditLearnerModal } from './EditLearnerModal';
import { EditNoticeModal } from './EditNoticeModal';
import { EditCurriculumModal } from './EditCurriculumModal';
import { CurriculumSettings } from '../../services/storageService';

interface AdminDashboardProps {
  students: Student[];
  schemes: SchemeOfWork[];
  onOpenLearner?: (studentId: string) => void;
  onSwitchPortal?: (role: 'teacher' | 'learner') => void;
  onBackToPortals?: () => void;
  setStudents?: React.Dispatch<React.SetStateAction<Student[]>> | ((learners: Student[]) => void);
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  schemes,
  onOpenLearner,
  onSwitchPortal,
  onBackToPortals,
  setStudents
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => storage.getSystemConfig());
  const [staffList, setStaffList] = useState<StaffMember[]>(() => storage.getStaffMembers());
  const [notices, setNotices] = useState<Notice[]>(() => storage.getNotices());
  const [resources, setResources] = useState<ResourceItem[]>(() => storage.getResources());
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  
  // Local students state so all mutations reflect immediately in UI
  const [localStudents, setLocalStudents] = useState<Student[]>(() => {
    const fromStorage = storage.getStudents();
    return fromStorage && fromStorage.length > 0 ? fromStorage : (students || []);
  });

  useEffect(() => {
    if (students && students.length > 0) {
      setLocalStudents(students);
    }
  }, [students]);

  // Subscribe to reactive storage changes
  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setLocalStudents(storage.getStudents());
      setStaffList(storage.getStaffMembers());
      setNotices(storage.getNotices());
    });
    return () => unsub();
  }, []);

  // In-app Deletion Modal State (immune to iframe window.confirm blocks)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'single-learner' | 'bulk-learners' | 'staff' | 'notice';
    id?: string;
    name?: string;
    count?: number;
  }>({
    isOpen: false,
    type: 'single-learner'
  });

  // Success Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };
  
  // Modals & Forms
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isBulkAddOpen, setIsBulkAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Offline Editing States
  const [editingLearner, setEditingLearner] = useState<Student | null>(null);
  const [isEditLearnerOpen, setIsEditLearnerOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isEditNoticeOpen, setIsEditNoticeOpen] = useState(false);
  const [curriculumSettings, setCurriculumSettings] = useState<CurriculumSettings>(() => storage.getCurriculumSettings());
  const [isEditCurriculumOpen, setIsEditCurriculumOpen] = useState(false);

  // Bulk Learner Selection State
  const [selectedLearnerIds, setSelectedLearnerIds] = useState<string[]>([]);

  // Search & Filter states
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffFilterRole, setStaffFilterRole] = useState('all');
  const [learnerSearchQuery, setLearnerSearchQuery] = useState('');
  const [learnerFilterGrade, setLearnerFilterGrade] = useState('all');

  // New Notice form
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeAuthor, setNewNoticeAuthor] = useState(systemConfig.school_metadata.head_teacher_name || 'Headteacher');
  const [newNoticeAudience, setNewNoticeAudience] = useState<'All' | 'Teachers' | 'Learners' | 'Parents'>('All');
  const [newNoticePriority, setNewNoticePriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [newNoticeContent, setNewNoticeContent] = useState('');

  // Staff Form state
  const [staffForm, setStaffForm] = useState<Partial<StaffMember>>({
    name: '',
    tscNumber: '',
    role: 'Teacher',
    primaryGrade: 'Grade 6',
    specialization: [],
    phone: '',
    email: '',
    joinedYear: 2024,
    status: 'Active'
  });
  const [specInput, setSpecInput] = useState('');

  // Sync on storage changes
  useEffect(() => {
    const handleUpdate = () => {
      setSystemConfig(storage.getSystemConfig());
      setStaffList(storage.getStaffMembers());
      setNotices(storage.getNotices());
      setResources(storage.getResources());
    };
    const unsubscribe = storage.subscribe(handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const meta = systemConfig.school_metadata;

  // Key stats calculations
  const totalLearners = students.length;
  const totalBoys = students.filter(s => s.gender === 'Male').length;
  const totalGirls = students.filter(s => s.gender === 'Female').length;
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter(s => s.status === 'Active').length;
  const totalSchemes = schemes.length;

  // Grade enrollment breakdown
  const gradeCounts: Record<string, number> = {
    'Grade 1': students.filter(s => s.grade === 'Grade 1').length,
    'Grade 2': students.filter(s => s.grade === 'Grade 2').length,
    'Grade 3': students.filter(s => s.grade === 'Grade 3').length,
    'Grade 4': students.filter(s => s.grade === 'Grade 4').length,
    'Grade 5': students.filter(s => s.grade === 'Grade 5').length,
    'Grade 6': students.filter(s => s.grade === 'Grade 6').length,
  };

  // Staff Management Handlers
  const handleOpenAddStaff = () => {
    setEditingStaff(null);
    setStaffForm({
      id: `stf-${Date.now()}`,
      name: '',
      tscNumber: 'TSC/' + Math.floor(100000 + Math.random() * 900000),
      role: 'Class Teacher',
      primaryGrade: 'Grade 6',
      specialization: ['Mathematics'],
      phone: '07',
      email: '',
      joinedYear: new Date().getFullYear(),
      status: 'Active'
    });
    setSpecInput('');
    setIsStaffModalOpen(true);
  };

  const handleOpenEditStaff = (member: StaffMember) => {
    setEditingStaff(member);
    setStaffForm({ ...member });
    setSpecInput('');
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name?.trim()) return;

    const memberToSave: StaffMember = {
      id: editingStaff ? editingStaff.id : `stf-${Date.now()}`,
      name: staffForm.name || 'Staff Member',
      tscNumber: staffForm.tscNumber || 'TSC/N/A',
      role: staffForm.role || 'Teacher',
      primaryGrade: staffForm.primaryGrade || 'Grade 6',
      specialization: staffForm.specialization && staffForm.specialization.length > 0 ? staffForm.specialization : ['General Education'],
      phone: staffForm.phone || '0700 000000',
      email: staffForm.email || 'staff@littleroses.ac.ke',
      joinedYear: Number(staffForm.joinedYear) || new Date().getFullYear(),
      status: (staffForm.status as 'Active' | 'On Leave') || 'Active'
    };

    storage.saveStaffMember(memberToSave);
    setStaffList(storage.getStaffMembers());
    setIsStaffModalOpen(false);
  };

  const handleDeleteStaff = (id: string, name?: string) => {
    const member = staffList.find(s => s.id === id);
    setDeleteModal({
      isOpen: true,
      type: 'staff',
      id,
      name: name || member?.name || 'Staff Member'
    });
  };

  const handleAddSpecialization = () => {
    if (specInput.trim()) {
      const current = staffForm.specialization || [];
      if (!current.includes(specInput.trim())) {
        setStaffForm({
          ...staffForm,
          specialization: [...current, specInput.trim()]
        });
      }
      setSpecInput('');
    }
  };

  const handleRemoveSpecialization = (spec: string) => {
    setStaffForm({
      ...staffForm,
      specialization: (staffForm.specialization || []).filter(s => s !== spec)
    });
  };

  // Notice Handlers
  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;

    const notice: Notice = {
      id: `not-${Date.now()}`,
      title: newNoticeTitle.trim(),
      author: newNoticeAuthor.trim() || (meta.head_teacher_name || 'Headteacher'),
      date: new Date().toISOString().slice(0, 10),
      priority: newNoticePriority,
      targetAudience: newNoticeAudience,
      content: newNoticeContent.trim()
    };

    storage.saveNotice(notice);
    setNotices(storage.getNotices());
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setShowNoticeForm(false);
  };

  const handleDeleteNotice = (id: string, title?: string) => {
    const targetNotice = notices.find(n => n.id === id);
    setDeleteModal({
      isOpen: true,
      type: 'notice',
      id,
      name: title || targetNotice?.title || 'Announcement'
    });
  };

  // Export / Backup
  const handleExportBackup = () => {
    const jsonStr = storage.exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Little_Roses_Administration_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered lists (uses localStudents for real-time responsiveness)
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      staff.tscNumber.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      staff.specialization.some(s => s.toLowerCase().includes(staffSearchQuery.toLowerCase()));
    const matchesRole = staffFilterRole === 'all' || 
      (staffFilterRole === 'active' && staff.status === 'Active') ||
      (staffFilterRole === 'leave' && staff.status === 'On Leave');
    return matchesSearch && matchesRole;
  });

  const filteredStudents = localStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(learnerSearchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(learnerSearchQuery.toLowerCase());
    const matchesGrade = learnerFilterGrade === 'all' || student.grade === learnerFilterGrade;
    return matchesSearch && matchesGrade;
  });

  // Toggle single selection
  const handleSelectOneLearner = (id: string) => {
    if (selectedLearnerIds.includes(id)) {
      setSelectedLearnerIds(selectedLearnerIds.filter(item => item !== id));
    } else {
      setSelectedLearnerIds([...selectedLearnerIds, id]);
    }
  };

  // Toggle "Select All"
  const handleSelectAllLearners = () => {
    if (selectedLearnerIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedLearnerIds([]); // Deselect all
    } else {
      setSelectedLearnerIds(filteredStudents.map(item => item.id)); // Select all
    }
  };

  // Trigger individual deletion
  const handleDeleteSingleLearner = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      type: 'single-learner',
      id,
      name
    });
  };

  // Trigger bulk deletion
  const handleDeleteSelectedLearners = () => {
    if (selectedLearnerIds.length === 0) return;
    setDeleteModal({
      isOpen: true,
      type: 'bulk-learners',
      count: selectedLearnerIds.length
    });
  };

  // Execute Confirmed Deletion
  const handleConfirmDeletion = () => {
    if (deleteModal.type === 'single-learner' && deleteModal.id) {
      const targetId = deleteModal.id;
      const targetName = deleteModal.name || 'Learner';

      // 1. Storage delete
      const remaining = storage.deleteStudent(targetId);
      setLocalStudents(remaining);
      if (setStudents) setStudents(remaining);

      // 2. SQLite delete
      deleteLearner(targetId).catch(() => {});

      // 3. Update selection
      setSelectedLearnerIds(prev => prev.filter(id => id !== targetId));

      showToast(`Learner "${targetName}" removed from registry.`);
    } else if (deleteModal.type === 'bulk-learners') {
      const count = selectedLearnerIds.length;
      if (count > 0) {
        // 1. Storage bulk delete
        const remaining = storage.bulkDeleteStudents(selectedLearnerIds);
        setLocalStudents(remaining);
        if (setStudents) setStudents(remaining);

        // 2. SQLite bulk delete
        bulkDeleteLearners(selectedLearnerIds).catch(() => {});

        // 3. Clear selection
        setSelectedLearnerIds([]);

        showToast(`Successfully removed ${count} selected learner(s).`);
      }
    } else if (deleteModal.type === 'staff' && deleteModal.id) {
      const targetId = deleteModal.id;
      const targetName = deleteModal.name || 'Staff Member';
      storage.deleteStaffMember(targetId);
      setStaffList(storage.getStaffMembers());
      showToast(`Staff member "${targetName}" removed.`);
    } else if (deleteModal.type === 'notice' && deleteModal.id) {
      const targetId = deleteModal.id;
      const targetName = deleteModal.name || 'Announcement';
      storage.deleteNotice(targetId);
      setNotices(storage.getNotices());
      showToast(`Announcement "${targetName}" deleted.`);
    }

    setDeleteModal({ isOpen: false, type: 'single-learner' });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pb-20 transition-colors">
      {/* Top Banner with Official Administration Branding */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* School Profile */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                <SchoolLogo size="lg" badgeOnly />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    Executive Portal
                  </span>
                  <span className="text-xs text-emerald-200 font-medium">
                    {systemConfig.active_academic_year} • {systemConfig.active_term}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-heading">
                  {meta.school_name || 'Little Roses Academy'}
                </h1>
                <p className="text-xs text-emerald-100 flex flex-wrap items-center gap-3">
                  <span className="font-semibold">{meta.county || 'Nakuru County'}</span>
                  <span>•</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[11px] font-bold">
                    {meta.po_box || 'P.O. Box 3443 NAKURU'}
                  </span>
                  <span>•</span>
                  <span>Code: {meta.school_code_number}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                <Settings className="w-4 h-4 text-emerald-700" />
                <span>School Metadata</span>
              </button>
              <button
                onClick={handleExportBackup}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border border-emerald-600/50 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Backup</span>
              </button>
              {onBackToPortals && (
                <button
                  onClick={onBackToPortals}
                  className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-all"
                  title="Return to Portal Select"
                >
                  Portals
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15">
              <span className="text-[10px] font-bold uppercase text-emerald-200 block">Total Learners</span>
              <div className="text-2xl font-black text-white mt-0.5">{totalLearners}</div>
              <span className="text-[10px] text-emerald-100">{totalBoys} Boys • {totalGirls} Girls</span>
            </div>
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15">
              <span className="text-[10px] font-bold uppercase text-emerald-200 block">Teaching Staff</span>
              <div className="text-2xl font-black text-white mt-0.5">{totalStaff}</div>
              <span className="text-[10px] text-emerald-100">{activeStaff} Active on Duty</span>
            </div>
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15">
              <span className="text-[10px] font-bold uppercase text-emerald-200 block">CBC Schemes Active</span>
              <div className="text-2xl font-black text-white mt-0.5">{totalSchemes}</div>
              <span className="text-[10px] text-emerald-100">Across 6 Grade Levels</span>
            </div>
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15">
              <span className="text-[10px] font-bold uppercase text-emerald-200 block">Headteacher</span>
              <div className="text-sm font-black text-white mt-1 truncate">{meta.head_teacher_name || 'Mr. Kelvin'}</div>
              <span className="text-[10px] text-emerald-100">{meta.phone || '0798 193966'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container & Sub-Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'staff'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Directory ({totalStaff})</span>
          </button>

          <button
            onClick={() => setActiveTab('learners')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'learners'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Learners & Enrollment ({totalLearners})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>📄 Documents</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'curriculum'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>CBC Curriculum & KPSEA</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'resources'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Textbooks & Resources (WRITE)</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'notices'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Official Notices ({notices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>System Settings</span>
          </button>
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 mt-6 animate-fadeIn">
            {/* Welcome & School Info Card */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Leadership & Oversight Dashboard
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                  Welcome to Little Roses Academy Administration
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Monitor CBC curriculum standards, staff deployments across Grade 1 through 6, learner enrollment records, and official Ministry / KNEC portal integrations.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{meta.po_box || 'P.O. Box 3443 NAKURU'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>{meta.phone || '0798 193966'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-rose-600" />
                    <span>{meta.email || 'roseslittle3@gmail.com'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('staff')}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Manage Teaching Staff</span>
                </button>
                <button
                  onClick={() => setIsConfigModalOpen(true)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configure PO Box & Dates</span>
                </button>
              </div>
            </div>

            {/* Offline Operational Center Banner */}
            <div className="p-4.5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl border border-emerald-500/30 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm tracking-tight">100% Offline Operational Suite</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                      Local SQLite & Storage Synced
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100/80 mt-0.5">
                    Every administrative module (learners, staff, curriculum, notices, documents) is fully editable and instantly persisted without internet.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsConfigModalOpen(true)}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Edit School Metadata</span>
                </button>
                <button
                  onClick={() => setIsEditCurriculumOpen(true)}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-300" />
                  <span>Edit Curriculum</span>
                </button>
              </div>
            </div>

            {/* Grid of Enrollment & Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Enrollment Distribution */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>Class Enrollment</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {totalLearners} Total
                  </span>
                </div>
                <div className="space-y-2.5">
                  {Object.entries(gradeCounts).map(([grade, count]) => {
                    const pct = totalLearners > 0 ? Math.round((count / totalLearners) * 100) : 0;
                    return (
                      <div key={grade} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700 dark:text-slate-300">{grade}</span>
                          <span className="text-slate-500 dark:text-slate-400">{count} Pupils ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Teaching Staff Quick Overview */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Staff Personnel</span>
                  </h3>
                  <button
                    onClick={handleOpenAddStaff}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Staff
                  </button>
                </div>

                <div className="space-y-3">
                  {staffList.slice(0, 4).map(staff => (
                    <div
                      key={staff.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{staff.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {staff.role} • {staff.primaryGrade}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        staff.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {staff.status}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('staff')}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all text-center block"
                >
                  View All {staffList.length} Staff Members →
                </button>
              </div>

              {/* Academic Term Status */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Academic Calendar Status</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Current active academic schedule for Little Roses Academy
                  </p>

                  <div className="mt-4 p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Academic Year:</span>
                      <strong className="text-slate-900 dark:text-white font-bold">{systemConfig.active_academic_year}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Active Term:</span>
                      <strong className="text-amber-700 dark:text-amber-300 font-bold">{systemConfig.active_term}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Next Opening:</span>
                      <strong className="text-slate-900 dark:text-white font-bold">May 5th, 2026</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      if (onSwitchPortal) onSwitchPortal('teacher');
                    }}
                    className="w-full py-2.5 bg-[#172554] hover:bg-[#1e3a8a] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>Switch to Teacher Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (onSwitchPortal) onSwitchPortal('learner');
                    }}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>Switch to Learner Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STAFF DIRECTORY & MANAGEMENT */}
        {activeTab === 'staff' && (
          <div className="space-y-6 mt-6 animate-fadeIn">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 flex-1 w-full sm:w-auto">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search staff by name, TSC, role..."
                    value={staffSearchQuery}
                    onChange={(e) => setStaffSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={staffFilterRole}
                  onChange={(e) => setStaffFilterRole(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="all">All Statuses ({staffList.length})</option>
                  <option value="active">Active ({staffList.filter(s => s.status === 'Active').length})</option>
                  <option value="leave">On Leave ({staffList.filter(s => s.status === 'On Leave').length})</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddStaff}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Staff Member</span>
              </button>
            </div>

            {/* Staff Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-sm flex items-center justify-center border border-emerald-300 dark:border-emerald-800">
                          {staff.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                            {staff.name}
                          </h3>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {staff.tscNumber}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        staff.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {staff.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>Role:</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{staff.role}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>Primary Grade:</span>
                        <strong className="text-emerald-700 dark:text-emerald-300 font-bold">{staff.primaryGrade}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>Joined:</span>
                        <span>{staff.joinedYear}</span>
                      </div>
                    </div>

                    {/* Specializations Pills */}
                    <div className="pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Teaching Subjects:</span>
                      <div className="flex flex-wrap gap-1">
                        {staff.specialization.map((spec, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Contact */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${staff.phone.replace(/\s+/g, '')}`}
                        className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                        title={`Call ${staff.phone}`}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        href={`mailto:${staff.email}`}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                        title={`Email ${staff.email}`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditStaff(staff)}
                        className="p-2 text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Edit Staff Member"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id, staff.name)}
                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title={`Remove Staff Member ${staff.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LEARNERS & ENROLLMENT */}
        {activeTab === 'learners' && (
          <div className="space-y-6 mt-6 animate-fadeIn">
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 flex-1 w-full sm:w-auto">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search learners by name or admission..."
                    value={learnerSearchQuery}
                    onChange={(e) => setLearnerSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={learnerFilterGrade}
                  onChange={(e) => setLearnerFilterGrade(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="all">All Grades ({students.length})</option>
                  <option value="Grade 1">Grade 1 ({gradeCounts['Grade 1']})</option>
                  <option value="Grade 2">Grade 2 ({gradeCounts['Grade 2']})</option>
                  <option value="Grade 3">Grade 3 ({gradeCounts['Grade 3']})</option>
                  <option value="Grade 4">Grade 4 ({gradeCounts['Grade 4']})</option>
                  <option value="Grade 5">Grade 5 ({gradeCounts['Grade 5']})</option>
                  <option value="Grade 6">Grade 6 ({gradeCounts['Grade 6']})</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Showing <strong>{filteredStudents.length}</strong> of {students.length} Learners
                </div>

                {/* Bulk Action Delete Button */}
                {selectedLearnerIds.length > 0 && (
                  <button 
                    onClick={handleDeleteSelectedLearners}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer shrink-0 animate-fadeIn"
                    title={`Delete ${selectedLearnerIds.length} selected learners`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedLearnerIds.length})</span>
                  </button>
                )}

                <button
                  onClick={() => setIsBulkAddOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Bulk Add Learners</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4 w-12 text-center">
                        <input 
                          type="checkbox" 
                          aria-label="Select all learners"
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                          checked={selectedLearnerIds.length === filteredStudents.length && filteredStudents.length > 0} 
                          onChange={handleSelectAllLearners} 
                        />
                      </th>
                      <th className="p-4">Learner Name</th>
                      <th className="p-4">Admission No.</th>
                      <th className="p-4">Grade</th>
                      <th className="p-4">Gender</th>
                      <th className="p-4">Parent / Guardian</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {filteredStudents.map((std) => {
                      const isSelected = selectedLearnerIds.includes(std.id);
                      return (
                        <tr 
                          key={std.id} 
                          className={`transition-colors ${
                            isSelected 
                              ? 'bg-rose-50/70 dark:bg-rose-950/20' 
                              : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox" 
                              aria-label={`Select ${std.name}`}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                              checked={isSelected} 
                              onChange={() => handleSelectOneLearner(std.id)} 
                            />
                          </td>
                          <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-black text-xs flex items-center justify-center">
                              {std.name.charAt(0)}
                            </div>
                            <span>{std.name}</span>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-600 dark:text-slate-300">
                            {std.admissionNumber}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                              {std.grade}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">
                            {std.gender}
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300">
                            {std.parentName || 'Guardian'}
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">
                            {std.parentPhone || '0700 000000'}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingLearner(std);
                                  setIsEditLearnerOpen(true);
                                }}
                                className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer text-xs"
                                title={`Edit ${std.name}`}
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  storage.setActiveStudentId(std.id);
                                  if (onOpenLearner) {
                                    onOpenLearner(std.id);
                                  } else if (onSwitchPortal) {
                                    onSwitchPortal('learner');
                                  }
                                }}
                                className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer text-xs"
                                title={`Inspect ${std.name}`}
                              >
                                <span>Inspect</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteSingleLearner(std.id, std.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                                title={`Delete ${std.name}`}
                                aria-label={`Delete ${std.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Selection Summary banner when items selected */}
              {selectedLearnerIds.length > 0 && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>
                    <strong>{selectedLearnerIds.length}</strong> of {filteredStudents.length} learner(s) selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedLearnerIds([])}
                      className="text-slate-500 hover:text-slate-900 dark:hover:text-white underline cursor-pointer"
                    >
                      Deselect All
                    </button>
                    <button
                      onClick={handleDeleteSelectedLearners}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete Selected</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: DOCUMENT CENTRE */}
        {activeTab === 'documents' && (
          <div className="mt-6 animate-fadeIn">
            <DocumentCentre
              students={localStudents}
              staffList={staffList}
              systemConfig={systemConfig}
            />
          </div>
        )}

        {/* TAB 4: CBC CURRICULUM & KPSEA */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6 mt-6 animate-fadeIn">
            {/* Curriculum Controls Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Competency-Based Education (CBE) Curriculum
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                    Offline Configurable
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Rationalized KICD learning areas, assessment examination windows, and local CBA preparation.
                </p>
              </div>

              <button
                onClick={() => setIsEditCurriculumOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Edit3 className="w-4 h-4 text-blue-300" />
                <span>Edit Curriculum Structure</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Rationalized CBC Structure */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Lower Primary CBE Learning Areas (Grades 1–3)</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {(curriculumSettings.lowerPrimarySubjects || []).length} Subjects
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Approved KICD rationalized subjects taught across Little Roses Lower Primary:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(curriculumSettings.lowerPrimarySubjects || []).map((sub, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upper Primary CBE Learning Areas */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Upper Primary CBE Learning Areas (Grades 4–6)</span>
                  </h3>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {(curriculumSettings.upperPrimarySubjects || []).length} Subjects
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Core curriculum designs preparing Grade 6 candidates for the KPSEA National Assessment:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(curriculumSettings.upperPrimarySubjects || []).map((sub, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KNEC CBA & KPSEA Readiness */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    KNEC CBA Portal Sync Engine Status
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Auto-sync bridge to Kenya National Examinations Council CBA portal (cba.knec.ac.ke)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
                  ✓ {curriculumSettings.syncStatus || 'Offline & Local Engine Ready'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400">School KNEC Code</span>
                  <div className="font-black text-slate-900 dark:text-white mt-1 font-mono">{meta.school_code_number}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Targeter & Jesma Series</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{curriculumSettings.examSeriesNote || 'Ready for Opener & Midterm'}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Grade 6 KPSEA Window</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{curriculumSettings.kpseaWindow || 'October 26–29, 2026'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: OFFICIAL NOTICES */}
        {activeTab === 'notices' && (
          <div className="space-y-6 mt-6 animate-fadeIn">
            {/* Notice header and button */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Official School Announcements</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Broadcast administrative memos to Teachers, Parents, and Learners
                </p>
              </div>

              <button
                onClick={() => setShowNoticeForm(!showNoticeForm)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{showNoticeForm ? 'Cancel' : 'Post New Notice'}</span>
              </button>
            </div>

            {/* New notice form */}
            {showNoticeForm && (
              <form onSubmit={handleCreateNotice} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-500 shadow-md space-y-4">
                <h4 className="font-black text-sm text-slate-900 dark:text-white">Publish New School Memo</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. End of Term Examination Schedule"
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Audience</label>
                    <select
                      value={newNoticeAudience}
                      onChange={(e) => setNewNoticeAudience(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="All">All School Community</option>
                      <option value="Teachers">Teachers Only</option>
                      <option value="Learners">Learners Only</option>
                      <option value="Parents">Parents Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Priority</label>
                    <select
                      value={newNoticePriority}
                      onChange={(e) => setNewNoticePriority(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Notice Content</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide details of the circular..."
                    value={newNoticeContent}
                    onChange={(e) => setNewNoticeContent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNoticeForm(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Publish Memo
                  </button>
                </div>
              </form>
            )}

            {/* List of Notices */}
            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          notice.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : notice.priority === 'High'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {notice.priority}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Audience: {notice.targetAudience}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {notice.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingNotice(notice);
                          setIsEditNoticeOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Edit Notice (Offline)"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNotice(notice.id, notice.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {notice.content}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Issued by: <strong>{notice.author}</strong></span>
                    <span>Date: {notice.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: TEXTBOOKS & RESOURCES (ADMIN WRITE CLEARANCE) */}
        {activeTab === 'resources' && (
          <div className="mt-6 animate-fadeIn">
            <ResourcesManager
              resources={resources}
              onOpenUploadModal={() => setIsResourceModalOpen(true)}
            />
          </div>
        )}

        {/* TAB: SYSTEM SETTINGS & METADATA */}
        {activeTab === 'settings' && (
          <div className="space-y-6 mt-6 animate-fadeIn">
            {/* System Specification & Roles Matrix */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      System Configuration & Access Control
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                      v2.0.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Little Roses EduHub security roles, synchronized local clock, and resource handling specs.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sync: device_local_time (HH:MM:SS)</span>
                  </span>
                </div>
              </div>

              {/* Roles & Permissions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Admin Role Box */}
                <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Role: ADMIN
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Master Key: ••••••••
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-emerald-200/50 dark:border-emerald-900/50">
                      <span className="text-slate-600 dark:text-slate-300">Textbooks & Resources</span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">WRITE (Unrestricted)</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-emerald-200/50 dark:border-emerald-900/50">
                      <span className="text-slate-600 dark:text-slate-300">Timetable Overrides</span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">WRITE (Full Override)</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-600 dark:text-slate-300">System Settings</span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">WRITE</span>
                    </div>
                  </div>
                </div>

                {/* Teachers Role Box */}
                <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      Role: TEACHERS (4 Faculty Staff)
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                      Faculty Auth Gate
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-blue-200/50 dark:border-blue-900/50">
                      <span className="text-slate-600 dark:text-slate-300">Textbooks & Resources</span>
                      <span className="font-mono font-bold text-amber-700 dark:text-amber-400">READ_ONLY</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-blue-200/50 dark:border-blue-900/50">
                      <span className="text-slate-600 dark:text-slate-300">Timetable Overrides</span>
                      <span className="font-mono font-bold text-amber-700 dark:text-amber-400">READ_ONLY</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-600 dark:text-slate-300">Personal Dashboard</span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">READ_WRITE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Faculty Credentials Reference */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    Configured Faculty Credentials & Subject Allocations
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Password Verification Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-extrabold text-slate-900 dark:text-white">MR ELVIS (elvis)</div>
                    <div className="font-mono text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Password: ••••••••</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Creative Arts (1-6), Social Studies (4-6), Maths (4-6)</p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-extrabold text-slate-900 dark:text-white">MADAM FRESIAH (fresiah)</div>
                    <div className="font-mono text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Password: ••••••••</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Maths (1, 3, 4), Science & Tech (4-6), C.R.E (1-6)</p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-extrabold text-slate-900 dark:text-white">MR KELVIN (kelvin)</div>
                    <div className="font-mono text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Password: ••••••••</span>
                    </div>
                    <p className="text-[10px] text-slate-500">English (1-6), Agriculture (4-6)</p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-extrabold text-slate-900 dark:text-white">MADAM LIZ (liz)</div>
                    <div className="font-mono text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Password: ••••••••</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Kiswahili (1-6), Maths (2), Environmental (1-3)</p>
                  </div>
                </div>
              </div>

              {/* Resource Input Types Specification */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  Standard Resource Input Types & Limits
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        PDF_ATTACHMENT
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold">
                        Max 50 MB
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Allowed extensions: <code className="font-mono font-bold text-slate-700 dark:text-slate-300">.pdf</code>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Standard textbooks, official KICD syllabi, and past examination papers.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        RAW_TEXT_AI_COPY
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold">
                        Format: Markdown
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Support formatted notes: <span className="font-bold text-emerald-600">Enabled</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Direct AI copy-paste, formatted headings, bullet points, and instant clipboard copy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* School Profile Card */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    School Identity & Official Details
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Official registration data stored in local storage and generated report cards
                  </p>
                </div>
                <button
                  onClick={() => setIsConfigModalOpen(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  Edit School Details
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">School Name</span>
                  <div className="font-black text-sm text-slate-900 dark:text-white">{meta.school_name}</div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Postal Address</span>
                  <div className="font-black text-sm text-emerald-700 dark:text-emerald-400 font-mono">
                    {meta.po_box || 'P.O. Box 3443 NAKURU'}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Headteacher</span>
                  <div className="font-black text-sm text-slate-900 dark:text-white">{meta.head_teacher_name || 'Mr. Kelvin'}</div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Telephone Contact</span>
                  <div className="font-bold text-slate-900 dark:text-white">{meta.phone || '0798 193966'}</div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Official Email</span>
                  <div className="font-bold text-slate-900 dark:text-white">{meta.email || 'roseslittle3@gmail.com'}</div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">School Motto</span>
                  <div className="font-serif italic font-bold text-rose-600 dark:text-rose-400">
                    "{meta.motto || 'Much from Little'}"
                  </div>
                </div>
              </div>
            </div>

            {/* Database & Backup Operations */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Database Backup & Recovery</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate an offline snapshot containing all students, staff, CAT marks, schemes, and configurations.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleExportBackup}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full JSON Backup</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Reset all demo staff and records back to factory initial state?')) {
                      storage.resetToFactoryDemo();
                      window.location.reload();
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl border border-rose-300 dark:border-rose-900 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset to Factory Defaults</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT STAFF */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scaleUp">
            <div className="flex items-center justify-between p-5 bg-emerald-800 text-white">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h3 className="font-black text-sm">
                  {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h3>
              </div>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tr. Beatrice Wangari"
                    value={staffForm.name || ''}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    TSC / ID Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TSC/489201/2018"
                    value={staffForm.tscNumber || ''}
                    onChange={(e) => setStaffForm({ ...staffForm, tscNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Teacher / Grade 6 Class Teacher"
                    value={staffForm.role || ''}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Assigned Grade
                  </label>
                  <select
                    value={staffForm.primaryGrade || 'Grade 6'}
                    onChange={(e) => setStaffForm({ ...staffForm, primaryGrade: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="All Grades">All Grades (Leadership/Sports)</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0722 123456"
                    value={staffForm.phone || ''}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. teacher@littleroses.ac.ke"
                    value={staffForm.email || ''}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Year Joined Little Roses
                  </label>
                  <input
                    type="number"
                    min="2000"
                    max="2030"
                    value={staffForm.joinedYear || 2024}
                    onChange={(e) => setStaffForm({ ...staffForm, joinedYear: parseInt(e.target.value) || 2024 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Active Status
                  </label>
                  <select
                    value={staffForm.status || 'Active'}
                    onChange={(e) => setStaffForm({ ...staffForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Active">Active on Duty</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              {/* Specializations / Subjects */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subjects & Specializations
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add subject (e.g. Science, Kiswahili)..."
                    value={specInput}
                    onChange={(e) => setSpecInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSpecialization();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecialization}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  {(staffForm.specialization || []).map((spec, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-medium"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialization(spec)}
                        className="hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {(!staffForm.specialization || staffForm.specialization.length === 0) && (
                    <span className="text-xs text-slate-400 italic">No subjects added yet.</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  {editingStaff ? 'Save Changes' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SCHOOL CONFIG & PO BOX EDIT */}
      <SchoolConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={systemConfig}
        onConfigUpdated={(newCfg) => {
          setSystemConfig(newCfg);
        }}
      />

      {/* MODAL: RESOURCE UPLOAD (ADMIN WRITE) */}
      <TeacherCRUDModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        type="resource"
        onSave={() => {
          setResources(storage.getResources());
        }}
      />

      {/* MODAL: BULK ADD LEARNERS */}
      <BulkAddLearnersModal
        isOpen={isBulkAddOpen}
        onClose={() => setIsBulkAddOpen(false)}
        onSuccess={() => {
          // Reactively synced through storageService
        }}
      />

      {/* MODAL: EDIT LEARNER (OFFLINE) */}
      <EditLearnerModal
        isOpen={isEditLearnerOpen}
        onClose={() => {
          setIsEditLearnerOpen(false);
          setEditingLearner(null);
        }}
        learner={editingLearner}
        onLearnerUpdated={(updated) => {
          setLocalStudents(storage.getStudents());
          showToast(`Learner record for "${updated.name}" updated successfully!`);
        }}
      />

      {/* MODAL: EDIT NOTICE (OFFLINE) */}
      <EditNoticeModal
        isOpen={isEditNoticeOpen}
        onClose={() => {
          setIsEditNoticeOpen(false);
          setEditingNotice(null);
        }}
        notice={editingNotice}
        onNoticeUpdated={(updated) => {
          setNotices(storage.getNotices());
          showToast(`Circular "${updated.title}" updated successfully!`);
        }}
      />

      {/* MODAL: EDIT CURRICULUM (OFFLINE) */}
      <EditCurriculumModal
        isOpen={isEditCurriculumOpen}
        onClose={() => setIsEditCurriculumOpen(false)}
        settings={curriculumSettings}
        onSettingsUpdated={(updated) => {
          setCurriculumSettings(updated);
          showToast('Competency-Based Education curriculum structure updated and persisted offline!');
        }}
      />

      {/* NON-BLOCKING IN-APP DELETION CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  {deleteModal.type === 'single-learner' && 'Delete Learner Record'}
                  {deleteModal.type === 'bulk-learners' && `Delete ${deleteModal.count || selectedLearnerIds.length} Selected Learners`}
                  {deleteModal.type === 'staff' && 'Remove Staff Member'}
                  {deleteModal.type === 'notice' && 'Delete Announcement'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {deleteModal.type === 'single-learner' && (
                    <>
                      Are you sure you want to permanently delete <strong>{deleteModal.name}</strong> from the official learner registry? This will clear enrollment and associated evaluation records.
                    </>
                  )}
                  {deleteModal.type === 'bulk-learners' && (
                    <>
                      Are you sure you want to permanently delete <strong>{deleteModal.count || selectedLearnerIds.length}</strong> selected learner(s)? This action updates both SQLite and local registry state.
                    </>
                  )}
                  {deleteModal.type === 'staff' && (
                    <>
                      Are you sure you want to remove <strong>{deleteModal.name}</strong> from the faculty directory?
                    </>
                  )}
                  {deleteModal.type === 'notice' && (
                    <>
                      Are you sure you want to delete memo "<strong>{deleteModal.name}</strong>"?
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, type: 'single-learner' })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletion}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  {deleteModal.type === 'bulk-learners'
                    ? `Delete (${deleteModal.count || selectedLearnerIds.length})`
                    : 'Confirm Deletion'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl shadow-xl border border-slate-700 dark:border-slate-200 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white dark:hover:text-slate-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
