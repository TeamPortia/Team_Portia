// src/components/home/StatsSection.jsx
import React from "react";
import { useData } from "../../contexts/DataContext";
import { Users, FolderGit2, Cpu, Briefcase, CheckCircle2 } from "lucide-react";

export const StatsSection = () => {
  const { stats } = useData();

  const statItems = [
    {
      label: "Active Team Members",
      value: `${stats.totalMembers}+`,
      subtext: "Specialized Engineers & Designers",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/50",
    },
    {
      label: "Centralized Projects",
      value: `${stats.totalProjects}+`,
      subtext: "Enterprise Solutions & Apps",
      icon: FolderGit2,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
    },
    {
      label: "Verified Certifications",
      value: `${stats.totalCertificates}+`,
      subtext: "AWS, Google Cloud, CNCF & Meta",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      label: "Technologies Mastered",
      value: `${stats.totalSkills}+`,
      subtext: "Frameworks, Languages & Clouds",
      icon: Cpu,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      label: "Core Services",
      value: "6+",
      subtext: "App, Web, IoT & Cloud Solutions",
      icon: Briefcase,
      color: "from-rose-500 to-red-600",
      textColor: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950/50",
    },
  ];

  return (
    <section className="py-12 bg-white/60 dark:bg-gray-900/60 border-y border-gray-200/80 dark:border-gray-800/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative overflow-hidden p-5 rounded-2xl luxury-glass border border-white/40 dark:border-white/10 shadow-lg luxury-card group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${item.bgColor}`}>
                    <Icon className={`w-5 h-5 ${item.textColor}`} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Live
                  </span>
                </div>
                <div className={`text-3xl sm:text-4xl font-extrabold ${item.textColor} tracking-tight`}>
                  {item.value}
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  {item.label}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                  {item.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
