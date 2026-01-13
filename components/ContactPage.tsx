
import React from 'react';
import { Phone, Mail, MessageSquare, Facebook, Instagram, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import Footer from './Footer';

const ContactPage: React.FC = () => {
  const contactOptions = [
    { 
      label: 'Call us Directly', 
      value: '+260 976 853 030', 
      icon: <Phone className="w-6 h-6" />, 
      href: 'tel:+260976853030',
      color: 'bg-red-600'
    },
    { 
      label: 'WhatsApp Message', 
      value: '+260 976 853 030', 
      icon: <MessageSquare className="w-6 h-6" />, 
      href: 'https://wa.me/260976853030',
      color: 'bg-green-600'
    },
    { 
      label: 'Email Support', 
      value: 'info@astermoneylenders.com', 
      icon: <Mail className="w-6 h-6" />, 
      href: 'mailto:info@astermoneylenders.com',
      color: 'bg-black'
    },
  ];

  const socials = [
    { name: 'Facebook', icon: <Facebook />, href: '#' },
    { name: 'Instagram', icon: <Instagram />, href: '#' },
    { name: 'LinkedIn', icon: <Linkedin />, href: '#' },
    { name: 'Twitter', icon: <Twitter />, href: '#' },
  ];

  return (
    <div className="pt-32 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 pb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-serif text-black mb-4">Connect With Us</h1>
        <p className="text-red-600 font-bold uppercase tracking-[0.3em] mb-16 text-sm">We are here to help</p>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {contactOptions.map((opt) => (
            <a 
              key={opt.label}
              href={opt.href}
              className="group bg-white p-10 rounded-[2.5rem] border-2 border-red-50 hover:border-red-600 transition-all shadow-sm hover:shadow-xl text-center flex flex-col items-center"
            >
              <div className={`p-4 rounded-2xl text-white mb-6 transition-transform group-hover:scale-110 ${opt.color}`}>
                {opt.icon}
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-black/40 mb-2">{opt.label}</h3>
              <p className="text-lg font-bold text-red-900 group-hover:text-red-600 transition-colors">{opt.value}</p>
              <ArrowRight className="w-5 h-5 mt-6 text-red-200 group-hover:text-red-600 transition-all group-hover:translate-x-1" />
            </a>
          ))}
        </div>

        <div className="pt-12 border-t border-red-50">
          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-black mb-10">Find us on Social Media</h4>
          <div className="flex justify-center space-x-6">
            {socials.map((social) => (
              <a 
                key={social.name}
                href={social.href}
                className="w-14 h-14 rounded-2xl bg-white border-2 border-red-50 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
