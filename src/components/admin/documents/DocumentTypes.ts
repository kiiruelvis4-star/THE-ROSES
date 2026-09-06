import { GradeLevel, Student, StaffMember } from '../../../types';

export type DocumentCategory =
  | 'official-letters'
  | 'academic-documents'
  | 'student-documents'
  | 'staff-documents'
  | 'finance-documents'
  | 'school-communication'
  | 'forms-templates';

export type DocumentLayoutType =
  | 'letter'
  | 'report-card'
  | 'form'
  | 'table-ledger'
  | 'certificate'
  | 'minutes'
  | 'roster'
  | 'invoice-receipt';

export type DocumentTargetType = 'student' | 'staff' | 'general' | 'finance' | 'custom';

export type DocumentStatus = 'draft' | 'generated' | 'signed' | 'sent';

export interface DocumentFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'number';
  placeholder?: string;
  options?: string[];
  defaultValue?: string | number;
  required?: boolean;
  helpText?: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  category: DocumentCategory;
  description: string;
  defaultSubject: string;
  referencePrefix: string;
  targetType: DocumentTargetType;
  layout: DocumentLayoutType;
  defaultBody: string;
  customFields?: DocumentFieldConfig[];
  isCustom?: boolean;
}

export interface SavedDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  templateId: string;
  referenceNumber: string;
  date: string;
  targetId?: string;
  targetName?: string;
  targetGrade?: GradeLevel;
  targetType: DocumentTargetType;
  createdBy: string;
  status: DocumentStatus;
  subject: string;
  recipientName?: string;
  recipientTitle?: string;
  recipientAddress?: string;
  bodyText: string;
  customData: Record<string, any>;
  headTeacherName: string;
  headTeacherTitle: string;
  includeStamp: boolean;
  includeSignature: boolean;
  watermark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSettings {
  numberingPrefix: string;
  numberingFormat: string; // e.g. '{PREFIX}/{DEPT}/{YEAR}/{NUM}'
  nextSequence: number;
  defaultHeadTeacherName: string;
  defaultHeadTeacherTitle: string;
  showDigitalStamp: boolean;
  showDigitalSignature: boolean;
  watermarkText: string;
  schoolMotto: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolAddress: string;
  schoolCode: string;
}

export interface DocumentFilterOptions {
  category: DocumentCategory | 'all';
  searchQuery: string;
  status: DocumentStatus | 'all';
  targetType: DocumentTargetType | 'all';
}
