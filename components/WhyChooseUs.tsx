
import React from 'react';
import { TRUST_POINTS, BRAND_COLORS } from '../constants';

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-24 bg-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-black">Our Commitment</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-white mb-6">Why Choose Aster Money Lenders</h3>
          <div className="h-1.5 w-24 mx-auto rounded-full bg-white"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {TRUST_POINTS.map((point) => (
            <div key={point.id} className="flex flex-col items-center text-center group">
              <div className="mb-6 p-5 rounded-3xl transition-all duration-300 bg-white text-red-600">
                {point.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-4">{point.title}</h4>
              <p className="text-white/80 leading-relaxed max-w-sm">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
