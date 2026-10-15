// src/components/common/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { Heart, ArrowUpRight, Mail, ShieldCheck } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  const { teamSettings, stats } = useData();

  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center p-2 px-3.5 rounded-2xl bg-white shadow-xl">
                <img
                  src="/inovexa-logo.png"
                  alt="Inovexa Technologies"
                  className="h-9 sm:h-11 w-auto max-w-[220px] sm:max-w-[260px] object-contain"
                />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                MSME Registered
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              {teamSettings?.description ||
                "An elite engineering team dedicated to building resilient distributed systems, modern AI applications, and high-impact web products."}
            </p>
            <div>
              <a
                href={`mailto:${teamSettings?.contactEmail || "inovexatechnologies2026@gmail.com"}`}
                className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition font-medium"
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{teamSettings?.contactEmail || "inovexatechnologies2026@gmail.com"}</span>
              </a>
            </div>
            <div className="flex items-center gap-3 pt-2">
              {teamSettings?.socialLinks?.github && (
                <a
                  href={teamSettings.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition"
                  aria-label="GitHub"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
              {teamSettings?.socialLinks?.linkedin && (
                <a
                  href={teamSettings.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
              )}
              {teamSettings?.socialLinks?.twitter && (
                <a
                  href={teamSettings.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
              )}
              {teamSettings?.socialLinks?.youtube && (
                <a
                  href={teamSettings.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition flex items-center gap-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-indigo-400 transition flex items-center gap-1">
                  Meet Our Team
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-indigo-400 transition flex items-center gap-1">
                  Central Projects Showcase
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-indigo-400 transition flex items-center gap-1">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition flex items-center gap-1">
                  Contact Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Access Portals */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Member & Admin</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition flex items-center gap-1">
                  Member Portal
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-indigo-400 transition flex items-center gap-1">
                  Admin Management
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400 transition">
                  Personal Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Live Team Metrics */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Live Metrics</h4>
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700/60">
                <p className="text-xl font-bold text-indigo-400">{stats.totalMembers}+</p>
                <p className="text-[11px] text-gray-400">Engineers</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700/60">
                <p className="text-xl font-bold text-purple-400">{stats.totalProjects}+</p>
                <p className="text-[11px] text-gray-400">Projects</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700/60">
                <p className="text-xl font-bold text-emerald-400">{stats.totalCertificates}+</p>
                <p className="text-[11px] text-gray-400">Certificates</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700/60">
                <p className="text-xl font-bold text-amber-400">{stats.totalSkills}+</p>
                <p className="text-[11px] text-gray-400">Tech Stack</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {teamSettings?.teamName || "Inovexa Technologies"} · Govt. of India MSME Registered. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> using React, Tailwind & Firebase
          </p>
        </div>
      </div>
    </footer>
  );
};
