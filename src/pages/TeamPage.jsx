// src/pages/TeamPage.jsx
import React, { useState, useMemo } from "react";
import { useData } from "../contexts/DataContext";
import { MemberCard } from "../components/team/MemberCard";
import { Users, Search } from "lucide-react";

import { shuffleArray } from "../utils/helpers";

export const TeamPage = () => {
  const { activeMembers } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  // Shuffle member order randomly on page load
  const shuffledMembers = useMemo(() => {
    return shuffleArray(activeMembers);
  }, [activeMembers]);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return shuffledMembers.filter((m) => {
      return (
        !q ||
        m.fullName?.toLowerCase().includes(q) ||
        m.title?.toLowerCase().includes(q) ||
        m.bio?.toLowerCase().includes(q) ||
        m.skills?.some((s) => s.name?.toLowerCase().includes(q))
      );
    });
  }, [shuffledMembers, searchQuery]);

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Meet The Creators</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Our Elite Engineering Team
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            A collaborative collective of software architects, full-stack engineers, AI researchers, and UX designers.
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search members by name, role, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {/* Members Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <MemberCard key={member.id || member.uid} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No team members found</h3>
            <p className="text-xs text-gray-500 mt-1">Try modifying your search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
