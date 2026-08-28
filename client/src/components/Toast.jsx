import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  const isSuccess = type === "success";
  const isError = type === "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`relative overflow-hidden min-w-[320px] max-w-[420px] p-4 rounded-md backdrop-blur-xl border shadow-2xl flex items-center justify-between gap-3 text-sm font-medium ${
        isSuccess
          ? "bg-slate-900 border-emerald-500/50 text-white shadow-emerald-950/60"
          : isError
          ? "bg-slate-900 border-rose-500/50 text-white shadow-rose-950/60"
          : "bg-slate-900 border-violet-500/50 text-white shadow-violet-950/60"
      }`}
    >
      {/* Icon Badge */}
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
            isSuccess
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
              : isError
              ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
              : "bg-violet-500/20 border-violet-500/40 text-violet-400"
          }`}
        >
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-violet-400" />}
        </div>

        {/* Message */}
        <div className="flex flex-col gap-0.5 pr-2 text-left">
          <span
            className={`font-extrabold text-[11px] tracking-wider uppercase ${
              isSuccess ? "text-emerald-400" : isError ? "text-rose-400" : "text-violet-400"
            }`}
          >
            {isSuccess ? "Success" : isError ? "Error" : "Notification"}
          </span>
          <p className="text-xs sm:text-sm font-bold text-white leading-snug">{message}</p>
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={onClose}
        className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shrink-0"
      >
        <X className="w-4 h-4 text-slate-300 hover:text-white" />
      </button>

      {/* Animated Bottom Progress Line */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 3.5, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-[2.5px] ${
          isSuccess ? "bg-emerald-400" : isError ? "bg-rose-400" : "bg-violet-400"
        }`}
      />
    </motion.div>
  );
};

// Toast Manager
let toastCallback = null;

export const showToast = (message, type = "success") => {
  if (toastCallback) toastCallback(message, type);
};

showToast.success = (message) => showToast(message, "success");
showToast.error = (message) => showToast(message, "error");

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastCallback = (message, type) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };
    return () => {
      toastCallback = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 pointer-events-auto">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
