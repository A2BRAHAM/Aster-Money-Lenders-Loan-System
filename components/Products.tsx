
import React from 'react';
import { PRODUCTS, BRAND_COLORS } from '../constants';
import { ChevronRight } from 'lucide-react';

const Products: React.FC = () => {
  return (
    <section id="products" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className={`text-sm font-bold uppercase tracking-[0.2em] mb-4 ${BRAND_COLORS.secondary}`}>Our Offerings</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">Our Loan Products</h3>
          <div className={`h-1.5 w-24 mx-auto rounded-full ${BRAND_COLORS.accentBg}`}></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-teal-100 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`mb-6 p-4 rounded-2xl inline-block transition-colors group-hover:bg-teal-50 ${BRAND_COLORS.primary} bg-slate-50`}>
                {product.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{product.title}</h4>
              <p className="text-slate-600 mb-8 line-relaxed">
                {product.description}
              </p>
              <button className={`flex items-center text-sm font-bold group-hover:underline transition-all ${BRAND_COLORS.primary}`}>
                Learn More <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
          
          {/* CTA Card */}
          <div className={`${BRAND_COLORS.primaryBg} rounded-3xl p-8 flex flex-col justify-center items-center text-center text-white relative overflow-hidden group shadow-2xl`}>
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <LandmarkIcon className="w-32 h-32" />
             </div>
             <h4 className="text-2xl font-serif mb-4 relative z-10">Need a custom solution?</h4>
             <p className="text-teal-100 mb-8 relative z-10">We offer tailored financing for unique projects and specific needs.</p>
             <button className="px-8 py-3 bg-white text-teal-700 font-bold rounded-xl hover:bg-amber-100 transition-colors relative z-10">
               Talk to an Agent
             </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const LandmarkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L1 7v2h22V7L12 2zm10 8H2v2h2v10H2v2h20v-2h-2V10h2v-2zM9 10h2v10H9V10zm4 0h2v10h-2V10z" />
  </svg>
);

export default Products;
