"use client";
import { useEffect, useRef, useState } from "react";

/**
 * CursorGlow — three-layer custom cursor system for the landing page.
 *
 *  Layer 1  Spotlight   — large dual-radial gradient that follows the cursor
 *                         instantly, creating a sharp-centred "torch" reveal.
 *  Layer 2  Dot         — small 8 px indigo circle that snaps to the cursor.
 *  Layer 3  Ring        — 36 px outline ring that springs behind the cursor
 *                         and morphs on hover over interactive elements.
 *
 * The native system cursor is hidden via an injected <style> tag so the
 * custom cursor is the only thing the user sees on md+ pointer devices.
 */
export default function CursorGlow() {
  const [mounted, setMounted] = useState(false);

  const spotRef  = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);

  // Positions stored in refs so RAF closure always sees latest values
  const cur = useRef({ x: -999, y: -999 });          // real mouse
  const lag = useRef({ x: -999, y: -999 });          // ring spring target
  const rafId = useRef<number>(0);
  const hovering = useRef(false);

  useEffect(() => {
    setMounted(true);

    /* ── Spotlight: two layered radial gradients for sharp-centre look ── */
    const updateSpotlight = (x: number, y: number) => {
      if (!spotRef.current) return;
      spotRef.current.style.background = [
        // Tight bright core
        `radial-gradient(220px circle at ${x}px ${y}px,
           rgba(99,102,241,0.16) 0%,
           rgba(99,102,241,0.07) 45%,
           transparent 100%)`,
        // Wide soft halo
        `radial-gradient(580px circle at ${x}px ${y}px,
           rgba(99,102,241,0.07) 0%,
           transparent 70%)`,
      ].join(", ");
    };

    /* ── Mouse move ─────────────────────────────────────────────────── */
    const onMove = (e: MouseEvent) => {
      cur.current.x = e.clientX;
      cur.current.y = e.clientY;

      // Spotlight + dot follow instantly (no lag)
      updateSpotlight(e.clientX, e.clientY);

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${e.clientX}px,${e.clientY}px,0) translate(-50%,-50%)`;
      }
    };

    /* ── Spring ring animation ───────────────────────────────────────── */
    const tick = () => {
      const ease = 0.1;
      lag.current.x += (cur.current.x - lag.current.x) * ease;
      lag.current.y += (cur.current.y - lag.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${lag.current.x}px,${lag.current.y}px,0) translate(-50%,-50%)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };

    /* ── Hover state: ring blooms over interactive elements ─────────── */
    const onOver = (e: MouseEvent) => {
      if (hovering.current) return;
      const target = e.target as HTMLElement;
      if (!target.closest("a, button")) return;
      hovering.current = true;
      if (ringRef.current) {
        ringRef.current.style.width  = "64px";
        ringRef.current.style.height = "64px";
        ringRef.current.style.borderColor = "rgba(99,102,241,0.7)";
        ringRef.current.style.backgroundColor = "rgba(99,102,241,0.08)";
        ringRef.current.style.backdropFilter = "blur(2px)";
      }
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };

    const onOut = (e: MouseEvent) => {
      if (!hovering.current) return;
      const target = e.target as HTMLElement;
      if (!target.closest("a, button")) return;
      hovering.current = false;
      if (ringRef.current) {
        ringRef.current.style.width  = "36px";
        ringRef.current.style.height = "36px";
        ringRef.current.style.borderColor = "rgba(99,102,241,0.5)";
        ringRef.current.style.backgroundColor = "transparent";
        ringRef.current.style.backdropFilter  = "none";
      }
      if (dotRef.current) dotRef.current.style.opacity = "1";
    };

    /* ── Cursor leaves window ────────────────────────────────────────── */
    const onLeave = () => {
      cur.current = { x: -999, y: -999 };
      if (spotRef.current) spotRef.current.style.background = "none";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);
    document.addEventListener("mouseleave", onLeave);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Hide the system cursor on md+ pointer devices */}
      <style>{`
        @media (min-width: 768px) and (pointer: fine) {
          *, *::before, *::after { cursor: none !important; }
        }
      `}</style>

      {/* Spotlight overlay */}
      <div
        ref={spotRef}
        className="hidden md:block pointer-events-none fixed inset-0 z-20"
        aria-hidden
      />

      {/* Dot — snaps to cursor */}
      <div
        ref={dotRef}
        className="hidden md:block pointer-events-none fixed top-0 left-0 z-[201] rounded-full bg-indigo-600"
        style={{
          width: 8, height: 8,
          transform: "translate3d(-999px,-999px,0) translate(-50%,-50%)",
          transition: "opacity 0.2s ease",
          willChange: "transform",
        }}
        aria-hidden
      />

      {/* Ring — springs behind the cursor */}
      <div
        ref={ringRef}
        className="hidden md:block pointer-events-none fixed top-0 left-0 z-[200] rounded-full border"
        style={{
          width: 36, height: 36,
          borderColor: "rgba(99,102,241,0.5)",
          backgroundColor: "transparent",
          transform: "translate3d(-999px,-999px,0) translate(-50%,-50%)",
          transition: "width 0.3s cubic-bezier(0.34,1.56,0.64,1), height 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s ease, background-color 0.25s ease, backdrop-filter 0.25s ease",
          willChange: "transform",
        }}
        aria-hidden
      />
    </>
  );
}
