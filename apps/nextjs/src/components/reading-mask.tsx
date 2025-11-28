"use client";

import { useEffect, useState } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";

export function ReadingMask() {
  const { readingGuide } = useAccessibility();
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    if (!readingGuide) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [readingGuide]);

  if (!readingGuide) return null;

  const maskHeight = 120; // Height of the clear reading area
  const topHeight = Math.max(0, mouseY - maskHeight / 2);
  const bottomTop = mouseY + maskHeight / 2;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Top Mask */}
      <div
        className="absolute left-0 right-0 top-0 bg-black/50 transition-all duration-75 ease-out"
        style={{ height: `${topHeight}px` }}
      />
      
      {/* Reading Line Indicator (Optional, helps center focus) */}
      <div 
        className="absolute left-0 right-0 h-0.5 bg-red-500/30"
        style={{ top: `${mouseY}px` }}
      />

      {/* Bottom Mask */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-black/50 transition-all duration-75 ease-out"
        style={{ top: `${bottomTop}px` }}
      />
    </div>
  );
}
