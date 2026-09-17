// src/components/home/AchievementsSection.jsx
import React from "react";
import { useData } from "../../contexts/DataContext";
import { Trophy, Award, BookOpen, CheckCircle } from "lucide-react";
import { Badge } from "../common/Badge";

export const AchievementsSection = () => {
  const { achievements } = useData();

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
    <section className="py-20 bg-gray-50/50 dark:bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Excellence & Recognition</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Team Awards & Milestones
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Honored at national hackathons, global open source summits, and peer-reviewed scientific journals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((ach) => {
            const Icon = getIcon(ach.icon);
            return (
              <div
                key={ach.id}
                className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
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

                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                    {ach.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="font-semibold">{ach.category}</span>
                  <span>{ach.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
