// src/components/home/ComputerWorkstation.jsx
import React, { useState, useEffect } from "react";
import { Terminal, Cpu, CheckCircle2, ShieldCheck, Zap, Code2, Sparkles, Layers } from "lucide-react";

const CODE_LINES = [
  "// Initializing Engineering Innovation Engine...",
  "import { AI, Cloud, React, Firebase } from '@team/core';",
  "const team = new DeveloperCollective({ status: '⚡ 100% Active' });",
  "await team.deployArchitectures();",
  "console.log('🚀 All Systems Operational!');",
];

export const ComputerWorkstation = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    const currentFullLine = CODE_LINES[currentLineIndex];

    if (isTyping) {
      if (displayedText.length < currentFullLine.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentFullLine.slice(0, displayedText.length + 1));
        }, 35);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1800);
      }
    } else {
      timeout = setTimeout(() => {
        setDisplayedText("");
        setIsTyping(true);
        setCurrentLineIndex((prev) => (prev + 1) % CODE_LINES.length);
      }, 400);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentLineIndex]);

  return (
    <div className="relative mt-12 mb-8 max-w-4xl mx-auto px-2 sm:px-4">
      {/* Background Neon Glowing Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-60 sm:h-[300px] bg-gradient-to-r from-indigo-500/25 via-purple-500/25 to-cyan-500/20 blur-[90px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />

      {/* FLOATING TECH BADGES AROUND THE COMPUTER */}
      {/* Badge 1: Top Left - React & AI */}
      <div className="hidden sm:flex absolute -top-6 -left-4 lg:-left-10 z-20 items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-indigo-500/30 shadow-xl shadow-indigo-500/10 text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-float">
        <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-500">
          <Code2 className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-extrabold text-gray-900 dark:text-white">Full-Stack Code</p>
          <p className="text-[9px] text-gray-500">React • Node • Cloud</p>
        </div>
      </div>

      {/* Badge 2: Top Right - Firebase & Auth */}
      <div className="hidden sm:flex absolute -top-6 -right-4 lg:-right-10 z-20 items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-amber-500/30 shadow-xl shadow-amber-500/10 text-xs font-bold text-amber-600 dark:text-amber-400 animate-float-delayed">
        <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-500">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-extrabold text-gray-900 dark:text-white">Realtime Sync</p>
          <p className="text-[9px] text-gray-500">Firebase Firestore & Auth</p>
        </div>
      </div>

      {/* Badge 3: Bottom Left - AI Agentic Models */}
      <div className="hidden sm:flex absolute -bottom-4 -left-4 lg:-left-8 z-20 items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-purple-500/30 shadow-xl shadow-purple-500/10 text-xs font-bold text-purple-600 dark:text-purple-400 animate-float-delayed">
        <div className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-500">
          <Cpu className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-extrabold text-gray-900 dark:text-white">Intelligent AI</p>
          <p className="text-[9px] text-gray-500">Agentic Architecture</p>
        </div>
      </div>

      {/* Badge 4: Bottom Right - System Status */}
      <div className="hidden sm:flex absolute -bottom-4 -right-4 lg:-right-8 z-20 items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-emerald-500/30 shadow-xl shadow-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-float">
        <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-500">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-extrabold text-gray-900 dark:text-white">Live System</p>
          <p className="text-[9px] text-emerald-500 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            100% Operational
          </p>
        </div>
      </div>

      {/* MAIN COMPUTER LAPTOP / MONITOR FRAME */}
      <div className="relative rounded-3xl bg-gray-950 border-2 border-indigo-500/30 shadow-2xl shadow-indigo-900/40 p-3 sm:p-4 transition-all group overflow-hidden">
        {/* Computer Screen Header / MacOS Controls */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-900/90 rounded-t-2xl border-b border-gray-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
            <span className="text-[11px] text-gray-400 font-mono ml-2 hidden sm:inline-block">
              developer_workspace.kt — Team Portfolio Workstation
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <Terminal className="w-3.5 h-3.5" /> zsh — node v20.11
            </span>
            <span className="hidden md:inline-block text-indigo-400 font-bold">PORT: 3000</span>
          </div>
        </div>

        {/* SCREEN INNER CONTENT: Live Typing Terminal & Workstation UI */}
        <div className="grid grid-cols-1 md:grid-cols-12 bg-gray-950/95 min-h-[260px] sm:min-h-[300px] rounded-b-2xl p-4 sm:p-6 gap-6 font-mono text-left items-center">
          
          {/* Left Column: Live Terminal Code Screen */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 pb-2 border-b border-gray-900">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>IDE Code Editor Live Preview</span>
            </div>

            {/* Typewriter Code Display */}
            <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
              <p className="text-gray-500 text-[11px]">{`// Real-time engineering workstation`}</p>
              <p className="text-indigo-400 font-semibold">
                <span className="text-purple-400">const</span> developer = <span className="text-amber-300">new</span> Team({`{`}
              </p>
              <p className="pl-4 text-emerald-400">
                status: <span className="text-cyan-300">"⚡ Active & Coding"</span>,
              </p>
              <p className="pl-4 text-emerald-400">
                stack: [<span className="text-amber-300">"AI"</span>, <span className="text-amber-300">"React"</span>, <span className="text-amber-300">"Firebase"</span>],
              </p>
              <p className="text-indigo-400 font-semibold">{`}`});</p>

              {/* Typing Line */}
              <div className="pt-2 flex items-center gap-1.5 text-cyan-400 font-semibold text-xs sm:text-sm bg-gray-900/60 p-2.5 rounded-xl border border-gray-800/80">
                <span className="text-emerald-400">❯</span>
                <span className="text-gray-100">{displayedText}</span>
                <span className="w-2 h-4 bg-cyan-400 animate-pulse"></span>
              </div>
            </div>

            {/* Output log */}
            <div className="pt-2 flex items-center justify-between text-[10px] text-gray-500">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 0 Syntax Errors • Build Clean
              </span>
              <span>Memory: 42MB</span>
            </div>
          </div>

          {/* Right Column: Visual Graphic of Engineer working at Computer */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/40 to-gray-950 border border-indigo-500/20 text-center relative overflow-hidden group/graphic">
            
            {/* Ambient Graphic Backdrop Glow */}
            <div className="absolute inset-0 bg-indigo-600/10 rounded-2xl blur-xl group-hover/graphic:bg-indigo-600/20 transition duration-500 pointer-events-none" />

            {/* Animated Workstation Laptop & Coffee & Desk Graphic */}
            <div className="relative my-2">
              {/* Laptop Screen Graphic */}
              <div className="w-28 h-20 sm:w-36 sm:h-24 rounded-t-xl bg-gradient-to-tr from-gray-900 to-indigo-950 border-2 border-indigo-400/50 p-2 flex flex-col justify-between shadow-lg mx-auto transform group-hover/graphic:scale-105 transition duration-300">
                <div className="flex items-center justify-between border-b border-indigo-500/30 pb-1 text-[8px] text-indigo-300">
                  <span className="flex items-center gap-1 font-bold">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-spin-slow" /> IDE Active
                  </span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                {/* Simulated Code Lines Graphic */}
                <div className="space-y-1 my-auto">
                  <div className="h-1.5 bg-indigo-500/60 rounded w-3/4 animate-pulse"></div>
                  <div className="h-1.5 bg-purple-500/60 rounded w-1/2 animate-pulse"></div>
                  <div className="h-1.5 bg-cyan-500/60 rounded w-5/6 animate-pulse"></div>
                  <div className="h-1.5 bg-emerald-500/60 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>

              {/* Laptop Keyboard & Trackpad Base */}
              <div className="w-36 h-3 sm:w-44 sm:h-3.5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-b-xl border-t border-gray-600 shadow-xl mx-auto flex items-center justify-center relative">
                <div className="w-8 h-1 bg-gray-500 rounded-full"></div>
              </div>
            </div>

            {/* Sub-label under Computer Graphic */}
            <div className="mt-3 space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60 text-[10px] font-bold">
                <Layers className="w-3 h-3 text-purple-400" /> Automated Build Pipeline
              </span>
              <p className="text-[11px] font-semibold text-gray-300">Active Engineer Session</p>
            </div>
          </div>

        </div>

        {/* Laptop Bottom Lip / Stand Reflection */}
        <div className="h-2 bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 rounded-b-2xl border-t border-gray-800"></div>
      </div>
    </div>
  );
};
