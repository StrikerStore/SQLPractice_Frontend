"use client";
import { useEffect, useRef, useState } from "react";

export default function CursorTrailer() {
  const [isClient, setIsClient] = useState(false);
  
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorOutline = useRef<HTMLDivElement>(null);
  
  const positions = useRef({
    dotX: -100, // Hide off-screen initially
    dotY: -100,
    outlineX: -100,
    outlineY: -100,
  });

  useEffect(() => {
    setIsClient(true);
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      positions.current.dotX = e.clientX;
      positions.current.dotY = e.clientY;
      
      // Instantly track primary dot
      if (cursorDot.current) {
        cursorDot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const animateOutline = () => {
      const { dotX, dotY, outlineX, outlineY } = positions.current;
      
      // Rubber-band easing factor
      const ease = 0.15;
      positions.current.outlineX += (dotX - outlineX) * ease;
      positions.current.outlineY += (dotY - outlineY) * ease;

      // Trailing ring snaps behind the primary dot
      if (cursorOutline.current) {
        cursorOutline.current.style.transform = `translate3d(${positions.current.outlineX}px, ${positions.current.outlineY}px, 0) translate(-50%, -50%)`;
      }
      
      animationFrameId = requestAnimationFrame(animateOutline);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(animateOutline);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isClient) return null;

  return (
    <>
      {/* Primary Dot */}
      <div 
        ref={cursorDot}
        className="pointer-events-none fixed top-0 left-0 z-[100] h-1.5 w-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.8)] mix-blend-multiply"
      />
      {/* Secondary Trailing Ring */}
      <div 
        ref={cursorOutline}
        className="pointer-events-none fixed top-0 left-0 z-[99] h-8 w-8 rounded-full border border-indigo-400/80 bg-indigo-100/30 mix-blend-multiply"
      />
    </>
  );
}
