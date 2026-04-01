"use client";
import { useEffect, useRef } from "react";

/**
 * DotGrid — canvas-based ambient background for the landing page hero.
 *
 * Renders a grid of small indigo dots. When the cursor enters the canvas
 * the dots nearest to it:
 *   • Scale up in radius (1.5 px → 5 px)
 *   • Increase in opacity (0.16 → 0.70)
 *   • Are repelled away from the cursor with quadratic falloff
 *
 * The further a dot is from the cursor the less it is affected, creating
 * a smooth ripple that looks physical without any physics library.
 */
export default function DotGrid({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Tunables ────────────────────────────────────────────────────────
    const SPACING     = 28;    // grid cell size in px
    const BASE_R      = 1.5;   // dot radius at rest
    const MAX_R       = 5;     // dot radius at cursor centre
    const EFFECT_R    = 145;   // activation radius around cursor
    const REPEL_DIST  = 12;    // maximum pixel push at cursor centre
    const BASE_ALPHA  = 0.16;
    const MAX_ALPHA   = 0.72;

    const mouse = { x: -9999, y: -9999 };
    let raf = 0;

    /* ── Resize handling ─────────────────────────────────────────────── */
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    /* ── Draw loop ───────────────────────────────────────────────────── */
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Start at half-spacing so dots are centred within cells
      for (let gy = SPACING / 2; gy < H + SPACING; gy += SPACING) {
        for (let gx = SPACING / 2; gx < W + SPACING; gx += SPACING) {

          const dx   = gx - mouse.x;
          const dy   = gy - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let px    = gx;
          let py    = gy;
          let r     = BASE_R;
          let alpha = BASE_ALPHA;

          if (dist < EFFECT_R && dist > 0) {
            // t = 1 at cursor centre, 0 at effect boundary
            const t = 1 - dist / EFFECT_R;
            // Quadratic ease-in so the effect is concentrated near cursor
            const tSq = t * t;

            // Repulsion: push dot away from cursor along its vector
            const angle = Math.atan2(dy, dx);
            const push  = REPEL_DIST * tSq;
            px += Math.cos(angle) * push;
            py += Math.sin(angle) * push;

            r     = BASE_R + (MAX_R - BASE_R) * tSq;
            alpha = BASE_ALPHA + (MAX_ALPHA - BASE_ALPHA) * tSq;
          }

          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99,102,241,${alpha})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    /* ── Mouse tracking (viewport → canvas coords) ───────────────────── */
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`hidden md:block ${className}`}
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
