
import React from 'react';
import { PRODUCTS } from '../constants';
import { AppView } from '../App';
import { Product } from '../types';

interface FooterProps {
  onSetView?: (view: AppView) => void;
  onProductSelect?: (product: Product) => void;
}

const Footer: React.FC<FooterProps> = ({ onSetView, onProductSelect }) => {
  const navLinks = [
    { label: 'Home', view: 'landing' as AppView, sectionId: 'home' },
    { label: 'Products', view: 'landing' as AppView, sectionId: 'products' },
    { label: 'About Us', view: 'about-page' as AppView },
    { label: 'Contact Us', view: 'contact-page' as AppView },
  ];

  const handleLinkClick = (link: { view: AppView, sectionId?: string }) => {
    if (onSetView) {
      onSetView(link.view);
      if (link.sectionId) {
        setTimeout(() => {
          const element = document.getElementById(link.sectionId!);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const handleProductLinkClick = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product && onProductSelect) {
      onProductSelect(product);
    }
  };

  return (
    <footer className="bg-red-600 text-white pt-20 pb-10 border-t-4 border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-4">
            <h4 className="text-lg font-bold uppercase tracking-tight text-white">
              Aster Money Lenders
            </h4>
            <p className="text-[10px] font-normal text-white/80 lowercase tracking-wide -mt-3">
              helping the nations
            </p>
            <p className="text-white leading-relaxed text-sm pt-4">
              Dedicated to providing accessible financial tools and professional lending services to foster growth and stability across the nations.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 text-white relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-black rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button 
                    onClick={() => handleLinkClick(link)} 
                    className="text-white hover:text-black transition-colors text-xs font-bold uppercase tracking-widest text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 text-white relative inline-block">
              Our Products
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-black rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-white text-xs font-bold uppercase tracking-widest">
              <li>
                <button 
                  onClick={() => handleProductLinkClick('personal')} 
                  className="hover:text-black transition-colors text-left"
                >
                  Personal Loans
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleProductLinkClick('business')} 
                  className="hover:text-black transition-colors text-left"
                >
                  Business Financing
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold mb-8 text-white relative inline-block">
              Headquarters
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-black rounded-full"></span>
            </h4>
            <div className="text-white text-sm leading-loose">
              <p>Nchelenge New market</p>
              <p>Luapula, Zambia</p>
              <div className="mt-4 space-y-1">
                <p>Phone: +260 973 358 899</p>
                <p>Phone: +260 772 899 184</p>
                <p className="pt-2">Email: info@astermoneylenders.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/50 flex flex-col md:flex-row justify-between items-center text-white text-[10px] font-bold uppercase tracking-widest">
          <p className="mb-4 md:mb-0">
            © 2026 Aster Money Lenders. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
