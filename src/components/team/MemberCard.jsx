// src/components/team/MemberCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, GraduationCap, Award } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Badge } from "../common/Badge";

export const MemberCard = ({ member }) => {
  return (
    <div className="group relative rounded-3xl luxury-glass border border-white/40 dark:border-white/10 p-6 shadow-lg luxury-card flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={member.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80"}
              alt={member.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/60 transition shadow-md"
            />
            {member.isOnline ? (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-gray-800" title="Online Now"></span>
              </span>
            ) : (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400 dark:bg-gray-600 border-2 border-white dark:border-gray-800 rounded-full" title="Offline"></span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {member.fullName}
              </h3>
              {member.isOnline ? (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50 flex-shrink-0">
                  Online
                </span>
              ) : (
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full flex-shrink-0">
                  Offline
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 line-clamp-1">
              {member.title}
            </p>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-indigo-500" />
                {member.education?.length || 0} Degrees
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-500" />
                {member.certificates?.length || 0} Certs
              </span>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed">
          {member.bio || member.aboutMe || "Passionate software development engineer dedicated to building scalable solutions."}
        </p>

        {/* Skills Preview */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {member.skills?.slice(0, 4).map((skill, idx) => (
            <Badge key={idx} variant="primary" size="sm">
              {skill.name}
            </Badge>
          ))}
          {(member.skills?.length || 0) > 4 && (
            <Badge variant="default" size="sm">
              +{(member.skills?.length || 0) - 4} more
            </Badge>
          )}
        </div>
      </div>

      {/* Footer / Socials & Action Button */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        {/* Social Icons */}
        <div className="flex items-center gap-2">
          {member.contact?.github && (
            <a
              href={member.contact.github}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition"
              title="GitHub Profile"
            >
              <FaGithub className="w-4 h-4" />
            </a>
          )}
          {member.contact?.linkedin && (
            <a
              href={member.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition"
              title="LinkedIn Profile"
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
          )}
          {member.contact?.email && (
            <a
              href={`mailto:${member.contact.email}`}
              className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition"
              title="Send Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* View Profile Link */}
        <Link
          to={`/team/${member.id || member.uid}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group-hover:translate-x-1 transition"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
