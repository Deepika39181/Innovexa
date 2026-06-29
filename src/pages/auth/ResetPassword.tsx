import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowLeft, ShieldAlert, CheckCircle } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-fill token if present in search query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg('Token is required.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const result = await resetPassword(token, password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg('Password has been reset successfully! Redirecting you to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-950 font-sans transition-colors">
      {/* Left side panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-blue-900 to-orange-700 p-12 flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-black/15 z-0" />
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-900 font-bold shadow-lg">
            IX
          </div>
          <span className="text-lg font-bold tracking-tight">Innovexa Catalyst</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-sm my-auto">
          <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl space-y-6">
            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight leading-snug">
              Secure Auth Credentials
            </h2>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              We enforce rigorous cryptographic checks, hashing all customer passwords securely via bcrypt to prevent data leaks.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/60 font-medium">
          &copy; 2026 Innovexa Catalyst. Secure Cloud-Native Platform.
        </div>
      </div>

      {/* Right side form */}
      <div className="lg:col-span-7 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 relative">
        <Link
          to="/login"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <div className="w-full max-w-md mx-auto space-y-8 text-left">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reset Password</h1>
            <p className="text-sm text-slate-400 font-medium">Please enter your reset token and define a strong new password.</p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold flex items-start gap-2">
              <CheckCircle className="w-4.5 h-4.5 shrink-0 text-green-500 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-start gap-2">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Reset Token</label>
              <input
                id="reset-token-input"
                type="text"
                placeholder="Enter reset token"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="reset-password-input"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="reset-confirm-input"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <button
              id="reset-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-orange-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
