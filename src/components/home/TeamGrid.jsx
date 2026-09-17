import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { MemberCard } from "../team/MemberCard";
import { Users, ArrowRight } from "lucide-react";
import { shuffleArray } from "../../utils/helpers";

export const TeamGrid = ({ limit = 4, showViewAll = true }) => {
  const { activeMembers } = useData();

  // Randomize member order every time page is opened / loaded
  const shuffledMembers = useMemo(() => {
    return shuffleArray(activeMembers);
  }, [activeMembers]);

  const displayedMembers = limit ? shuffledMembers.slice(0, limit) : shuffledMembers;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>Meet Our Team</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Brilliant Minds Behind Our Innovations
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
              Each team member brings specialized deep domain mastery across AI algorithms, cloud resilience, full-stack architecture, and user experience.
            </p>
          </div>

          {showViewAll && activeMembers.length > (limit || 4) && (
            <Link
              to="/team"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 text-sm font-bold transition w-fit"
            >
              View All {activeMembers.length} Members
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Member Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedMembers.map((member) => (
            <MemberCard key={member.id || member.uid} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};
