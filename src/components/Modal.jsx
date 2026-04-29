import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, wide = false }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`relative z-10 bg-[#F1F9F4]/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden
              ${wide ? 'w-full max-w-4xl' : 'w-full max-w-lg'}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/40">
              <h2 className="text-xl font-bold tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/60 text-text-muted hover:text-text-primary transition-all"
              >
                <X size={18} />
              </button>
            </div>
            {/* Body */}
            <div className="px-8 py-6 overflow-y-auto max-h-[75vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
