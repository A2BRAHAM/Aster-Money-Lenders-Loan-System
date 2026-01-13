
import React from 'react';
import { BRAND_COLORS } from '../constants';
import { TrendingUp, ShieldCheck } from 'lucide-react';

const Investments: React.FC = () => {
  return (
    <section id="investments" className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-black">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-red-600">Wealth Generation</h2>
            <h3 className="text-4xl md:text-6xl font-serif mb-8 leading-tight text-black">
              Invest With Confidence. <br/>Grow With Us.
            </h3>
            <p className="text-xl text-black mb-10 leading-relaxed font-light">
              Partner with us and earn competitive returns while contributing to economic growth and financial inclusion. We transform your capital into meaningful opportunities.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-5 bg-white text-red-600 p-5 rounded-2xl border-2 border-red-50 shadow-sm">
                <div className="bg-red-600 p-3 rounded-xl text-white"><TrendingUp className="w-7 h-7" /></div>
                <span className="font-bold text-lg text-black">High-Yield Returns on your Capital</span>
              </div>
              <div className="flex items-center space-x-5 bg-black text-white p-5 rounded-2xl border-2 border-black shadow-sm">
                <div className="bg-white p-3 rounded-xl text-black"><ShieldCheck className="w-7 h-7" /></div>
                <span className="font-bold text-lg text-white">Secured & Insured Investment Portfolios</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
             <div className="relative">
                {/* 
                  Refined return indicator: 
                  - Removed black border
                  - Removed container background (red)
                  - Removed shadow
                  - Removed icon container box
                  - High-contrast red typography for visibility on white section background
                */}
                <div className="text-red-600 w-80 animate-float flex flex-col items-center">
                  <div className="mb-6">
                     <TrendingUp className="w-16 h-16"/>
                  </div>
                  <div className="flex flex-col items-center text-center">
                     <span className="font-black text-7xl tracking-tighter mb-3">+14.2%</span>
                     <div className="text-[10px] font-black uppercase tracking-[0.5em] opacity-80">
                       Average Annual Return
                     </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Investments;
