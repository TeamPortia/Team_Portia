// src/components/common/LuxuryAuraBackground.jsx
import React, { useEffect, useState, useRef } from "react";

export const LuxuryAuraBackground = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const mouseOffset = useRef({ x: 0, y: 0 });
  const targetMouseOffset = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);

  // References for direct GPU transform manipulation for buttery smooth 60-120fps
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const orb4Ref = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = Math.max(
            document.documentElement.scrollHeight - window.innerHeight,
            1
          );
          const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
          setScrollProgress(progress);

          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progress * 100}%`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseMove = (e) => {
      // Subtle parallax offset relative to screen center (-30px to +30px)
      const x = ((e.clientX / window.innerWidth) - 0.5) * 60;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 60;
      targetMouseOffset.current = { x, y };
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    handleScroll();

    // Smooth Lerp loop for mouse parallax & organic breathing
    let time = 0;
    const updateTransforms = () => {
      time += 0.015;

      // Lerp mouse offset
      mouseOffset.current.x += (targetMouseOffset.current.x - mouseOffset.current.x) * 0.05;
      mouseOffset.current.y += (targetMouseOffset.current.y - mouseOffset.current.y) * 0.05;

      const progress = scrollProgress;
      const mx = mouseOffset.current.x;
      const my = mouseOffset.current.y;

      // ORB 1: Royal Amethyst / Deep Indigo (Top-Left -> Sweeps Center-Right -> Lower-Center)
      if (orb1Ref.current) {
        const x1 = (20 + progress * 50) + mx * 0.8 + Math.sin(time) * 3;
        const y1 = (15 + progress * 65) + my * 0.8 + Math.cos(time * 0.8) * 4;
        const scale1 = 1 + Math.sin(time * 0.5) * 0.15 + progress * 0.25;
        const rotate1 = progress * 180 + time * 10;
        orb1Ref.current.style.transform = `translate3d(${x1}vw, ${y1}vh, 0) scale(${scale1}) rotate(${rotate1}deg)`;
      }

      // ORB 2: Radiant Sapphire / Electric Cyan (Top-Right -> Sweeps Left -> Bottom-Right)
      if (orb2Ref.current) {
        const x2 = (75 - progress * 55) - mx * 0.7 + Math.cos(time * 0.9) * 4;
        const y2 = (30 + progress * 45) - my * 0.7 + Math.sin(time * 0.7) * 3;
        const scale2 = 1.1 + Math.cos(time * 0.6) * 0.18 - progress * 0.15;
        const rotate2 = -progress * 140 - time * 8;
        orb2Ref.current.style.transform = `translate3d(${x2}vw, ${y2}vh, 0) scale(${scale2}) rotate(${rotate2}deg)`;
      }

      // ORB 3: Luminous Neon Magenta / Cosmic Rose (Mid-Center Core -> Pulses on Projects & Team)
      if (orb3Ref.current) {
        const x3 = (50 + Math.sin(progress * Math.PI * 2) * 25) + mx * 0.5;
        const y3 = (45 + Math.cos(progress * Math.PI) * 30) + my * 0.5;
        const scale3 = 0.9 + Math.sin(time * 1.2) * 0.2 + (progress > 0.3 && progress < 0.7 ? 0.4 : 0);
        orb3Ref.current.style.transform = `translate3d(${x3}vw, ${y3}vh, 0) scale(${scale3})`;
      }

      // ORB 4: Celestial Emerald / Twilight Azure (Bottom Aura Base)
      if (orb4Ref.current) {
        const x4 = (35 + progress * 30) - mx * 0.4;
        const y4 = (70 - progress * 40) - my * 0.4 + Math.sin(time * 0.4) * 5;
        const scale4 = 1.0 + Math.cos(time * 0.8) * 0.12;
        orb4Ref.current.style.transform = `translate3d(${x4}vw, ${y4}vh, 0) scale(${scale4})`;
      }

      animFrameRef.current = requestAnimationFrame(updateTransforms);
    };

    animFrameRef.current = requestAnimationFrame(updateTransforms);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [scrollProgress]);

  return (
    <>
      {/* 1. TOP SCROLL PROGRESS BEAM (Ultra-thin luxury glow indicator) */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[99990] bg-transparent pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_12px_rgba(168,85,247,0.9)] transition-all duration-75 ease-out"
          style={{ width: "0%" }}
        />
      </div>

      {/* 2. FIXED BACKGROUND LUXURY AURA CONTAINER */}
      <div
        aria-hidden="true"
        className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none"
      >
        {/* Subtle Luxury High-Tech Grid Matrix Layer */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient Subtle Vignette */}
        <div className="absolute inset-0 bg-radial-vignette opacity-50 dark:opacity-70" />

        {/* --- DYNAMIC LUXURY AURA ORBS --- */}

        {/* ORB 1: Royal Amethyst / Deep Indigo (Vibrant Glow) */}
        <div
          ref={orb1Ref}
          className="absolute -top-36 -left-36 w-[550px] sm:w-[750px] lg:w-[900px] h-[550px] sm:h-[750px] lg:h-[900px] rounded-full filter blur-[100px] sm:blur-[140px] opacity-40 dark:opacity-50 transition-colors duration-700 will-change-transform"
          style={{
            background:
              scrollProgress < 0.35
                ? "radial-gradient(circle, rgba(99,102,241,0.85) 0%, rgba(139,92,246,0.65) 45%, rgba(168,85,247,0.1) 75%, transparent 100%)"
                : scrollProgress < 0.7
                ? "radial-gradient(circle, rgba(168,85,247,0.9) 0%, rgba(217,70,239,0.65) 45%, rgba(99,102,241,0.15) 75%, transparent 100%)"
                : "radial-gradient(circle, rgba(79,70,229,0.85) 0%, rgba(14,165,233,0.6) 45%, rgba(99,102,241,0.1) 75%, transparent 100%)",
          }}
        />

        {/* ORB 2: Radiant Sapphire / Electric Cyan Glow */}
        <div
          ref={orb2Ref}
          className="absolute top-10 right-0 w-[500px] sm:w-[700px] lg:w-[850px] h-[500px] sm:h-[700px] lg:h-[850px] rounded-full filter blur-[90px] sm:blur-[130px] opacity-35 dark:opacity-45 transition-colors duration-700 will-change-transform"
          style={{
            background:
              scrollProgress < 0.4
                ? "radial-gradient(circle, rgba(56,189,248,0.75) 0%, rgba(99,102,241,0.55) 50%, rgba(14,165,233,0.1) 80%, transparent 100%)"
                : scrollProgress < 0.75
                ? "radial-gradient(circle, rgba(6,182,212,0.8) 0%, rgba(59,130,246,0.6) 50%, rgba(139,92,246,0.15) 80%, transparent 100%)"
                : "radial-gradient(circle, rgba(168,85,247,0.75) 0%, rgba(236,72,153,0.5) 50%, rgba(59,130,246,0.1) 80%, transparent 100%)",
          }}
        />

        {/* ORB 3: Luminous Neon Magenta / Cosmic Rose Pulse */}
        <div
          ref={orb3Ref}
          className="absolute top-1/3 left-1/4 w-[400px] sm:w-[600px] lg:w-[750px] h-[400px] sm:h-[600px] lg:h-[750px] rounded-full filter blur-[95px] sm:blur-[135px] opacity-30 dark:opacity-40 transition-colors duration-700 will-change-transform"
          style={{
            background:
              scrollProgress < 0.5
                ? "radial-gradient(circle, rgba(236,72,153,0.7) 0%, rgba(168,85,247,0.5) 45%, transparent 80%)"
                : "radial-gradient(circle, rgba(244,63,94,0.75) 0%, rgba(192,38,211,0.55) 45%, transparent 80%)",
          }}
        />

        {/* ORB 4: Celestial Emerald / Deep Twilight Sapphire */}
        <div
          ref={orb4Ref}
          className="absolute bottom-10 left-1/3 w-[450px] sm:w-[650px] lg:w-[800px] h-[450px] sm:h-[650px] lg:h-[800px] rounded-full filter blur-[100px] sm:blur-[140px] opacity-25 dark:opacity-35 transition-colors duration-700 will-change-transform"
          style={{
            background:
              scrollProgress < 0.6
                ? "radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(14,165,233,0.45) 50%, transparent 80%)"
                : "radial-gradient(circle, rgba(99,102,241,0.7) 0%, rgba(168,85,247,0.5) 50%, transparent 80%)",
          }}
        />

        {/* 3. LUXURY HORIZONTAL LIGHT REFLECTION BEAM (Moves across screen with scroll) */}
        <div
          className="absolute left-0 right-0 h-[1px] opacity-20 dark:opacity-30 bg-gradient-to-r from-transparent via-indigo-500 to-transparent transition-all duration-300"
          style={{
            top: `${(scrollProgress * 90 + 5).toFixed(1)}%`,
            filter: "drop-shadow(0 0 8px rgba(99,102,241,0.8))",
          }}
        />
      </div>
    </>
  );
};
