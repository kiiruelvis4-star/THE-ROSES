import React from 'react';

interface OfficialRectangularStampProps {
  className?: string;
  /** Optional pre-filled date or leave blank underline for physical handwriting */
  fillDate?: string;
  /** Optional pre-filled signature or leave blank underline for physical handwriting */
  fillSign?: string;
  /** Whether to apply an authentic subtle stamp angle (default: true) */
  rotate?: boolean;
}

export const OfficialRectangularStamp: React.FC<OfficialRectangularStampProps> = ({
  className = '',
  fillDate,
  fillSign,
  rotate = true
}) => {
  return (
    <div
      className={`inline-block select-none bg-transparent ${
        rotate ? 'rotate-[-1.5deg]' : ''
      } transition-transform ${className}`}
      style={{
        color: '#1d4ed8' // Authentic school office blue ink
      }}
      aria-label="Official Little Roses Academy School Stamp"
    >
      {/* Outer rectangular border with double-line styling */}
      <div className="border-[2.5px] border-blue-700 p-[3.5px] bg-white/60 backdrop-blur-[0.5px]">
        {/* Inner rectangular border */}
        <div className="border-[1.5px] border-blue-700 px-4 py-2.5 flex flex-col items-center justify-center text-center min-w-[230px] max-w-[260px]">
          {/* Designation */}
          <div className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-blue-700 leading-tight">
            HEADTEACHER
          </div>

          {/* School Name - Most Prominent Text */}
          <div className="text-sm sm:text-[15px] font-black tracking-wide uppercase text-blue-800 my-0.5 leading-snug font-serif">
            LITTLE ROSES ACADEMY
          </div>

          {/* Postal Box & Location */}
          <div className="text-[10px] sm:text-[10.5px] font-extrabold tracking-wider uppercase text-blue-700 leading-tight">
            P.O. BOX 3443, NAKURU
          </div>

          {/* Clean spacer */}
          <div className="w-full my-2 border-t border-blue-600/35" />

          {/* Date Line with Handwriting Space */}
          <div className="w-full flex items-center justify-between text-[10.5px] font-bold text-blue-700 tracking-wide mb-1.5">
            <span className="shrink-0 font-extrabold mr-2">DATE:</span>
            <span className="flex-1 border-b-[1.5px] border-blue-700 text-left pl-1 font-mono text-[10px] text-blue-900 tracking-wider min-h-[14px] flex items-center">
              {fillDate ? (
                <span>{fillDate}</span>
              ) : (
                <span className="text-blue-700 font-mono">__________________</span>
              )}
            </span>
          </div>

          {/* Signature Line with Handwriting Space */}
          <div className="w-full flex items-center justify-between text-[10.5px] font-bold text-blue-700 tracking-wide">
            <span className="shrink-0 font-extrabold mr-2">SIGN:</span>
            <span className="flex-1 border-b-[1.5px] border-blue-700 text-left pl-1 font-serif italic text-xs text-blue-900 min-h-[14px] flex items-center">
              {fillSign ? (
                <span>{fillSign}</span>
              ) : (
                <span className="text-blue-700 font-mono">__________________</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
