"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type DaltonismType =
  | "none"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia";

interface AccessibilityContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  daltonism: DaltonismType;
  setDaltonism: (type: DaltonismType) => void;
  letterSpacing: boolean;
  setLetterSpacing: (enabled: boolean) => void;
  cursorSize: boolean;
  setCursorSize: (enabled: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (enabled: boolean) => void;
  highlightLinks: boolean;
  setHighlightLinks: (enabled: boolean) => void;
  readingGuide: boolean;
  setReadingGuide: (enabled: boolean) => void;
  resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined
);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [daltonism, setDaltonism] = useState<DaltonismType>("none");
  const [letterSpacing, setLetterSpacing] = useState(false);
  const [cursorSize, setCursorSize] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);

  // Apply Font Size
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.fontSize = `${fontSize}%`;
    }
  }, [fontSize]);

  // Apply High Contrast
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (highContrast) {
        root.classList.add("high-contrast");
      } else {
        root.classList.remove("high-contrast");
      }
    }
  }, [highContrast]);

  // Apply Letter Spacing
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (letterSpacing) {
        root.classList.add("wide-spacing");
      } else {
        root.classList.remove("wide-spacing");
      }
    }
  }, [letterSpacing]);

  // Apply Daltonism
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (daltonism !== "none") {
        root.setAttribute("data-daltonism", daltonism);
      } else {
        root.removeAttribute("data-daltonism");
      }
    }
  }, [daltonism]);

  // Apply Cursor Size
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (cursorSize) {
        root.classList.add("big-cursor");
      } else {
        root.classList.remove("big-cursor");
      }
    }
  }, [cursorSize]);

  // Apply Reduce Motion
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (reduceMotion) {
        root.classList.add("reduce-motion");
      } else {
        root.classList.remove("reduce-motion");
      }
    }
  }, [reduceMotion]);

  // Apply Highlight Links
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (highlightLinks) {
        root.classList.add("highlight-links");
      } else {
        root.classList.remove("highlight-links");
      }
    }
  }, [highlightLinks]);

  const resetSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    setDaltonism("none");
    setLetterSpacing(false);
    setCursorSize(false);
    setReduceMotion(false);
    setHighlightLinks(false);
    setReadingGuide(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        daltonism,
        setDaltonism,
        letterSpacing,
        setLetterSpacing,
        cursorSize,
        setCursorSize,
        reduceMotion,
        setReduceMotion,
        highlightLinks,
        setHighlightLinks,
        readingGuide,
        setReadingGuide,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
