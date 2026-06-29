import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConfirmationModal: React.FC = () => {
  const { confirmModal, closeConfirm } = useApp();

  if (!confirmModal || !confirmModal.isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          id="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeConfirm}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Panel */}
        <motion.div
          id="modal-panel"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 z-10"
        >
          {/* Close button */}
          <button
            id="close-modal-btn"
            onClick={closeConfirm}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {confirmModal.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {confirmModal.message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              id="confirm-cancel-btn"
              onClick={closeConfirm}
              className="px-4 py-2 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-action-btn"
              onClick={() => {
                confirmModal.onConfirm();
                closeConfirm();
              }}
              className="px-5 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 shadow-md shadow-orange-500/10 transition-opacity"
            >
              Confirm Action
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
