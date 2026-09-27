import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Loader2, X } from 'lucide-react';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsSigningOut(true);
    setError(null);
    try {
      await onConfirm();
      // Note: Modal will unmount upon redirect from layout, but we can close it if needed.
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to sign out. Please try again.');
      setIsSigningOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !isSigningOut && onClose()}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <LogOut className="w-5 h-5 text-red-500" />
                Sign out?
              </div>
              <button 
                onClick={onClose}
                disabled={isSigningOut}
                className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-slate-600 text-sm">
                Are you sure you want to sign out of your SwipeX account?
              </p>
              {error && (
                <p className="mt-2 text-red-500 text-xs font-medium">{error}</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={onClose}
                disabled={isSigningOut}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSigningOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:opacity-70"
              >
                {isSigningOut ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Yes, Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
