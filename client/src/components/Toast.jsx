import React, { useEffect, useState } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icon = type === "success" ? "✓" : "✕";

  return (
    <div
      className={`toast ${type}`}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <span style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: type === "success" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.75rem",
        flexShrink: 0,
      }}>
        {icon}
      </span>
      {message}
    </div>
  );
};

// Toast Manager
let toastCallback = null;

export const showToast = (message, type = "success") => {
  if (toastCallback) toastCallback(message, type);
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastCallback = (message, type) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
    };
    return () => { toastCallback = null; };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
};

export default Toast;
