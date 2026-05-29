"use client";

const LOGOS = [
  { name: "PostgreSQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
  { name: "Python",     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
  { name: "React",      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "Node.js",    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
  { name: "CSS3",       src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
  { name: "HTML5",      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
];

// Three copies so the loop never shows a gap regardless of viewport width
const TRACK = [...LOGOS, ...LOGOS, ...LOGOS];

function LogoCard({ name, src }: { name: string; src: string }) {
  return (
    <div
      className="group relative shrink-0 flex flex-col items-center justify-center gap-2.5 px-6 py-4 cursor-default transition-all duration-300 hover:-translate-y-0.5"
      style={{
        width: "120px",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "rgba(255,255,255,0.6)",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.9)",
        boxShadow: "inset 0px 1px 2px rgba(255,255,255,0.8), 0 2px 12px rgba(0,80,200,0.06)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[18px]"
        style={{
          background: "linear-gradient(135deg, rgba(0,132,255,0.08) 0%, rgba(99,102,241,0.06) 100%)",
          boxShadow: "inset 0px 1px 3px rgba(255,255,255,0.9)",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        loading="lazy"
        className="relative z-10 w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110"
      />
      <span
        className="relative z-10 text-[11px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors duration-300 tracking-wide whitespace-nowrap"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {name}
      </span>
    </div>
  );
}

export default function MarqueeScroller() {
  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .marquee-track {
          animation: marquee-scroll 28s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden py-6"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="marquee-track flex gap-3 w-max">
          {TRACK.map((card, i) => (
            <LogoCard key={i} {...card} />
          ))}
        </div>
      </div>
    </>
  );
}
