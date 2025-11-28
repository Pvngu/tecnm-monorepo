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
  grayscale: boolean;
  setGrayscale: (enabled: boolean) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (enabled: boolean) => void;
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
  const [grayscale, setGrayscale] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);

  const STORAGE_KEY = "accessibility-settings";

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          if (parsed.fontSize) setFontSize(parsed.fontSize);
          if (parsed.highContrast !== undefined) setHighContrast(parsed.highContrast);
          if (parsed.daltonism) setDaltonism(parsed.daltonism);
          if (parsed.letterSpacing !== undefined) setLetterSpacing(parsed.letterSpacing);
          if (parsed.cursorSize !== undefined) setCursorSize(parsed.cursorSize);
          if (parsed.reduceMotion !== undefined) setReduceMotion(parsed.reduceMotion);
          if (parsed.highlightLinks !== undefined) setHighlightLinks(parsed.highlightLinks);
          if (parsed.readingGuide !== undefined) setReadingGuide(parsed.readingGuide);
          if (parsed.grayscale !== undefined) setGrayscale(parsed.grayscale);
          if (parsed.dyslexiaFont !== undefined) setDyslexiaFont(parsed.dyslexiaFont);
        } catch (e) {
          console.error("Failed to parse accessibility settings:", e);
        }
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const settings = {
        fontSize,
        highContrast,
        daltonism,
        letterSpacing,
        cursorSize,
        reduceMotion,
        highlightLinks,
        readingGuide,
        grayscale,
        dyslexiaFont,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [
    fontSize,
    highContrast,
    daltonism,
    letterSpacing,
    cursorSize,
    reduceMotion,
    highlightLinks,
    readingGuide,
    grayscale,
    dyslexiaFont,
  ]);

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

  // Apply Grayscale
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (grayscale) {
        root.classList.add("grayscale");
      } else {
        root.classList.remove("grayscale");
      }
    }
  }, [grayscale]);

  // Apply Dyslexia Font
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (dyslexiaFont) {
        root.classList.add("dyslexia-font");
      } else {
        root.classList.remove("dyslexia-font");
      }
    }
  }, [dyslexiaFont]);

  const resetSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    setDaltonism("none");
    setLetterSpacing(false);
    setCursorSize(false);
    setReduceMotion(false);
    setHighlightLinks(false);
    setReadingGuide(false);
    setGrayscale(false);
    setDyslexiaFont(false);
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
        grayscale,
        setGrayscale,
        dyslexiaFont,
        setDyslexiaFont,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
