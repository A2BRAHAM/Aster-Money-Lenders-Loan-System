
import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import { BRAND_COLORS } from '../constants';

const FollowUs: React.FC = () => {
  const socials = [
    { name: 'Facebook', icon: <Facebook />, href: '#', color: 'hover:bg-blue-600' },
    { name: 'WhatsApp', icon: <MessageCircle />, href: '#', color: 'hover:bg-green-500' },
    { name: 'Instagram', icon: <Instagram />, href: '#', color: 'hover:bg-pink-600' },
    { name: 'LinkedIn', icon: <Linkedin />, href: '#', color: 'hover:bg-blue-700' },
    { name: 'X (Twitter)', icon: <Twitter />, href: '#', color: 'hover:bg-slate-900' },
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${BRAND_COLORS.secondary}`}>Stay Connected</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">Follow Us</h3>
          <p className="text-lg text-slate-600 mb-12 font-medium">
            Stay connected for updates, financial tips, and new investment opportunities. Join our growing community of successful investors.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className={`w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-400 transition-all duration-300 hover:text-white hover:-translate-y-2 hover:shadow-2xl ${social.color}`}
                aria-label={social.name}
              >
                {React.cloneElement(social.icon as React.ReactElement<{ className?: string }>, { className: 'w-7 h-7' })}
              </a>
            ))}
          </div>
          
          <div className="mt-20 p-12 bg-white rounded-[3rem] border border-slate-100 shadow-xl inline-block w-full max-w-2xl">
            <h4 className="text-slate-900 font-black text-xl mb-6">Join our Financial Newsletter</h4>
            <div className="flex flex-col sm:flex-row gap-4">
               <input 
                 type="email" 
                 placeholder="Enter your email address" 
                 className="flex-grow px-8 py-5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-semibold"
               />
               <button className={`px-10 py-5 text-sm font-black uppercase tracking-widest text-white rounded-2xl shadow-lg shadow-cyan-900/20 transition-all hover:opacity-90 active:scale-95 ${BRAND_COLORS.primaryBg}`}>
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
