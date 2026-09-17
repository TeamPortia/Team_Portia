// src/pages/ProjectsPage.jsx
import React, { useState, useMemo } from "react";
import { useData } from "../contexts/DataContext";
import { ProjectCard } from "../components/projects/ProjectCard";
import { ProjectFilter } from "../components/projects/ProjectFilter";
import { FolderGit2 } from "lucide-react";

export const ProjectsPage = () => {
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

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Centralized Team Portfolio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Our Central Engineering Showcase
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            A centralized showcase of our team's proprietary products, research platforms, enterprise systems, and open-source packages.
          </p>
        </div>

        {/* Filter */}
        <ProjectFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8">
            <FolderGit2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No projects match your search</h3>
            <p className="text-xs text-gray-500 mt-1">Try selecting another category or clearing your keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};
