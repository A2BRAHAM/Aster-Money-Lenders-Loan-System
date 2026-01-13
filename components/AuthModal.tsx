
import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, User, Loader2, Eye, EyeOff,
  Facebook, Instagram, Twitter, Linkedin, Briefcase, UserCircle, ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  // Fix: changed onClose type from void to () => void as it is used as a function
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
    setConfirmPassword('');
  }, [initialMode, isOpen, defaultTargetRole]);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signup' && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, role: role } }
        });
        if (signUpError) throw signUpError;
        setSuccess(`Verification link sent to your email.`);
      } else if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onClose();
      } else if (mode === 'reset') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
        if (resetError) throw resetError;
        setSuccess('Recovery link sent.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const SocialIcon = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <button 
      type="button"
      className="group flex items-center justify-center w-8 h-8 rounded-full border border-red-600 bg-white hover:bg-red-600 transition-all shadow-sm"
      aria-label={label}
    >
      <Icon className="w-3.5 h-3.5 text-red-600 group-hover:text-white" />
    </button>
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-[360px] bg-white rounded-[2rem] shadow-2xl border border-black px-8 py-8 animate-fade-in-up flex flex-col justify-center">
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-serif font-bold text-black mb-4 tracking-tight">
            {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Sign up' : 'Account recovery'}
          </h2>

          {!isRoleLocked && mode !== 'reset' && (
            <div className="flex p-1 bg-white border border-black rounded-xl">
              <button 
                type="button"
                onClick={() => setRole('customer')}
                className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all ${role === 'customer' ? 'bg-red-600 text-white shadow-sm' : 'text-black'}`}
              >
                <UserCircle className="w-3 h-3" />
                <span>Customer</span>
              </button>
              <button 
                type="button"
                onClick={() => setRole('employer')}
                className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all ${role === 'employer' ? 'bg-red-600 text-white shadow-sm' : 'text-black'}`}
              >
                <Briefcase className="w-3 h-3" />
                <span>Employee</span>
              </button>
            </div>
          )}
        </div>

        {error && <div className="mb-4 p-2 bg-white border border-red-600 text-red-600 rounded-lg text-[10px] font-bold text-center">{error}</div>}
        {success && <div className="mb-4 p-2 bg-white border border-red-600 text-red-600 rounded-lg text-[10px] font-bold text-center">{success}</div>}

        <form onSubmit={handleAuth} className="space-y-2">
          {mode === 'signup' && (
            <input
              type="text" required value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border border-red-600 px-4 py-2.5 rounded-xl text-black outline-none focus:ring-1 focus:ring-red-600 transition-all text-xs font-medium"
              placeholder="Full name"
            />
          )}

          <input
            type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-red-600 px-4 py-2.5 rounded-xl text-black outline-none focus:ring-1 focus:ring-red-600 transition-all text-xs font-medium"
            placeholder="Email address"
          />

          {mode !== 'reset' && (
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'} required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-red-600 px-4 py-2.5 rounded-xl text-black outline-none focus:ring-1 focus:ring-red-600 transition-all text-xs font-medium"
                placeholder="Password"
              />
              <button 
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          )}

          {mode === 'signup' && (
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'} required value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-red-600 px-4 py-2.5 rounded-xl text-black outline-none focus:ring-1 focus:ring-red-600 transition-all text-xs font-medium"
                placeholder="Repeat password"
              />
            </div>
          )}

          {mode === 'login' && (
            <button 
              type="button"
              onClick={() => setMode('reset')}
              className="block w-full text-right pr-2 text-[10px] text-red-600 hover:underline"
            >
              Reset password
            </button>
          )}

          <div className="pt-2 space-y-2">
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-[10px] tracking-widest transition-all duration-300 border border-red-600 bg-red-600 text-white hover:bg-black hover:border-black active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" /> : (
                mode === 'login' ? 'Proceed to account' : mode === 'signup' ? 'Create account' : 'Request link'
              )}
            </button>

            {mode === 'login' && (
              <button
                type="button"
                className="w-full py-3 rounded-xl font-bold text-[10px] tracking-widest transition-all duration-300 border border-black bg-white text-black hover:bg-black hover:text-white flex items-center justify-center space-x-2"
              >
                <div className="w-4 h-4 flex items-center justify-center font-black border border-current rounded-sm text-[8px]">G</div>
                <span>Continue with google</span>
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-red-600 text-center">
          <div className="text-[10px] text-black font-bold">
            {mode === 'login' ? (
              <>
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-red-600 hover:underline transition-all"
                >
                  Sign up here.
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-red-600 hover:underline transition-all"
                >
                  Login
                </button>
              </>
            )}
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-3">
             <SocialIcon icon={Facebook} label="Facebook" />
             <SocialIcon icon={Linkedin} label="LinkedIn" />
             <SocialIcon icon={Instagram} label="Instagram" />
          </div>

          <button 
            onClick={onClose}
            className="mt-6 inline-flex items-center space-x-1 text-[10px] font-bold text-red-600 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
