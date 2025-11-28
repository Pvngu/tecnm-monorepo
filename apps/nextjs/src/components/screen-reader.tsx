"use client";

import { useEffect, useRef, useState } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";

export function ScreenReader() {
  const { screenReader } = useAccessibility();
  const lastReadText = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!screenReader) {
      window.speechSynthesis.cancel();
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (!element) return;

        // Check for interactive elements (Button or Link)
        const interactiveElement = element.closest("button, a");
        if (interactiveElement) {
          const text = interactiveElement.textContent?.trim() || "";
          const tagName = interactiveElement.tagName.toLowerCase();
          const type = tagName === "button" ? "Button" : "Link"; // Using English as requested
          
          const textToRead = `${text} ${type}`;

          if (text && textToRead !== lastReadText.current) {
            speak(textToRead);
            lastReadText.current = textToRead;
          }
          return;
        }

        // Check for text content
        let range;
        if (document.caretRangeFromPoint) {
          range = document.caretRangeFromPoint(e.clientX, e.clientY);
        } else if ((document as any).caretPositionFromPoint) {
          const position = (document as any).caretPositionFromPoint(e.clientX, e.clientY);
          if (position) {
            range = document.createRange();
            range.setStart(position.offsetNode, position.offset);
            range.setEnd(position.offsetNode, position.offset);
          }
        }

        if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
          const textNode = range.startContainer;
          const text = textNode.textContent || "";
          
          // Find sentence boundaries
          // Simple sentence detection: look for . ! ?
          // We want to find the sentence containing the current offset
          
          // This is a simple implementation and might need refinement for complex cases
          const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
          let currentSentence = "";
          let currentLength = 0;
          
          for (const sentence of sentences) {
            if (currentLength + sentence.length >= range.startOffset) {
              currentSentence = sentence.trim();
              break;
            }
            currentLength += sentence.length;
          }

          if (currentSentence && currentSentence.length > 1 && currentSentence !== lastReadText.current) {
            speak(currentSentence);
            lastReadText.current = currentSentence;
          }
        }
      }, 200);
    };

    const speak = (text: string) => {
      console.log("Speaking:", text);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Select a Spanish voice if available, since the content seems to be Spanish
      // but we will stick to the user's request for "Button"/"Link" which implies English context or mixed.
      // However, reading Spanish text with an English voice sounds bad.
      // I will try to detect language or default to Spanish as the previous component did.
      
      const spanishVoice = voices.find((v) => v.lang.includes("es") || v.lang.includes("ES"));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
        utterance.lang = spanishVoice.lang;
      } else {
        utterance.lang = "es-ES";
      }
      
      window.speechSynthesis.speak(utterance);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.speechSynthesis.cancel();
    };
  }, [screenReader, voices]);

  return null;
}
