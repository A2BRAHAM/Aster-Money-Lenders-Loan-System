
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import About from './components/About';
import WhyChooseUs from './components/WhyChooseUs';
import Investments from './components/Investments';
import FollowUs from './components/FollowUs';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ProductDetailPage from './components/ProductDetailPage';
import { supabase } from './lib/supabase';
import { Product } from './types';

export type AppView = 'landing' | 'dashboard' | 'about-page' | 'contact-page' | 'product-detail';

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
  const [view, setView] = useState<AppView>('landing');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

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

  const openAuth = (
    mode: 'login' | 'signup' | 'reset' = 'login', 
    role: 'customer' | 'employer' = 'customer',
    isRoleLocked: boolean = false
  ) => {
    window.history.pushState({ modal: true }, '');
    setAuthConfig({ isOpen: true, mode, role, isRoleLocked });
  };

  const closeAuth = () => {
    if (window.history.state?.modal) {
      window.history.back();
    } else {
      setAuthConfig({ ...authConfig, isOpen: false });
    }
  };

  const handleNavigate = (targetView: AppView) => {
    setView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    handleNavigate('product-detail');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar 
        isScrolled={isScrolled} 
        onLoginClick={() => openAuth('login', 'customer', false)}
        user={user}
        view={view}
        onSetView={handleNavigate}
      />
      
      <main className="transition-all duration-500">
        {view === 'dashboard' && user ? (
          <Dashboard user={user} />
        ) : view === 'about-page' ? (
          <AboutPage />
        ) : view === 'contact-page' ? (
          <ContactPage />
        ) : view === 'product-detail' && selectedProduct ? (
          <ProductDetailPage 
            product={selectedProduct} 
            onBack={() => handleNavigate('landing')} 
          />
        ) : (
          <div className={authConfig.isOpen ? 'hidden' : 'block'}>
            <Hero 
              onApplyClick={() => openAuth('login', 'customer', true)} 
              onInvestClick={() => openAuth('login', 'customer', true)}
            />
            <Products onProductSelect={handleViewProduct} />
            <About />
            <WhyChooseUs />
            <Investments />
            <FollowUs />
            <Footer onSetView={handleNavigate} onProductSelect={handleViewProduct} />
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
