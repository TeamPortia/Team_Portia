// src/pages/MemberProfilePage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import {
  User,
  GraduationCap,
  Award,
  Cpu,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowLeft,
  ExternalLink,
  Download,
  Sparkles,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";

export const MemberProfilePage = () => {
  const { userId } = useParams();
  const { getMemberById } = useData();
  const member = getMemberById(userId);

  if (!member) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4 text-center">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Team Member Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The requested team profile does not exist or has been removed.</p>
        <Link to="/team">
          <Button variant="primary">Back to Team</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back Link */}
        <div>
          <Link
            to="/team"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Team Members
          </Link>
        </div>

        {/* Profile Header Hero Card */}
        <div className="relative rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700/80 p-6 sm:p-10 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 sm:gap-8">
            <div className="relative flex-shrink-0">
              <img
                src={
                  member.avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80"
                }
                alt={member.fullName}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-xl"
              />
              {member.isOnline ? (
                <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 border-4 border-white dark:border-gray-800" title="Online Now"></span>
                </span>
              ) : (
                <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-gray-400 dark:bg-gray-600 border-4 border-white dark:border-gray-800 rounded-full" title="Offline"></span>
              )}
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                  {member.fullName}
                </h1>
                {member.isOnline ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200/50 dark:border-emerald-800/50">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online Now
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium border border-gray-200 dark:border-gray-700">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    Offline
                  </span>
                )}
              </div>

              <p className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                {member.title}
              </p>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto md:mx-0">
                {member.bio}
              </p>

              {/* Action Buttons: Resume & Contact */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                {member.resumeUrl ? (
                  <a
                    href={member.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={member.resumeName || "Resume.pdf"}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/25 transition w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                ) : null}

                {member.contact?.email && (
                  <a
                    href={`mailto:${member.contact.email}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs sm:text-sm font-semibold transition w-full sm:w-auto"
                  >
                    <Mail className="w-4 h-4 text-indigo-500" />
                    Contact Me
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Social Links Row */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/60 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300">
              {member.contact?.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  {member.contact.location}
                </span>
              )}
              {member.contact?.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" />
                  {member.contact.phone}
                </span>
              )}
              {member.contact?.website && (
                <a
                  href={member.contact.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-indigo-500 transition"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                  Website
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              {member.contact?.github && (
                <a
                  href={member.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:text-indigo-500 transition"
                  title="GitHub"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
              {member.contact?.linkedin && (
                <a
                  href={member.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:text-indigo-500 transition"
                  title="LinkedIn"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* About Me & Career Objective */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-8">
            {/* Detailed About Me */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                About Me
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {member.aboutMe || member.bio}
              </p>

              {member.careerObjective && (
                <div className="mt-6 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5">
                    Career Objective
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {member.careerObjective}
                  </p>
                </div>
              )}
            </div>

            {/* Education Timeline */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
                Academic Background & Education
              </h2>

              {member.education && member.education.length > 0 ? (
                <div className="space-y-6">
                  {member.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6 border-l-2 border-indigo-200 dark:border-indigo-800 space-y-1.5"
                    >
                      <div className="absolute -left-2 top-0 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-gray-800" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                          {edu.degree}
                        </h4>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full">
                          {edu.startYear} – {edu.endYear || "Present"}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        {edu.institution} {edu.department ? `• ${edu.department}` : ""}
                      </p>
                      {edu.grade && (
                        <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          Grade / CGPA: {edu.grade}
                        </p>
                      )}
                      {edu.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pt-1">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No education entries added yet.</p>
              )}
            </div>

            {/* Certificates Showcase */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                Certifications & Credentials
              </h2>

              {member.certificates && member.certificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {member.certificates.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Award className="w-5 h-5 text-amber-500" />
                          <span className="text-[10px] font-semibold text-gray-400">
                            {cert.issueDate}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                          {cert.name}
                        </h4>
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                          {cert.organization}
                        </p>
                        {cert.credentialId && (
                          <p className="text-[10px] text-gray-400 mt-1">ID: {cert.credentialId}</p>
                        )}
                        {cert.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                            {cert.description}
                          </p>
                        )}
                      </div>

                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Verify Credential
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No certificates listed.</p>
              )}
            </div>
          </div>

          {/* Sidebar: Skills & Areas of Interest */}
          <div className="md:col-span-4 space-y-8">
            {/* Skills Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-500" />
                Technical Skills
              </h3>

              {member.skills && member.skills.length > 0 ? (
                <div className="space-y-4">
                  {member.skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        <span>{skill.name}</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{skill.level || 85}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${skill.level || 85}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No skills added yet.</p>
              )}
            </div>

            {/* Areas of Interest */}
            {member.areasOfInterest && member.areasOfInterest.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Areas of Interest
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.areasOfInterest.map((interest, idx) => (
                    <Badge key={idx} variant="purple" size="md">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
