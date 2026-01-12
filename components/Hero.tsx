
import React from 'react';
import { BRAND_COLORS } from '../constants';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface HeroProps {
  onApplyClick?: () => void;
  onInvestClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onApplyClick, onInvestClick }) => {
  return (
    <section id="home" className="relative min-h-[95vh] flex items-center pt-24 pb-12 overflow-hidden bg-slate-950">
      {/* Premium Background Graphics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full mb-8 border border-white/10 shadow-2xl">
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></div>
              <span className="text-amber-100 text-[10px] font-black uppercase tracking-[0.3em]">Licensed & Trusted Financial Institution</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[1.05] tracking-tight">
              Fast, Secure <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 italic">Financial Power</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Helping individuals and businesses access reliable loans and investment opportunities with absolute transparency. Empowering nations, one dream at a time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-5 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={onApplyClick}
                className={`group w-full sm:w-auto px-10 py-5 text-sm font-black uppercase tracking-widest rounded-2xl text-white shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)] flex items-center justify-center transition-all transform hover:-translate-y-1 active:scale-95 ${BRAND_COLORS.secondaryBg} ${BRAND_COLORS.secondaryHover}`}
              >
                Apply for a Loan <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button 
                onClick={onInvestClick}
                className="w-full sm:w-auto px-10 py-5 text-sm font-black uppercase tracking-widest rounded-2xl text-white bg-white/5 border border-white/20 hover:bg-white/10 transition-all backdrop-blur-md shadow-xl flex items-center justify-center active:scale-95"
              >
                Invest With Us
              </button>
            </div>

            <div className="mt-20 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-10 opacity-60">
              <div className="text-white text-[10px] font-black tracking-[0.4em] uppercase">Trusted Partners</div>
              <div className="flex items-center space-x-8 text-white font-serif text-xl italic opacity-80">
                <span>Goal Getters Cooperative</span>
                <span className="w-1 h-1 bg-white rounded-full"></span>
                <span>Aster Nations Fund</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up animate-delay-200 lg:block">
            <div className="relative z-10 rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 group bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Professional team celebrating financial success" 
                className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80"></div>
              
              {/* Floating Stat Card - Premium UI */}
              <div className="absolute bottom-8 left-8 right-8 bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl border border-white/10 flex items-center space-x-6 transform transition-transform hover:scale-[1.02]">
                <div className="bg-amber-500/20 p-4 rounded-2xl shadow-inner border border-amber-500/20">
                  <TrendingUp className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <div className="text-[10px] text-amber-500/80 font-black uppercase tracking-[0.3em] mb-1">Growth Forecast</div>
                  <div className="text-3xl font-serif font-black text-white">Starting 5% <span className="text-sm font-sans font-medium text-white/40">p.a</span></div>
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute top-10 right-10 w-24 h-24 border-2 border-white/5 rounded-full flex items-center justify-center">
                 <div className="w-16 h-16 border border-white/10 rounded-full"></div>
              </div>
            </div>
            
            {/* Background Glow for image */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-600/20 blur-[120px] rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
