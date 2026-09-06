import React from 'react';
import { SchoolLogo } from '../../SchoolLogo';
import { SystemConfig } from '../../../types';
import { OfficialRectangularStamp } from './OfficialRectangularStamp';

export { OfficialRectangularStamp };

interface SchoolLetterheadProps {
  systemConfig?: SystemConfig;
  referenceNumber?: string;
  date?: string;
  className?: string;
  minimal?: boolean;
}

export const SchoolLetterhead: React.FC<SchoolLetterheadProps> = ({
  systemConfig,
  referenceNumber,
  date,
  className = '',
  minimal = false
}) => {
  const meta = systemConfig?.school_metadata;
  const schoolName = meta?.school_name || 'LITTLE ROSES ACADEMY';
  const poBox = meta?.po_box || 'P.O. Box 3443 NAKURU';
  const phone = meta?.phone || '0798 193966';
  const email = meta?.email || 'info@littleroses.ac.ke';
  const county = meta?.county || 'Nakuru County';
  const subCounty = meta?.sub_county || 'Nakuru East';
  const motto = meta?.motto || 'Much from Little';

  const displayDate = date || new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={`w-full select-none text-slate-900 ${className}`}>
      {/* Top Banner Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-emerald-800">
        {/* Logo Crest */}
        <div className="shrink-0 flex items-center justify-center p-1 bg-white rounded-full">
          <SchoolLogo size="lg" badgeOnly />
        </div>

        {/* Institution Title & Details */}
        <div className="flex-1 text-center space-y-0.5">
          <div className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-widest rounded-full mb-1 border border-emerald-200">
            Ministry of Education Registered Institution
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-950 font-serif uppercase">
            {schoolName}
          </h1>
          <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
            {subCounty} • {county} • Kenya
          </p>
          <p className="text-[11px] text-slate-600 font-medium flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
            <span>{poBox}</span>
            <span>•</span>
            <span>Tel: {phone}</span>
            <span>•</span>
            <span>Email: {email}</span>
          </p>
          <div className="pt-1 flex items-center justify-center gap-2">
            <div className="h-[1.5px] w-12 bg-amber-500" />
            <span className="text-[11px] italic font-serif font-bold text-emerald-900">
              "{motto}"
            </span>
            <div className="h-[1.5px] w-12 bg-amber-500" />
          </div>
        </div>

        {/* Right Stamp/Emblem Placeholder or Seal */}
        <div className="hidden sm:flex shrink-0 flex-col items-center justify-center p-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400 text-center w-24">
          <span className="text-[9px] font-mono uppercase font-black text-slate-500 leading-tight">Official Seal</span>
          <div className="w-12 h-12 my-1 rounded-full border border-emerald-700/40 flex items-center justify-center text-emerald-800 text-[8px] font-black text-center p-1 leading-none">
            LRA VALID
          </div>
          <span className="text-[8px] font-mono text-slate-400">NAKURU</span>
        </div>
      </div>

      {/* Decorative Gold Trim Divider */}
      <div className="h-1 bg-gradient-to-r from-emerald-800 via-amber-500 to-emerald-800 w-full mb-4" />

      {/* Official Date Strip - Clean right-aligned without empty spaces or placeholders */}
      {!minimal && (
        <div className="flex items-center justify-end text-xs font-semibold text-slate-700 pb-2 mb-3 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Date:</span>
            <span className="font-bold text-slate-900">
              {displayDate}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const OfficialSchoolFooter: React.FC<{
  headTeacherName?: string;
  headTeacherTitle?: string;
  showStamp?: boolean;
  showSignature?: boolean;
  schoolMotto?: string;
  schoolPhone?: string;
  schoolEmail?: string;
  date?: string;
}> = ({
  headTeacherName = 'Mr. Kelvin Kiiru',
  headTeacherTitle = 'Headteacher / Principal',
  showStamp = true,
  showSignature = true,
  schoolMotto = 'Much from Little',
  schoolPhone = '0798 193966',
  schoolEmail = 'info@littleroses.ac.ke',
  date
}) => {
  return (
    <div className="w-full mt-8 pt-4 border-t border-slate-200 text-slate-800 select-none">
      {/* Signatures and Stamp Block */}
      <div className="flex flex-wrap items-end justify-between gap-6 mb-4">
        {/* Left: Administrative Signoff */}
        <div className="space-y-1">
          <p className="text-xs text-slate-600 font-medium">Yours Faithfully,</p>
          <p className="text-xs font-black uppercase text-emerald-950 pt-1">
            FOR: LITTLE ROSES ACADEMY
          </p>

          {/* Signature Representation */}
          <div className="h-12 flex items-center">
            {showSignature ? (
              <div className="font-serif italic text-lg sm:text-xl font-bold text-emerald-900 tracking-wider rotate-[-2deg] pl-2 select-none border-b-2 border-slate-400 pb-0.5 inline-block">
                {headTeacherName}
              </div>
            ) : (
              <div className="w-48 border-b-2 border-dashed border-slate-400 h-8" />
            )}
          </div>

          <div className="pt-1">
            <p className="text-xs font-black text-slate-900 uppercase underline decoration-emerald-800 underline-offset-2">
              {headTeacherName}
            </p>
            <p className="text-[11px] font-bold text-slate-600">
              {headTeacherTitle}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Little Roses Academy • Nakuru
            </p>
          </div>
        </div>

        {/* Right: Official Rectangular School Stamp */}
        {showStamp && (
          <div className="flex flex-col items-center justify-center">
            <OfficialRectangularStamp
              fillDate={date}
              fillSign={showSignature ? headTeacherName : undefined}
            />
          </div>
        )}
      </div>

      {/* Bottom Legal / Accreditation Baseline */}
      <div className="pt-3 border-t-2 border-emerald-800 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <p>
          Little Roses Academy • P.O. Box 3443 Nakuru • Phone: {schoolPhone} • Email: {schoolEmail}
        </p>
        <p className="font-semibold text-emerald-900 italic font-serif">
          "{schoolMotto}"
        </p>
      </div>
    </div>
  );
};
