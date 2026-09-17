// src/components/common/LoadingSpinner.jsx
import React from "react";

export const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-3 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin`}
      />
      {text && <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{text}</p>}
    </div>
  );
};
