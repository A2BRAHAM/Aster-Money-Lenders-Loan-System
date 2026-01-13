
import React from 'react';
import Footer from './Footer';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <h1 className="text-5xl md:text-7xl font-serif text-red-600 mb-8 leading-tight">
          Who We Are
        </h1>
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-black mb-12">Our Mission & Heritage</p>
        
        <div className="prose prose-xl text-red-950 space-y-8 font-light leading-relaxed">
          <p className="text-2xl text-black font-normal">
            Aster Money Lenders is more than just a financial institution; we are a partner in the global effort toward financial stability and individual growth.
          </p>
          <p>
            Founded with the singular purpose of <strong>Helping the Nations</strong>, we bridge the gap between financial aspirations and reality. Our heritage is built on the belief that responsible lending is a catalyst for community development.
          </p>
          <p>
            We adhere to the highest standards of transparency and ethics. Every loan we facilitate and every investment we manage is handled with the precision and care that modern fintech demands, ensuring our clients can scale their businesses and secure their futures with confidence.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-red-50 pt-16">
          <div className="bg-red-600 p-10 rounded-3xl text-white">
            <h3 className="text-2xl font-serif mb-4">Our Commitment</h3>
            <p className="opacity-90 font-light">To provide fast, secure, and fair financial products that empower individuals regardless of their background.</p>
          </div>
          <div className="bg-black p-10 rounded-3xl text-white">
            <h3 className="text-2xl font-serif mb-4">Global Vision</h3>
            <p className="opacity-90 font-light">Creating a world where access to capital is not a barrier to success, but a bridge to prosperity.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
