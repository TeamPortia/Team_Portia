// src/pages/HomePage.jsx
import React from "react";
import { HeroSection } from "../components/home/HeroSection";
import { StatsSection } from "../components/home/StatsSection";
import { AboutSection } from "../components/home/AboutSection";
import { TeamGrid } from "../components/home/TeamGrid";
import { ProjectsShowcase } from "../components/home/ProjectsShowcase";
import { SkillsCloud } from "../components/home/SkillsCloud";
import { AchievementsSection } from "../components/home/AchievementsSection";
import { ContactSection } from "../components/home/ContactSection";

export const HomePage = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <TeamGrid limit={4} showViewAll={true} />
      <ProjectsShowcase limit={6} showViewAll={true} />
      <SkillsCloud />
      <AchievementsSection />
      <ContactSection />
    </div>
  );
};
