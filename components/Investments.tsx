
import React from 'react';
import { BRAND_COLORS } from '../constants';
import { TrendingUp, PieChart, ShieldCheck } from 'lucide-react';

// Fix: Added InvestmentsProps interface to support the onInvestClick prop used in App.tsx
interface InvestmentsProps {
  onInvestClick?: () => void;
}

const Investments: React.FC<InvestmentsProps> = ({ onInvestClick }) => {
  return (
    <section id="investments" className="py-24 relative overflow-hidden">
      {/* Background with an image overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/wealth-growth/1600/900" 
          alt="Investment background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-teal-900/90 mix-blend-multiply"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-amber-400">Wealth Generation</h2>
            <h3 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
              Invest With Confidence. <br/><span className="text-amber-400">Grow With Us.</span>
            </h3>
            <p className="text-xl text-teal-100 mb-10 leading-relaxed">
              Partner with us and earn competitive returns while contributing to economic growth and financial inclusion. We transform your capital into meaningful opportunities.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <TrendingUp className="text-amber-400 w-8 h-8" />
                <span className="font-semibold text-lg">High-Yield Returns on your Capital</span>
              </div>
              <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <ShieldCheck className="text-amber-400 w-8 h-8" />
                <span className="font-semibold text-lg">Secured & Insured Investment Portfolios</span>
              </div>
              <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <PieChart className="text-amber-400 w-8 h-8" />
                <span className="font-semibold text-lg">Transparent Reporting & 24/7 Tracking</span>
              </div>
            </div>

            <button 
              onClick={onInvestClick}
              className={`px-10 py-4 text-lg font-bold rounded-xl text-white shadow-2xl transition-all transform hover:-translate-y-1 ${BRAND_COLORS.secondaryBg} ${BRAND_COLORS.secondaryHover}`}
            >
              Start Investing Now
            </button>
          </div>

          <div className="hidden lg:flex justify-center">
             <div className="relative">
                {/* Floating card decoration */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl w-80 shadow-2xl animate-float">
                  <div className="flex justify-between items-start mb-12">
                     <div className="bg-white/20 p-2 rounded-lg"><TrendingUp className="w-6 h-6 text-white"/></div>
                     <span className="text-white font-bold text-2xl">+14.2%</span>
                  </div>
                  <div className="space-y-4">
                     <div className="h-2 bg-white/20 rounded-full w-full"></div>
                     <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                     <div className="h-2 bg-white/20 rounded-full w-1/2"></div>
                  </div>
                  <div className="mt-8 text-white/60 text-xs font-bold uppercase tracking-widest text-center">Average Annual Return</div>
                </div>
                
                {/* Another floating card */}
                <div className="absolute -bottom-10 -left-20 bg-amber-500 p-8 rounded-3xl w-72 shadow-2xl animate-float" style={{ animationDelay: '1.5s' }}>
                  <div className="text-white text-4xl font-black mb-2">$1.2M+</div>
                  <div className="text-white/80 text-sm font-bold uppercase tracking-tighter leading-none">Total Interest Paid to Investors</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Investments;
