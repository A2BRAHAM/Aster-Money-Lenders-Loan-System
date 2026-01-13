
import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'light', className = '' }) => {
  const textColor = 'text-white';

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white shadow-lg">
          <span className="text-red-600 font-black text-sm">A</span>
        </div>
        <h1 className={`text-xl lg:text-2xl font-black uppercase tracking-tighter leading-none ${textColor}`}>
          Aster Money Lenders
        </h1>
      </div>
      <div className="mt-1 bg-white px-3 py-1 self-start shadow-sm rounded-sm">
        <span className="text-[9px] lg:text-[10px] font-bold text-red-600 uppercase tracking-[0.2em] whitespace-nowrap">
          Helping the Nations
        </span>
      </div>
    </div>
  );
};

export default Logo;
