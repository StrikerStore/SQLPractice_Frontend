"use client";
import { useRef, ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
  /** How far in px from the element centre the effect activates. Default 110. */
  radius?: number;
  /** 0–1 fraction of the cursor-to-centre distance the element travels. Default 0.38. */
  strength?: number;
  className?: string;
}

/**
 * MagneticButton — wraps any element and magnetically pulls it toward the
 * cursor when the pointer enters the activation radius.
 *
 * Physics model:
 *   • When cursor is within `radius` px of the element centre, compute the
 *     normalised offset and set `target` to (offset * strength).
 *   • When cursor leaves, `target` resets to (0, 0).
 *   • Each RAF tick springs `current` toward `target` with a 0.12 ease factor,
 *     giving a natural rubber-band feel.
 *   • The RAF loop idles automatically when the element is at rest to avoid
 *     unnecessary work.
 */
export default function MagneticButton({
  children,
  radius   = 110,
  strength = 0.38,
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // All mutable state in refs so RAF closure never goes stale
  const target  = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const active  = useRef(false);  // cursor is within radius
  const running = useRef(false);  // RAF loop is alive
  const rafId   = useRef<number>(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    /* ── Spring animation loop ───────────────────────────────────────── */
    const spring = () => {
      const EASE = 0.12;
      current.current.x += (target.current.x - current.current.x) * EASE;
      current.current.y += (target.current.y - current.current.y) * EASE;

      el.style.transform =
        `translate3d(${current.current.x.toFixed(2)}px,${current.current.y.toFixed(2)}px,0)`;

      const restX = Math.abs(target.current.x - current.current.x);
      const restY = Math.abs(target.current.y - current.current.y);

      // Keep looping if still in motion OR cursor is actively inside
      if (restX > 0.05 || restY > 0.05 || active.current) {
        rafId.current = requestAnimationFrame(spring);
      } else {
        // Snap to exact zero and stop the loop
        el.style.transform = "translate3d(0px,0px,0)";
        running.current = false;
      }
    };

    const startSpring = () => {
      if (running.current) return;
      running.current = true;
      rafId.current = requestAnimationFrame(spring);
    };

    /* ── Global mouse tracking ───────────────────────────────────────── */
    const onMove = (e: MouseEvent) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        active.current  = true;
        target.current  = { x: dx * strength, y: dy * strength };
        startSpring();
      } else if (active.current) {
        // Just left the radius
        active.current  = false;
        target.current  = { x: 0, y: 0 };
        startSpring();
      }
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [radius, strength]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ willChange: "transform", display: "inline-flex" }}
    >
      {children}
    </div>
  );
}
