// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DataProvider } from "./contexts/DataContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { CustomCursor } from "./components/common/CustomCursor";
import { LuxuryAuraBackground } from "./components/common/LuxuryAuraBackground";
import { Toaster } from "react-hot-toast";

// Pages
import { HomePage } from "./pages/HomePage";
import { TeamPage } from "./pages/TeamPage";
import { MemberProfilePage } from "./pages/MemberProfilePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { AchievementsPage } from "./pages/AchievementsPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { MemberDashboardPage } from "./pages/MemberDashboardPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={requireAdmin ? "/admin/login" : "/login"} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <LuxuryAuraBackground />
            <CustomCursor />
            <div className="min-h-screen flex flex-col relative bg-slate-50/60 dark:bg-transparent text-gray-900 dark:text-gray-100 transition-colors selection:bg-indigo-500 selection:text-white">
              <Navbar />
              <main className="flex-1 relative z-10">
                <Routes>
                  {/* Public Core Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/team/:userId" element={<MemberProfilePage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* Authentication */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />

                  {/* Member Dashboard */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <MemberDashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Management Dashboard */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  className:
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 shadow-2xl text-xs rounded-2xl",
                }}
              />
            </div>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
