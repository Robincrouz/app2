import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, Delete, Fingerprint } from "lucide-react";
import { cn } from "../lib/utils";

interface PinLockScreenProps {
  correctPin: string;
  onUnlock: () => void;
}

export function PinLockScreen({ correctPin, onUnlock }: PinLockScreenProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setPin("");
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 font-sans p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 to-slate-900"></div>
      
      <div className="relative z-10 w-full max-w-xs flex flex-col items-center">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-700">
           <Lock size={32} className="text-teal-400" strokeWidth={1.5} />
        </div>
        
        <h2 className="text-2xl font-black text-white tracking-tighter mb-2">পিন কোড দিন</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">অ্যাপ আনলক করতে</p>

        <div className="flex items-center gap-4 mb-14">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={error ? { x: [-10, 10, -10, 10, 0] } : { scale: pin.length > i ? 1.2 : 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                error ? "border-rose-500 bg-rose-500" :
                pin.length > i ? "bg-teal-400 border-teal-400" : "border-slate-600 bg-transparent"
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="w-16 h-16 rounded-[1.5rem] bg-slate-800/50 text-white text-2xl font-black flex items-center justify-center border border-slate-700/50 shadow-sm active:scale-90 active:bg-slate-700 transition-all hover:bg-slate-800"
            >
              {num}
            </button>
          ))}
          <div className="w-16 h-16 flex items-center justify-center">
            {/* Optional biometric icon space */}
            <button className="text-slate-500 hover:text-teal-400 transition-colors">
               <Fingerprint size={28} />
            </button>
          </div>
          <button
            onClick={() => handlePress("0")}
            className="w-16 h-16 rounded-[1.5rem] bg-slate-800/50 text-white text-2xl font-black flex items-center justify-center border border-slate-700/50 shadow-sm active:scale-90 active:bg-slate-700 transition-all hover:bg-slate-800"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-[1.5rem] text-slate-400 flex items-center justify-center active:scale-90 active:text-slate-300 transition-all hover:text-white"
          >
            <Delete size={24} strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
