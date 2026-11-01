"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  fontSize: "sm" | "base" | "lg";
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  fontSize: "base",
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

  useEffect(() => {
    const saved = localStorage.getItem("ag_theme") as Theme | null;
    if (saved) {
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("ag_theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  const increaseFontSize = () => {
    setFontSize((prev) => (prev === "sm" ? "base" : "lg"));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => (prev === "lg" ? "base" : "sm"));
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, fontSize, increaseFontSize, decreaseFontSize }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
