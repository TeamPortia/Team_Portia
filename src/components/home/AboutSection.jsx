// src/components/home/AboutSection.jsx
import React from "react";
import { useData } from "../../contexts/DataContext";
import { Sparkles, Terminal, Layers, ShieldCheck, Zap } from "lucide-react";

export const AboutSection = () => {
  const { teamSettings } = useData();

  const pillars = [
    {
      title: "AI & Neural Perception",
      desc: "Fine-tuning LLMs, computer vision recognition models, voice synthesis, and autonomous agent systems.",
      icon: Zap,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Resilient Cloud Infrastructure",
      desc: "Kubernetes orchestration, automated GitOps CI/CD pipelines, multi-cloud microservices, and observability.",
      icon: Terminal,
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      title: "Modern Web & Mobile UX",
      desc: "Delightful, responsive, WCAG accessible interfaces built with React, Tailwind CSS, React Native, and Flutter.",
      icon: Layers,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      title: "Zero-Trust Enterprise Security",
      desc: "SOC2 compliance, role-based access control, cryptographic verification, and end-to-end data encryption.",
      icon: ShieldCheck,
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About Our Team</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Crafting Digital Solutions With Precision & Heart
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300">
            {teamSettings?.mission ||
              "To solve high-complexity technical challenges and empower businesses and communities through elegant, secure, and scalable software systems."}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl luxury-glass border border-white/40 dark:border-white/10 shadow-lg luxury-card group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${p.gradient} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
