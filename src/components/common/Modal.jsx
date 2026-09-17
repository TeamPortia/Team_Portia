// src/components/common/Modal.jsx
import React, { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="flex min-h-full items-center justify-center py-4 px-2 sm:px-0 text-center">
        <div
          className={`relative transform overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-left shadow-2xl transition-all my-auto w-full ${maxWidth} p-4 sm:p-8 animate-scale-up max-h-[92vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white pr-2 truncate">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200 transition flex-shrink-0"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto pr-1 flex-1 no-scrollbar">{children}</div>
        </div>
      </div>
    </div>
  );
};
