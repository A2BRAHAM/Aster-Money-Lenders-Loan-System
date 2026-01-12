
import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, User, Loader2, Eye, EyeOff,
  Facebook, Instagram, Twitter, Linkedin, Briefcase, UserCircle, ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BRAND_COLORS } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'reset';
  targetRole?: 'customer' | 'employer';
  isRoleLocked?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  targetRole: defaultTargetRole = 'customer',
  isRoleLocked = false
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [role, setRole] = useState<'customer' | 'employer'>(defaultTargetRole);
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
    setRole(defaultTargetRole);
    setError(null);
    setSuccess(null);
  }, [initialMode, isOpen, defaultTargetRole]);

  if (!isOpen) return null;

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return regex.test(pass);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === 'signup') {
      if (!validatePassword(password)) {
        setError('Password must be 8+ chars (Upper, Lower, Number, Special).');
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
            data: { full_name: fullName, role: role }
          }
        });
        if (signUpError) throw signUpError;
        setSuccess(`Account created! Verify email, then login.`);
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
        setSuccess('Recovery link sent to email.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const SocialIcon = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <button 
      type="button"
      className="group flex items-center justify-center w-10 h-10 rounded-full border border-slate-100 bg-white transition-all hover:bg-amber-500 hover:border-amber-500 shadow-sm"
      aria-label={label}
    >
      <Icon className="w-4 h-4 text-slate-400 transition-colors group-hover:text-white" />
    </button>
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-50/95 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-[350px] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 px-8 py-10 animate-fade-in-up">
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">
            {mode === 'login' ? 'Login' : mode === 'signup' ? 'Create an account' : 'Reset Password'}
          </h2>

          {/* Role Selection Segmented Control - Only visible if not locked */}
          {!isRoleLocked && (
            <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
              <button 
                type="button"
                onClick={() => setRole('customer')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${role === 'customer' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <UserCircle className="w-4 h-4" />
                <span>Customer</span>
              </button>
              <button 
                type="button"
                onClick={() => setRole('employer')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${role === 'employer' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Employee</span>
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold text-center animate-shake">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-xl text-[10px] font-bold text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && (
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text" required value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-3 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-amber-500 transition-all text-sm font-medium placeholder-slate-300"
                placeholder="Full Name"
              />
            </div>
          )}

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-3 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-amber-500 transition-all text-sm font-medium placeholder-slate-300"
              placeholder="Email address"
            />
          </div>

          {mode !== 'reset' && (
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'} required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 pl-11 pr-11 py-3 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-amber-500 transition-all text-sm font-medium placeholder-slate-300"
                placeholder="Password"
              />
              <button 
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit" disabled={loading}
              className={`w-full py-3.5 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-[0.98] ${role === 'employer' ? BRAND_COLORS.primaryBg : BRAND_COLORS.secondaryBg} hover:opacity-90 disabled:opacity-50`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>
                {mode === 'login' ? 'Login' : mode === 'signup' ? 'Get Started' : 'Reset'}
              </span>}
            </button>
          </div>

          {mode === 'login' && (
            <div className="text-center pt-0.5">
              <button 
                type="button" onClick={() => setMode('reset')}
                className="text-[11px] text-slate-400 hover:text-amber-600 font-bold transition-colors"
              >
                forgot password?
              </button>
            </div>
          )}
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50">
          <div className="text-center mb-6">
            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-50"></div></div>
              <span className="relative px-3 text-slate-200 text-[10px] font-black uppercase tracking-widest bg-white">or</span>
            </div>
            
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[11px] text-amber-600 hover:text-amber-700 font-black uppercase tracking-widest transition-colors"
            >
              {mode === 'login' ? 'Create an account' : 'Back to login'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <span className="text-slate-400 text-[11px] font-medium">login with</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <SocialIcon icon={Mail} label="Google" />
              <SocialIcon icon={Facebook} label="Facebook" />
              <SocialIcon icon={Instagram} label="Instagram" />
              <SocialIcon icon={Twitter} label="Twitter" />
              <SocialIcon icon={Linkedin} label="LinkedIn" />
            </div>
          </div>
          
          {/* Explicit Back to home button as requested */}
          <div className="mt-8 text-center">
            <button 
              onClick={onClose}
              className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-slate-500 transition-all group"
            >
              <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
              <span>Back to home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
