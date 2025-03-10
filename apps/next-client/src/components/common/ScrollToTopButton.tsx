'use client';

import { useState, useEffect } from "react";

export function ScrollToTopButton({ offset = 200 }: { offset?: number }) {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > offset) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showTopBtn) return null;

  return (
    <button className="top_btn" onClick={handleScrollToTop}>
      TOP
    </button>
  );
}