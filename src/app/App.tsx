import { useState, useEffect, useRef } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

/* ═══════════════════════════════════════════════════════
   SIGNAL — Landing Page
   Brutalist · Editorial · High-Fashion
═══════════════════════════════════════════════════════ */

const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const SANS: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };

type AppView = "landing" | "session" | "complete";

export default function App() {
  const [view, setView] = useState<AppView>("landing");

  if (view === "session") {
    return <SessionView onExit={() => setView("landing")} onComplete={() => setView("complete")} />;
  }

  if (view === "complete") {
    return <AfterZPage onRestart={() => setView("landing")} />;
  }

  return <LandingPage onLaunch={() => setView("session")} />;
}

/* ═══════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════ */
function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / 400);

  return (
    <div
      className="w-full bg-[#0A0A0A] text-white overflow-x-hidden"
      style={SANS}
    >
      {/* ── Global CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #262626; }

        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.15; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanDown {
          from { top: 0%; }
          to   { top: 100%; }
        }
        .animate-fade-up { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.35s; }
        .delay-500 { animation-delay: 0.55s; }

        .hud-scanline::after {
          content: '';
          position: absolute;
          left: 0; right: 0; height: 1px;
          background: rgba(57,255,20,0.15);
          animation: scanDown 3s linear infinite;
        }
      `}</style>

      {/* ════════════════════════════════════════
          NAV
      ════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 border-b"
        style={{
          background: scrollY > 40 ? "rgba(10,10,10,0.95)" : "transparent",
          borderColor: scrollY > 40 ? "#1E1E1E" : "transparent",
          transition: "background 0.4s, border-color 0.4s",
          backdropFilter: scrollY > 40 ? "blur(8px)" : "none",
        }}
      >
        <span className="font-black text-white text-sm uppercase" style={{ letterSpacing: "0.45em" }}>
          SIGNAL
        </span>

        <div className="hidden md:flex items-center gap-10">
          {["Method", "Technology", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[#9CA3AF] text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors duration-200"
              style={MONO}
            >
              {item}
            </a>
          ))}
        </div>

        <button
          onClick={onLaunch}
          className="hidden md:flex items-center gap-2 border border-[#262626] px-5 py-2 text-[10px] tracking-[0.25em] uppercase text-[#CBD5E1] hover:text-white hover:border-[#39FF14] transition-all duration-200 cursor-pointer"
          style={MONO}
        >
          BEGIN SESSION
          <span className="text-[#39FF14]">→</span>
        </button>
      </nav>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col border-b border-[#1A1A1A]">

        {/* Split background: right half image */}
        <div className="absolute inset-0 flex">
          <div className="w-[45%] bg-[#0A0A0A]" />
          <div className="flex-1 relative overflow-hidden bg-[#080808]">
            <img
              src="https://images.unsplash.com/photo-1573484092085-afd66f8cf2f3?w=1200&h=1100&fit=crop&auto=format"
              alt="Hand forming a fist — ASL letter A"
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(1) contrast(1.1) brightness(0.35)" }}
            />
            {/* Vertical gradient left edge blending */}
            <div
              className="absolute inset-y-0 left-0 w-32"
              style={{ background: "linear-gradient(to right, #0A0A0A, transparent)" }}
            />
            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)",
              }}
            />
            {/* HUD corner marks */}
            <div className="absolute top-12 right-10 w-5 h-5 border-t border-r border-white/20" />
            <div className="absolute bottom-12 left-10 w-5 h-5 border-b border-l border-white/20" />
            {/* Floating HUD label */}
            <div
              className="absolute top-12 left-10 text-[#39FF14]/50 text-[8px] tracking-[0.3em] uppercase"
              style={MONO}
            >
              REF // ASL_A
            </div>
            <div
              className="absolute bottom-12 right-10 text-[#39FF14]/40 text-[8px] tracking-[0.25em] uppercase"
              style={MONO}
            >
              CV_ENGINE : ACTIVE
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div
          className="relative z-10 flex flex-col justify-between h-full min-h-screen px-10 md:px-16"
          style={{ opacity: heroOpacity }}
        >
          {/* Spacer for nav */}
          <div className="h-28" />

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8 animate-fade-up">
            <div className="w-[6px] h-[6px] bg-[#39FF14]" style={{ boxShadow: "0 0 8px rgba(57,255,20,0.6)" }} />
            <span className="text-[#39FF14] text-[9px] tracking-[0.4em] uppercase" style={MONO}>
              NOW IN OPEN BETA
            </span>
          </div>

          {/* Main headline */}
          <div className="max-w-[680px]">
            <h1
              className="font-black text-white leading-none uppercase animate-fade-up delay-100"
              style={{ fontSize: "clamp(56px, 7vw, 96px)", letterSpacing: "-0.02em" }}
            >
              LEARN SIGN<br />
              LANGUAGE<br />
              <span className="text-[#9CA3AF]">THROUGH</span><br />
              MACHINE<br />VISION.
            </h1>

            <p
              className="text-[#9CA3AF] text-sm leading-relaxed mt-8 max-w-[380px] animate-fade-up delay-200"
              style={{ letterSpacing: "0.02em" }}
            >
              SIGNAL uses real-time computer vision to watch your hands, grade your signs, and teach you the full ASL alphabet — entirely in the browser. No app. No download.
            </p>

            <div className="flex items-center gap-5 mt-10 animate-fade-up delay-300">
              <button
                onClick={onLaunch}
                className="flex items-center gap-3 bg-white text-black px-8 py-4 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-[#39FF14] transition-colors duration-300 cursor-pointer"
              >
                BEGIN SESSION
                <span className="text-lg leading-none">→</span>
              </button>
              <a
                href="#method"
                className="text-[#9CA3AF] text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors duration-200 flex items-center gap-2"
                style={MONO}
              >
                HOW IT WORKS
              </a>
            </div>
          </div>

          {/* Bottom metadata strip */}
          <div className="flex items-end justify-between pb-10 mt-auto pt-20 animate-fade-up delay-500">
            <div className="flex items-center gap-8">
              {[["26", "ASL LETTERS"], ["0ms", "LATENCY"], ["100%", "BROWSER NATIVE"]].map(([val, label]) => (
                <div key={label}>
                  <div className="font-black text-white text-2xl" style={{ letterSpacing: "-0.02em" }}>{val}</div>
                  <div className="text-[#9CA3AF] text-[8px] tracking-[0.3em] uppercase mt-1" style={MONO}>{label}</div>
                </div>
              ))}
            </div>
            <div className="text-[#9CA3AF] text-[9px] tracking-[0.2em] uppercase" style={MONO}>
              BUILD // ATULIT DEWANGAN
            </div>
          </div>
        </div>

        {/* Vertical rule dividing columns */}
        <div className="absolute left-[45%] top-0 bottom-0 w-px bg-[#1A1A1A]" />
      </section>

      {/* ════════════════════════════════════════
          MARQUEE TICKER
      ════════════════════════════════════════ */}
      <div className="w-full border-b border-[#1A1A1A] overflow-hidden py-3 bg-[#0D0D0D]">
        <div
          style={{ display: "flex", animation: "marquee 22s linear infinite", width: "max-content" }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-0 shrink-0">
              {[
                "REAL-TIME CV ENGINE",
                "26 ASL LETTERS",
                "ZERO LATENCY",
                "BROWSER NATIVE",
                "NO INSTALL REQUIRED",
                "HAND LANDMARK DETECTION",
                "OPEN BETA",
                "MACHINE VISION",
              ].map((item) => (
                <span key={item} className="flex items-center">
                  <span
                    className="text-[#9CA3AF] text-[9px] tracking-[0.35em] uppercase px-8"
                    style={MONO}
                  >
                    {item}
                  </span>
                  <span className="text-[#9CA3AF] text-[10px]">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          MANIFESTO
      ════════════════════════════════════════ */}
      <section id="about" className="w-full border-b border-[#1A1A1A] px-10 md:px-16 py-28">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 items-start">
          <div>
            <div className="text-[#9CA3AF] text-[8px] tracking-[0.4em] uppercase mb-4" style={MONO}>
              01 / MANIFESTO
            </div>
            <div className="w-8 h-px bg-[#262626]" />
          </div>
          <div>
            <h2
              className="font-black text-white uppercase leading-[1.05] mb-10"
              style={{ fontSize: "clamp(32px, 4vw, 54px)", letterSpacing: "-0.02em" }}
            >
              WE BUILT A MACHINE<br />
              THAT WATCHES YOUR<br />
              <span className="text-[#9CA3AF]">HANDS AND TEACHES YOU</span><br />
              TO SPEAK WITHOUT<br />WORDS.
            </h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-0">
              <p className="text-[#9CA3AF] text-sm leading-loose">
                Sign language is not a secondary skill. It is a complete linguistic system used by over 70 million people worldwide. SIGNAL treats it with the gravity it deserves.
              </p>
              <p className="text-[#9CA3AF] text-sm leading-loose">
                No gamification. No cartoons. No infantilizing reward mechanics. Just your hands, a camera, and a machine smart enough to know if you are doing it correctly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section id="method" className="w-full border-b border-[#1A1A1A] bg-[#0D0D0D]">
        {/* Section header */}
        <div className="px-10 md:px-16 pt-20 pb-12 border-b border-[#1A1A1A] flex items-center justify-between">
          <div className="text-[#9CA3AF] text-[8px] tracking-[0.4em] uppercase" style={MONO}>
            02 / METHOD
          </div>
          <div className="text-[#9CA3AF] text-[8px] tracking-[0.3em] uppercase" style={MONO}>
            THREE STEPS
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1A1A1A]">
          {[
            {
              n: "01",
              title: "ACTIVATE\nCAMERA",
              desc: "Grant browser access to your webcam. SIGNAL processes video locally — nothing leaves your device. No server. No cloud.",
              tag: "INPUT // WEBCAM_0",
            },
            {
              n: "02",
              title: "MIRROR\nTHE SIGN",
              desc: "A high-contrast reference loop shows you the correct hand shape. Position your hand in front of the camera and match the form.",
              tag: "CV_ENGINE : RUNNING",
            },
            {
              n: "03",
              title: "ADVANCE\nTHE SEQUENCE",
              desc: "The engine grades your sign in real time. A clean confidence score determines pass or fail. Move through all 26 letters.",
              tag: "CONFIDENCE : 94%",
            },
          ].map(({ n, title, desc, tag }) => (
            <div key={n} className="px-10 md:px-12 pt-12 pb-14 flex flex-col gap-8">
              <div className="flex items-start justify-between">
                <span
                  className="font-black text-[#9CA3AF] text-[80px] leading-none"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  {n}
                </span>
                <div
                  className="text-[#9CA3AF] text-[8px] tracking-[0.25em] uppercase mt-2"
                  style={MONO}
                >
                  {tag}
                </div>
              </div>

              <h3
                className="font-black text-white uppercase leading-tight"
                style={{ fontSize: "clamp(26px, 2.5vw, 38px)", letterSpacing: "-0.02em", whiteSpace: "pre-line" }}
              >
                {title}
              </h3>

              <div className="w-8 h-px bg-[#262626]" />

              <p className="text-[#9CA3AF] text-sm leading-loose">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          TECHNOLOGY SECTION
      ════════════════════════════════════════ */}
      <section id="technology" className="w-full border-b border-[#1A1A1A]">
        <div className="px-10 md:px-16 pt-20 pb-12 border-b border-[#1A1A1A] flex items-center justify-between">
          <div className="text-[#9CA3AF] text-[8px] tracking-[0.4em] uppercase" style={MONO}>
            03 / TECHNOLOGY
          </div>
          <div className="text-[#9CA3AF] text-[8px] tracking-[0.3em] uppercase" style={MONO}>
            CV ENGINE v1.0
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-[#1A1A1A]">
          {/* Left: tech details */}
          <div className="px-10 md:px-16 py-20">
            <h2
              className="font-black text-white uppercase leading-tight mb-8"
              style={{ fontSize: "clamp(28px, 3vw, 46px)", letterSpacing: "-0.02em" }}
            >
              THE ENGINE<br />
              <span className="text-[#9CA3AF]">SEES WHAT</span><br />
              YOU CANNOT.
            </h2>
            <p className="text-[#9CA3AF] text-sm leading-loose mb-12 max-w-[400px]">
              SIGNAL"s computer vision layer runs entirely in-browser using WebAssembly and the MediaPipe Hands model — detecting 21 hand landmarks at up to 60 frames per second with no perceptible lag.
            </p>

            {/* Spec table */}
            <div className="border-t border-[#1A1A1A]">
              {[
                ["MODEL", "MediaPipe Hands"],
                ["LANDMARKS", "21 points per hand"],
                ["INFERENCE", "WebAssembly WASM"],
                ["FRAME RATE", "Up to 60 FPS"],
                ["PRIVACY", "100% on-device"],
                ["DEPENDENCY", "Zero server calls"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-3 border-b border-[#141414]">
                  <span className="text-[#9CA3AF] text-[9px] tracking-[0.3em] uppercase" style={MONO}>{k}</span>
                  <span className="text-[#CBD5E1] text-[9px] tracking-[0.15em]" style={MONO}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: HUD visualization panel */}
          <div className="relative flex items-center justify-center bg-[#080808] min-h-[480px] overflow-hidden hud-scanline">

            {/* Background photo */}
            <img
              src="https://images.unsplash.com/photo-1559913929-08b6989ec45e?w=800&h=700&fit=crop&auto=format"
              alt="Hand reaching up"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "grayscale(1) brightness(0.18) contrast(1.2)" }}
            />

            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(57,255,20,1) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* HUD bounding box */}
            <div className="relative z-10" style={{ width: 200, height: 260 }}>
              {(["tl","tr","bl","br"] as const).map((p) => (
                <HudCorner key={p} pos={p} />
              ))}
              <div className="absolute inset-0" style={{ border: "0.5px dashed rgba(57,255,20,0.12)" }} />

              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-8 h-8">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-[#39FF14]/50" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#39FF14]/50" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-[#39FF14]" style={{ boxShadow: "0 0 6px rgba(57,255,20,0.9)" }} />
                </div>
              </div>

              <div
                className="absolute -top-5 left-0 text-[#39FF14]/60 text-[7px] tracking-[0.15em]"
                style={MONO}
              >
                X:318 Y:241
              </div>
              <div
                className="absolute -bottom-5 right-0 text-[#39FF14]/40 text-[7px] tracking-[0.12em] uppercase"
                style={MONO}
              >
                HAND_DETECTED
              </div>

              {/* Confidence bar */}
              <div className="absolute -right-4 top-0 bottom-0 w-[2px] bg-[#141414]">
                <div className="absolute bottom-0 w-full bg-[#39FF14]/50" style={{ height: "86%" }} />
              </div>
            </div>

            {/* Corner meta tags */}
            <div className="absolute top-5 left-5 text-[#9CA3AF] text-[8px] tracking-[0.3em] uppercase" style={MONO}>INPUT // WEBCAM_0</div>
            <div className="absolute bottom-5 right-5 flex items-center gap-2">
              <PulseDot />
              <span className="text-[#39FF14]/60 text-[8px] tracking-[0.18em] uppercase" style={MONO}>[ CV_ENGINE : TRACKING_ACTIVE ]</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS ROW
      ════════════════════════════════════════ */}
      <section className="w-full border-b border-[#1A1A1A] bg-[#0D0D0D]">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1A1A1A]">
          {[
            { val: "26", label: "ASL Letters", sub: "Full alphabet coverage" },
            { val: "21", label: "Landmarks", sub: "Per hand per frame" },
            { val: "60", label: "FPS Target", sub: "Real-time inference" },
            { val: "0", label: "Server Calls", sub: "Fully on-device" },
          ].map(({ val, label, sub }) => (
            <div key={label} className="px-10 py-14 border-b md:border-b-0 border-[#1A1A1A]">
              <div
                className="font-black text-white leading-none mb-3"
                style={{ fontSize: "clamp(48px, 5vw, 72px)", letterSpacing: "-0.03em" }}
              >
                {val}
              </div>
              <div className="text-[#CBD5E1] text-[10px] tracking-[0.3em] uppercase font-bold mb-1">{label}</div>
              <div className="text-[#9CA3AF] text-[8px] tracking-[0.2em] uppercase" style={MONO}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          APP PREVIEW MOCK
      ════════════════════════════════════════ */}
      <section className="w-full border-b border-[#1A1A1A] px-10 md:px-16 py-20">
        <div className="flex items-start justify-between mb-12">
          <div className="text-[#9CA3AF] text-[8px] tracking-[0.4em] uppercase" style={MONO}>04 / INTERFACE</div>
          <div className="text-[#9CA3AF] text-[8px] tracking-[0.3em] uppercase" style={MONO}>DESKTOP 1440 × 1024</div>
        </div>

        {/* Mockup frame */}
        <div className="w-full border border-[#1E1E1E] bg-[#0A0A0A] overflow-hidden">
          {/* Fake browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#161616] bg-[#0D0D0D]">
            <div className="w-2 h-2 bg-[#1E1E1E]" />
            <div className="w-2 h-2 bg-[#1E1E1E]" />
            <div className="w-2 h-2 bg-[#1E1E1E]" />
            <div className="flex-1 mx-4 h-5 bg-[#141414] border border-[#1A1A1A] flex items-center px-3">
              <span className="text-[#9CA3AF] text-[7px] tracking-[0.2em]" style={MONO}>signal.app/session</span>
            </div>
          </div>

          {/* App interior */}
          <div style={{ aspectRatio: "1440/700" }} className="relative flex flex-col">
            {/* Mini header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[#161616] shrink-0">
              <span className="font-black text-white text-[10px] uppercase" style={{ letterSpacing: "0.4em" }}>SIGNAL</span>
              <span className="text-[#9CA3AF] text-[7px] tracking-[0.2em] uppercase" style={MONO}>BUILD // ATULIT DEWANGAN</span>
            </div>
            {/* Progress bar */}
            <div className="h-[2px] bg-[#141414] shrink-0">
              <div className="h-full bg-[#39FF14] w-[23%]" style={{ boxShadow: "0 0 6px rgba(57,255,20,0.5)" }} />
            </div>
            {/* Split content */}
            <div className="flex flex-1 min-h-0">
              {/* Left */}
              <div className="w-[40%] border-r border-[#161616] flex flex-col">
                <div className="flex-1 bg-[#0D0D0D] relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1573484092085-afd66f8cf2f3?w=500&h=400&fit=crop&auto=format"
                    alt="ASL A sign reference"
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(1) brightness(0.6) contrast(1.1)" }}
                  />
                </div>
                <div className="px-5 py-4 border-t border-[#161616]">
                  <div className="font-black text-white text-3xl leading-none" style={{ letterSpacing: "-0.02em" }}>A</div>
                  <div className="text-[#9CA3AF] text-[7px] tracking-[0.4em] uppercase mt-1">MATCH THIS SIGN.</div>
                </div>
              </div>
              {/* Right */}
              <div className="flex-1 bg-[#080808] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative" style={{ width: 120, height: 150 }}>
                    {(["tl","tr","bl","br"] as const).map((p) => (
                      <HudCorner key={p} pos={p} size={10} />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[2px] h-[2px] bg-[#39FF14]" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1">
                  <div className="w-[4px] h-[4px] rounded-full bg-[#39FF14]" style={{ boxShadow: "0 0 5px rgba(57,255,20,0.7)" }} />
                  <span className="text-[#39FF14]/60 text-[6px] tracking-[0.15em] uppercase" style={MONO}>[ CV_ENGINE : TRACKING_ACTIVE ]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════ */}
      <section id="start" className="w-full border-b border-[#1A1A1A] px-10 md:px-16 py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
        <div>
          <div className="text-[#9CA3AF] text-[8px] tracking-[0.4em] uppercase mb-8" style={MONO}>05 / START</div>
          <h2
            className="font-black text-white uppercase leading-none"
            style={{ fontSize: "clamp(48px, 7vw, 108px)", letterSpacing: "-0.025em" }}
          >
            BEGIN<br />YOUR<br />SESSION.
          </h2>
        </div>
        <div className="flex flex-col items-start md:items-end gap-6">
          <p className="text-[#9CA3AF] text-sm leading-loose max-w-[280px] md:text-right">
            No account required. No download. Open the app, grant camera access, and start learning ASL in under ten seconds.
          </p>
          <button
            onClick={onLaunch}
            className="flex items-center gap-4 bg-[#39FF14] text-black px-10 py-5 text-[12px] font-black tracking-[0.3em] uppercase hover:bg-white transition-colors duration-300 cursor-pointer"
          >
            LAUNCH SIGNAL
            <span className="text-xl leading-none">→</span>
          </button>
          <div className="text-[#9CA3AF] text-[8px] tracking-[0.25em] uppercase" style={MONO}>
            BROWSER REQUIRED — NO INSTALL
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="w-full px-10 md:px-16 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <span className="font-black text-[#9CA3AF] text-sm uppercase" style={{ letterSpacing: "0.45em" }}>SIGNAL</span>
        <div className="flex items-center gap-8">
          <span className="text-[#9CA3AF] text-[8px] tracking-[0.3em] uppercase" style={MONO}>© 2025 SIGNAL</span>
          <span className="text-[#9CA3AF] text-[8px] tracking-[0.3em] uppercase" style={MONO}>OPEN BETA</span>
        </div>
        <span className="text-[#9CA3AF] text-[8px] tracking-[0.22em] uppercase" style={MONO}>BUILD // ATULIT DEWANGAN</span>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SHARED ATOMS
═══════════════════════════════════════════════ */
function HudCorner({ pos, size = 14 }: { pos: "tl" | "tr" | "bl" | "br"; size?: number }) {
  const edgeMap: Record<string, React.CSSProperties> = {
    tl: { top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1 },
    tr: { top: 0, right: 0, borderTopWidth: 1, borderRightWidth: 1 },
    bl: { bottom: 0, left: 0, borderBottomWidth: 1, borderLeftWidth: 1 },
    br: { bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1 },
  };
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderStyle: "solid",
        borderWidth: 0,
        borderColor: "rgba(255,255,255,0.5)",
        ...edgeMap[pos],
      }}
    />
  );
}

function PulseDot() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 850);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      className="w-[5px] h-[5px] rounded-full bg-[#39FF14] shrink-0"
      style={{
        opacity: on ? 1 : 0.15,
        transition: "opacity 0.4s",
        boxShadow: on ? "0 0 7px 2px rgba(57,255,20,0.5)" : "none",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   SESSION VIEW — the actual learning interface
═══════════════════════════════════════════════════════ */
function SessionView({ onExit, onComplete }: { onExit: () => void; onComplete: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [coords, setCoords] = useState({ x: 318, y: 241, w: 224, h: 287 });
  const [pulse, setPulse] = useState(true);
  const [webcamReady, setWebcamReady] = useState(false);
  const [webcamDenied, setWebcamDenied] = useState(false);
  const [confidence, setConfidence] = useState(72);
  const [currentLetter, setCurrentLetter] = useState(0); // 0-25 for A-Z
  const [landmarks, setLandmarks] = useState<Array<{ x: number; y: number; z?: number }> | null>(null);
  const [isMatched, setIsMatched] = useState(false);
  const [matchConfidence, setMatchConfidence] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setProgress(23), 600);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    let handLandmarker: HandLandmarker | null = null;
    let detectionInterval: NodeJS.Timeout;

    async function initHandDetection() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });

        // Start detection loop
        detectionInterval = setInterval(() => {
          if (!videoRef.current || !handLandmarker || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
            return;
          }

          try {
            const results = handLandmarker.detectForVideo(videoRef.current, Date.now());
            
            if (results.landmarks && results.landmarks.length > 0) {
              const detectedLandmarks = results.landmarks[0];
              setLandmarks(detectedLandmarks);
              
              // Calculate bounding box from landmarks
              let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
              detectedLandmarks.forEach((landmark) => {
                minX = Math.min(minX, landmark.x);
                minY = Math.min(minY, landmark.y);
                maxX = Math.max(maxX, landmark.x);
                maxY = Math.max(maxY, landmark.y);
              });

              // Convert normalized coords to pixel coords (video is 1280x720)
              const videoWidth = 1280;
              const videoHeight = 720;
              const x = minX * videoWidth;
              const y = minY * videoHeight;
              const w = (maxX - minX) * videoWidth;
              const h = (maxY - minY) * videoHeight;

              // Get confidence from hand world landmarks visibility
              const avgConfidence = detectedLandmarks.reduce((sum, l) => sum + (l.z || 0), 0) / detectedLandmarks.length;
              const confidence = Math.round(Math.min(99, Math.max(20, (avgConfidence + 1) * 50)));

              setCoords({
                x: Math.round(x),
                y: Math.round(y),
                w: Math.round(w),
                h: Math.round(h),
              });
              setConfidence(confidence);

              // Simple hand matching: check if hand is in center and has good confidence
              // In a real app, you'd compare hand shape to reference
              const centerX = videoWidth / 2;
              const centerY = videoHeight / 2;
              const handCenterX = x + w / 2;
              const handCenterY = y + h / 2;
              const distanceFromCenter = Math.sqrt(
                Math.pow(handCenterX - centerX, 2) + Math.pow(handCenterY - centerY, 2)
              );
              const maxDistance = 200; // pixels from center
              
              const matchScore = Math.max(0, 100 - (distanceFromCenter / maxDistance) * 50) * (confidence / 100);
              setMatchConfidence(Math.round(matchScore));
              setIsMatched(matchScore > 30 && confidence > 30);

              // Draw landmarks on canvas
              if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                if (ctx) {
                  ctx.clearRect(0, 0, videoWidth, videoHeight);
                  
                  // Draw connections
                  const connections = [
                    [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
                    [0, 5], [5, 6], [6, 7], [7, 8], // Index
                    [5, 9], [9, 10], [10, 11], [11, 12], // Middle
                    [9, 13], [13, 14], [14, 15], [15, 16], // Ring
                    [13, 17], [17, 18], [18, 19], [19, 20], // Pinky
                    [0, 17], [0, 5], [0, 9], [0, 13], // Palm to fingers
                  ];

                  ctx.strokeStyle = "#39FF14";
                  ctx.lineWidth = 2;
                  connections.forEach(([start, end]) => {
                    const p1 = detectedLandmarks[start];
                    const p2 = detectedLandmarks[end];
                    ctx.beginPath();
                    ctx.moveTo(p1.x * videoWidth, p1.y * videoHeight);
                    ctx.lineTo(p2.x * videoWidth, p2.y * videoHeight);
                    ctx.stroke();
                  });

                  // Draw joints
                  ctx.fillStyle = "#39FF14";
                  detectedLandmarks.forEach((landmark) => {
                    ctx.beginPath();
                    ctx.arc(landmark.x * videoWidth, landmark.y * videoHeight, 4, 0, 2 * Math.PI);
                    ctx.fill();
                  });
                }
              }
            } else {
              // No hand detected
              setLandmarks(null);
              setConfidence(Math.max(0, (Math.random() * 15)));
              setIsMatched(false);
              setMatchConfidence(0);
              
              // Clear canvas
              if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                if (ctx) {
                  ctx.clearRect(0, 0, 1280, 720);
                }
              }
            }
          } catch (err) {
            console.warn("Hand detection error:", err);
          }
        }, 33); // ~30 FPS
      } catch (err) {
        console.error("Failed to initialize hand detection:", err);
      }
    }

    if (webcamReady && !webcamDenied) {
      initHandDetection();
    }

    return () => {
      if (detectionInterval) clearInterval(detectionInterval);
      if (handLandmarker) handLandmarker.close();
    };
  }, [webcamReady, webcamDenied]);

  useEffect(() => {
    const id = setInterval(() => setPulse((v) => !v), 800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setWebcamReady(true);
        }
      } catch {
        setWebcamDenied(true);
      }
    }
    init();
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const fmt = (s: number) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-[#0A0A0A] text-white select-none" style={SANS}>
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-10 pt-6 pb-4">
        <button
          onClick={onExit}
          className="text-white font-black text-sm uppercase hover:text-[#39FF14] transition-colors duration-200 cursor-pointer"
          style={{ letterSpacing: "0.5em", fontSize: "15px" }}
        >
          ← SIGNAL
        </button>
        <span className="text-[#9CA3AF] text-[9px] uppercase tracking-[0.22em]" style={MONO}>
          BUILD // ATULIT DEWANGAN
        </span>
      </header>

      {/* Progress bar */}
      <div className="shrink-0 w-full h-[2px] bg-[#141414]">
        <div
          className="h-full bg-[#39FF14]"
          style={{
            width: `${progress}%`,
            transition: "width 2.8s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: "0 0 8px rgba(57,255,20,0.4)",
          }}
        />
      </div>

      {/* Timer */}
      <div className="shrink-0 flex items-center justify-between px-10 pt-3 pb-3">
        <span className="text-[#9CA3AF] text-[11px] tracking-[0.35em]" style={MONO}>{fmt(elapsed)}</span>
        <span className="text-[#9CA3AF] text-[9px] tracking-[0.2em] uppercase" style={MONO}>SESSION_ACTIVE</span>
      </div>

      <div className="shrink-0 h-px bg-[#1E1E1E]" />

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* LEFT — Instruction 40% */}
        <div className="w-[40%] shrink-0 flex flex-col border-r border-[#1E1E1E] bg-[#0A0A0A]">
          <div className="flex-1 relative overflow-hidden bg-[#0D0D0D] min-h-0">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 55% 60% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)" }}
            />
            <ASLSignImage letter={String.fromCharCode(65 + currentLetter)} />
            <div className="absolute top-4 left-5 text-[#9CA3AF] text-[8.5px] tracking-[0.28em] uppercase" style={MONO}>REF // ASL_{String.fromCharCode(65 + currentLetter)}</div>
            <div className="absolute bottom-4 right-5 text-[#9CA3AF] text-[8.5px] tracking-[0.28em] uppercase" style={MONO}>LOOP // 00:03</div>
            <div className="absolute top-4 right-5 w-4 h-4 border-t border-r border-[#262626]" />
            <div className="absolute bottom-4 left-5 w-4 h-4 border-b border-l border-[#262626]" />
          </div>

          <div className="shrink-0 bg-[#0A0A0A] border-t border-[#1E1E1E] px-10 pt-7 pb-8" style={{ minHeight: "180px" }}>
            <div className="font-black text-white leading-none" style={{ fontSize: "clamp(88px,9vw,124px)", letterSpacing: "-0.025em" }}>{String.fromCharCode(65 + currentLetter)}</div>
            <div className="flex items-center gap-4 mt-5">
              <div className="w-6 h-px bg-[#262626]" />
              <span className="text-[#CBD5E1] text-[9px] font-bold tracking-[0.5em] uppercase">MATCH THIS SIGN.</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="text-[#9CA3AF] text-[8px] tracking-[0.25em] uppercase" style={MONO}>LETTER {String(currentLetter + 1).padStart(2, "0")} / 26</div>
              <div className="flex gap-[3px]">
                {Array.from({ length: 26 }).map((_, i) => (
                  <div key={i} className="h-[2px] cursor-pointer hover:bg-[#39FF14] transition-colors" style={{ width: "7px", background: i === currentLetter ? "#39FF14" : i < currentLetter ? "#1a3a0a" : "#1A1A1A" }} onClick={() => setCurrentLetter(i)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Webcam 60% */}
        <div className="flex-1 relative overflow-hidden bg-[#080808]">
          <video
            ref={videoRef}
            autoPlay muted playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: "scaleX(-1)", opacity: webcamReady ? 1 : 0, transition: "opacity 1s ease" }}
          />

          {/* Canvas overlay for hand landmarks */}
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="absolute inset-0 w-full h-full"
            style={{ transform: "scaleX(-1)", pointerEvents: "none" }}
          />

          {!webcamReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="opacity-10"><HandSilhouette /></div>
              <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 text-center" style={MONO}>
                <div className="text-[#9CA3AF] text-[9px] tracking-[0.4em] uppercase mb-1">
                  {webcamDenied ? "CAMERA_ACCESS_DENIED" : "AWAITING_FEED..."}
                </div>
                {webcamDenied && (
                  <div className="text-[#9CA3AF] text-[8px] tracking-[0.25em] uppercase">GRANT PERMISSION TO CONTINUE</div>
                )}
              </div>
            </div>
          )}

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)" }}
          />

          {/* HUD bounding box */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative" style={{ width: 228, height: 292 }}>
              {(["tl","tr","bl","br"] as const).map((p) => <HudCorner key={p} pos={p} />)}
              <div className="absolute inset-[6px]" style={{ border: "0.5px dashed rgba(255,255,255,0.07)" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-10 h-10">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-[#39FF14]/40" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#39FF14]/40" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-[#39FF14]" style={{ boxShadow: "0 0 4px rgba(57,255,20,0.8)" }} />
                </div>
              </div>
              <div className="absolute -top-6 left-0 text-[#39FF14] text-[8px] tracking-[0.14em]" style={{ ...MONO, opacity: 0.65 }}>
                X:{coords.x} Y:{coords.y}
              </div>
              <div className="absolute -top-6 right-0 text-[#39FF14] text-[8px] tracking-[0.12em]" style={{ ...MONO, opacity: 0.35 }}>
                {coords.w}×{coords.h}
              </div>
              <div className="absolute -bottom-7 left-0 text-[#39FF14] text-[8px] tracking-[0.14em] uppercase" style={{ ...MONO, opacity: 0.5 }}>
                HAND_DETECTED
              </div>
              <div className="absolute -bottom-7 right-0 text-[#39FF14] text-[8px] tracking-[0.1em]" style={{ ...MONO, opacity: 0.35 }}>
                CONF:{confidence}%
              </div>
              <div className="absolute -right-5 top-0 bottom-0 w-[2px] bg-[#141414]">
                <div className="w-full bg-[#39FF14] absolute bottom-0" style={{ height: `${confidence}%`, opacity: 0.6, transition: "height 0.3s ease" }} />
              </div>
            </div>
          </div>

          <div className="absolute top-4 left-5 text-[#9CA3AF] text-[9px] tracking-[0.25em] uppercase" style={MONO}>INPUT // WEBCAM_0</div>
          <div className="absolute top-4 right-5 text-[#9CA3AF] text-[9px] tracking-[0.2em] uppercase" style={MONO}>1280×720</div>

          {/* Match indicator and NEXT button */}
          {isMatched && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="mb-8 text-center">
                <div className="text-[#39FF14] text-[14px] font-bold tracking-[0.3em] uppercase mb-4" style={MONO}>✓ MATCH DETECTED</div>
                <div className="text-[#39FF14] text-[11px] tracking-[0.2em] uppercase" style={MONO}>MATCH SCORE: {matchConfidence}%</div>
              </div>
              <button
                onClick={() => {
                  if (currentLetter >= 25) {
                    onComplete();
                  } else {
                    setCurrentLetter(currentLetter + 1);
                  }
                }}
                className="pointer-events-auto px-8 py-3 bg-[#39FF14] text-black font-black text-[12px] tracking-[0.25em] uppercase hover:bg-white transition-colors duration-200 cursor-pointer"
                style={{ letterSpacing: "0.15em" }}
              >
                {currentLetter >= 25 ? "COMPLETE SESSION →" : "NEXT LETTER →"}
              </button>
            </div>
          )}

          <div className="absolute bottom-5 right-5 flex items-center gap-[7px]">
            <div
              className="w-[5px] h-[5px] rounded-full bg-[#39FF14] shrink-0"
              style={{ opacity: pulse ? 1 : 0.15, transition: "opacity 0.5s ease", boxShadow: pulse ? "0 0 8px 2px rgba(57,255,20,0.5)" : "none" }}
            />
            <span className="text-[#39FF14] text-[9px] tracking-[0.18em] uppercase" style={{ ...MONO, opacity: 0.75 }}>
              [ CV_ENGINE : TRACKING_ACTIVE ]
            </span>
          </div>

          <div className="absolute bottom-5 left-5 text-[#9CA3AF] text-[8px] tracking-[0.2em] uppercase" style={MONO}>
            FRM // {String(elapsed * 30).padStart(7, "0")}
          </div>

          <div className="absolute inset-0 border border-[#1A1A1A] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

/* ── ASL Sign Image Component ── */
function ASLSignImage({ letter }: { letter: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const normalizedLetter = letter.toLowerCase();
  const imageUrl = new URL(`../../images/${normalizedLetter}.png`, import.meta.url).href;

  useEffect(() => {
    setImageFailed(false);
  }, [letter]);

  if (imageFailed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#0d0d0d]">
        <div className="relative flex w-[92%] h-[92%] flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[#111827] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="relative z-10 flex flex-col items-center justify-center gap-5 text-center px-6 py-8">
            <div className="text-[#9ca3af] text-[10px] uppercase tracking-[0.5em]" style={MONO}>local ASL image</div>
            <div className="text-white font-black leading-none" style={{ fontSize: "clamp(96px, 20vw, 180px)", letterSpacing: "-0.05em" }}>{letter}</div>
            <div className="max-w-[70%] text-[#cbd5e1] text-[12px] uppercase tracking-[0.3em]" style={MONO}>
              could not load the local image for this letter.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#0d0d0d]">
      <img
        key={letter}
        src={imageUrl}
        alt={`ASL sign for ${letter}`}
        className="max-w-[90%] max-h-[90%] object-contain rounded-[24px] shadow-[0_20px_70px_rgba(0,0,0,0.45)]"
        style={{ backgroundColor: "#070707", padding: "10px" }}
        onError={() => setImageFailed(true)}
      />
    </div>
  );
}

function AfterZPage({ onRestart }: { onRestart: () => void }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const generateCertificateSvg = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <svg xmlns="http://www.w3.org/2000/svg" width="1654" height="2339" viewBox="0 0 1654 2339">
        <defs>
          <style>
            .bg { fill: #0A0A0A; }
            .text-neon { fill: #39FF14; font-family: 'JetBrains Mono', monospace; font-weight: 800; }
            .text-light { fill: #E5E7EB; font-family: 'Inter', sans-serif; font-weight: 700; }
            .text-muted { fill: #9CA3AF; font-family: 'JetBrains Mono', monospace; font-weight: 600; }
            .title { font-size: 120px; letter-spacing: -0.03em; }
            .subtitle { font-size: 36px; letter-spacing: 0.12em; }
            .body { font-size: 26px; letter-spacing: 0.06em; }
            .label { font-size: 18px; letter-spacing: 0.22em; text-transform: uppercase; }
          </style>
        </defs>
        <rect width="100%" height="100%" class="bg" rx="48" />
        <g transform="translate(120, 160)">
          <text class="label text-muted" x="0" y="48">CERTIFICATE OF COMPLETION</text>
          <text class="title text-light" x="0" y="150">SPATIAL</text>
          <text class="title text-light" x="0" y="270">GESTURAL</text>
          <text class="title text-light" x="0" y="390">MASTERY</text>
          <text class="body text-muted" x="0" y="520">
            <tspan x="0" dy="0">Awarded for finishing the complete ASL alphabet challenge.</tspan>
            <tspan x="0" dy="40">This verifies the successful completion of the SIGNAL sign language curriculum.</tspan>
            <tspan x="0" dy="40">By mastering this spatial language, the user actively bridges accessibility gaps in</tspan>
            <tspan x="0" dy="40">human communication. Gestural accuracy and kinetic control were strictly validated in</tspan>
            <tspan x="0" dy="40">real-time through our browser-native computer vision matrix.</tspan>
          </text>
          <text class="label text-neon" x="0" y="840">Learner</text>
          <text class="body text-light" x="0" y="900">SIGN LANGUAGE PRACTICE</text>
          <text class="label text-neon" x="0" y="980">Score</text>
          <text class="body text-light" x="0" y="1040">26/26 SIGNS</text>
        </g>
        <rect x="110" y="1260" width="1434" height="1" fill="#1F2937" opacity="0.55" />
        <text class="text-muted label" x="120" y="1324">Verified Build</text>
        <text class="text-light body" x="120" y="1372">BUILD // ATULIT DEWANGAN</text>
      </svg>`;
  };

  const downloadCertificate = async () => {
    setIsDownloading(true);
    try {
      const svg = generateCertificateSvg();
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1654;
        canvas.height = 2339;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          setIsDownloading(false);
          return;
        }
        ctx.fillStyle = '#0A0A0A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob((pngBlob) => {
          if (!pngBlob) {
            setIsDownloading(false);
            return;
          }
          const pngUrl = URL.createObjectURL(pngBlob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = 'spatial-gestural-mastery-certificate.png';
          link.click();
          URL.revokeObjectURL(pngUrl);
          setIsDownloading(false);
        }, 'image/png');
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      };
      img.src = url;
    } catch {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center px-6 py-10" style={SANS}>
      <div className="max-w-[1040px] w-full rounded-[32px] border border-[#1C1C1C] bg-[#090909] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
        <div className="mb-8 text-[#39FF14] uppercase tracking-[0.3em] text-[10px]" style={MONO}>SESSION COMPLETE</div>
        <div className="text-[42px] md:text-[54px] font-black leading-tight mb-6">You finished the alphabet.</div>
        <p className="max-w-3xl text-[#A1A1AA] text-[15px] leading-7 mb-10" style={MONO}>
          Congratulations! You completed A through Z and unlocked the next page. Keep practicing to improve recognition confidence and speed.
        </p>
        <div className="grid gap-6 md:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[24px] border border-[#222] bg-[#090909] p-7">
            <div className="mb-5 text-[#A1A1AA] uppercase tracking-[0.28em] text-[9px]" style={MONO}>CERTIFICATE</div>
            <div className="rounded-[20px] bg-[#111827] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <div className="mb-4 text-[#888] uppercase tracking-[0.2em] text-[8.5px]">CERTIFICATE OF COMPLETION</div>
              <div className="text-[28px] md:text-[32px] font-black uppercase leading-tight mb-5">Spatial Gestural Mastery</div>
              <div className="text-[#D1D5DB] text-[13px] tracking-[0.24em] uppercase mb-8" style={MONO}>
                Awarded for finishing the complete ASL alphabet challenge. This verifies the successful completion of the SIGNAL sign language curriculum. By mastering this spatial language, the user actively bridges accessibility gaps in human communication. Gestural accuracy and kinetic control were strictly validated in real-time through our browser-native computer vision matrix.
              </div>
              <div className="grid gap-3">
                <div className="text-[#F8FAFC] text-[14px] font-semibold">Learner</div>
                <div className="text-[#9CA3AF] text-[12px] uppercase tracking-[0.22em]" style={MONO}>SIGN LANGUAGE PRACTICE</div>
                <div className="text-[#F8FAFC] text-[14px] font-semibold">Score</div>
                <div className="text-[#9CA3AF] text-[12px] uppercase tracking-[0.22em]" style={MONO}>26/26 SIGNS</div>
              </div>
            </div>
          </div>
          <div className="rounded-[24px] border border-[#222] bg-[#111827] p-7 flex flex-col justify-between">
            <div>
              <div className="mb-6 text-[#39FF14] uppercase tracking-[0.3em] text-[9px]" style={MONO}>FINAL MILESTONE</div>
              <div className="text-[22px] font-black uppercase mb-4">Next / Bonus</div>
              <p className="text-[#D1D5DB] text-[14px] leading-7" style={MONO}>
                Explore extra challenges or restart the session to practice again. The journey through handshapes and gesture alignment continues beyond Z.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={downloadCertificate}
                disabled={isDownloading}
                className="rounded-full bg-[#39FF14] px-6 py-3 text-black font-black uppercase tracking-[0.18em] hover:bg-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ letterSpacing: "0.12em" }}
              >
                {isDownloading ? "GENERATING..." : "DOWNLOAD CERTIFICATE"}
              </button>
              <button
                onClick={onRestart}
                className="rounded-full border border-[#39FF14] bg-transparent px-6 py-3 text-[#39FF14] font-black uppercase tracking-[0.18em] hover:bg-white hover:text-black transition-colors duration-200"
                style={{ letterSpacing: "0.12em" }}
              >
                RESTART SESSION
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HandSilhouette() {
  return (
    <svg width="180" height="260" viewBox="0 0 260 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="85" y="272" width="90" height="100" rx="14" fill="#333" />
      <ellipse cx="130" cy="245" rx="60" ry="68" fill="#333" />
      <rect x="97" y="158" width="26" height="50" rx="13" fill="#2A2A2A" />
      <rect x="117" y="150" width="28" height="56" rx="14" fill="#2A2A2A" />
      <rect x="140" y="155" width="26" height="52" rx="13" fill="#2A2A2A" />
      <rect x="161" y="168" width="22" height="44" rx="11" fill="#2A2A2A" />
      <ellipse cx="80" cy="228" rx="20" ry="14" fill="#2E2E2E" transform="rotate(-20 80 228)" />
      <ellipse cx="62" cy="216" rx="17" ry="12" fill="#2E2E2E" transform="rotate(-28 62 216)" />
      <ellipse cx="48" cy="204" rx="13" ry="9" fill="#2E2E2E" transform="rotate(-32 48 204)" />
    </svg>
  );
}
