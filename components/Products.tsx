
import React from 'react';
import { PRODUCTS, BRAND_COLORS } from '../constants';
import { ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductsProps {
  onProductSelect?: (product: Product) => void;
}

const Products: React.FC<ProductsProps> = ({ onProductSelect }) => {
  return (
    <section id="products" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-red-600">Our Offerings</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-black mb-6">Our Loan Products</h3>
          <div className="h-1.5 w-24 mx-auto rounded-full bg-red-600"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-3xl p-8 shadow-sm border-2 border-red-50 hover:border-red-600 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="mb-6 p-4 rounded-2xl inline-block bg-red-600 text-white">
                {product.icon}
              </div>
              <h4 className="text-xl font-bold text-red-600 mb-4">{product.title}</h4>
              <p className="text-black mb-8 leading-relaxed">
                {product.description}
              </p>
              <button 
                onClick={() => onProductSelect?.(product)}
                className="flex items-center text-xs font-bold uppercase tracking-widest text-red-600 hover:text-black transition-colors"
              >
                View Details <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
          
          <div className="bg-red-600 rounded-3xl p-8 flex flex-col justify-center items-center text-center text-white relative overflow-hidden group shadow-2xl">
             <h4 className="text-2xl font-serif mb-4 relative z-10">Custom Solutions</h4>
             <p className="text-white relative z-10 font-medium">We offer tailored financing for unique projects and specific needs to help you grow.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
