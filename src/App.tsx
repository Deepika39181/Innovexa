import React, { useState } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { Toast } from './components/ui/Toast';
import { ConfirmationModal } from './components/ui/Modal';
import { Layers, Users, Shield, Globe, Lock } from 'lucide-react';

function SandboxController() {
  const { role, setRole, authStep, setAuthStep, setActiveTab, showToast, loginUser } = useApp();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const switchRole = async (newRole: typeof role, step: typeof authStep, defaultTab: string, label: string) => {
    // If logging in as an authenticated user, perform login FIRST before changing role or step state to prevent race conditions
    if (step === 'authenticated') {
      let email = '';
      if (newRole === 'client') email = 'client@innovexa.com';
      else if (newRole === 'freelancer') email = 'freelancer@innovexa.com';
      else if (newRole === 'admin') email = 'admin@innovexa.com';

      if (email) {
        const success = await loginUser(email, 'password123');
        if (success) {
          showToast(`Role switched to ${label}`, 'info');
          if (newRole === 'client') navigate('/client/dashboard');
          else if (newRole === 'freelancer') navigate('/freelancer/dashboard');
          else if (newRole === 'admin') navigate('/admin/dashboard');
        } else {
          showToast(`Failed to auto-login as ${newRole}.`, 'error');
        }
        return;
      }
    }

    // Otherwise, if not logging in/authenticating, we just set states and navigate
    setRole(newRole);
    setAuthStep(step);
    setActiveTab(defaultTab);
    showToast(`Role switched to ${label}`, 'info');

    if (newRole === 'public') {
      navigate('/');
    } else if (step === 'login') {
      navigate('/login');
    }
  };

  return (
    <div id="sandbox-switcher" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9995] flex flex-col items-center">
      {isOpen ? (
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-2xl text-white text-xs font-semibold select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Layers className="w-4 h-4 text-orange-500 shrink-0 animate-pulse" />
          <span className="text-[10px] text-slate-400 mr-2 uppercase tracking-wider font-bold">Sandbox:</span>
          
          <button
            id="switch-to-landing-btn"
            onClick={() => switchRole('public', 'login', 'home', 'Public Landing Page')}
            className={`px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1
              ${role === 'public' 
                ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB] text-white font-bold' 
                : 'hover:bg-slate-800 text-slate-300'
              }`}
          >
            <Globe className="w-3.5 h-3.5" /> Landing
          </button>

          <button
            id="switch-to-auth-btn"
            onClick={() => switchRole('client', 'login', 'dashboard', 'Auth Screens')}
            className={`px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1
              ${role !== 'public' && authStep === 'login' 
                ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB] text-white font-bold' 
                : 'hover:bg-slate-800 text-slate-300'
              }`}
          >
            <Lock className="w-3.5 h-3.5" /> Auth
          </button>

          <button
            id="switch-to-client-btn"
            onClick={() => switchRole('client', 'authenticated', 'dashboard', 'Client Dashboard')}
            className={`px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1
              ${role === 'client' && authStep === 'authenticated' 
                ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB] text-white font-bold' 
                : 'hover:bg-slate-800 text-slate-300'
              }`}
          >
            <Users className="w-3.5 h-3.5" /> Client
          </button>

          <button
            id="switch-to-freelancer-btn"
            onClick={() => switchRole('freelancer', 'authenticated', 'dashboard', 'Freelancer Dashboard')}
            className={`px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1
              ${role === 'freelancer' && authStep === 'authenticated' 
                ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB] text-white font-bold' 
                : 'hover:bg-slate-800 text-slate-300'
              }`}
          >
            <Users className="w-3.5 h-3.5" /> Freelancer
          </button>

          <button
            id="switch-to-admin-btn"
            onClick={() => switchRole('admin', 'authenticated', 'dashboard', 'Admin Console')}
            className={`px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1
              ${role === 'admin' && authStep === 'authenticated' 
                ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB] text-white font-bold' 
                : 'hover:bg-slate-800 text-slate-300'
              }`}
          >
            <Shield className="w-3.5 h-3.5" /> Admin
          </button>

          <div className="w-px h-4 bg-slate-800 mx-1" />
          <button 
            onClick={() => setIsOpen(false)}
            className="text-xs text-slate-500 hover:text-slate-300 px-1 font-bold"
          >
            Hide
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 shadow-2xl text-white hover:bg-slate-800 transition-colors"
        >
          <Layers className="w-5 h-5 text-orange-500" />
        </button>
      )}
    </div>
  );
}

function MainApp() {
  return (
    <div className="relative min-h-screen">
      {/* Route Render Engine */}
      <AppRoutes />

      {/* Persistent global widgets */}
      <Toast />
      <ConfirmationModal />
      <SandboxController />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
