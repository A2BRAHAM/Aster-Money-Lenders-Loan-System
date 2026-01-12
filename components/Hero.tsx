
import React from 'react';
import { BRAND_COLORS } from '../constants';
import { ArrowRight, TrendingUp, ShieldCheck, Globe } from 'lucide-react';

interface HeroProps {
  onApplyClick?: () => void;
  onInvestClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onApplyClick, onInvestClick }) => {
  return (
    <section id="home" className="relative min-h-[100vh] flex items-center pt-24 pb-12 overflow-hidden bg-slate-950">
      {/* Premium Background Graphics - Enhanced for depth */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content Area */}
          <div className="lg:col-span-7 text-center lg:text-left animate-fade-in-up" style={{ animationDuration: '0.8s' }}>
            <h1 className="text-5xl md:text-7xl lg:text-[88px] font-serif leading-[0.95] tracking-[-0.03em] mb-10 overflow-visible">
              <span className="text-white block">Fast. Secure.</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-400 via-amber-100 to-amber-500 block mt-2 drop-shadow-2xl pr-4">
                Financial Empowerment.
              </span>
            </h1>
            
            <div className="max-w-xl mx-auto lg:mx-0">
              <p className="text-lg md:text-xl text-slate-300 mb-6 leading-relaxed font-light">
                Helping individuals and businesses access reliable loans and smart investment opportunities with complete transparency.
              </p>
              <p className="text-amber-200/60 font-serif italic text-2xl mb-12 transform transition-all duration-700 hover:translate-x-2 inline-block">
                Helping the Nations.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-5 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={onApplyClick}
                className={`group w-full sm:w-auto px-12 py-5 text-xs font-black uppercase tracking-[0.2em] rounded-2xl text-white shadow-[0_20px_40px_-10px_rgba(245,158,11,0.5)] flex items-center justify-center transition-all transform hover:-translate-y-1 active:scale-95 ${BRAND_COLORS.secondaryBg} ${BRAND_COLORS.secondaryHover}`}
              >
                Apply for a Loan <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button 
                onClick={onInvestClick}
                className="w-full sm:w-auto px-12 py-5 text-xs font-black uppercase tracking-[0.2em] rounded-2xl text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md shadow-xl flex items-center justify-center active:scale-95 group"
              >
                Invest With Us <TrendingUp className="ml-3 w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <div className="mt-20 flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-40">
              <div className="flex items-center space-x-2 group transition-all hover:opacity-100 cursor-default">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="text-[9px] font-black tracking-[0.3em] text-white uppercase">Certified Lending</span>
              </div>
              <div className="flex items-center space-x-2 group transition-all hover:opacity-100 cursor-default">
                <Globe className="w-5 h-5 text-white" />
                <span className="text-[9px] font-black tracking-[0.3em] text-white uppercase">Global Growth</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-white/20"></div>
              <div className="text-[9px] font-black tracking-[0.3em] text-white uppercase opacity-70">Goal Getters Cooperative</div>
            </div>
          </div>

          {/* Visual Area */}
          <div className="lg:col-span-5 relative hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.3s', animationDuration: '1s' }}>
            <div className="relative z-10 p-4">
              <div className="relative rounded-[4rem] overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,1)] border border-white/10 group">
                <img 
                  src="https://images.unsplash.com/photo-1579621970795-87f967b16c8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90" 
                  alt="Joyful person holding money" 
                  className="w-full h-[650px] object-cover transition-transform duration-[3s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 transition-opacity group-hover:opacity-70"></div>
                
                {/* Floating Stat Card - Ultra High End */}
                <div className="absolute bottom-10 left-10 right-10 bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl transform transition-all duration-700 hover:translate-y-[-10px] hover:bg-slate-900/80">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/20 transition-transform hover:rotate-12">
                      <TrendingUp className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Active Rate</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-500 font-black uppercase tracking-[0.4em] mb-2">Loan Interest</div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-serif font-black text-white">4%</span>
                      <span className="text-xs text-white/30 uppercase tracking-widest">Fixed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-cyan-600/10 blur-[150px] rounded-full -z-10 animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-[60px] rounded-full -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
