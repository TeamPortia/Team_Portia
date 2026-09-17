// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "../components/common/Button";

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">404 – Page Not Found</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The requested route doesn't exist or may have been moved.
        </p>
        <Link to="/">
          <Button variant="primary" icon={ArrowLeft}>
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};
