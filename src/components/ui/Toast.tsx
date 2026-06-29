import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          id="toast-notification"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-sm"
        >
          {toast.type === 'success' && (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          )}
          {toast.type === 'error' && (
            <X className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
          )}
          
          <div className="flex-1 text-sm font-medium pr-2">
            {toast.message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
