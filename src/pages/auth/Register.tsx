import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, User, Briefcase, ChevronLeft } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'CLIENT' | 'FREELANCER' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Client conditional fields
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');

  // Freelancer conditional fields
  const [title, setTitle] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(35);
  const [skillsStr, setSkillsStr] = useState('React, TypeScript, Node.js');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!role) {
      setErrorMsg('Please select your role first.');
      return;
    }
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('You must accept the terms & conditions.');
      return;
    }

    setIsSubmitting(true);

    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      name,
      email,
      password,
      role,
      companyName: role === 'CLIENT' ? companyName : undefined,
      website: role === 'CLIENT' && website ? website : undefined,
      title: role === 'FREELANCER' ? title : undefined,
      hourlyRate: role === 'FREELANCER' ? Number(hourlyRate) : undefined,
      skills: role === 'FREELANCER' ? skills : undefined,
    };

    const result = await register(payload);
    setIsSubmitting(false);

    if (result.success) {
      // Redirect to verification screen, passing email via React Router state
      navigate('/verify-email', { state: { email, message: result.message } });
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
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight leading-snug">
              Secure Your Future
            </h2>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Join the premier ecosystem connecting elite freelancers with Fortune 500 enterprises. Experience instant verification, smart contract protection, and secure escrow services.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/60 font-medium">
          &copy; 2026 Innovexa Catalyst. All rights reserved. Secure Cloud-Native Platform.
        </div>
      </div>

      {/* Right side form */}
      <div className="lg:col-span-7 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 relative overflow-y-auto">
        <div className="w-full max-w-md mx-auto space-y-8 text-left">
          {role !== null && (
            <button
              onClick={() => setRole(null)}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Role Selection
            </button>
          )}

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {role === null ? 'Join our ecosystem' : `Sign Up as a ${role === 'CLIENT' ? 'Client' : 'Freelancer'}`}
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              {role === null ? 'Select your primary role to get started' : 'Please provide the details below to complete your registration.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold animate-shake">
              {errorMsg}
            </div>
          )}

          {role === null ? (
            /* Role Selection Screen */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  id="register-role-client"
                  onClick={() => setRole('CLIENT')}
                  className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-orange-500 hover:shadow-2xl transition-all cursor-pointer text-center space-y-4"
                >
                  <div className="mx-auto h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">I want to Hire</h4>
                    <p className="text-[11px] text-slate-400 font-medium">I'm looking for elite talent for my projects</p>
                  </div>
                </div>

                <div
                  id="register-role-freelancer"
                  onClick={() => setRole('FREELANCER')}
                  className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer text-center space-y-4"
                >
                  <div className="mx-auto h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">I want to Work</h4>
                    <p className="text-[11px] text-slate-400 font-medium">I'm a professional looking for freelance jobs</p>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs font-semibold text-slate-500 pt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          ) : (
            /* Register Form Screen */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    id="reg-name-input"
                    type="text"
                    required
                    placeholder="Sarah Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    id="reg-email-input"
                    type="email"
                    required
                    placeholder="sarah@innovexa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Client conditional fields */}
              {role === 'CLIENT' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Company Name</label>
                    <input
                      id="reg-company-input"
                      type="text"
                      required
                      placeholder="Enterprise Co."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Website URL (Optional)</label>
                    <input
                      id="reg-website-input"
                      type="url"
                      placeholder="https://company.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </>
              )}

              {/* Freelancer conditional fields */}
              {role === 'FREELANCER' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Professional Title</label>
                    <input
                      id="reg-title-input"
                      type="text"
                      required
                      placeholder="Senior Fullstack Architect"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Hourly Rate ($)</label>
                      <input
                        id="reg-rate-input"
                        type="number"
                        min="10"
                        required
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Skills (Comma-separated)</label>
                      <input
                        id="reg-skills-input"
                        type="text"
                        required
                        value={skillsStr}
                        onChange={(e) => setSkillsStr(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      id="reg-password-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      id="reg-confirm-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                </button>
              </div>

              <div className="flex items-start gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 py-2">
                <input
                  id="reg-terms-checkbox"
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500 h-4 w-4 shrink-0 mt-0.5"
                />
                <span className="leading-tight">
                  I agree to the{' '}
                  <span className="text-orange-600 hover:underline cursor-pointer">Terms of Service</span> and{' '}
                  <span className="text-orange-600 hover:underline cursor-pointer">Privacy Policy</span>.
                </span>
              </div>

              <button
                id="reg-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-orange-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              <p className="text-center text-xs font-semibold text-slate-500 pt-2">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Log In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
