
import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'light', className = '' }) => {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Visual Logo Mark */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        {/* Wreath / Laurel (Cyan) */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-cyan-500">
          <g transform="translate(50, 50)">
            {/* Laurel leaves on left and right */}
            {[-1, 1].map((side) => (
              <g key={side} transform={`scale(${side}, 1)`}>
                {[0, 15, 30, 45, 60, 75].map((angle) => (
                  <path 
                    key={angle}
                    d="M-40 0 Q-45 -5 -40 -10 Q-35 -5 -40 0" 
                    fill="currentColor" 
                    transform={`rotate(${angle + 120} 0 0)`}
                  />
                ))}
              </g>
            ))}
          </g>
        </svg>

        {/* Central Globe area */}
        <div className="relative z-10 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-100 overflow-hidden">
           {/* Globe lines */}
           <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-cyan-600/40">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M0 50 H100 M50 0 V100" stroke="currentColor" strokeWidth="1" />
              <ellipse cx="50" cy="50" rx="20" ry="48" fill="none" stroke="currentColor" strokeWidth="1" />
           </svg>
           
           {/* Inner Money Details (Green) */}
           <div className="relative z-20 flex flex-col items-center">
             <div className="w-4 h-5 bg-green-700 rounded-sm flex items-center justify-center shadow-sm">
                <span className="text-[8px] font-black text-white leading-none">K</span>
             </div>
           </div>

           {/* Orange Growth Arrow */}
           <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-500 z-30">
              <path d="M25 75 Q45 85 75 45" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              <path d="M68 50 L82 38 L85 58 Z" fill="currentColor" />
           </svg>
        </div>
        
        {/* White outer circle from logo */}
        <div className="absolute inset-1 border-[3px] border-white/50 rounded-full"></div>
      </div>

      {/* Brand Text Stacking */}
      <div className="mt-1 flex flex-col items-center">
        <h1 className="text-[14px] font-black uppercase tracking-tight text-white leading-none whitespace-nowrap">
          Aster Money Lenders
        </h1>
        {/* Tagline Badge (Red) */}
        <div className="mt-0.5 px-2 py-0.5 bg-red-600 rounded-full">
          <span className="text-[7px] font-bold text-white uppercase tracking-[0.2em] whitespace-nowrap">
            Helping the Nations
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logo;
