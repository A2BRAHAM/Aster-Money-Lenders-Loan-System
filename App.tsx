
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Services from './components/Services';
import About from './components/About';
import WhyChooseUs from './components/WhyChooseUs';
import Investments from './components/Investments';
import FollowUs from './components/FollowUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [authConfig, setAuthConfig] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup' | 'reset';
    role: 'customer' | 'employer';
    isRoleLocked: boolean;
  }>({
    isOpen: false,
    mode: 'login',
    role: 'customer',
    isRoleLocked: false
  });
  
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle browser back button to close modal
    const handlePopState = () => {
      if (authConfig.isOpen) {
        setAuthConfig(prev => ({ ...prev, isOpen: false }));
      }
    };
    window.addEventListener('popstate', handlePopState);

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) setView('dashboard');
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setView('dashboard');
      } else {
        setView('landing');
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
      subscription.unsubscribe();
    };
  }, [authConfig.isOpen]);

  useEffect(() => {
    if (authConfig.isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [authConfig.isOpen]);

  const openAuth = (
    mode: 'login' | 'signup' | 'reset' = 'login', 
    role: 'customer' | 'employer' = 'customer',
    isRoleLocked: boolean = false
  ) => {
    // Push state so back button works
    window.history.pushState({ modal: true }, '');
    setAuthConfig({ isOpen: true, mode, role, isRoleLocked });
  };

  const closeAuth = () => {
    // If we're closing via UI, we might want to go back in history if we pushed state
    if (window.history.state?.modal) {
      window.history.back();
    } else {
      setAuthConfig({ ...authConfig, isOpen: false });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar 
        isScrolled={isScrolled} 
        onLoginClick={() => openAuth('login', 'customer', false)} // Login allows role choice
        onApplyClick={() => openAuth('login', 'customer', true)}  // Apply forces Customer role
        user={user}
        view={view}
        onSetView={setView}
      />
      
      <main className="transition-all duration-500">
        {view === 'dashboard' && user ? (
          <Dashboard user={user} />
        ) : (
          <div className={authConfig.isOpen ? 'hidden' : 'block'}>
            <Hero 
              onApplyClick={() => openAuth('login', 'customer', true)} 
              onInvestClick={() => openAuth('login', 'customer', true)}
            />
            <Products />
            <Services />
            <About />
            <WhyChooseUs />
            <Investments onInvestClick={() => openAuth('login', 'customer', true)} />
            <FollowUs />
            <Contact />
            <Footer onLoginClick={() => openAuth('login', 'customer', false)} user={user} />
          </div>
        )}
      </main>
      
      {authConfig.isOpen && (
        <AuthModal 
          isOpen={authConfig.isOpen} 
          onClose={closeAuth} 
          initialMode={authConfig.mode}
          targetRole={authConfig.role}
          isRoleLocked={authConfig.isRoleLocked}
        />
      )}
    </div>
  );
};

export default App;
