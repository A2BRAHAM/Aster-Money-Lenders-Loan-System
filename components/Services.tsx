
import React from 'react';
import { SERVICES, BRAND_COLORS } from '../constants';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/customer-support/700/800" 
                alt="Client support and services" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Support Online</span>
                </div>
                <div className="text-lg font-bold text-slate-900">24/7 Availability</div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className={`text-sm font-bold uppercase tracking-[0.2em] mb-4 ${BRAND_COLORS.secondary}`}>Why Aster?</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">Excellence in Every Transaction</h3>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed">
              We leverage cutting-edge financial technology to ensure that our services are not just fast, but reliable and tailored to the modern customer's expectations.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {SERVICES.map((service) => (
                <div key={service.id} className="flex items-start space-x-4 group">
                  <div className={`mt-1 p-2 rounded-lg transition-colors group-hover:scale-110 ${BRAND_COLORS.accent} bg-green-50`}>
                    {service.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 mb-1">{service.title}</h4>
                    <p className="text-sm text-slate-500">Industry-leading standards and professional delivery.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
