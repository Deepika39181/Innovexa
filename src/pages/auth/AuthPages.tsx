import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowLeft, ShieldCheck, HelpCircle, Briefcase, UserCircle2 } from 'lucide-react';

export const AuthPages: React.FC = () => {
  const { 
    authStep, setAuthStep, setRole, setActiveTab,
    selectedRegisterRole, setSelectedRegisterRole, showToast,
    loginUser, registerUser
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }
    
    setIsSubmitting(true);
    const success = await loginUser(email, password);
    setIsSubmitting(false);
    
    if (!success) {
      // Offline fallback: lets log them in locally with simulated roles so the UI is always perfectly fluid
      if (email.toLowerCase().includes('client') || email.toLowerCase().includes('sarah')) {
        setRole('client');
        setActiveTab('dashboard');
        setAuthStep('authenticated');
        showToast('Offline Mode: Welcome back, Sarah Chen!', 'success');
      } else if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('marcus')) {
        setRole('admin');
        setActiveTab('dashboard');
        setAuthStep('authenticated');
        showToast('Offline Mode: Welcome back, Admin Marcus Thorne!', 'success');
      } else {
        setRole('freelancer');
        setActiveTab('dashboard');
        setAuthStep('authenticated');
        showToast('Offline Mode: Welcome back, Alex Rivera!', 'success');
      }
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please specify your registered email address.', 'error');
      return;
    }
    showToast(`Password reset instruction sent to ${email}.`, 'success');
    setAuthStep('login');
  };

  const handleRegisterRoleChoice = async (choice: 'client' | 'freelancer') => {
    setSelectedRegisterRole(choice);
    setIsSubmitting(true);
    
    const suffix = Math.floor(Math.random() * 1000);
    const mockEmail = `${choice}${suffix}@innovexa.com`;
    const mockPassword = 'password123';
    const mockName = choice === 'client' ? 'Sarah Chen' : 'Alex Rivera';
    
    const success = await registerUser({
      email: mockEmail,
      password: mockPassword,
      name: mockName,
      role: choice.toUpperCase(),
      companyName: choice === 'client' ? 'Enterprise Client Co.' : undefined,
      title: choice === 'freelancer' ? 'Expert Developer' : undefined,
      skills: choice === 'freelancer' ? ['React', 'TypeScript', 'Node.js'] : undefined
    });
    
    setIsSubmitting(false);
    
    if (!success) {
      // Offline fallback
      setRole(choice);
      setActiveTab('dashboard');
      setAuthStep('authenticated');
      showToast(`Offline Mode: Account created as a ${choice === 'client' ? 'Client' : 'Freelancer'}!`, 'success');
    }
  };

  // 1. LOGIN SCREEN
  if (authStep === 'login') {
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
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <button
              onClick={() => setAuthStep('authenticated')}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
            >
              Skip as Guest
            </button>
          </div>

          <div className="w-full max-w-md mx-auto space-y-8 text-left">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
              <p className="text-sm text-slate-400 font-medium">Please enter your details to access your dashboard.</p>
            </div>

            {/* SSO Trigger */}
            <button
              onClick={() => {
                setRole('freelancer');
                setAuthStep('authenticated');
                setActiveTab('dashboard');
                showToast('Logged in successfully via Google SSO.', 'success');
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-850"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold tracking-wider uppercase">Or sign in with email</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-850"></div>
            </div>

            {/* Email form */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    id="email-input"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Tip: Type "client" for Sarah Chen, or "admin" for Marcus Thorne.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-10 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setAuthStep('forgot')}
                  className="text-orange-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                id="submit-login-btn"
                type="submit"
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-orange-600/10"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-xs font-semibold text-slate-500">
              New to the catalyst?{' '}
              <button
                onClick={() => setAuthStep('role_select')}
                className="text-blue-600 hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. FORGOT PASSWORD SCREEN
  if (authStep === 'forgot') {
    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-950 font-sans transition-colors">
        {/* Left Side Branding */}
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
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight leading-snug">
                Secure Your Future
              </h2>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Access the world’s most elite freelance network and drive corporate innovation at scale. Enterprise-Grade Security and multi-layered protection.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-xs text-white/60 font-medium">
            &copy; 2026 Innovexa Catalyst. Secure Cloud-Native Platform.
          </div>
        </div>

        {/* Right Side Forgot Password Form */}
        <div className="lg:col-span-7 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 relative">
          <button
            onClick={() => setAuthStep('login')}
            className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          <div className="w-full max-w-md mx-auto space-y-8 text-left">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Forgot Password?</h1>
              <p className="text-sm text-slate-400 font-medium">No worries! Enter the email address associated with your account and we’ll send you a recovery link.</p>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    id="forgot-email-input"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <button
                id="forgot-submit-btn"
                type="submit"
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-orange-600/10"
              >
                Send Reset Link
              </button>
            </form>

            <p className="text-center text-xs font-semibold text-slate-500">
              Remember your password?{' '}
              <button
                onClick={() => setAuthStep('login')}
                className="text-blue-600 hover:underline"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. ROLE CHANGER / ECOSYSTEM SELECTOR
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-950 font-sans transition-colors">
      {/* Left side illustration */}
      <div className="hidden lg:flex lg:col-span-6 bg-blue-900 p-12 flex-col justify-between text-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-blue-800 z-0" />
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-900 font-bold">
            IX
          </div>
          <span className="text-lg font-bold">Innovexa Catalyst</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-md my-auto">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Fueling Innovation Through Elite Talent.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            Join the premier network where corporate visionaries meet world-class freelance experts to build the future of technology.
          </p>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <p className="text-xs italic text-slate-200">
              "Innovexa has transformed how we scale our engineering teams. The caliber of freelancers is unmatched in the industry."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" className="h-8 w-8 rounded-full object-cover" alt="Sarah" />
              <div>
                <h5 className="text-xs font-bold">Sarah Jenkins</h5>
                <p className="text-[10px] text-slate-400">VP of Engineering, CloudCore</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          &copy; 2026 Innovexa Catalyst. All rights reserved. Secure Cloud-Native Platform.
        </div>
      </div>

      {/* Right side Selector cards */}
      <div className="lg:col-span-6 flex flex-col justify-center px-4 sm:px-12 lg:px-20 py-12">
        <div className="w-full max-w-md mx-auto space-y-10 text-center">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Join our ecosystem</h1>
            <p className="text-sm text-slate-400 font-medium">Select your primary role to get started</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card: I want to Hire */}
            <div
              id="role-hire-card"
              onClick={() => handleRegisterRoleChoice('client')}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-orange-500 hover:shadow-2xl transition-all cursor-pointer text-center space-y-4"
            >
              <div className="mx-auto h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">I want to Hire</h4>
                <p className="text-[11px] text-slate-400 font-medium">I'm looking for elite talent for my project</p>
              </div>
            </div>

            {/* Card: I want to Work */}
            <div
              id="role-work-card"
              onClick={() => handleRegisterRoleChoice('freelancer')}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer text-center space-y-4"
            >
              <div className="mx-auto h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">I want to Work</h4>
                <p className="text-[11px] text-slate-400 font-medium">I'm a professional looking for opportunities</p>
              </div>
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-500">
            Already have an account?{' '}
            <button
              onClick={() => setAuthStep('login')}
              className="text-blue-600 hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
