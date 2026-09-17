// src/components/home/SkillsCloud.jsx
import React, { useState, useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import { Cpu } from "lucide-react";

export const SkillsCloud = () => {
  const { teamMembers } = useData();
  const [activeCategory, setActiveCategory] = useState("All");

  const { categorizedSkills, categories } = useMemo(() => {
    const map = {};
    teamMembers.forEach((m) => {
      m.skills?.forEach((s) => {
        const cat = s.category || "Other";
        if (!map[cat]) map[cat] = [];
        if (!map[cat].some((existing) => existing.name.toLowerCase() === s.name.toLowerCase())) {
          map[cat].push(s);
        }
      });
    });

    const cats = ["All", ...Object.keys(map)];
    return { categorizedSkills: map, categories: cats };
  }, [teamMembers]);

  const displayedSkills = useMemo(() => {
    if (activeCategory === "All") {
      const all = [];
      Object.values(categorizedSkills).forEach((list) => all.push(...list));
      return all;
    }
    return categorizedSkills[activeCategory] || [];
  }, [activeCategory, categorizedSkills]);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Collective Expertise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Comprehensive Technology Matrix
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Across frontend architectures, neural networks, distributed databases, cloud orchestration, and IoT edge hardware.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayedSkills.map((skill, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                  {skill.category || "General"}
                </p>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                  {skill.name}
                </h4>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  <span>Proficiency</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{skill.level || 85}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-700"
                    style={{ width: `${skill.level || 85}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
