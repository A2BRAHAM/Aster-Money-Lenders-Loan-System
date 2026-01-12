
import React from 'react';
import { BRAND_COLORS } from '../constants';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      {/* Decorative overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 L100 0 L100 100 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-6 text-cyan-400">Who We Are</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-10 leading-tight">
            Helping the Nations Through Responsible Financial Growth.
          </h3>
          <div className="w-24 h-2 bg-amber-500 mx-auto rounded-full mb-12 shadow-[0_0_20px_rgba(245,158,11,0.5)]"></div>
          
          <div className="space-y-8 text-xl text-slate-300 leading-relaxed font-light">
            <p>
              Aster Money Lenders is a trusted financial services provider committed to helping nations by offering accessible loans and sustainable investment opportunities.
            </p>
            <p>
              We support financial growth through responsible lending, transparency, and customer-focused solutions. Our mission is to bridge the gap between aspirations and reality by providing the capital necessary for businesses to thrive and individuals to achieve their dreams.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-12 border-t border-white/5 pt-12">
            {[
              { label: 'Founded', value: '2023' },
              { label: 'Active Clients', value: '10K+' },
              { label: 'Loan Volume', value: 'K 50M+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-4xl font-black text-amber-500 mb-2 transition-transform group-hover:scale-110">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
