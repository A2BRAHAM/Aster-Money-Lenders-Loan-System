
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
    mode: 'login' | 'signup';
    role: 'customer' | 'employer';
  }>({
    isOpen: false,
    mode: 'login',
    role: 'employer'
  });
  
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

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
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (authConfig.isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [authConfig.isOpen]);

  // Changed default mode to 'login' even for customers as per request
  const openAuth = (mode: 'login' | 'signup' = 'login', role: 'customer' | 'employer' = 'employer') => {
    setAuthConfig({ isOpen: true, mode, role });
  };

  const closeAuth = () => setAuthConfig({ ...authConfig, isOpen: false });

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar 
        isScrolled={isScrolled} 
        onLoginClick={() => openAuth('login', 'employer')} 
        onApplyClick={() => openAuth('login', 'customer')}
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
              onApplyClick={() => openAuth('login', 'customer')} 
              onInvestClick={() => openAuth('login', 'customer')}
            />
            <Products />
            <Services />
            <About />
            <WhyChooseUs />
            <Investments onInvestClick={() => openAuth('login', 'customer')} />
            <FollowUs />
            <Contact />
            <Footer onLoginClick={() => openAuth('login', 'employer')} user={user} />
          </div>
        )}
      </main>
      
      {authConfig.isOpen && (
        <AuthModal 
          isOpen={authConfig.isOpen} 
          onClose={closeAuth} 
          initialMode={authConfig.mode}
          targetRole={authConfig.role}
        />
      )}
    </div>
  );
};

export default App;
