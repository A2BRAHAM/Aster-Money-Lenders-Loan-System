
import React, { useState, useEffect } from 'react';
import { BRAND_COLORS } from '../constants';
import { ArrowRight, TrendingUp, ShieldCheck, Globe } from 'lucide-react';

interface HeroProps {
  onApplyClick?: () => void;
  onInvestClick?: () => void;
}

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    alt: "Joyful person holding money celebrating financial success"
  },
  {
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    alt: "Confident professional man celebrating investment growth"
  }
];

const Hero: React.FC<HeroProps> = ({ onApplyClick, onInvestClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-[100vh] flex items-center pt-24 pb-12 overflow-hidden bg-red-600">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-red-700/30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="text-center lg:text-left animate-fade-in-left">
            <h1 className="text-5xl md:text-7xl lg:text-[88px] font-serif leading-[0.95] tracking-[-0.03em] mb-10 overflow-visible text-white">
              Fast. Secure.
              <span className="block mt-2 text-white">Financial Empowerment.</span>
            </h1>
            
            <div className="max-w-xl mx-auto lg:mx-0">
              <p className="text-lg md:text-xl text-white mb-12 leading-relaxed font-light">
                Helping individuals and businesses access reliable loans and smart investment opportunities with complete transparency.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-5 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={onApplyClick}
                className="px-10 py-5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border-2 bg-white text-red-600 border-white hover:bg-black hover:text-white hover:border-black"
              >
                Apply for a Loan
              </button>
              <button 
                onClick={onInvestClick}
                className="px-10 py-5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border-2 bg-black text-white border-black hover:bg-white hover:text-red-600 hover:border-white"
              >
                Invest With Us
              </button>
            </div>

            <div className="mt-20 flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-90">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="text-[9px] font-black tracking-[0.3em] text-white uppercase">Certified Lending</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-white" />
                <span className="text-[9px] font-black tracking-[0.3em] text-white uppercase">Global Growth</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-right h-[450px] md:h-[650px] lg:h-[700px]">
            <div className="relative z-10 p-4 h-full">
              <div className="relative h-full overflow-hidden">
                {HERO_IMAGES.map((img, index) => (
                  <div
                    key={img.url}
                    className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
                      index === currentImageIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt={img.alt} 
                      className="w-full h-full object-cover rounded-[2rem]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
