import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    const result = await login({ email, password });
    setIsSubmitting(false);

    if (result.success && result.user) {
      if (!result.user.isVerified) {
        navigate('/verify-email', { state: { email } });
      } else {
        // Successful login - route dynamically
        switch (result.user.role) {
          case 'CLIENT':
            navigate('/client/dashboard');
            break;
          case 'FREELANCER':
            navigate('/freelancer/dashboard');
            break;
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } else {
      setErrorMsg(result.message);
      if (result.emailNotVerified) {
        // If email is not verified, pass email in state for convenience
        setTimeout(() => {
          navigate('/verify-email', { state: { email } });
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-950 font-sans transition-colors">
      {/* Left Side: Brand Marketing Panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-orange-600 to-blue-900 p-12 flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-black/15 z-0" />
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-orange-600 font-bold shadow-lg">
            IX
          </div>
          <span className="text-lg font-bold tracking-tight">Innovexa Catalyst</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-sm my-auto">
          <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl space-y-6">
            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight leading-snug">
              Innovexa Catalyst
            </h2>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Where Elite Talent Meets Innovation. Join the premier network connecting top-tier freelance experts with global corporate powerhouses.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
              <div>
                <p className="text-lg font-extrabold">15k+</p>
                <p className="text-[9px] text-white/60 font-semibold uppercase tracking-wider">Freelancers</p>
              </div>
              <div>
                <p className="text-lg font-extrabold">500+</p>
                <p className="text-[9px] text-white/60 font-semibold uppercase tracking-wider">Enterprises</p>
              </div>
              <div>
                <p className="text-lg font-extrabold">98%</p>
                <p className="text-[9px] text-white/60 font-semibold uppercase tracking-wider">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/60 font-medium">
          &copy; 2026 Innovexa Catalyst. All rights reserved. Secure Cloud-Native Workspace.
        </div>
      </div>

      {/* Right Side: Login Form Panel */}
      <div className="lg:col-span-7 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 relative">
        <div className="w-full max-w-md mx-auto space-y-8 text-left">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
            <p className="text-sm text-slate-400 font-medium">Please enter your details to access your dashboard.</p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold animate-shake">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="login-email-input"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-10 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  id="login-remember-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-orange-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-orange-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs font-semibold text-slate-500">
            New to the catalyst?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
