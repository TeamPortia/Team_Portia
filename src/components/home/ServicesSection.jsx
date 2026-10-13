// src/components/home/ServicesSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Globe,
  Cpu,
  Cloud,
  Sparkles,
  Palette,
  ArrowRight,
  CheckCircle2,
  Layers,
} from "lucide-react";

export const servicesData = [
  {
    id: "app-development",
    title: "Mobile App Development",
    shortTitle: "App Development",
    tagline: "Cross-Platform & Native Mobile Solutions",
    description:
      "High-performance iOS and Android applications engineered for speed, fluid touch interactions, and offline reliability. Built with scalable architectures that grow with your user base.",
    icon: Smartphone,
    color: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-cyan-500/20",
    badge: "Mobile Engineering",
    features: [
      "Cross-Platform (React Native & Flutter)",
      "Native iOS & Android Performance",
      "Real-Time Sync & Offline Storage",
      "Biometric Auth & Push Notifications",
    ],
    techStack: ["React Native", "Flutter", "Firebase", "REST APIs", "Kotlin", "Swift"],
  },
  {
    id: "web-development",
    title: "Full-Stack Web Development",
    shortTitle: "Web Development",
    tagline: "Ultra-Fast & Responsive Web Platforms",
    description:
      "Modern, enterprise-grade web applications and high-converting portals built using React, Next.js, and robust cloud backend architectures. Optimized for speed, security, and SEO.",
    icon: Globe,
    color: "from-indigo-500 to-purple-500",
    shadowColor: "shadow-indigo-500/20",
    badge: "Web Systems",
    features: [
      "Modern React & Next.js Architecture",
      "Tailwind CSS Luxury UI/UX Design",
      "Microservices & REST / GraphQL APIs",
      "High-Security Auth & Database Management",
    ],
    techStack: ["React", "Next.js", "Tailwind CSS", "Node.js", "PostgreSQL", "Firebase"],
  },
  {
    id: "iot-solutions",
    title: "IoT (Internet of Things)",
    shortTitle: "IoT & Hardware",
    tagline: "Smart Hardware & Embedded Telemetry",
    description:
      "Bridging the physical and digital domains with custom microcontroller firmware, smart sensor networks, edge intelligence, and low-latency cloud telemetry dashboards.",
    icon: Cpu,
    color: "from-emerald-500 to-teal-500",
    shadowColor: "shadow-emerald-500/20",
    badge: "Embedded & Edge",
    features: [
      "Microcontroller Programming (ESP32 / Arduino / STM32)",
      "Real-Time Telemetry & WebSocket Dashboards",
      "MQTT & Industrial IoT Communication Protocols",
      "Smart Automation & Sensor Array Integration",
    ],
    techStack: ["ESP32", "Arduino", "Raspberry Pi", "MQTT", "C/C++", "Sensors"],
  },
  {
    id: "cloud-devops",
    title: "Cloud Infrastructure & DevOps",
    shortTitle: "Cloud & DevOps",
    tagline: "High-Availability Automated Deployment",
    description:
      "Automated deployment pipelines, scalable cloud setups, containerization, and zero-downtime serverless infrastructures built for bulletproof reliability.",
    icon: Cloud,
    color: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/20",
    badge: "Cloud Architecture",
    features: [
      "Automated CI/CD Workflows",
      "Docker Containerization & Serverless",
      "Database Optimization & Auto-Scaling",
      "99.9% Uptime & Security Hardening",
    ],
    techStack: ["AWS", "Docker", "Firebase", "GitHub Actions", "Vercel", "Netlify"],
  },
  {
    id: "ai-intelligent-systems",
    title: "AI & Intelligent Systems",
    shortTitle: "AI & Machine Learning",
    tagline: "Intelligent Automation & Smart Workflows",
    description:
      "Practical AI integrations that empower applications with computer vision, natural language processing, predictive algorithms, and custom automated agent workflows.",
    icon: Sparkles,
    color: "from-fuchsia-500 to-pink-500",
    shadowColor: "shadow-fuchsia-500/20",
    badge: "Artificial Intelligence",
    features: [
      "LLM & Intelligent Agent Integrations",
      "Computer Vision & Pattern Recognition",
      "Predictive Analytics & Data Pipelines",
      "Automated Workflow Optimization",
    ],
    techStack: ["Python", "PyTorch", "OpenAI API", "FastAPI", "Computer Vision"],
  },
  {
    id: "product-uiux",
    title: "UI/UX & Product Design",
    shortTitle: "Product Design",
    tagline: "Luxury Aesthetics & Intuitive Experience",
    description:
      "Crafting high-converting digital interfaces through human-centered design principles, interactive wireframes, custom design systems, and responsive luxury aesthetics.",
    icon: Palette,
    color: "from-violet-500 to-indigo-500",
    shadowColor: "shadow-purple-500/20",
    badge: "Design Systems",
    features: [
      "Interactive Prototyping & Wireframing",
      "Component-Driven Design Systems",
      "Conversion & Engagement Focused UX",
      "Accessibility & Fluid Motion Design",
    ],
    techStack: ["Figma", "Tailwind CSS", "Framer Motion", "Design Tokens"],
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-teal-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Layers className="w-3.5 h-3.5" />
            <span>End-to-End Solutions</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Our{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From cross-platform mobile apps and dynamic full-stack web platforms to smart IoT hardware integrations, we build transformative digital solutions with industry-grade reliability.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {servicesData.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative rounded-3xl p-7 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Gradient accent top line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                />

                {/* Content Top */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-13 h-13 p-3.5 rounded-2xl bg-gradient-to-tr ${service.color} text-white shadow-lg ${service.shadowColor} group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                    {service.tagline}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Key Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Bottom / Tech Stack */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {service.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border border-gray-200/60 dark:border-gray-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 group-hover:translate-x-1 transition-all"
                  >
                    <span>Request this service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 sm:px-8 sm:py-5 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 shadow-xl">
            <div className="text-center sm:text-left">
              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                Have a custom project or engineering inquiry?
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Let's collaborate to architect your next digital or hardware innovation.
              </p>
            </div>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 shrink-0"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
