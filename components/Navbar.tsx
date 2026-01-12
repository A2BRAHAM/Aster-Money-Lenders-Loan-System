
import React, { useState } from 'react';
import { Menu, X, LogOut, Home, LayoutDashboard } from 'lucide-react';
import { NAV_LINKS, BRAND_COLORS } from '../constants';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

interface NavbarProps {
  isScrolled: boolean;
  onLoginClick: () => void;
  onApplyClick: () => void;
  user: any;
  view: 'landing' | 'dashboard';
  onSetView: (view: 'landing' | 'dashboard') => void;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, onLoginClick, onApplyClick, user, view, onSetView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onSetView('landing');
  };

  const isNavSolid = isScrolled || view === 'dashboard';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isNavSolid ? 'bg-slate-950/90 backdrop-blur-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] py-2 border-b border-white/5' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <button onClick={() => onSetView('landing')} className="flex items-center group relative z-10">
            <Logo 
              className={`transform transition-all duration-500 origin-left ${isNavSolid ? 'scale-90' : 'scale-100'}`}
            />
          </button>

          {/* Joined Desktop Navigation Items */}
          <div className="hidden md:flex items-center">
            {view === 'landing' && (
              <div className="flex items-center bg-white/5 backdrop-blur-md rounded-2xl px-2 py-1.5 border border-white/5 mr-8 shadow-inner">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-amber-500 transition-all rounded-xl hover:bg-white/5"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center bg-slate-900/50 backdrop-blur-md rounded-2xl p-1 border border-white/10">
                  <button 
                    onClick={() => onSetView(view === 'landing' ? 'dashboard' : 'landing')}
                    className="flex items-center space-x-3 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-white/10 text-white hover:bg-white/20"
                  >
                    {view === 'landing' ? (
                      <><LayoutDashboard className="w-4 h-4 text-cyan-400" /><span>Dashboard</span></>
                    ) : (
                      <><Home className="w-4 h-4 text-amber-400" /><span>Home</span></>
                    )}
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2.5 ml-1 rounded-xl transition-all text-white/40 hover:text-red-500 hover:bg-red-500/10"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={onLoginClick}
                    className="px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all border border-white/20 text-white hover:bg-white/10"
                  >
                    Login
                  </button>
                  <button 
                    onClick={onApplyClick} 
                    className={`px-7 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-2xl text-white active:scale-95 ${BRAND_COLORS.secondaryBg} ${BRAND_COLORS.secondaryHover}`}
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden relative z-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-2xl text-white bg-white/5 border border-white/10 active:scale-90 transition-transform"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`md:hidden transition-all duration-500 ease-in-out absolute w-full left-0 ${
        isOpen ? 'top-full opacity-100 bg-slate-950/95 backdrop-blur-2xl border-b border-white/5' : 'top-[-500%] opacity-0 pointer-events-none'
      }`}>
        <div className="px-6 pt-4 pb-10 space-y-4">
          {view === 'landing' && (
            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-amber-500 bg-white/5 rounded-2xl border border-white/5"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
          <div className="pt-6 space-y-4">
            {user ? (
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { onSetView(view === 'landing' ? 'dashboard' : 'landing'); setIsOpen(false); }}
                  className="py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white bg-white/10 flex flex-col items-center justify-center space-y-2"
                >
                  {view === 'landing' ? <LayoutDashboard className="w-6 h-6 text-cyan-400" /> : <Home className="w-6 h-6 text-amber-400" />}
                  <span>{view === 'landing' ? 'Dashboard' : 'Portal Home'}</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-500 bg-red-500/10 flex flex-col items-center justify-center space-y-2"
                >
                  <LogOut className="w-6 h-6" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                 <button 
                   onClick={() => { onLoginClick(); setIsOpen(false); }}
                   className="py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white border border-white/10 bg-white/5"
                 >
                   Staff & Client Login
                 </button>
                 <button 
                   onClick={() => { onApplyClick(); setIsOpen(false); }}
                   className={`py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-2xl ${BRAND_COLORS.secondaryBg}`}
                 >
                   Start Loan Application
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
