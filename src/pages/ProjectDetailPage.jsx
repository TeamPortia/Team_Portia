// src/pages/ProjectDetailPage.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import {
  FolderGit2,
  ExternalLink,
  FileText,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Layers,
  Sparkles,
  Maximize2,
  X,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";

export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { getProjectById } = useData();
  const project = getProjectById(projectId);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!project) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4 text-center">
        <FolderGit2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The requested team project does not exist or has been removed.</p>
        <Link to="/projects">
          <Button variant="primary">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const screenshots = project.screenshots && project.screenshots.length > 0
    ? project.screenshots
    : [project.bannerImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"];

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back Link */}
        <div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Central Projects
          </Link>
        </div>

        {/* Project Header & Banner */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="purple" size="md">
                  {project.category || "Web Application"}
                </Badge>
                {project.startDate && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {project.startDate} {project.endDate ? `– ${project.endDate}` : ""}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {project.title}
              </h1>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                  <Button variant="outline" icon={FaGithub} className="w-full justify-center">
                    Source Code
                  </Button>
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                  <Button variant="gradient" icon={ExternalLink} className="w-full justify-center">
                    Live Application
                  </Button>
                </a>
              )}
              {project.documentationUrl && (
                <a href={project.documentationUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                  <Button variant="secondary" icon={FileText} className="w-full justify-center">
                    Documentation
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Large Hero Banner / Screenshot Gallery */}
          <div className="rounded-3xl overflow-hidden bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl relative group">
            <div className="relative h-[320px] sm:h-[480px] w-full">
              <img
                src={screenshots[activeImage]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 p-2.5 rounded-2xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition"
                title="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail selector */}
            {screenshots.length > 1 && (
              <div className="p-4 bg-gray-950/80 backdrop-blur-md flex items-center gap-3 overflow-x-auto">
                {screenshots.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                      activeImage === idx ? "border-indigo-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Description & Features */}
          <div className="md:col-span-8 space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Project Architecture & Overview
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {project.description || project.shortDescription}
              </p>
            </div>

            {/* Key Features */}
            {project.features && project.features.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Key Innovations & Features
                </h2>
                <ul className="space-y-3">
                  {project.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Tech Stack & Specs */}
          <div className="md:col-span-4 space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, idx) => (
                  <Badge key={idx} variant="primary" size="md">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-gray-950 text-white shadow-xl space-y-4">
              <h3 className="text-lg font-bold">Team Collaborative Project</h3>
              <p className="text-xs text-indigo-200/80 leading-relaxed">
                This project was engineered, tested, and deployed under our central innovation lab initiative. All intellectual rights and patents belong to the team collective.
              </p>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="block pt-2">
                  <Button variant="primary" size="sm" className="w-full" icon={ExternalLink}>
                    Launch Live System
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={screenshots[activeImage]}
            alt=""
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
