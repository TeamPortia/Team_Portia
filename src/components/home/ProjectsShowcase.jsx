// src/components/home/ProjectsShowcase.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { ProjectCard } from "../projects/ProjectCard";
import { ProjectFilter } from "../projects/ProjectFilter";
import { FolderGit2, ArrowRight } from "lucide-react";

export const ProjectsShowcase = ({ limit = 6, showViewAll = true }) => {
  const { publicProjects } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    return publicProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" ||
        project.category?.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        project.title?.toLowerCase().includes(query) ||
        project.shortDescription?.toLowerCase().includes(query) ||
        project.technologies?.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [publicProjects, selectedCategory, searchQuery]);

  const displayedProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Centralized Team Projects</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Flagship Engineering Showcase
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
              Explore our collective innovations across AI, cloud systems, mobile apps, and IoT.
            </p>
          </div>

          {showViewAll && (
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 transition w-fit"
            >
              Explore All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Filter Bar */}
        <ProjectFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Projects Grid */}
        {displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/80 p-8">
            <FolderGit2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No projects found</h3>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};
