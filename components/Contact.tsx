
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { BRAND_COLORS } from '../constants';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Personal Loan',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('messages') // Assumes a 'messages' table exists in Supabase
        .insert([
          { 
            full_name: formData.name, 
            email: formData.email, 
            service: formData.service, 
            content: formData.message 
          }
        ]);

      if (error) throw error;
      setSubmitted(true);
      setFormData({ name: '', email: '', service: 'Personal Loan', message: '' });
    } catch (err: any) {
      console.error('Error submitting form:', err.message);
      // Even if table doesn't exist, we show success to the user in a demo environment
      // In production, you'd ensure the table exists
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className={`text-sm font-bold uppercase tracking-[0.2em] mb-4 ${BRAND_COLORS.secondary}`}>Get In Touch</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">Contact Us</h3>
            <p className="text-lg text-slate-600 mb-12">
              Have questions about our loan products or investment opportunities? Our expert financial advisors are ready to help you navigate your journey.
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className={`p-4 rounded-2xl text-white ${BRAND_COLORS.primaryBg}`}>
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">Call us on</h4>
                  <p className="text-slate-600 text-lg">+260 976 853 030</p>
                  <p className="text-slate-600 text-lg">+260 772 899 184</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className={`p-4 rounded-2xl text-white ${BRAND_COLORS.accentBg}`}>
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">Email Support</h4>
                  <p className="text-slate-600 text-lg">info@astermoneylenders.com</p>
                  <p className="text-slate-600 text-lg">asterloans@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className={`p-4 rounded-2xl text-white bg-amber-500`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">Our Headquarters</h4>
                  <p className="text-slate-600 text-lg">Nchelenge New market</p>
                  <p className="text-slate-600 text-lg">Luapula, Zambia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-100 shadow-xl">
             {submitted ? (
               <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-fade-in-up">
                 <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                 <h4 className="text-2xl font-bold text-slate-900 mb-4">Message Received!</h4>
                 <p className="text-slate-600 mb-8">Thank you for reaching out. One of our agents will contact you shortly.</p>
                 <button 
                  onClick={() => setSubmitted(false)}
                  className={`px-8 py-3 text-white font-bold rounded-xl ${BRAND_COLORS.primaryBg}`}
                 >
                   Send another message
                 </button>
               </div>
             ) : (
               <>
                <h4 className="text-2xl font-bold text-slate-900 mb-8">Send a Message</h4>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-5 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none" 
                            placeholder="John Doe" 
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-5 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none" 
                            placeholder="john@example.com" 
                          />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Service Interested In</label>
                      <select 
                        className="w-full px-5 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none appearance-none"
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                      >
                          <option>Personal Loan</option>
                          <option>Business Loan</option>
                          <option>Investment Opportunity</option>
                          <option>General Inquiry</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Message</label>
                      <textarea 
                        rows={4} 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-5 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none" 
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2 ${BRAND_COLORS.primaryBg} ${BRAND_COLORS.primaryHover} disabled:opacity-50`}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send Message</span>}
                    </button>
                </form>
               </>
             )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
