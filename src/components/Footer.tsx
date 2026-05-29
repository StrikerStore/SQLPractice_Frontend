"use client";

import { useEffect } from "react";

export default function Footer() {
  useEffect(() => {
    function fitWatermark() {
      const svg = document.getElementById("watermarkSvg") as SVGSVGElement | null;
      const text = document.getElementById("watermarkText") as SVGTextElement | null;
      if (!svg || !text) return;
      try {
        const bbox = text.getBBox();
        svg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
      } catch (_) {}
    }
    if (document.fonts?.ready) {
      document.fonts.ready.then(fitWatermark);
    } else {
      window.addEventListener("load", fitWatermark);
    }
    window.addEventListener("resize", fitWatermark);
    return () => window.removeEventListener("resize", fitWatermark);
  }, []);

  return (
    <section className="footer-section">
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; }

        .footer-section {
          background: transparent;
          padding: 48px 24px 0;
          font-family: var(--font-inter), 'Inter', sans-serif;
          color: #2d3148;
        }

        .footer-wrapper {
          max-width: 1150px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 14px;
          align-items: stretch;
        }

        /* ── Left card ── */
        .footer-left {
          position: relative;
          min-height: 320px;
          border-radius: 24px;
          padding: 28px;
          overflow: hidden;
          background: #0f1623;
          box-shadow: 0 12px 40px rgba(0,0,0,0.18);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .footer-left-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          pointer-events: none;
          mix-blend-mode: screen;
          filter: hue-rotate(-55deg) saturate(220%) brightness(1.1);
          opacity: 0.85;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 1;
        }

        .footer-logo-mark {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .footer-logo-mark svg {
          width: 14px;
          height: 14px;
          stroke: #fff;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .footer-logo-name {
          font-family: var(--font-fustat), 'Fustat', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .footer-tagline-container {
          position: relative;
          z-index: 1;
        }

        .footer-tagline {
          font-family: var(--font-fustat), 'Fustat', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          line-height: 1.4;
          margin: 0;
        }

        .footer-tagline span {
          color: rgba(255,255,255,0.5);
          font-weight: 400;
          font-size: 14px;
          display: block;
          margin-top: 6px;
          font-family: var(--font-inter), 'Inter', sans-serif;
        }

        .footer-social-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .footer-social-label {
          font-family: var(--font-caveat), 'Caveat', cursive;
          font-size: 16px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          white-space: nowrap;
        }

        .footer-social-icons {
          display: flex;
          gap: 6px;
        }

        .social-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
        }

        .social-icon svg {
          width: 14px;
          height: 14px;
          fill: rgba(255,255,255,0.8);
        }

        .social-icon:hover {
          background: rgba(255,255,255,0.16);
          transform: translateY(-2px);
        }

        /* ── Right card (liquid glass) ── */
        .footer-right {
          border-radius: 24px;
          padding: 36px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.85);
          box-shadow: inset 0px 1px 2px rgba(255,255,255,0.95), 0 4px 24px rgba(0,80,200,0.06);
        }

        /* Nav columns */
        .footer-nav-cols {
          display: flex;
          gap: 80px;
        }

        .footer-col-title {
          font-family: var(--font-inter), 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 16px;
          display: block;
        }

        .footer-col a {
          display: block;
          font-family: var(--font-inter), 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 12px;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-col a:hover {
          color: #0084FF;
        }

        /* Bottom row */
        .footer-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-top: 40px;
          gap: 24px;
        }

        .footer-copyright {
          font-family: var(--font-inter), 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: #94a3b8;
        }

        .footer-cta-mini {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
        }

        .footer-cta-mini h4 {
          font-size: 13px;
          font-weight: 400;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
          text-align: right;
          font-family: var(--font-inter), 'Inter', sans-serif;
        }

        .footer-cta-mini h4 strong {
          display: block;
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          font-family: var(--font-fustat), 'Fustat', sans-serif;
          letter-spacing: -0.3px;
        }

        .footer-subscribe-row {
          display: flex;
          width: 320px;
          border-radius: 14px;
          padding: 4px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: inset 0px 1px 2px rgba(255,255,255,0.9), 0 2px 10px rgba(0,0,0,0.04);
        }

        .footer-subscribe-row input {
          flex: 1;
          padding: 10px 14px;
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-inter), 'Inter', sans-serif;
          font-size: 13px;
          color: #1e293b;
          min-width: 0;
        }

        .footer-subscribe-row input::placeholder {
          color: #94a3b8;
        }

        .footer-subscribe-row button {
          padding: 10px 18px;
          color: #fff;
          font-family: var(--font-inter), 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
          background: rgba(0,132,255,0.88);
          backdrop-filter: blur(2px);
          box-shadow: inset 0px 3px 4px rgba(255,255,255,0.3), 0 3px 12px rgba(0,132,255,0.28);
        }

        .footer-subscribe-row button:hover {
          transform: scale(1.02);
        }

        /* Watermark */
        .footer-watermark {
          max-width: 1150px;
          margin: -50px auto 0;
          pointer-events: none;
          user-select: none;
          position: relative;
          z-index: 0;
          line-height: 0;
        }

        .footer-watermark svg {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .footer-watermark text {
          font-family: var(--font-fustat), 'Fustat', sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
          fill: rgba(0,0,0,0.035);
        }

        @media (max-width: 860px) {
          .footer-wrapper { grid-template-columns: 1fr; }
          .footer-left { min-height: auto; gap: 32px; }
        }

        @media (max-width: 560px) {
          .footer-right { padding: 24px; }
          .footer-nav-cols { gap: 40px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
          .footer-subscribe-row { width: 100%; }
          .footer-cta-mini { align-items: flex-start; }
          .footer-cta-mini h4 { text-align: left; }
        }
      `}} />

      <div className="footer-wrapper">
        {/* ── Left card ── */}
        <div className="footer-left">
          <video
            className="footer-left-video"
            autoPlay muted loop playsInline preload="auto"
          >
            <source
              src="https://future.co/images/homepage/glassy-orb/orb-purple.webm"
              type="video/webm"
            />
          </video>

          <div className="footer-logo">
            <div className="footer-logo-mark">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <span className="footer-logo-name">LearnMyCode</span>
          </div>

          <div className="footer-tagline-container">
            <p className="footer-tagline">
              Interactive learning,
              <br />one concept at a time.
              <span>Build real skills. Ship real projects.</span>
            </p>
          </div>

          <div className="footer-social-row">
            <span className="footer-social-label">Stay in touch!</span>
            <div className="footer-social-icons">
              <a href="#" className="social-icon" aria-label="Discord">
                <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
              <a href="#" className="social-icon" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="social-icon" aria-label="GitHub">
                <svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── Right card (liquid glass) ── */}
        <div className="footer-right">
          <div className="footer-nav-cols">
            <div className="footer-col">
              <span className="footer-col-title">Navigate</span>
              <a href="#how">How it Works</a>
              <a href="#tracks">Learning Tracks</a>
              <a href="/login">Sign In</a>
              <a href="/signup">Sign Up Free</a>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Legal</span>
              <a href="/about">About</a>
              <a href="/terms">Terms &amp; Conditions</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/contact">Contact</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">&copy; 2025 LearnMyCode. All rights reserved.</p>
            <div className="footer-cta-mini">
              <h4>
                Learn by doing, not watching.
                <strong>Start your first track free.</strong>
              </h4>
              <div className="footer-subscribe-row">
                <input type="email" placeholder="Enter your email" />
                <button type="button">Get Started</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="footer-watermark" aria-hidden="true">
        <svg
          id="watermarkSvg"
          viewBox="62 95 876 175"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text id="watermarkText" x="500" y="240" textAnchor="middle" fontSize="320">
            LearnMyCode
          </text>
        </svg>
      </div>
    </section>
  );
}
