import { DocumentTemplate, DocumentCategory } from './DocumentTypes';

export const DOCUMENT_CATEGORIES: {
  id: DocumentCategory;
  name: string;
  description: string;
  icon: string;
  countBadge?: number;
}[] = [
  {
    id: 'official-letters',
    name: 'Official Letters',
    description: 'Formal school correspondence, admission, transfer, and administrative missives with official letterhead',
    icon: 'Mail'
  },
  {
    id: 'academic-documents',
    name: 'Academic Documents',
    description: 'CBC summative reports, transcripts, assessment summaries, examination schedules, and diplomas',
    icon: 'GraduationCap'
  },
  {
    id: 'student-documents',
    name: 'Student Documents',
    description: 'Admission dossiers, student profiles, transfer clearance forms, medical records, and bio-data',
    icon: 'Users'
  },
  {
    id: 'staff-documents',
    name: 'Staff Documents',
    description: 'Faculty appointment letters, duty rosters, appraisal forms, leave permits, and meeting minutes',
    icon: 'Briefcase'
  },
  {
    id: 'finance-documents',
    name: 'Finance Documents',
    description: 'Fee schedules, student invoices, receipts, payment acknowledgements, and expense vouchers',
    icon: 'CreditCard'
  },
  {
    id: 'school-communication',
    name: 'School Communication',
    description: 'Parent circulars, executive staff memos, campus notices, and general announcements',
    icon: 'Megaphone'
  },
  {
    id: 'forms-templates',
    name: 'Forms & Templates',
    description: 'Standard institutional forms, blank evaluation sheets, and reusable custom school templates',
    icon: 'FileCode'
  }
];

export const INITIAL_DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  // ==========================================
  // 1. OFFICIAL LETTERS
  // ==========================================
  {
    id: 'official-school-letter',
    title: 'Official School Letter',
    category: 'official-letters',
    description: 'Standard executive correspondence for external agencies, government offices, and institutional partners',
    defaultSubject: 'OFFICIAL COMMUNICATION REGARDING INSTITUTIONAL MATTERS',
    referencePrefix: 'LRA/OFF',
    targetType: 'general',
    layout: 'letter',
    defaultBody: `We write on behalf of the Board of Management and Administration of Little Roses Academy, Nakuru, to formally communicate regarding the above-captioned matter.\n\nLittle Roses Academy continues to foster holistic academic rigor, ethical values, and CBC foundational competence across all learning tiers. We appreciate your continued partnership with our institution and remain available for any further clarification.\n\nPlease accept the assurances of our highest esteem and consideration.`
  },
  {
    id: 'admission-letter',
    title: 'Admission Letter',
    category: 'official-letters',
    description: 'Formal offer of learner enrollment specifying grade placement, admission number, and reporting requirements',
    defaultSubject: 'OFFER OF ADMISSION AND ENROLLMENT PLACEMENT',
    referencePrefix: 'LRA/ADM',
    targetType: 'student',
    layout: 'letter',
    defaultBody: `Following your application and successful review by the Admissions Committee of Little Roses Academy, we are pleased to offer your child formal admission to our institution.\n\nThe learner is expected to report on the designated opening day of the term, accompanied by their original birth certificate, previous school progress records/NEMIS UPI details, and the completed medical disclosure form.\n\nWe congratulate you on this milestone and look forward to nurturing your child towards academic and moral excellence.`
  },
  {
    id: 'transfer-letter',
    title: 'Transfer Letter',
    category: 'official-letters',
    description: 'Official transfer release certificate confirming learner clearance and recommending admission to a receiving institution',
    defaultSubject: 'OFFICIAL TRANSFER AND RELEASE CERTIFICATE',
    referencePrefix: 'LRA/TRF',
    targetType: 'student',
    layout: 'letter',
    defaultBody: `This is to certify that the above-named learner has been enrolled at Little Roses Academy, Nakuru. At the request of the parent/guardian, the learner is hereby released to proceed with transfer to your esteemed institution.\n\nDuring their tenure at Little Roses Academy, the learner exhibited commendable conduct, diligence, and participated actively in CBC learning areas. All institutional dues, textbooks, and library materials have been fully accounted for.\n\nWe recommend the learner for admission without hesitation and wish them boundless success in their academic endeavors.`
  },
  {
    id: 'recommendation-letter',
    title: 'Recommendation Letter',
    category: 'official-letters',
    description: 'Commendatory letter detailing learner or staff character, academic achievements, and co-curricular leadership',
    defaultSubject: 'LETTER OF RECOMMENDATION AND GOOD CONDUCT',
    referencePrefix: 'LRA/REC',
    targetType: 'student',
    layout: 'letter',
    defaultBody: `It is with immense pleasure that I write this recommendation on behalf of Little Roses Academy. Throughout their period in our school community, the candidate demonstrated exceptional responsibility, discipline, and exemplary leadership.\n\nTheir commitment to community values, respectful engagement with peers and faculty, and consistent performance in both formative and summative assessments distinguish them as an outstanding individual.\n\nI recommend them with the highest confidence for any academic opportunity, leadership role, or competitive placement.`
  },
  {
    id: 'introduction-letter',
    title: 'Introduction Letter',
    category: 'official-letters',
    description: 'Formal letter of introduction addressed to embassies, commercial banks, healthcare centers, or sports organizations',
    defaultSubject: 'LETTER OF INTRODUCTION FOR BONA FIDE MEMBER OF INSTITUTION',
    referencePrefix: 'LRA/INT',
    targetType: 'student',
    layout: 'letter',
    defaultBody: `This is to formally confirm that the bearer of this letter is a bona fide member of Little Roses Academy, Nakuru, currently registered and active in our institution.\n\nThis introduction is issued upon official request to facilitate administrative processing with your reputable office. Any courtesy, assistance, or facilities extended to them will be deeply appreciated by the administration of Little Roses Academy.\n\nShould you require any independent verification or supplementary documentation, kindly reach our registry via our official contacts.`
  },
  {
    id: 'parent-guardian-letter',
    title: 'Parent/Guardian Letter',
    category: 'official-letters',
    description: 'Direct individualized letter to parent/guardian concerning learner academic progress, attendance, or school clinic advisories',
    defaultSubject: 'COMMUNICATION TO PARENT/GUARDIAN ON LEARNER WELFARE',
    referencePrefix: 'LRA/PRN',
    targetType: 'student',
    layout: 'letter',
    defaultBody: `We present our warmest greetings from the staff and management of Little Roses Academy.\n\nWe write to bring to your immediate attention important matters regarding your child's learning journey, personal welfare, and school engagement during the ongoing academic session.\n\nWe kindly invite you to schedule a consultative session with the class teacher and headteacher on campus to review these observations together and establish a shared support strategy for the child's success.`
  },
  {
    id: 'fee-reminder-letter',
    title: 'Fee Reminder Letter',
    category: 'official-letters',
    description: 'Polite yet firm notice detailing outstanding school fee balance and providing official payment channels',
    defaultSubject: 'NOTICE OF OUTSTANDING SCHOOL FEES BALANCE',
    referencePrefix: 'LRA/FIN',
    targetType: 'student',
    layout: 'letter',
    defaultBody: `We wish to express our heartfelt gratitude for entrusting your child's education to Little Roses Academy. As we approach critical academic milestones this term, smooth operational running relies upon prompt settlement of school fees.\n\nOur records indicate an outstanding balance against the learner's account. We kindly request you to remit this balance to enable uninterrupted learning and access to CBC resource materials and scheduled assessments.\n\nPayments may be deposited through our official school accounts or via our verified M-Pesa Paybill number. Kindly ensure the learner's full name is quoted as the account reference.`
  },
  {
    id: 'disciplinary-letter',
    title: 'Disciplinary Letter',
    category: 'official-letters',
    description: 'Formal notice addressing breach of school rules, corrective counseling, and parent consultation appointment',
    defaultSubject: 'NOTICE OF DISCIPLINARY CONCERN AND PARENTAL CONSULTATION',
    referencePrefix: 'LRA/DISC',
    targetType: 'student',
    layout: 'letter',
    defaultBody: `The management of Little Roses Academy places supreme value on a safe, respectful, and disciplined environment for every child. We regret to inform you that the learner has been involved in an incident that contravenes the established school code of conduct.\n\nIn line with our restorative guidance and counseling philosophy, our Guidance Committee has addressed the matter. However, your presence as parent/guardian is required for an in-person conference with the Headteacher to institute restorative commitments.`
  },
  {
    id: 'warning-letter',
    title: 'Warning Letter',
    category: 'official-letters',
    description: 'Formal disciplinary warning letter issued for persistent infractions or chronic absenteeism',
    defaultSubject: 'FORMAL WARNING LETTER ON PERSISTENT INFRACTIONS',
    referencePrefix: 'LRA/WRN',
    targetType: 'student',
    layout: 'letter',
    defaultBody: `This letter serves as an official formal warning regarding repeated infractions of school regulations, specifically concerning unauthorized absence, neglect of academic tasks, or failure to adhere to school standards.\n\nPlease note that Little Roses Academy upholds high standards of discipline. Continued non-compliance after this warning may result in formal suspension or referral to the Board of Management Disciplinary Panel.\n\nYou are urgently requested to acknowledge receipt and accompany your child for a mandatory administrative interview.`
  },
  {
    id: 'staff-appointment-letter',
    title: 'Staff Appointment Letter',
    category: 'official-letters',
    description: 'Official employment contract letter detailing teaching assignment, TSC/MoE compliance, and terms of service',
    defaultSubject: 'OFFER OF APPOINTMENT AS TEACHING STAFF MEMBER',
    referencePrefix: 'LRA/HR',
    targetType: 'staff',
    layout: 'letter',
    defaultBody: `Following your successful interview and review of your professional credentials, the Board of Management is pleased to appoint you to the faculty of Little Roses Academy.\n\nIn this position, you will be assigned teaching subjects, class management responsibilities, and co-curricular duties under the guidance of the Headteacher. You will be expected to adhere to the Teachers Service Commission (TSC) professional code of conduct and our school ethos.\n\nKindly confirm your formal acceptance of this appointment by signing and returning the enclosed duplicate copy within seven days of receipt.`
  },
  {
    id: 'staff-leave-letter',
    title: 'Staff Leave Letter',
    category: 'official-letters',
    description: 'Official approval letter for annual, maternity/paternity, compassionate, or study leave for staff members',
    defaultSubject: 'OFFICIAL APPROVAL OF LEAVE OF ABSENCE',
    referencePrefix: 'LRA/HR',
    targetType: 'staff',
    layout: 'letter',
    defaultBody: `We acknowledge receipt of your formal application for leave of absence. We are pleased to advise that your leave has been officially sanctioned by the administration.\n\nYou are scheduled to resume full teaching and administrative duties on the designated resumption date. During your absence, your assigned learning areas and duty duties have been temporarily assigned to the relief teacher designated in your handover notes.\n\nWe wish you a restful leave period and look forward to welcoming you back.`
  },
  {
    id: 'general-notification-letter',
    title: 'General Notification Letter',
    category: 'official-letters',
    description: 'Versatile formal letter suitable for ministry correspondences, public health advisories, and inter-school fixtures',
    defaultSubject: 'OFFICIAL NOTIFICATION TO STAKEHOLDERS',
    referencePrefix: 'LRA/NOT',
    targetType: 'general',
    layout: 'letter',
    defaultBody: `This official notification is issued to apprise all concerned stakeholders of updated administrative arrangements and institutional directives at Little Roses Academy.\n\nAll members of the school community and relevant parties are requested to note these details and align accordingly. For any inquiries, our administrative office remains open during standard operating hours.\n\nThank you for your cooperation and continued dedication to our learners' welfare.`
  },

  // ==========================================
  // 2. ACADEMIC DOCUMENTS
  // ==========================================
  {
    id: 'student-report-card',
    title: 'Student Report Card',
    category: 'academic-documents',
    description: 'Comprehensive CBC summative and formative assessment report card with subject marks, performance levels, and teacher remarks',
    defaultSubject: 'CBC SUMMATIVE & FORMATIVE LEARNER REPORT CARD',
    referencePrefix: 'LRA/REP',
    targetType: 'student',
    layout: 'report-card',
    defaultBody: `Termly assessment of learner competencies, subject performance levels (Exceeding, Meeting, Approaching, Below Expectation), and teacher/headteacher evaluative remarks.`
  },
  {
    id: 'progress-report',
    title: 'Progress Report',
    category: 'academic-documents',
    description: 'Mid-term academic snapshot reflecting formative class tasks, CAT 1 assessments, and learner participation',
    defaultSubject: 'MID-TERM ACADEMIC & BEHAVIORAL PROGRESS REPORT',
    referencePrefix: 'LRA/PRG',
    targetType: 'student',
    layout: 'report-card',
    defaultBody: `This mid-term evaluation provides parents and teachers with an interim assessment of the learner's academic trajectory, homework completion, and core value demonstration.`
  },
  {
    id: 'assessment-cat-report',
    title: 'Assessment/CAT Report',
    category: 'academic-documents',
    description: 'Detailed analysis sheet for Continuous Assessment Tests (CAT 1 & CAT 2) across all rationalized learning areas',
    defaultSubject: 'CONTINUOUS ASSESSMENT TEST (CAT) ANALYSIS REPORT',
    referencePrefix: 'LRA/CAT',
    targetType: 'student',
    layout: 'report-card',
    defaultBody: `Official compilation of CAT 1, CAT 2, and projected End Term summative scores with class averages and mastery breakdown.`
  },
  {
    id: 'academic-transcript',
    title: 'Academic Transcript',
    category: 'academic-documents',
    description: 'Official multi-term cumulative record of academic grades, attendance percentage, and teacher appraisals',
    defaultSubject: 'OFFICIAL CUMULATIVE ACADEMIC TRANSCRIPT',
    referencePrefix: 'LRA/TRN',
    targetType: 'student',
    layout: 'report-card',
    defaultBody: `Verified institutional record reflecting cumulative subject performance, core competencies mastered, and official school seals.`
  },
  {
    id: 'student-performance-summary',
    title: 'Student Performance Summary',
    category: 'academic-documents',
    description: 'Executive grade breakdown and ranking summary for parent conferences and academic clinics',
    defaultSubject: 'COMPREHENSIVE LEARNER PERFORMANCE & COMPETENCY SUMMARY',
    referencePrefix: 'LRA/PRF',
    targetType: 'student',
    layout: 'report-card',
    defaultBody: `Summary of learner's performance trajectory, strengths in specific learning areas, areas requiring remedial attention, and co-curricular contributions.`
  },
  {
    id: 'examination-timetable',
    title: 'Examination Timetable',
    category: 'academic-documents',
    description: 'Official schedule for end-term examinations and KPSEA rehearsals with invigilation slots and rooms',
    defaultSubject: 'OFFICIAL END-TERM & KPSEA REHEARSAL EXAMINATION TIMETABLE',
    referencePrefix: 'LRA/EXAM',
    targetType: 'general',
    layout: 'table-ledger',
    defaultBody: `Below is the official timetable for the scheduled terminal examinations. Learners are advised to adhere strictly to time and examination regulations.`
  },
  {
    id: 'academic-calendar',
    title: 'Academic Calendar',
    category: 'academic-documents',
    description: 'Annual and termly schedule highlighting opening dates, mid-term breaks, assessment windows, and closing ceremonies',
    defaultSubject: 'ANNUAL ACADEMIC & ACTIVITIES CALENDAR',
    referencePrefix: 'LRA/CAL',
    targetType: 'general',
    layout: 'table-ledger',
    defaultBody: `Official MoE aligned calendar of events, school assessment dates, public holidays, sports days, and parent-teacher consultative clinics.`
  },
  {
    id: 'certificate-of-completion',
    title: 'Certificate of Completion',
    category: 'academic-documents',
    description: 'Prestigious completion certificate honoring primary education completion, exemplary character, and CBC competence',
    defaultSubject: 'CERTIFICATE OF PRIMARY EDUCATION COMPLETION',
    referencePrefix: 'LRA/CERT',
    targetType: 'student',
    layout: 'certificate',
    defaultBody: `This is to certify that the learner has successfully fulfilled the prescribed curriculum requirements for Primary Education with distinction.`
  },

  // ==========================================
  // 3. STUDENT DOCUMENTS
  // ==========================================
  {
    id: 'student-admission-form',
    title: 'Student Admission Form',
    category: 'student-documents',
    description: 'Official intake biodata document capturing learner details, birth certificate number, NEMIS UPI, and parental declarations',
    defaultSubject: 'OFFICIAL LEARNER ADMISSION & BIO-DATA DOSSIER',
    referencePrefix: 'LRA/ADM-F',
    targetType: 'student',
    layout: 'form',
    defaultBody: `Comprehensive admission biodata for new learners enrolling into Little Roses Academy.`
  },
  {
    id: 'student-registration-form',
    title: 'Student Registration Form',
    category: 'student-documents',
    description: 'Annual enrollment validation and class placement register sheet',
    defaultSubject: 'ANNUAL LEARNER REGISTRATION & CLASS REGISTER FORM',
    referencePrefix: 'LRA/REG-F',
    targetType: 'student',
    layout: 'form',
    defaultBody: `Annual registration verification ensuring contact details, residential addresses, and emergency contacts are up to date.`
  },
  {
    id: 'student-profile',
    title: 'Student Profile',
    category: 'student-documents',
    description: 'Full learner dossier with biographical details, academic summary, attendance track record, and medical notices',
    defaultSubject: 'OFFICIAL CONFIDENTIAL LEARNER PROFILE & DOSSIER',
    referencePrefix: 'LRA/PRF-D',
    targetType: 'student',
    layout: 'form',
    defaultBody: `Consolidated permanent student file tracking enrollment history, academic progress, and health notes.`
  },
  {
    id: 'student-attendance-report',
    title: 'Student Attendance Report',
    category: 'student-documents',
    description: 'Termly attendance analysis sheet with days present, excused absences, unexcused absences, and percentage rate',
    defaultSubject: 'OFFICIAL LEARNER ATTENDANCE & PUNCTUALITY AUDIT',
    referencePrefix: 'LRA/ATT-S',
    targetType: 'student',
    layout: 'form',
    defaultBody: `Termly audit of learner presence, class attendance compliance, and morning assembly punctuality.`
  },
  {
    id: 'student-transfer-form',
    title: 'Student Transfer Form',
    category: 'student-documents',
    description: 'Statutory form detailing transfer justification, NEMIS release data, and receiving school particulars',
    defaultSubject: 'MINISTRY OF EDUCATION COMPLIANT TRANSFER CLEARANCE FORM',
    referencePrefix: 'LRA/TRF-F',
    targetType: 'student',
    layout: 'form',
    defaultBody: `Official transfer request and transition document compliant with Ministry of Education regulations.`
  },
  {
    id: 'student-clearance-form',
    title: 'Student Clearance Form',
    category: 'student-documents',
    description: 'Departmental clearance voucher certifying return of textbooks, sports equipment, boarding/lunch fee settlement',
    defaultSubject: 'INSTITUTIONAL DEPARTURE & PROPERTY CLEARANCE FORM',
    referencePrefix: 'LRA/CLR-F',
    targetType: 'student',
    layout: 'form',
    defaultBody: `Mandatory clearance certificate covering Class Teacher, School Librarian, Sports Master, and Accounts Office.`
  },
  {
    id: 'parent-guardian-information-form',
    title: 'Parent/Guardian Information Form',
    category: 'student-documents',
    description: 'Confidential guardian contact registry, emergency authorization, and legal custody declarations',
    defaultSubject: 'CONFIDENTIAL PARENT/GUARDIAN CONTACT & IDENTIFICATION FORM',
    referencePrefix: 'LRA/PRN-F',
    targetType: 'student',
    layout: 'form',
    defaultBody: `Registry form recording parent/guardian identity numbers, employment details, and verified WhatsApp/SMS numbers.`
  },
  {
    id: 'student-medical-form',
    title: 'Student Medical/Important Information Form',
    category: 'student-documents',
    description: 'Vital health disclosure document covering allergies, chronic ailments, emergency medical consent, and physician contacts',
    defaultSubject: 'CONFIDENTIAL LEARNER MEDICAL & EMERGENCY PROTOCOL FORM',
    referencePrefix: 'LRA/MED-F',
    targetType: 'student',
    layout: 'form',
    defaultBody: `Health and emergency medical treatment authorization retained in the School Clinic and Headteacher's office.`
  },

  // ==========================================
  // 4. STAFF DOCUMENTS
  // ==========================================
  {
    id: 'staff-information-form',
    title: 'Staff Information Form',
    category: 'staff-documents',
    description: 'Comprehensive staff profile covering TSC registration number, academic credentials, KRA PIN, and NHIF/NSSF numbers',
    defaultSubject: 'CONFIDENTIAL FACULTY & STAFF EMPLOYEE RECORD',
    referencePrefix: 'LRA/STF-F',
    targetType: 'staff',
    layout: 'form',
    defaultBody: `Official human resource dossier capturing teacher professional qualifications and personal bio-data.`
  },
  {
    id: 'staff-attendance-report',
    title: 'Staff Attendance Report',
    category: 'staff-documents',
    description: 'Monthly faculty clock-in, lesson attendance audit, and duty supervision log',
    defaultSubject: 'MONTHLY STAFF ATTENDANCE & LESSON DELIVERY AUDIT',
    referencePrefix: 'LRA/ATT-T',
    targetType: 'staff',
    layout: 'form',
    defaultBody: `Monthly executive report monitoring teaching staff punctuality, daily lesson attendance, and assembly duty.`
  },
  {
    id: 'staff-duty-roster',
    title: 'Staff Duty Roster',
    category: 'staff-documents',
    description: 'Weekly schedule designating Teachers on Duty (TOD), dining hall supervisors, and gate safety monitoring teams',
    defaultSubject: 'WEEKLY TEACHERS ON DUTY (TOD) & SUPERVISION ROSTER',
    referencePrefix: 'LRA/DUTY',
    targetType: 'general',
    layout: 'roster',
    defaultBody: `Master duty roster detailing weekly staff assignments for morning devotions, breaktime patrol, and gate clearance.`
  },
  {
    id: 'staff-appointment-doc',
    title: 'Staff Appointment Contract',
    category: 'staff-documents',
    description: 'Formal employment agreement specifying role, remuneration, code of ethics, and probation guidelines',
    defaultSubject: 'FORMAL TEACHING FACULTY SERVICE CONTRACT',
    referencePrefix: 'LRA/CON',
    targetType: 'staff',
    layout: 'letter',
    defaultBody: `Terms and conditions governing appointment as an educator at Little Roses Academy, Nakuru.`
  },
  {
    id: 'staff-leave-application',
    title: 'Staff Leave Application Form',
    category: 'staff-documents',
    description: 'Official leave request form with handover plan, relief teacher assignment, and headteacher sign-off',
    defaultSubject: 'FORMAL APPLICATION FOR LEAVE OF ABSENCE',
    referencePrefix: 'LRA/LV-F',
    targetType: 'staff',
    layout: 'form',
    defaultBody: `Formal leave clearance form specifying category of leave, duration, lesson coverage plan, and executive approval.`
  },
  {
    id: 'staff-warning-letter',
    title: 'Staff Warning Letter',
    category: 'staff-documents',
    description: 'Administrative advisory addressing professional lapses, unexcused absence, or breach of TSC standards',
    defaultSubject: 'ADMINISTRATIVE WARNING NOTICE ON PROFESSIONAL CONDUCT',
    referencePrefix: 'LRA/HR-W',
    targetType: 'staff',
    layout: 'letter',
    defaultBody: `Official administrative correspondence highlighting professional duty obligations and required immediate remedies.`
  },
  {
    id: 'staff-meeting-minutes',
    title: 'Staff Meeting Minutes',
    category: 'staff-documents',
    description: 'Structured minutes document capturing agenda, attendees, matters arising, deliberations, and resolutions',
    defaultSubject: 'MINUTES OF THE GENERAL STAFF & PEDAGOGY MEETING',
    referencePrefix: 'LRA/MIN',
    targetType: 'general',
    layout: 'minutes',
    defaultBody: `Formal record of proceedings, resolutions, and actionable responsibilities from the faculty meeting.`
  },
  {
    id: 'staff-evaluation-form',
    title: 'Staff Evaluation Form',
    category: 'staff-documents',
    description: 'CBC Teacher Performance Appraisal and Development (TPAD) evaluation form assessing lesson plans, pedagogy, and conduct',
    defaultSubject: 'ANNUAL TEACHER PERFORMANCE APPRAISAL & EVALUATION (TPAD)',
    referencePrefix: 'LRA/EVAL',
    targetType: 'staff',
    layout: 'form',
    defaultBody: `Comprehensive evaluation instrument assessing curriculum implementation, learner engagement, and community cooperation.`
  },

  // ==========================================
  // 5. FINANCE DOCUMENTS
  // ==========================================
  {
    id: 'fee-structure',
    title: 'Fee Structure',
    category: 'finance-documents',
    description: 'Official itemized tuition and amenities fee schedule for Playgroup to Grade 6 across Term 1, 2, and 3',
    defaultSubject: 'OFFICIAL ANNUAL & TERMLY SCHOOL FEE STRUCTURE',
    referencePrefix: 'LRA/FEE-S',
    targetType: 'general',
    layout: 'table-ledger',
    defaultBody: `Approved institutional fee breakdown covering tuition, CBC learning materials, lunch program, and transport zones.`
  },
  {
    id: 'student-fee-invoice',
    title: 'Student Fee Invoice',
    category: 'finance-documents',
    description: 'Numbered termly invoice issued to parent/guardian detailing voteheads, opening balance, and total payable',
    defaultSubject: 'OFFICIAL TERMLY SCHOOL FEE INVOICE',
    referencePrefix: 'LRA/INV',
    targetType: 'student',
    layout: 'invoice-receipt',
    defaultBody: `Official termly bill reflecting vote-head breakdown, previous balances, and authorized school banking details.`
  },
  {
    id: 'fee-statement',
    title: 'Fee Statement',
    category: 'finance-documents',
    description: 'Cumulative ledger showing debit billings, credits/receipts, payment modes, and current running balance',
    defaultSubject: 'OFFICIAL CUMULATIVE LEARNER FEE STATEMENT',
    referencePrefix: 'LRA/STM',
    targetType: 'student',
    layout: 'invoice-receipt',
    defaultBody: `Financial transaction statement detailing date-wise receipts, bank deposits, and current net balance.`
  },
  {
    id: 'official-payment-receipt',
    title: 'Official Payment Receipt',
    category: 'finance-documents',
    description: 'Numbered official school receipt acknowledging fee deposit via M-Pesa, Bank, or Banker’s Cheque with verification stamp',
    defaultSubject: 'OFFICIAL PAYMENT RECEIPT',
    referencePrefix: 'LRA/REC-F',
    targetType: 'student',
    layout: 'invoice-receipt',
    defaultBody: `Official legal acknowledgment of school fee deposit received into Little Roses Academy accounts.`
  },
  {
    id: 'fee-payment-acknowledgement',
    title: 'Fee Payment Acknowledgement',
    category: 'finance-documents',
    description: 'Formal appreciation letter confirming receipt of school fees and updating learner clearance status',
    defaultSubject: 'ACKNOWLEDGEMENT OF SCHOOL FEE PAYMENT',
    referencePrefix: 'LRA/ACK-F',
    targetType: 'student',
    layout: 'letter',
    defaultBody: `We gratefully acknowledge receipt of your school fee remittance for the current academic term.\n\nThe learner's account has been successfully updated with our accounts office, and all clearance privileges remain in full effect. Thank you for your proactive partnership in supporting quality education.`
  },
  {
    id: 'fee-reminder-doc',
    title: 'Fee Reminder Notice',
    category: 'finance-documents',
    description: 'Urgent statement outlining pending school fee arrears with final deadline and account details',
    defaultSubject: 'URGENT REMINDER: OUTSTANDING SCHOOL DUES',
    referencePrefix: 'LRA/FEE-R',
    targetType: 'student',
    layout: 'invoice-receipt',
    defaultBody: `Important notice alerting parent/guardian to outstanding fee balance and requesting prompt remittance before the mid-term assessment window.`
  },
  {
    id: 'expense-voucher',
    title: 'Expense Voucher',
    category: 'finance-documents',
    description: 'Internal disbursement and petty cash payment voucher with votehead, authorized signature, and supporting receipt tags',
    defaultSubject: 'INTERNAL EXPENDITURE & PETTY CASH DISBURSEMENT VOUCHER',
    referencePrefix: 'LRA/VOUCH',
    targetType: 'finance',
    layout: 'table-ledger',
    defaultBody: `Institutional payment voucher accounting for school maintenance, teaching aids procurement, and administrative supplies.`
  },

  // ==========================================
  // 6. SCHOOL COMMUNICATION
  // ==========================================
  {
    id: 'parent-circular',
    title: 'Parent Circular',
    category: 'school-communication',
    description: 'End-of-term or term-opening executive newsletter highlighting academic achievements, holiday assignments, and key dates',
    defaultSubject: 'EXECUTIVE NEWSLETTER & GENERAL PARENT CIRCULAR',
    referencePrefix: 'LRA/CIR',
    targetType: 'general',
    layout: 'letter',
    defaultBody: `As we conclude an extraordinarily productive and rewarding academic term, the administration, teachers, and pupils of Little Roses Academy extend their sincere gratitude for your steadfast support.\n\nOur learners have accomplished outstanding milestones across both formative assessments and CBC co-curricular projects. Please review the important dates and requirements outlined below for the upcoming term.`
  },
  {
    id: 'staff-memo',
    title: 'Staff Memo',
    category: 'school-communication',
    description: 'Internal administrative memorandum to teaching and support staff regarding deadlines, duty, or institutional policy',
    defaultSubject: 'INTERNAL ADMINISTRATIVE MEMORANDUM TO ALL STAFF',
    referencePrefix: 'LRA/MEMO',
    targetType: 'general',
    layout: 'letter',
    defaultBody: `This internal memorandum serves to remind all faculty members of upcoming curriculum submission deadlines, lesson plan verifications, and duty obligations.\n\nEvery teacher is requested to ensure all records of work and learner portfolios are updated and submitted to the Head of Curriculum before the stipulated close of business.`
  },
  {
    id: 'school-notice',
    title: 'School Notice',
    category: 'school-communication',
    description: 'Official bulletin board notification for students, parents, and visitors concerning campus regulations or calendar updates',
    defaultSubject: 'OFFICIAL INSTITUTIONAL NOTICE & CAMPUS BULLETIN',
    referencePrefix: 'LRA/BUL',
    targetType: 'general',
    layout: 'letter',
    defaultBody: `Notice is hereby given to all members of the school community regarding updated campus protocols, visiting hours, and safety guidelines.\n\nCompliance with these guidelines ensures a safe, conducive learning atmosphere for our children. Your cooperation is highly valued.`
  },
  {
    id: 'parent-meeting-invitation',
    title: 'Parent Meeting Invitation',
    category: 'school-communication',
    description: 'Formal invitation to Annual General Meeting (AGM), Grade-level conference, or Academic Clinic',
    defaultSubject: 'INVITATION TO ANNUAL GENERAL PARENT MEETING (AGM)',
    referencePrefix: 'LRA/AGM',
    targetType: 'general',
    layout: 'letter',
    defaultBody: `The Board of Management and Headteacher cordially invite all parents and guardians to our upcoming consultative meeting at the school main hall.\n\nKey agenda items will include a comprehensive review of academic performance, infrastructure developments, and collaborative strategies to nurture our children's potential under the CBC curriculum.\n\nPlease ensure you attend punctually; your presence and voice are invaluable.`
  },
  {
    id: 'staff-meeting-notice',
    title: 'Staff Meeting Notice',
    category: 'school-communication',
    description: 'Convocation notice for academic staff meetings with detailed agenda and required documentation',
    defaultSubject: 'CONVOCATION NOTICE: FULL FACULTY ACADEMIC BRIEFING',
    referencePrefix: 'LRA/MTG-T',
    targetType: 'general',
    layout: 'letter',
    defaultBody: `Notice is hereby given that a full faculty academic staff meeting will take place in the staff conference room.\n\nAll teachers are required to bring their updated schemes of work, lesson plan sheets, and learner continuous assessment records. Punctual attendance is mandatory.`
  },
  {
    id: 'school-event-invitation',
    title: 'School Event Invitation',
    category: 'school-communication',
    description: 'Invitation card and letter for Sports Day, Prize Giving Day, Cultural Extravaganza, or Grade 6 Graduation',
    defaultSubject: 'INVITATION TO ANNUAL PRIZE GIVING & SPORTS EXTRAVAGANZA',
    referencePrefix: 'LRA/EVT',
    targetType: 'general',
    layout: 'letter',
    defaultBody: `We take immense pride in inviting you to celebrate our learners' exceptional talents and accomplishments at our Annual Prize Giving and Cultural Day.\n\nThe day will feature vibrant student performances, academic prize awards, creative exhibitions, and speeches by distinguished guests.\n\nWe warmly welcome you to share in this joyous celebration of excellence.`
  },
  {
    id: 'general-announcement',
    title: 'General Announcement',
    category: 'school-communication',
    description: 'Public community announcement on admissions, school transport routes, or holiday clinics',
    defaultSubject: 'PUBLIC ANNOUNCEMENT: LITTLE ROSES ACADEMY COMMUNITY UPDATE',
    referencePrefix: 'LRA/ANN',
    targetType: 'general',
    layout: 'letter',
    defaultBody: `Little Roses Academy is pleased to announce the commencement of admissions for the upcoming academic year across Playgroup, PP1, PP2, and Grades 1 through 6.\n\nOur institution offers state-of-the-art CBC learning environments, dedicated and certified educators, reliable school transport, and nutritious dining services.\n\nLimited vacancies are available on a first-come, first-served basis.`
  }
];

export const DEFAULT_DOCUMENT_SETTINGS = {
  numberingPrefix: 'LRA',
  numberingFormat: '{PREFIX}/{DEPT}/{YEAR}/{NUM}',
  nextSequence: 101,
  defaultHeadTeacherName: 'Mr. Kelvin Kiiru',
  defaultHeadTeacherTitle: 'Headteacher / Principal',
  showDigitalStamp: true,
  showDigitalSignature: true,
  watermarkText: 'LITTLE ROSES ACADEMY',
  schoolMotto: 'Much from Little',
  schoolEmail: 'info@littleroses.ac.ke',
  schoolPhone: '0798 193966',
  schoolAddress: 'P.O. Box 3443 NAKURU, Kenya',
  schoolCode: '3661102004'
};
