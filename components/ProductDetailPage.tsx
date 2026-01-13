
import React from 'react';
import { ArrowLeft, CheckCircle2, FileText, Info, Clock, CreditCard } from 'lucide-react';
import { Product } from '../types';
import Footer from './Footer';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack }) => {
  return (
    <div className="pt-32 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 pb-24">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="group flex items-center space-x-2 text-red-600 font-bold text-xs uppercase tracking-widest mb-12 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Products</span>
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16">
          <div className="p-6 rounded-[2rem] bg-red-600 text-white shadow-xl shadow-red-100">
            {product.icon}
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-serif text-black mb-4">{product.title}</h1>
            <p className="text-xl text-black/60 font-light max-w-2xl">{product.description}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Eligibility Section */}
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 rounded-lg bg-red-50 text-red-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-black uppercase tracking-tight">Who Can Apply?</h2>
              </div>
              <ul className="grid sm:grid-cols-2 gap-4">
                {product.eligibility?.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 p-4 rounded-2xl bg-red-50/50 border border-red-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
                    <span className="text-sm font-medium text-black/80">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Requirements Section */}
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 rounded-lg bg-red-50 text-red-600">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-black uppercase tracking-tight">Required Documents</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {product.requirements?.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-5 rounded-2xl border-2 border-red-50 group hover:border-red-600 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white border border-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <span className="text-xs font-black">{idx + 1}</span>
                    </div>
                    <span className="text-sm font-bold text-black">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Important Info */}
          <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-black text-white shadow-2xl sticky top-32">
              <div className="flex items-center space-x-3 mb-8 border-b border-white/10 pb-6">
                <Info className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-black uppercase tracking-widest">At a Glance</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center space-x-2 text-white/40 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Loan Tenure</span>
                  </div>
                  <p className="text-lg font-bold">{product.additionalInfo?.duration}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-white/40 mb-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Repayment Style</span>
                  </div>
                  <p className="text-lg font-bold">{product.additionalInfo?.repayment}</p>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs italic text-white/60 leading-loose">
                    {product.additionalInfo?.notes}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => window.location.href = '#contact'}
                className="w-full mt-10 py-5 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-red-600 transition-all shadow-xl shadow-red-900/20"
              >
                Inquire Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
