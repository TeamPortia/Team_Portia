// src/pages/AchievementsPage.jsx
import React, { useState, useMemo } from "react";
import { useData } from "../contexts/DataContext";
import { Trophy, Award, BookOpen, CheckCircle } from "lucide-react";
import { Badge } from "../components/common/Badge";

export const AchievementsPage = () => {
  const { achievements } = useData();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Hackathon", "Award", "Publication", "Milestone"];

  const filteredAchievements = useMemo(() => {
    return achievements.filter((ach) => {
      return selectedCategory === "All" || ach.category?.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [achievements, selectedCategory]);

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Trophy":
        return Trophy;
      case "Award":
        return Award;
      case "BookOpen":
        return BookOpen;
      default:
        return CheckCircle;
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Honors & Accreditations</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Team Achievements & Awards
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Celebrating our collective victories at national hackathons, global conferences, and peer-reviewed publications.
          </p>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((ach) => {
            const Icon = getIcon(ach.icon);
            return (
              <div
                key={ach.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="warning" size="sm">
                      {ach.badge || ach.category}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                    {ach.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-400">
                  <span className="font-semibold">{ach.category}</span>
                  <span>{ach.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
