import React, { useState } from 'react';
import { Menu, X, LogOut, Search } from 'lucide-react';
import { BRAND_COLORS } from '../constants';
import { supabase } from '../lib/supabase';
import { AppView } from '../App';

interface NavbarProps {
  isScrolled: boolean;
  onLoginClick: () => void;
  user: any;
  view: AppView;
  onSetView: (view: AppView) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, onLoginClick, user, view, onSetView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onSetView('landing');
  };

  const isNavSolid = isScrolled || view !== 'landing';
  const isEmployee = user?.user_metadata?.role === 'employer' || user?.email === 'abrahamgmutwale@gmail.com';
  const showSearch = isEmployee && view === 'dashboard';

  const navLinks = [
    { label: 'Home', view: 'landing' as AppView, sectionId: 'home' },
    { label: 'Products', view: 'landing' as AppView, sectionId: 'products' },
    { label: 'About Us', view: 'about-page' as AppView },
    { label: 'Contact Us', view: 'contact-page' as AppView },
  ];

  const handleLinkClick = (link: { view: AppView, sectionId?: string }) => {
    onSetView(link.view);
    setIsOpen(false);
    
    if (link.sectionId) {
      setTimeout(() => {
        const element = document.getElementById(link.sectionId!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isNavSolid ? 'bg-red-600 shadow-xl py-3 border-b border-red-700' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Branding */}
          <button 
            onClick={() => onSetView('landing')} 
            className="flex flex-col items-start group relative z-10 hover:opacity-90 transition-opacity text-left"
            aria-label="Aster Money Lenders Home"
          >
            <span className="text-xl lg:text-2xl font-medium uppercase tracking-tight text-white leading-tight">
              Aster Money Lenders
            </span>
            <span className="text-[10px] lg:text-[11px] font-normal text-white/80 lowercase tracking-wide -mt-0.5">
              Helping the nations
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-14">
            {view !== 'dashboard' && (
              <div className="flex items-center space-x-12">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleLinkClick(link)}
                    className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all text-white hover:text-orange-400 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-orange-400 after:transition-all hover:after:w-full`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex items-center ml-8">
              {showSearch && (
                <button className="flex items-center gap-2 text-white/80 hover:text-white transition-all group mr-10 print:hidden">
                  <Search className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase">Global Search</span>
                </button>
              )}
              {user ? (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => onSetView(view === 'landing' ? 'dashboard' : 'landing')}
                    className="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border-2 border-white text-white hover:bg-white hover:text-red-600 transition-all"
                  >
                    {view === 'landing' ? 'Dashboard' : 'Home'}
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl transition-all text-white hover:bg-white/20"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border-2 border-white text-white hover:bg-white hover:text-red-600 transition-all shadow-lg shadow-black/10"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden relative z-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-2xl border border-white text-white bg-white/10"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden transition-all duration-500 ease-in-out absolute w-full left-0 ${
        isOpen ? 'top-full opacity-100 bg-red-600 border-b border-red-700 shadow-xl' : 'top-[-1000%] opacity-0 pointer-events-none'
      }`}>
        <div className="px-6 pt-4 pb-10 space-y-4">
          {view !== 'dashboard' && (
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link)}
                  className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 rounded-xl transition-all text-left border-b border-white/5"
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}
          <div className="pt-4">
            {user ? (
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => { onSetView(view === 'landing' ? 'dashboard' : 'landing'); setIsOpen(false); }}
                  className="w-full py-4 text-[10px] font-bold uppercase tracking-widest border-2 border-white text-white rounded-xl"
                >
                  {view === 'landing' ? 'Dashboard' : 'Return to Home'}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { onLoginClick(); setIsOpen(false); }}
                className="w-full py-4 text-[10px] font-bold uppercase tracking-widest border-2 border-white text-white rounded-xl bg-white/5"
              >
                Login to Portal
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;