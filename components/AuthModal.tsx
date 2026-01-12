
import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Loader2, AlertCircle, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BRAND_COLORS } from '../constants';
import Logo from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'reset';
  targetRole?: 'customer' | 'employer';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  targetRole = 'employer' 
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setSuccess(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const validatePassword = (pass: string) => {
    // Requirements: Capital, small, number, character, 8+ length
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return regex.test(pass);
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setError(null);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === 'signup') {
      if (!validatePassword(password)) {
        setError('Password must be at least 8 characters and include uppercase, lowercase, number, and a special character.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: fullName,
              role: targetRole 
            }
          }
        });
        if (signUpError) throw signUpError;
        
        // After successful signup: empty fields and bring login instead of signup
        setSuccess(`Account created successfully! Please verify your email, then login.`);
        clearForm();
        // Give time for user to read the message before switching view
        setTimeout(() => setMode('login'), 2500);
      } else if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onClose();
      } else if (mode === 'reset') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
        if (resetError) throw resetError;
        setSuccess('A recovery link has been sent to your email.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-full-page bg-slate-950 flex flex-col min-h-screen animate-fade-in">
      {/* Background Decorative Elements - High-end Unique Styling */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[150px] rounded-full"></div>
      </div>

      {/* portal Header */}
      <div className="relative z-50 bg-slate-900/40 backdrop-blur-2xl border-b border-white/5 py-5 px-10 flex justify-between items-center shadow-2xl">
        <Logo className="scale-75 origin-left" />
        <button 
          onClick={onClose} 
          className="group flex items-center space-x-3 px-5 py-2.5 bg-white/5 hover:bg-red-500/10 rounded-full text-white/60 hover:text-red-400 transition-all border border-white/10"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exit Portal</span>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative z-10 flex-grow flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[1000px] grid lg:grid-cols-2 bg-slate-900 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] border border-white/10 overflow-hidden">
          
          {/* Visual Brand Side */}
          <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-slate-800 to-slate-950 text-white relative">
            {/* Background lines removed as requested */}
            <div className="relative z-10">
              <div className="w-16 h-1 bg-amber-500 mb-8 rounded-full"></div>
              <h3 className="text-4xl font-serif font-black mb-8 leading-tight">
                {targetRole === 'employer' ? 'Employer Portal' : 'Customer Portal'}
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed font-light mb-12">
                {targetRole === 'employer' 
                  ? 'Access internal management tools for loan verification and institutional oversight.' 
                  : 'Your secure gateway to reliable financial assistance, loan tracking, and wealth management.'}
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <ShieldCheck className="w-5 h-5" />, text: 'Military-Grade Security' },
                  { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Fraud Protection System' },
                  { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Verified Institutional Access' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 text-cyan-400/80">
                    <div className="p-2 bg-white/5 rounded-lg">{item.icon}</div>
                    <span className="text-sm font-bold uppercase tracking-widest">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-12 pt-12 border-t border-white/5">
              <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">System Status: Optimal</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-10 md:p-16 bg-white relative">
            <div className="mb-12 text-center lg:text-left">
              <h2 className="text-4xl font-serif font-black text-slate-900 mb-3">
                {mode === 'login' ? 'Login' : mode === 'signup' ? 'Create Account' : 'Reset Portal'}
              </h2>
              <p className="text-slate-500 font-medium">
                {mode === 'login' 
                  ? 'Sign in to access your dashboard.' 
                  : mode === 'signup' 
                    ? 'Start your application by creating an account.' 
                    : 'Provide your email to recover access.'}
              </p>
            </div>

            {error && (
              <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-2xl flex items-center space-x-4 text-sm animate-shake shadow-sm">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-8 p-5 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-2xl flex items-center space-x-4 text-sm shadow-sm">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <span className="font-semibold">{success}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              {mode === 'signup' && (
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-cyan-600">Legal Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-cyan-600" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 focus:bg-white outline-none transition-all font-semibold"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-cyan-600">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-cyan-600" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 focus:bg-white outline-none transition-all font-semibold"
                    placeholder="email@provider.com"
                  />
                </div>
              </div>

              {mode !== 'reset' && (
                <>
                  <div className="space-y-2 group">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-cyan-600">Portal Password</label>
                      {mode === 'login' && (
                        <button 
                          type="button"
                          onClick={() => setMode('reset')}
                          className="text-[10px] font-black text-cyan-600 hover:text-amber-600 uppercase tracking-widest"
                        >
                          Help?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-cyan-600" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 focus:bg-white outline-none transition-all font-semibold"
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {mode === 'signup' && (
                        <p className="text-[9px] text-slate-400 italic px-2">Required: 8+ chars, Upper, Lower, Number, Special.</p>
                    )}
                  </div>

                  {mode === 'signup' && (
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-cyan-600">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-cyan-600" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full pl-14 pr-5 py-4 border rounded-[1.25rem] focus:ring-4 outline-none transition-all font-semibold ${
                            confirmPassword && password !== confirmPassword 
                              ? 'bg-red-50 border-red-300 focus:ring-red-600/10' 
                              : 'bg-slate-50 border-slate-200 focus:ring-cyan-600/10 focus:border-cyan-600'
                          }`}
                          placeholder="Repeat password"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 text-white font-black uppercase tracking-[0.25em] text-xs rounded-[1.25rem] shadow-2xl transition-all flex items-center justify-center space-x-3 active:scale-[0.98] ${BRAND_COLORS.primaryBg} hover:shadow-cyan-600/40 disabled:opacity-50`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>
                  {mode === 'login' ? 'Login' : mode === 'signup' ? 'Submit Application' : 'Request Link'}
                </span>}
              </button>
            </form>

            <div className="mt-12 pt-10 border-t border-slate-100 text-center">
              {mode === 'reset' ? (
                <button
                  onClick={() => setMode('login')}
                  className="text-xs font-black text-cyan-700 hover:text-cyan-800 uppercase tracking-widest flex items-center justify-center mx-auto"
                >
                  Return to portal login
                </button>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                    {mode === 'login' ? "Don't have an account?" : "Already an Aster member?"}{' '}
                    <button
                      onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                      className="ml-2 text-cyan-600 hover:text-amber-600 font-black underline underline-offset-8 decoration-2"
                    >
                      {mode === 'login' ? 'Sign Up' : 'Login'}
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
