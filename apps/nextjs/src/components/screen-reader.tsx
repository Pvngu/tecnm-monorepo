"use client";

import { useEffect, useRef, useState } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";

export function ScreenReader() {
  const { screenReader } = useAccessibility();
  const lastReadText = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

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
      setHighlightRect(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Clear highlight immediately on move to feel responsive, 
      // or keep it until new one is found. Let's keep it for now or clear if desired.
      // setHighlightRect(null); 

      timeoutRef.current = setTimeout(() => {
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (!element) {
            setHighlightRect(null);
            return;
        }

        // Check for custom screen reader text
        const customTextElement = element.closest("[data-screen-reader-text]");
        if (customTextElement) {
            const text = customTextElement.getAttribute("data-screen-reader-text") || "";
            if (text && text !== lastReadText.current) {
                speak(text);
                lastReadText.current = text;
                setHighlightRect(customTextElement.getBoundingClientRect());
            }
            return;
        }

        // Check for interactive elements (Button or Link)
        const interactiveElement = element.closest("button, a");
        if (interactiveElement) {
          const text = interactiveElement.textContent?.trim() || "";
          const tagName = interactiveElement.tagName.toLowerCase();
          const type = tagName === "button" ? "Button" : "Link";
          
          const textToRead = `${text} ${type}`;

          if (text && textToRead !== lastReadText.current) {
            speak(textToRead);
            lastReadText.current = textToRead;
            setHighlightRect(interactiveElement.getBoundingClientRect());
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
          
          const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
          let currentSentence = "";
          let currentLength = 0;
          let sentenceStartOffset = 0;
          
          for (const sentence of sentences) {
            if (currentLength + sentence.length >= range.startOffset) {
              currentSentence = sentence.trim();
              sentenceStartOffset = currentLength;
              break;
            }
            currentLength += sentence.length;
          }

          if (currentSentence && currentSentence.length > 1 && currentSentence !== lastReadText.current) {
            speak(currentSentence);
            lastReadText.current = currentSentence;

            // Calculate highlight rect for the sentence
            try {
                const highlightRange = document.createRange();
                highlightRange.setStart(textNode, sentenceStartOffset);
                // Ensure end offset doesn't exceed length
                const endOffset = Math.min(sentenceStartOffset + currentSentence.length + 1, text.length); 
                highlightRange.setEnd(textNode, endOffset);
                setHighlightRect(highlightRange.getBoundingClientRect());
            } catch (err) {
                console.warn("Could not set highlight range", err);
                setHighlightRect(null);
            }
          }
        } else {
            // No text node found
             // setHighlightRect(null); // Optional: clear if not over text
        }
      }, 200);
    };

    const speak = (text: string) => {
      console.log("Speaking:", text);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
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
      setHighlightRect(null);
    };
  }, [screenReader, voices]);

  if (!screenReader) return null;

  return (
    <>
      {highlightRect && (
        <div
          style={{
            position: "fixed",
            top: highlightRect.top,
            left: highlightRect.left,
            width: highlightRect.width,
            height: highlightRect.height,
            backgroundColor: "rgba(255, 255, 0, 0.3)",
            pointerEvents: "none",
            zIndex: 9999,
            transition: "all 0.2s ease",
            borderRadius: "4px",
            border: "2px solid rgba(255, 200, 0, 0.8)"
          }}
        />
      )}
    </>
  );
}
