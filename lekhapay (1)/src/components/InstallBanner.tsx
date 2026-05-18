import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface InstallBannerProps {
  show: boolean;
  onClose: () => void;
  onInstall: () => void;
}

export function InstallBanner({ show, onClose, onInstall }: InstallBannerProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 bg-gradient-to-r from-[#0d6e6e] to-teal-600 text-white p-4 rounded-2xl shadow-2xl z-50 max-w-lg mx-auto"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-inner">
                💰
              </div>
              <div>
                <h4 className="font-bold text-sm">হোম স্ক্রিনে যোগ করুন</h4>
                <p className="text-xs text-teal-100">দ্রুত অ্যাক্সেসের জন্য ইনস্টল করুন</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors"
              >
                পরে
              </button>
              <button
                onClick={onInstall}
                className="px-4 py-2 bg-white text-teal-700 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-all"
              >
                ইনস্টল
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
