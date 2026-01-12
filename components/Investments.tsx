
import React from 'react';
import { BRAND_COLORS } from '../constants';
import { TrendingUp, PieChart, ShieldCheck } from 'lucide-react';

interface InvestmentsProps {
  onInvestClick?: () => void;
}

const Investments: React.FC<InvestmentsProps> = ({ onInvestClick }) => {
  return (
    <section id="investments" className="py-24 relative overflow-hidden">
      {/* Background with an image overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Investment growth chart" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-teal-950/90 mix-blend-multiply"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-amber-400">Wealth Generation</h2>
            <h3 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
              Invest With Confidence. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Grow With Us.</span>
            </h3>
            <p className="text-xl text-teal-100/80 mb-10 leading-relaxed font-light">
              Partner with us and earn competitive returns while contributing to economic growth and financial inclusion. We transform your capital into meaningful opportunities.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-center space-x-5 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="bg-amber-500/20 p-3 rounded-xl"><TrendingUp className="text-amber-400 w-7 h-7" /></div>
                <span className="font-bold text-lg">High-Yield Returns on your Capital</span>
              </div>
              <div className="flex items-center space-x-5 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="bg-amber-500/20 p-3 rounded-xl"><ShieldCheck className="text-amber-400 w-7 h-7" /></div>
                <span className="font-bold text-lg">Secured & Insured Investment Portfolios</span>
              </div>
              <div className="flex items-center space-x-5 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="bg-amber-500/20 p-3 rounded-xl"><PieChart className="text-amber-400 w-7 h-7" /></div>
                <span className="font-bold text-lg">Transparent Reporting & 24/7 Tracking</span>
              </div>
            </div>

            <button 
              onClick={onInvestClick}
              className={`px-12 py-5 text-sm font-black uppercase tracking-widest rounded-2xl text-white shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 ${BRAND_COLORS.secondaryBg} ${BRAND_COLORS.secondaryHover}`}
            >
              Start Investing Now
            </button>
          </div>

          <div className="hidden lg:flex justify-center">
             <div className="relative">
                {/* Floating card decoration */}
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[3rem] w-80 shadow-2xl animate-float">
                  <div className="flex justify-between items-start mb-12">
                     <div className="bg-white/20 p-3 rounded-2xl"><TrendingUp className="w-7 h-7 text-white"/></div>
                     <span className="text-white font-black text-3xl">+14.2%</span>
                  </div>
                  <div className="space-y-4">
                     <div className="h-2 bg-white/20 rounded-full w-full"></div>
                     <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                     <div className="h-2 bg-white/20 rounded-full w-1/2"></div>
                  </div>
                  <div className="mt-8 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] text-center">Average Annual Return</div>
                </div>
                
                {/* Another floating card */}
                <div className="absolute -bottom-10 -left-20 bg-amber-500 p-10 rounded-[2.5rem] w-72 shadow-[0_25px_50px_-12px_rgba(245,158,11,0.5)] animate-float" style={{ animationDelay: '1.5s' }}>
                  <div className="text-white text-5xl font-black mb-3">K 1.2M+</div>
                  <div className="text-white/90 text-xs font-black uppercase tracking-widest leading-none">Interest Distributed</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Investments;
