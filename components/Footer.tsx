
import React from 'react';
import { Landmark, LogOut } from 'lucide-react';
import { BRAND_COLORS, NAV_LINKS } from '../constants';
import { supabase } from '../lib/supabase';

interface FooterProps {
  onLoginClick: () => void;
  onApplyClick: () => void;
  user: any;
}

const Footer: React.FC<FooterProps> = ({ onLoginClick, onApplyClick, user }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${BRAND_COLORS.primaryBg}`}>
                <Landmark className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-none text-white">
                  Aster Money Lenders
                </span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              Dedicated to providing accessible financial tools and professional lending services to foster growth and stability.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 text-white relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-amber-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-400 hover:text-amber-500 transition-colors text-sm font-medium">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 text-white relative inline-block">
              Services
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-amber-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><button onClick={onApplyClick} className="hover:text-amber-500 transition-colors">Apply for a Loan</button></li>
              <li><button onClick={onApplyClick} className="hover:text-amber-500 transition-colors">Invest With Us</button></li>
              <li><a href="#products" className="hover:text-amber-500 transition-colors">Business Financing</a></li>
              <li><a href="#products" className="hover:text-amber-500 transition-colors">Personal Wealth</a></li>
              <li><a href="#contact" className="hover:text-amber-500 transition-colors">Debt Consulting</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold mb-8 text-white relative inline-block">
              Take Action
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-amber-500 rounded-full"></span>
            </h4>
            <div className="space-y-4">
              <button 
                onClick={onApplyClick}
                className={`w-full py-4 font-bold text-white rounded-xl shadow-lg transition-all ${BRAND_COLORS.primaryBg} ${BRAND_COLORS.primaryHover}`}
              >
                Apply for a Loan
              </button>
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 font-bold text-white bg-red-900/20 border border-red-900/30 rounded-xl hover:bg-red-900/30 transition-all flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="w-full py-4 font-bold text-amber-500 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  Login to Portal
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p className="mb-4 md:mb-0">
            © 2026 Aster Money Lenders. All Rights Reserved.
          </p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
