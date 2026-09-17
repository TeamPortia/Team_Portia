// src/components/projects/ProjectCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, FileText, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Badge } from "../common/Badge";

export const ProjectCard = ({ project }) => {
  return (
    <div className="group relative rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700/80 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Banner Image */}
        <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-gray-900">
          <img
            src={
              project.bannerImage ||
              project.screenshots?.[0] ||
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
            }
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-80" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="purple" size="sm" className="shadow-lg backdrop-blur-md bg-purple-900/80 text-purple-200 border-purple-700/50">
              {project.category || "Web App"}
            </Badge>
          </div>

          {/* Quick External Links Overlay */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-gray-900/80 backdrop-blur-md text-white hover:bg-indigo-600 flex items-center justify-center transition shadow-lg"
                title="GitHub Repository"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGithub className="w-4 h-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center transition shadow-lg"
                title="Live Demo"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition mb-2">
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed">
            {project.shortDescription || project.description}
          </p>

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {project.technologies?.slice(0, 4).map((tech, idx) => (
              <Badge key={idx} variant="primary" size="sm">
                {tech}
              </Badge>
            ))}
            {(project.technologies?.length || 0) > 4 && (
              <Badge variant="default" size="sm">
                +{(project.technologies?.length || 0) - 4}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Bar */}
      <div className="px-6 py-4 bg-gray-50/60 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {project.documentationUrl && (
            <a
              href={project.documentationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              Docs
            </a>
          )}
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group-hover:translate-x-1 transition"
        >
          View Full Project
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
