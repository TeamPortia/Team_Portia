// src/pages/ServicesPage.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { servicesData } from "../components/home/ServicesSection";

export const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { label: "All Services", value: "All" },
    { label: "App Development", value: "app-development" },
    { label: "Web Development", value: "web-development" },
    { label: "IoT & Embedded", value: "iot-solutions" },
    { label: "Cloud & DevOps", value: "cloud-devops" },
    { label: "AI & ML", value: "ai-intelligent-systems" },
    { label: "UI/UX Design", value: "product-uiux" },
  ];

  const filteredServices = useMemo(() => {
    if (selectedCategory === "All") return servicesData;
    return servicesData.filter((s) => s.id === selectedCategory);
  }, [selectedCategory]);

  const engineeringProcess = [
    {
      step: "01",
      title: "Discovery & Strategy",
      desc: "Deep-dive analysis of your requirements, technical feasibility mapping, and solution architecture planning.",
    },
    {
      step: "02",
      title: "UI/UX & System Architecture",
      desc: "Creating interactive prototypes, database schematics, hardware pinouts, and system integration diagrams.",
    },
    {
      step: "03",
      title: "Agile Development & Coding",
      desc: "Sprint-driven implementation with clean codebases, continuous commits, and iterative feedback loops.",
    },
    {
      step: "04",
      title: "Testing, QA & Calibration",
      desc: "Automated test suites, device compatibility testing, security audits, and hardware bench calibration.",
    },
    {
      step: "05",
      title: "Launch & Ongoing Scaling",
      desc: "Zero-downtime deployment to app stores, cloud clusters, or edge IoT gateways with live monitoring.",
    },
  ];

  return (
    <div className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Layers className="w-3.5 h-3.5" />
            <span>Specialized Capabilities</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Our{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
              Services
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Delivering cutting-edge solutions across mobile application development, full-stack web platforms, and IoT hardware ecosystems tailored for real-world impact.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === cat.value
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative rounded-3xl p-8 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Gradient accent top line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                />

                {/* Card Top */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 p-4 rounded-2xl bg-gradient-to-tr ${service.color} text-white shadow-lg ${service.shadowColor} group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-3.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                    {service.tagline}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Key Highlights:
                    </p>
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom: Tech Stack & CTA */}
                <div className="pt-5 border-t border-gray-100 dark:border-gray-800/80">
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {service.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-gray-100 hover:bg-indigo-600 dark:bg-gray-800 dark:hover:bg-indigo-600 text-gray-900 hover:text-white dark:text-gray-200 dark:hover:text-white transition-all shadow-sm hover:shadow-md"
                  >
                    <span>Discuss Your Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Engineering Process Section */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>How We Deliver</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Our Engineering Lifecycle
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A transparent, agile workflow ensuring seamless handoff from initial blueprint to live production.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {engineeringProcess.map((proc, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white/60 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200/70 dark:border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black text-indigo-500/30 dark:text-indigo-400/20 block mb-3">
                    {proc.step}
                  </span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    {proc.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {proc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global CTA Banner */}
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-slate-900/90 border border-indigo-500/30 text-white shadow-2xl overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Production-Ready & Scalable</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to turn your vision into an innovative reality?
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Connect with our team to explore tailored web, mobile, or IoT hardware solutions designed specifically for your roadmap.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-indigo-900 hover:bg-gray-100 transition shadow-xl hover:scale-105"
            >
              Start a Conversation
            </Link>
            <Link
              to="/projects"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition backdrop-blur-md"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
