
import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import { BRAND_COLORS } from '../constants';

const FollowUs: React.FC = () => {
  const socials = [
    { 
      name: 'Facebook', 
      icon: <Facebook />, 
      href: '#', 
      hoverBg: 'hover:bg-[#1877F2]' 
    },
    { 
      name: 'WhatsApp', 
      icon: <MessageCircle />, 
      href: '#', 
      hoverBg: 'hover:bg-[#25D366]' 
    },
    { 
      name: 'Instagram', 
      icon: <Instagram />, 
      href: '#', 
      hoverBg: 'hover:bg-[#F58529]' // Orange as requested
    },
    { 
      name: 'LinkedIn', 
      icon: <Linkedin />, 
      href: '#', 
      hoverBg: 'hover:bg-[#0A66C2]' 
    },
  ];

  return (
    <section className="py-24 bg-red-700 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-black">Stay Connected</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">Follow Us</h3>
          
          <div className="flex flex-wrap justify-center gap-6">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className={`w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-white text-red-600 transition-all duration-300 ease-in-out hover:text-white hover:-translate-y-2 hover:shadow-2xl ${social.hoverBg}`}
                aria-label={social.name}
              >
                {React.cloneElement(social.icon as React.ReactElement<{ className?: string }>, { className: 'w-7 h-7' })}
              </a>
            ))}
          </div>
          
          <div className="mt-20 p-12 bg-white rounded-[3rem] shadow-xl inline-block w-full max-w-2xl">
            <h4 className="text-red-600 font-black text-xl mb-6">Join our Financial Newsletter</h4>
            <div className="flex flex-col sm:flex-row gap-4">
               <input 
                 type="email" 
                 placeholder="Enter your email address" 
                 className="flex-grow px-8 py-5 rounded-2xl bg-white border border-red-600 focus:outline-none focus:ring-4 focus:ring-black/10 focus:border-black transition-all text-sm font-semibold text-black"
               />
               <button className="px-10 py-5 text-sm font-black uppercase tracking-widest text-white rounded-2xl shadow-lg bg-red-600 transition-all hover:bg-black active:scale-95">
                 Subscribe
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FollowUs;
