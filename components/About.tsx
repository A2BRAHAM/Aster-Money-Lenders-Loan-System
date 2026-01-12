
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
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 text-teal-400">Who We Are</h2>
          <h3 className="text-4xl md:text-5xl font-serif mb-10 leading-tight italic">
            "Helping the Nations Through Responsible Financial Growth."
          </h3>
          <div className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full mb-12"></div>
          
          <div className="space-y-8 text-xl text-teal-100 leading-relaxed font-light">
            <p>
              Aster Money Lenders is a trusted financial services provider committed to helping the nations by offering accessible loans and sustainable investment opportunities.
            </p>
            <p>
              We support financial growth through responsible lending, transparency, and customer-focused solutions. Our mission is to bridge the gap between aspirations and reality by providing the capital necessary for businesses to thrive and individuals to achieve their dreams.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { label: 'Founded', value: '2023' },
              { label: 'Active Clients', value: '10K+' },
              { label: 'Loan Volume', value: '$50M+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-amber-500 mb-1">{stat.value}</div>
                <div className="text-xs font-semibold text-teal-300 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;