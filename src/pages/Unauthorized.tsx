import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldX } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    switch (user.role) {
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
        navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 p-8 shadow-xl text-center space-y-6">
        <div className="mx-auto h-16 w-16 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-2xl flex items-center justify-center shadow-inner animate-pulse">
          <ShieldX className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Access Denied</h1>
          <p className="text-xs text-slate-400 font-medium">
            You do not have the required permissions to view this section.
          </p>
        </div>

        <button
          id="unauthorized-back-btn"
          onClick={handleGoHome}
          className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-orange-600/10"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
