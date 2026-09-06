import React from 'react';
import { SchoolLetterhead, OfficialSchoolFooter } from './SchoolLetterhead';
import { DocumentTemplate, SavedDocument } from './DocumentTypes';
import { Student, StaffMember, SystemConfig } from '../../../types';
import { SchoolLogo } from '../../SchoolLogo';

interface DocumentViewerA4Props {
  documentData: Partial<SavedDocument>;
  template?: DocumentTemplate;
  student?: Student;
  staff?: StaffMember;
  systemConfig?: SystemConfig;
  className?: string;
  id?: string;
}

export const DocumentViewerA4: React.FC<DocumentViewerA4Props> = ({
  documentData,
  template,
  student,
  staff,
  systemConfig,
  className = '',
  id = 'printable-document-root'
}) => {
  const layout = template?.layout || 'letter';
  const customData = documentData.customData || {};
  const meta = systemConfig?.school_metadata;

  // Format date
  const displayDate = documentData.date || new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const refNumber = documentData.referenceNumber || 'LRA/DOC/2026/001';
  const headName = documentData.headTeacherName || meta?.head_teacher_name || 'Mr. Kelvin Kiiru';
  const headTitle = documentData.headTeacherTitle || 'Headteacher / Principal';
  const showStamp = documentData.includeStamp ?? true;
  const showSignature = documentData.includeSignature ?? true;
  const watermark = documentData.watermark;

  return (
    <div
      id={id}
      className={`relative bg-white text-slate-900 shadow-2xl rounded-sm mx-auto p-6 sm:p-10 transition-all font-sans print:p-8 print:shadow-none print:m-0 print:w-full print:max-w-none ${className}`}
      style={{
        width: '100%',
        maxWidth: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box'
      }}
    >
      {/* Optional Watermark */}
      {watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden z-0">
          <span className="text-8xl font-black font-serif uppercase tracking-widest rotate-[-35deg] text-slate-950">
            {watermark}
          </span>
        </div>
      )}

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col justify-between min-h-[265mm]">
        <div>
          {/* Header & Letterhead */}
          {layout === 'certificate' ? (
            // Special Certificate Header
            <div className="text-center pb-6 border-b-4 border-double border-amber-600">
              <div className="flex justify-center mb-3">
                <SchoolLogo size="xl" badgeOnly />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black font-serif uppercase tracking-widest text-emerald-950">
                {meta?.school_name || 'LITTLE ROSES ACADEMY'}
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-rose-700 mt-1">
                {meta?.county || 'Nakuru County'} • Kenya • CBC Centre of Excellence
              </p>
              <p className="text-xs italic text-amber-800 font-serif font-bold mt-1">
                "{meta?.motto || 'Much from Little'}"
              </p>
            </div>
          ) : (
            <SchoolLetterhead
              systemConfig={systemConfig}
              referenceNumber={refNumber}
              date={displayDate}
            />
          )}

          {/* Recipient Details & Target Info */}
          {layout !== 'certificate' && (
            <div className="mt-4 mb-5 text-xs text-slate-800 space-y-1">
              {documentData.recipientName ? (
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">To:</span>
                  <div className="font-black text-slate-900 text-sm">{documentData.recipientName}</div>
                  {documentData.recipientTitle && (
                    <div className="text-slate-600 font-medium">{documentData.recipientTitle}</div>
                  )}
                  {documentData.recipientAddress && (
                    <div className="text-slate-500">{documentData.recipientAddress}</div>
                  )}
                </div>
              ) : student ? (
                <div className="grid grid-cols-2 gap-4 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Learner Name:</span>
                    <span className="font-black text-slate-900 text-sm">{student.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Class / Grade:</span>
                    <span className="font-black text-emerald-900 text-sm">{student.grade}</span>
                    {student.parentName && (
                      <span className="text-[11px] text-slate-600 block mt-0.5">Parent / Guardian: <strong>{student.parentName}</strong></span>
                    )}
                  </div>
                </div>
              ) : staff ? (
                <div className="grid grid-cols-2 gap-4 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Staff Member:</span>
                    <span className="font-black text-slate-900 text-sm">{staff.name}</span>
                    <span className="text-[11px] text-slate-600 block">Designation / Role: <strong>{staff.role}</strong></span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Employment Details:</span>
                    <span className="font-black text-emerald-900 text-sm font-mono">TSC: {staff.tscNumber || 'LRA-REG'}</span>
                    <span className="text-[11px] text-slate-600 block">Phone: {staff.phone || '0700 000000'}</span>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Subject Line */}
          {documentData.subject && layout !== 'certificate' && (
            <div className="my-4 pb-2">
              <h2 className="text-sm sm:text-base font-black uppercase text-slate-900 tracking-wide border-b-2 border-slate-900 pb-1 font-heading inline-block">
                RE: {documentData.subject}
              </h2>
            </div>
          )}

          {/* Dynamic Body according to Layout */}
          {layout === 'letter' && (
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 font-normal text-justify whitespace-pre-line">
              {documentData.bodyText || template?.defaultBody || 'Official correspondence from Little Roses Academy.'}
            </div>
          )}

          {layout === 'report-card' && (
            <ReportCardLayout
              student={student}
              systemConfig={systemConfig}
              customData={customData}
              bodyText={documentData.bodyText}
            />
          )}

          {layout === 'invoice-receipt' && (
            <InvoiceReceiptLayout
              templateId={template?.id}
              student={student}
              customData={customData}
              systemConfig={systemConfig}
              bodyText={documentData.bodyText}
            />
          )}

          {layout === 'form' && (
            <FormDossierLayout
              templateId={template?.id}
              student={student}
              staff={staff}
              customData={customData}
              bodyText={documentData.bodyText}
            />
          )}

          {layout === 'table-ledger' && (
            <TableLedgerLayout
              templateId={template?.id}
              customData={customData}
              bodyText={documentData.bodyText}
            />
          )}

          {layout === 'certificate' && (
            <CertificateLayout
              student={student}
              customData={customData}
              bodyText={documentData.bodyText}
              headName={headName}
            />
          )}

          {layout === 'minutes' && (
            <MinutesLayout
              customData={customData}
              bodyText={documentData.bodyText}
            />
          )}

          {layout === 'roster' && (
            <DutyRosterLayout
              customData={customData}
              bodyText={documentData.bodyText}
            />
          )}
        </div>

        {/* Official Footer with Signoff and Rubber Stamp */}
        {layout !== 'certificate' && (
          <OfficialSchoolFooter
            headTeacherName={headName}
            headTeacherTitle={headTitle}
            showStamp={showStamp}
            showSignature={showSignature}
            schoolMotto={meta?.motto || 'Much from Little'}
            schoolPhone={meta?.phone || '0798 193966'}
            schoolEmail={meta?.email || 'info@littleroses.ac.ke'}
            date={displayDate}
          />
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// SUB-LAYOUT: REPORT CARD
// ----------------------------------------------------
const ReportCardLayout: React.FC<{
  student?: Student;
  systemConfig?: SystemConfig;
  customData: Record<string, any>;
  bodyText?: string;
}> = ({ student, systemConfig, customData, bodyText }) => {
  const subjects = student?.catMarks ? Object.keys(student.catMarks) : [
    'English Language Activities',
    'Kiswahili Language Activities',
    'Mathematical Activities',
    'Environmental Activities',
    'Creative Activities',
    'Religious Education Activities'
  ];

  return (
    <div className="space-y-4 text-xs">
      {bodyText && <p className="text-slate-700 italic">{bodyText}</p>}

      {/* CBC Performance Descriptors Legend */}
      <div className="grid grid-cols-4 gap-2 text-center text-[10px] p-2 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="p-1 bg-emerald-100/70 border border-emerald-300 rounded text-emerald-950 font-bold">
          EE: Exceeding Expectation (80-100%)
        </div>
        <div className="p-1 bg-blue-100/70 border border-blue-300 rounded text-blue-950 font-bold">
          ME: Meeting Expectation (60-79%)
        </div>
        <div className="p-1 bg-amber-100/70 border border-amber-300 rounded text-amber-950 font-bold">
          AE: Approaching Expectation (40-59%)
        </div>
        <div className="p-1 bg-rose-100/70 border border-rose-300 rounded text-rose-950 font-bold">
          BE: Below Expectation (0-39%)
        </div>
      </div>

      {/* Assessment Table */}
      <div className="border border-slate-300 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-900 text-white text-[10px] uppercase font-bold">
              <th className="p-2 border-r border-emerald-800">Learning Area / Subject</th>
              <th className="p-2 text-center border-r border-emerald-800 w-16">CAT 1 (30)</th>
              <th className="p-2 text-center border-r border-emerald-800 w-16">CAT 2 (30)</th>
              <th className="p-2 text-center border-r border-emerald-800 w-20">End Term (40)</th>
              <th className="p-2 text-center border-r border-emerald-800 w-20">Total (100)</th>
              <th className="p-2 text-center border-r border-emerald-800 w-16">Level</th>
              <th className="p-2">Teacher's Competency Remark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-[11px]">
            {subjects.map((sub, idx) => {
              const markObj = student?.catMarks?.[sub as any];
              const cat1 = markObj?.cat1 ?? 24;
              const cat2 = markObj?.cat2 ?? 25;
              const endTerm = markObj?.endTerm ?? 34;
              const total = cat1 + cat2 + endTerm;
              let level = 'ME';
              let badgeColor = 'text-blue-700 bg-blue-50';
              if (total >= 80) { level = 'EE'; badgeColor = 'text-emerald-700 bg-emerald-50'; }
              else if (total < 60 && total >= 40) { level = 'AE'; badgeColor = 'text-amber-700 bg-amber-50'; }
              else if (total < 40) { level = 'BE'; badgeColor = 'text-rose-700 bg-rose-50'; }

              return (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-2 font-bold text-slate-900 border-r border-slate-200">{sub}</td>
                  <td className="p-2 text-center font-mono border-r border-slate-200">{cat1}</td>
                  <td className="p-2 text-center font-mono border-r border-slate-200">{cat2}</td>
                  <td className="p-2 text-center font-mono border-r border-slate-200">{endTerm}</td>
                  <td className="p-2 text-center font-black font-mono border-r border-slate-200 text-emerald-950">{total}</td>
                  <td className="p-2 text-center font-bold border-r border-slate-200">
                    <span className={`px-1.5 py-0.5 rounded font-black text-[10px] ${badgeColor}`}>
                      {level}
                    </span>
                  </td>
                  <td className="p-2 text-[10px] text-slate-600">
                    {total >= 80 ? 'Demonstrates superior critical mastery and leadership in practical exercises.' :
                     total >= 60 ? 'Consistently meets learning outcomes with active class participation.' :
                     total >= 40 ? 'Fair conceptual grasp; recommend targeted remedial practice.' :
                     'Needs focused guidance in foundational literacy and numeracy activities.'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Holistic Values & Attendance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
          <span className="font-bold text-[10px] uppercase text-emerald-900 block">CBC Core Values Observed</span>
          <div className="flex flex-wrap gap-1 text-[10px]">
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-medium">Responsibility: Exemplary</span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-medium">Respect: High</span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-medium">Integrity: Commendable</span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-medium">Cooperation: Active</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
          <span className="font-bold text-[10px] uppercase text-emerald-900 block">Attendance & Term Trajectory</span>
          <p className="text-[11px] text-slate-700">
            Term Attendance Rate: <strong className="font-mono text-emerald-900">{student?.attendanceRate || 96}%</strong> (Present 68 / 70 Days)
          </p>
          <p className="text-[11px] text-slate-700">
            Next Term Opens: <strong>4th January, 2027</strong>
          </p>
        </div>
      </div>

      {/* Evaluator Remarks */}
      <div className="p-3 bg-white border-2 border-emerald-900/40 rounded-lg space-y-2">
        <div>
          <span className="text-[10px] font-black uppercase text-slate-500 block">Class Teacher's Evaluative Remark:</span>
          <p className="text-[11px] text-slate-800 italic font-serif">
            "{student?.teacherRemarks || customData.teacherRemarks || 'A focused, hardworking learner with great potential and keen interest in creative arts and mathematics. Keep up the high standard!'}"
          </p>
        </div>
        <div className="pt-2 border-t border-slate-200">
          <span className="text-[10px] font-black uppercase text-slate-500 block">Headteacher's Formal Remarks:</span>
          <p className="text-[11px] text-slate-800 italic font-serif">
            "{student?.headteacherRemarks || customData.headteacherRemarks || 'Very commendable achievement this term. The learner exhibits sound moral fiber and steady academic growth.'}"
          </p>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// SUB-LAYOUT: INVOICE / RECEIPT / STATEMENT
// ----------------------------------------------------
const InvoiceReceiptLayout: React.FC<{
  templateId?: string;
  student?: Student;
  customData: Record<string, any>;
  systemConfig?: SystemConfig;
  bodyText?: string;
}> = ({ templateId, student, customData, systemConfig, bodyText }) => {
  const isReceipt = templateId === 'official-payment-receipt';
  const isStatement = templateId === 'fee-statement';

  const defaultVoteheads = [
    { name: 'Tuition & CBC Learning Materials', amount: 9500 },
    { name: 'Midday Hot Meal & Catering Program', amount: 4500 },
    { name: 'Co-Curricular, Sports & Cultural Activities', amount: 1200 },
    { name: 'School Medical & First Aid Retainer', amount: 800 },
    { name: 'Continuous Assessment & Examination Printing', amount: 1500 },
    { name: 'ICT & Science Technology Lab Levy', amount: 1000 }
  ];

  const totalBill = defaultVoteheads.reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = customData.amountPaid ?? (isReceipt ? 18500 : 12000);
  const balanceDue = Math.max(0, totalBill - paidAmount);

  return (
    <div className="space-y-4 text-xs">
      {bodyText && <p className="text-slate-700">{bodyText}</p>}

      {/* Financial Header Box */}
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-emerald-800 font-bold uppercase block">Document Type</span>
          <span className="text-base font-black text-emerald-950 uppercase">
            {isReceipt ? 'Official Payment Receipt' : isStatement ? 'Fee Statement Ledger' : 'Student Termly Invoice'}
          </span>
        </div>
        <div className="text-right font-mono">
          <span className="text-[10px] text-emerald-800 font-bold uppercase block">
            {isReceipt ? 'Receipt No:' : 'Invoice No:'}
          </span>
          <span className="font-bold text-sm text-slate-900">
            {customData.financialRefNo || (isReceipt ? 'LRA-REC-2026-884' : 'LRA-INV-2026-102')}
          </span>
        </div>
      </div>

      {/* Transaction Items */}
      <div className="border border-slate-300 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[10px] uppercase font-bold">
              <th className="p-2.5">Item / Votehead Description</th>
              <th className="p-2.5 text-center w-24">Term / Period</th>
              <th className="p-2.5 text-right w-32">Amount (KES)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {defaultVoteheads.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="p-2.5 font-medium text-slate-900">{item.name}</td>
                <td className="p-2.5 text-center text-slate-500 font-mono text-[11px]">Term 3, 2026</td>
                <td className="p-2.5 text-right font-mono font-bold text-slate-800">{item.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
              <td colSpan={2} className="p-2.5 text-right uppercase text-[11px]">Total Term Dues:</td>
              <td className="p-2.5 text-right font-mono text-sm font-black">KES {totalBill.toLocaleString()}</td>
            </tr>
            {isReceipt ? (
              <tr className="bg-emerald-100/70 text-emerald-950 font-bold">
                <td colSpan={2} className="p-2.5 text-right uppercase text-[11px]">Amount Remitted & Verified:</td>
                <td className="p-2.5 text-right font-mono text-sm font-black text-emerald-900">KES {paidAmount.toLocaleString()}</td>
              </tr>
            ) : (
              <>
                <tr className="bg-emerald-50 text-emerald-900 font-medium">
                  <td colSpan={2} className="p-2.5 text-right uppercase text-[11px]">Amount Paid to Date:</td>
                  <td className="p-2.5 text-right font-mono text-sm font-bold">KES {paidAmount.toLocaleString()}</td>
                </tr>
                <tr className="bg-rose-50 text-rose-950 font-bold">
                  <td colSpan={2} className="p-2.5 text-right uppercase text-[11px]">Outstanding Arrears Balance:</td>
                  <td className="p-2.5 text-right font-mono text-base font-black text-rose-700">KES {balanceDue.toLocaleString()}</td>
                </tr>
              </>
            )}
          </tfoot>
        </table>
      </div>

      {/* Official Payment Channels */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
        <span className="text-[10px] font-bold uppercase text-slate-600 block">Authorized School Payment Channels:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-800">
          <div>
            <span className="font-bold text-emerald-900">M-Pesa Paybill:</span> <strong>247247</strong> • Account: <span className="font-mono font-bold text-rose-700">{student?.name || 'STUDENT ACCOUNT'}</span>
          </div>
          <div>
            <span className="font-bold text-emerald-900">Bank:</span> Equity Bank Nakuru • Acc: <strong>0310298765432</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// SUB-LAYOUT: FORM / DOSSIER
// ----------------------------------------------------
const FormDossierLayout: React.FC<{
  templateId?: string;
  student?: Student;
  staff?: StaffMember;
  customData: Record<string, any>;
  bodyText?: string;
}> = ({ templateId, student, staff, customData, bodyText }) => {
  return (
    <div className="space-y-4 text-xs">
      {bodyText && <p className="text-slate-700">{bodyText}</p>}

      {/* General Form Table Grid */}
      <div className="border border-slate-300 rounded-lg overflow-hidden">
        <div className="bg-emerald-900 text-white p-2 font-bold uppercase text-[11px] tracking-wider">
          Section A: Institutional Bio-Data & Primary Particulars
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-slate-200 text-[11px]">
          <div className="p-2 bg-slate-50">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Full Name:</span>
            <span className="font-bold text-slate-900">{student?.name || staff?.name || 'Authorized Member'}</span>
          </div>
          <div className="p-2 bg-white">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Gender:</span>
            <span className="font-medium text-slate-900">{student?.gender || 'Not Specified'}</span>
          </div>
          <div className="p-2 bg-slate-50">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Registration / Identity Reference:</span>
            <span className="font-mono font-bold text-emerald-900">{student?.name ? `LRA-LRN-${student.grade.replace(/\s+/g, '')}` : staff?.tscNumber || 'LRA-STAFF'}</span>
          </div>
          <div className="p-2 bg-white">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Grade / Faculty Department:</span>
            <span className="font-bold text-slate-900">{student?.grade || staff?.role || 'Primary Education'}</span>
          </div>
          <div className="p-2 bg-slate-50">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Date of Birth / Admission:</span>
            <span className="font-medium text-slate-900">{student?.dob || '12/04/2016'}</span>
          </div>
          <div className="p-2 bg-white">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Contact Telephone:</span>
            <span className="font-mono text-slate-900">{student?.parentPhone || staff?.phone || '0798 193966'}</span>
          </div>
        </div>
      </div>

      <div className="border border-slate-300 rounded-lg overflow-hidden">
        <div className="bg-slate-900 text-white p-2 font-bold uppercase text-[11px] tracking-wider">
          Section B: Guardian Details, Health & Emergency Declaration
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-slate-200 text-[11px]">
          <div className="p-2.5 bg-white space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Primary Contact / Parent:</span>
            <p className="font-bold text-slate-900">{student?.parentName || 'Parent / Legal Guardian'}</p>
            <p className="text-slate-600">Telephone: {student?.parentPhone || '0700 000000'}</p>
            <p className="text-slate-500 text-[10px]">Emergency Alternate: {student?.emergencyContact || '0722 000000'}</p>
          </div>
          <div className="p-2.5 bg-slate-50 space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Medical Notes & Health Alerts:</span>
            <p className="text-slate-700 italic">
              {customData.medicalAlerts || 'No known chronic allergies or dietary restrictions recorded. Fully immunized under KEPI.'}
            </p>
            <p className="text-[10px] text-emerald-800 font-semibold">Consent for First Aid: Authorized</p>
          </div>
        </div>
      </div>

      {/* Declaration Signoff */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 leading-relaxed">
        <span className="font-bold uppercase text-slate-900 block mb-1">Official Declaration & Attestation</span>
        I hereby certify that all information submitted in this form is accurate, complete, and true to the best of my knowledge. I commit to abiding by all rules, policies, and CBC educational standards established by Little Roses Academy.
        <div className="grid grid-cols-2 gap-6 mt-4 pt-2 border-t border-slate-300">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Parent / Applicant Signature:</span>
            <div className="w-full border-b border-slate-400 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Date & Registry Stamp:</span>
            <div className="w-full border-b border-slate-400 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// SUB-LAYOUT: TABLE / LEDGER / TIMETABLE
// ----------------------------------------------------
const TableLedgerLayout: React.FC<{
  templateId?: string;
  customData: Record<string, any>;
  bodyText?: string;
}> = ({ templateId, customData, bodyText }) => {
  const isTimetable = templateId === 'examination-timetable';
  const isCalendar = templateId === 'academic-calendar';

  const timetableRows = [
    { day: 'Day 1 (Monday)', time: '08:30 AM - 10:00 AM', subject: 'English Language Activities', venue: 'Main Hall', invigilator: 'Madam Faith' },
    { day: 'Day 1 (Monday)', time: '11:00 AM - 12:30 PM', subject: 'English Composition & Reading', venue: 'Main Hall', invigilator: 'Mr. David' },
    { day: 'Day 2 (Tuesday)', time: '08:30 AM - 10:00 AM', subject: 'Mathematical Activities', venue: 'Main Hall', invigilator: 'Mr. Kelvin' },
    { day: 'Day 2 (Tuesday)', time: '11:00 AM - 12:30 PM', subject: 'Science & Technology', venue: 'Main Hall', invigilator: 'Madam Grace' },
    { day: 'Day 3 (Wednesday)', time: '08:30 AM - 10:00 AM', subject: 'Kiswahili Lugha', venue: 'Main Hall', invigilator: 'Mr. Dennis' },
    { day: 'Day 3 (Wednesday)', time: '11:00 AM - 12:30 PM', subject: 'Kiswahili Insha & Kusoma', venue: 'Main Hall', invigilator: 'Madam Mary' },
    { day: 'Day 4 (Thursday)', time: '08:30 AM - 10:00 AM', subject: 'Social Studies & CRE', venue: 'Main Hall', invigilator: 'Mr. Brian' },
    { day: 'Day 4 (Thursday)', time: '11:00 AM - 12:30 PM', subject: 'Creative Arts & Music', venue: 'Main Hall', invigilator: 'Madam Faith' }
  ];

  return (
    <div className="space-y-4 text-xs">
      {bodyText && <p className="text-slate-700 leading-relaxed">{bodyText}</p>}

      <div className="border border-slate-300 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-900 text-white text-[10px] uppercase font-bold">
              <th className="p-2.5">Scheduled Day</th>
              <th className="p-2.5">Time Slot</th>
              <th className="p-2.5">Learning Area / Examination</th>
              <th className="p-2.5">Venue</th>
              <th className="p-2.5">Invigilator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-[11px]">
            {timetableRows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                <td className="p-2.5 font-bold text-slate-900">{row.day}</td>
                <td className="p-2.5 font-mono text-slate-600">{row.time}</td>
                <td className="p-2.5 font-bold text-emerald-950">{row.subject}</td>
                <td className="p-2.5 text-slate-600">{row.venue}</td>
                <td className="p-2.5 text-slate-700 font-medium">{row.invigilator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-950">
        <strong>Examination Code of Conduct:</strong> All candidates must be seated 15 minutes before exam commencement. No unauthorized revision notes, digital gadgets, or communication devices are permitted into the examination room.
      </div>
    </div>
  );
};

// ----------------------------------------------------
// SUB-LAYOUT: CERTIFICATE
// ----------------------------------------------------
const CertificateLayout: React.FC<{
  student?: Student;
  customData: Record<string, any>;
  bodyText?: string;
  headName?: string;
}> = ({ student, customData, bodyText, headName }) => {
  return (
    <div className="py-6 text-center space-y-6">
      <p className="text-xs font-serif uppercase tracking-widest text-slate-600">
        This is to certify with highest institutional honors that
      </p>

      <div className="py-2">
        <h2 className="text-3xl sm:text-4xl font-serif font-black uppercase text-emerald-950 tracking-wide underline decoration-amber-500 decoration-2 underline-offset-8">
          {student?.name || 'STUDENT NAME'}
        </h2>
      </div>

      <p className="text-sm font-serif text-slate-800 max-w-lg mx-auto leading-relaxed">
        has diligently fulfilled the prescribed course of Competency-Based Education (CBC) curriculum requirements for Primary Education with exemplary discipline, leadership, and moral character.
      </p>

      {/* Gold Seal / Badge */}
      <div className="py-3 flex justify-center">
        <div className="w-24 h-24 rounded-full border-4 border-amber-500 bg-amber-50 flex items-center justify-center shadow-lg p-1">
          <div className="w-full h-full rounded-full border border-dashed border-amber-600 flex flex-col items-center justify-center">
            <span className="text-[8px] font-black text-amber-800 uppercase tracking-wider">EXCELLENCE</span>
            <span className="text-[10px] font-black text-emerald-900">CBC 2026</span>
            <span className="text-[7px] text-amber-700">LITTLE ROSES</span>
          </div>
        </div>
      </div>

      {/* Certificate Signatures */}
      <div className="grid grid-cols-2 gap-12 max-w-md mx-auto pt-6 text-xs border-t border-slate-300">
        <div>
          <div className="font-serif italic font-bold text-lg text-emerald-950 border-b border-slate-400 pb-1">
            {headName || 'Mr. Kelvin Kiiru'}
          </div>
          <p className="text-[10px] uppercase font-bold text-slate-600 pt-1">Headteacher</p>
        </div>
        <div>
          <div className="font-serif italic font-bold text-lg text-emerald-950 border-b border-slate-400 pb-1">
            Prof. J. N. Mwangi
          </div>
          <p className="text-[10px] uppercase font-bold text-slate-600 pt-1">Chairman, Board of Management</p>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// SUB-LAYOUT: MINUTES
// ----------------------------------------------------
const MinutesLayout: React.FC<{
  customData: Record<string, any>;
  bodyText?: string;
}> = ({ customData, bodyText }) => {
  return (
    <div className="space-y-4 text-xs text-slate-800">
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 gap-2 text-[11px]">
        <div><strong>Meeting Venue:</strong> Staff Conference Room</div>
        <div><strong>Time Commenced:</strong> 08:00 AM - 10:30 AM</div>
        <div><strong>Chairperson:</strong> Mr. Kelvin Kiiru (Headteacher)</div>
        <div><strong>Secretary / Minuting:</strong> Madam Faith (Senior Teacher)</div>
      </div>

      <div className="space-y-3 leading-relaxed text-justify">
        <div>
          <h4 className="font-black text-slate-900 uppercase">Min 01/2026: Preliminaries & Devotions</h4>
          <p>The meeting commenced with an opening prayer led by Mr. David. The Chairperson formally welcomed all faculty members and emphasized institutional punctuality and CBC rationalized curriculum focus.</p>
        </div>
        <div>
          <h4 className="font-black text-slate-900 uppercase">Min 02/2026: Review of Continuous Assessment & CAT Marks</h4>
          <p>Class teachers presented continuous assessment scores. It was noted that literacy in both English and Kiswahili has advanced by 14% across Grade 3 and Grade 4. Remedial sessions are scheduled for learners requiring support in Mathematics.</p>
        </div>
        <div>
          <h4 className="font-black text-slate-900 uppercase">Min 03/2026: Co-Curricular & KPSEA National Preparedness</h4>
          <p>The Grade 6 coordinator confirmed all KNEC project scores and formative assessment logs have been synchronized. Sports day rehearsals will run every Tuesday afternoon without disrupting morning academic periods.</p>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// SUB-LAYOUT: DUTY ROSTER
// ----------------------------------------------------
const DutyRosterLayout: React.FC<{
  customData: Record<string, any>;
  bodyText?: string;
}> = ({ customData, bodyText }) => {
  const rosterItems = [
    { week: 'Week 1', dates: '08 Jan - 12 Jan', tod: 'Mr. David & Madam Grace', focus: 'Orientation, Morning Assembly, Gate Protocol' },
    { week: 'Week 2', dates: '15 Jan - 19 Jan', tod: 'Mr. Kelvin & Madam Faith', focus: 'Library Routine, Dining Hall Supervision' },
    { week: 'Week 3', dates: '22 Jan - 26 Jan', tod: 'Mr. Dennis & Madam Mary', focus: 'Environmental Cleanliness, Playground Safety' },
    { week: 'Week 4', dates: '29 Jan - 02 Feb', tod: 'Mr. Brian & Madam Faith', focus: 'Mid-term Assessment Review & Punctuality' },
    { week: 'Week 5', dates: '05 Feb - 09 Feb', tod: 'Madam Grace & Mr. David', focus: 'CBC Talent & Co-Curricular Coordination' }
  ];

  return (
    <div className="space-y-4 text-xs">
      {bodyText && <p className="text-slate-700">{bodyText}</p>}

      <div className="border border-slate-300 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-900 text-white text-[10px] uppercase font-bold">
              <th className="p-2.5">Academic Week</th>
              <th className="p-2.5">Date Span</th>
              <th className="p-2.5">Teachers on Duty (TOD)</th>
              <th className="p-2.5">Key Focus & Supervision Area</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-[11px]">
            {rosterItems.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="p-2.5 font-bold text-slate-900">{item.week}</td>
                <td className="p-2.5 font-mono text-slate-600">{item.dates}</td>
                <td className="p-2.5 font-bold text-emerald-950">{item.tod}</td>
                <td className="p-2.5 text-slate-700">{item.focus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
