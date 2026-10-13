// src/components/common/CustomCursor.jsx
import React, { useEffect, useState, useRef } from "react";

export const CustomCursor = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isTextSelect, setIsTextSelect] = useState(false);

  // Position references for smooth 60-120fps physics interpolation
  const mousePos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const particlesContainerRef = useRef(null);
  const particles = useRef([]);
  const animFrameId = useRef(null);

  useEffect(() => {
    // Disable custom cursor on mobile / touch screen devices
    const checkTouch = () => {
      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);

    return () => {
      window.removeEventListener("resize", checkTouch);
    };
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    let lastSparkleTime = 0;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target;
      if (target) {
        // Detect text inputs
        const isInput =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable;
        setIsTextSelect(isInput);

        // Detect interactive clickable elements
        const clickable = target.closest(
          'a, button, [role="button"], input[type="submit"], input[type="button"], select, label, .cursor-pointer, [data-cursor]'
        );

        if (clickable) {
          setIsHovered(true);
          const customText = clickable.getAttribute("data-cursor-text") || "";
          setCursorText(customText);
        } else {
          setIsHovered(false);
          setCursorText("");
        }
      }

      // Spawn subtle magical stardust particles on movement
      const now = performance.now();
      if (now - lastSparkleTime > 45 && particles.current.length < 15) {
        lastSparkleTime = now;
        spawnParticle(e.clientX, e.clientY);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    // Smooth RAF loop for interpolation (Lerp)
    const animate = () => {
      // Lerp ring towards mouse
      const ease = 0.18;
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * ease;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * ease;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0)`;
      }

      // Update particles
      if (particles.current.length > 0) {
        for (let i = particles.current.length - 1; i >= 0; i--) {
          const p = particles.current[i];
          p.life -= 0.035;
          p.x += p.vx;
          p.y += p.vy;
          p.scale *= 0.95;

          if (p.life <= 0 || !p.el) {
            if (p.el && p.el.parentNode) {
              p.el.parentNode.removeChild(p.el);
            }
            particles.current.splice(i, 1);
          } else {
            p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${p.scale})`;
            p.el.style.opacity = p.life.toFixed(2);
          }
        }
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isTouchDevice, isVisible]);

  const spawnParticle = (x, y) => {
    if (!particlesContainerRef.current) return;

    const el = document.createElement("div");
    const colors = [
      "rgba(99, 102, 241, 0.8)",   // Indigo
      "rgba(168, 85, 247, 0.8)",   // Purple
      "rgba(236, 72, 153, 0.8)",   // Pink
      "rgba(45, 212, 191, 0.8)",   // Teal
      "rgba(56, 189, 248, 0.8)",   // Cyan
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 4 + 2;

    el.className = "absolute rounded-full pointer-events-none";
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.backgroundColor = color;
    el.style.boxShadow = `0 0 6px ${color}`;
    el.style.left = "-2px";
    el.style.top = "-2px";

    particlesContainerRef.current.appendChild(el);

    particles.current.push({
      el,
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8 - 0.3,
      life: 0.9,
      scale: 1,
    });
  };

  if (isTouchDevice) return null;

  return (
    <>
      {/* Particle trail container */}
      <div
        ref={particlesContainerRef}
        className="fixed inset-0 pointer-events-none z-[99998] overflow-hidden"
      />

      {/* Trailing Outer Ring Aura */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 pointer-events-none z-[99999] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`relative rounded-full transition-all duration-300 ease-out flex items-center justify-center ${
            isTextSelect
              ? "w-4 h-7 -ml-[-8px] -mt-[-2px] rounded-sm bg-indigo-500/30 border border-indigo-400"
              : isHovered
              ? "w-14 h-14 -ml-2 -mt-2 bg-gradient-to-tr from-indigo-500/20 via-purple-500/25 to-pink-500/20 backdrop-blur-[2px] border-2 border-indigo-400/80 shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110"
              : isClicked
              ? "w-8 h-8 ml-1 mt-1 border-2 border-pink-500/90 bg-pink-500/20 scale-90"
              : "w-10 h-10 border border-indigo-500/60 dark:border-indigo-400/60 bg-indigo-500/5 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
          }`}
        >
          {/* Subtle spinning accent gradient for creative tech feel */}
          {!isTextSelect && (
            <div
              className={`absolute inset-0 rounded-full border-t border-r border-indigo-400/70 transition-opacity duration-300 ${
                isHovered ? "opacity-100 animate-spin-slow" : "opacity-30"
              }`}
            />
          )}

          {/* Optional tooltip text when hovering custom elements */}
          {cursorText && (
            <span className="text-[9px] font-bold tracking-wider uppercase text-white drop-shadow px-1 select-none whitespace-nowrap">
              {cursorText}
            </span>
          )}
        </div>
      </div>

      {/* Immediate Sharp Inner Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1.5 -mt-1.5 pointer-events-none z-[99999] transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`rounded-full transition-all duration-150 ease-out ${
            isTextSelect
              ? "w-0.5 h-4 bg-indigo-500 ml-1 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
              : isHovered
              ? "w-3 h-3 bg-gradient-to-tr from-pink-500 to-indigo-400 shadow-[0_0_10px_rgba(236,72,153,0.9)] scale-125"
              : isClicked
              ? "w-2.5 h-2.5 bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,1)] scale-150"
              : "w-3 h-3 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] ring-1 ring-white/50"
          }`}
        />
      </div>
    </>
  );
};
