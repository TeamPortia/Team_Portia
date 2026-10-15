// src/components/home/HeroSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import {
  Sparkles,
  ArrowRight,
  FolderGit2,
  Users,
  Zap,
  Cpu,
  Globe2,
  ShieldCheck,
} from "lucide-react";

import { ComputerWorkstation } from "./ComputerWorkstation";

export const HeroSection = () => {
  const { teamSettings } = useData();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -top-10 right-10 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm animate-bounce-subtle">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Next-Gen Engineering Collective</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-700/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Govt. of India MSME Registered</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15]">
            Building Ideas. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent luxury-shimmer">
              Creating Measurable Impact.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-3xl mx-auto">
            {teamSettings?.description ||
              "We are an elite multi-disciplinary software engineering team designing scalable enterprise architectures, intelligent AI agents, resilient cloud platforms, and immersive digital experiences."}
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 w-full max-w-md mx-auto sm:max-w-none">
            <Link
              to="/team"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 text-sm luxury-card"
            >
              <Users className="w-4 h-4" />
              Explore Our Team
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl luxury-glass text-gray-800 dark:text-gray-100 font-semibold border border-white/30 dark:border-white/10 hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-lg transition-all hover:scale-105 active:scale-95 text-sm luxury-card"
            >
              <FolderGit2 className="w-4 h-4 text-indigo-500" />
              View Centralized Projects
            </Link>
          </div>

          {/* ANIMATED COMPUTER WORKSTATION & CODING OPERATOR */}
          <ComputerWorkstation />

          {/* Feature Badges Row */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60">
              <Cpu className="w-4 h-4 text-purple-500" />
              <span>Full-Stack & Cloud Native</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Deep Learning & Agentic AI</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60">
              <Globe2 className="w-4 h-4 text-indigo-500" />
              <span>Enterprise Grade Security</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
