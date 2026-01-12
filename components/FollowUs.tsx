
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
          <h2 className={`text-sm font-bold uppercase tracking-[0.2em] mb-4 ${BRAND_COLORS.secondary}`}>Stay Connected</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">Follow Us</h3>
          <p className="text-lg text-slate-600 mb-12">
            Stay connected for updates, financial tips, and new investment opportunities. Join our growing community.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className={`w-14 h-14 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-600 transition-all duration-300 hover:text-white hover:-translate-y-2 hover:shadow-xl ${social.color}`}
                aria-label={social.name}
              >
                {/* Fix: Explicitly cast the icon to a ReactElement with className support to satisfy TS */}
                {React.cloneElement(social.icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
              </a>
            ))}
          </div>
          
          <div className="mt-16 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm inline-block w-full max-w-lg">
            <h4 className="text-slate-900 font-bold mb-4 italic">Subscribe to our Financial Newsletter</h4>
            <div className="flex flex-col sm:flex-row gap-4">
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="flex-grow px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
               />
               <button className={`px-8 py-4 font-bold text-white rounded-xl ${BRAND_COLORS.primaryBg}`}>Join</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FollowUs;
