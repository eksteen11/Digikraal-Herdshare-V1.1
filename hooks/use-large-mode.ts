"use client";

import { useState, useEffect } from "react";

export function useLargeMode() {
  const [isLargeMode, setIsLargeMode] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem("largeMode");
    if (saved !== null) {
      setIsLargeMode(saved === "true");
    }
  }, []);

  const toggleLargeMode = () => {
    const newValue = !isLargeMode;
    setIsLargeMode(newValue);
    localStorage.setItem("largeMode", String(newValue));
  };

  return {
    isLargeMode,
    toggleLargeMode,
  };
}

