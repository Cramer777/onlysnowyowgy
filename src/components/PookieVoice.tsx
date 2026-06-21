import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import p7 from "@/assets/photos/Snapchat-2044494905.jpg.asset.json";

// Approved keywords/phrases (kept private — never shown to the user)
const KEYWORDS = [
  "pookie", "pookiee", "pooki",
  "tum pookiee ho", "tum pookie ho", "pookie ho",
  "tum meri pookie ho", "meri pookie",
  "barbie", "barbiee", "tum barbiee ho",
  "snowy owgy", "owgy",
  "pagal", "tum pagal ho",
  "happoo", "hapoo",
];
function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
}
function sim(a: string, b: string): number {
  if (!a.length || !b.length) return 0;
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
  return 1 - dp[m][n] / Math.max(m, n);
}
function matchesSecret(raw: string): boolean {
  const t = normalize(raw);
  if (!t) return false;
  const words = t.split(" ");
  for (const kw of KEYWORDS) {
    if (t.includes(kw)) return true;
    const k = kw.split(" ");
    if (k.length === 1) {
      for (const w of words) if (sim(w, kw) >= 0.7) return true;
    } else {
      for (let i = 0; i + k.length <= words.length; i++) {
        const win = words.slice(i, i + k.length).join(" ");
        if (sim(win, kw) >= 0.7) return true;
      }
    }
  }
  return false;
}

type Phase = "idle" | "listening" | "denied" | "opening" | "open";

export function PookieVoice() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [heard, setHeard] = useState("");
  const [revealStep, setRevealStep] = useState(0); // 0 detected, 1 tum pookiee, 2 barbiee, 3 dimension
  const [showNote, setShowNote] = useState(false);
  const recogRef = useRef<any>(null);

  const supported = typeof window !== "undefined" &&
    (("SpeechRecognition" in window) || ("webkitSpeechRecognition" in window));

  const stopListening = () => {
    try { recogRef.current?.stop(); } catch {}
    recogRef.current = null;
  };

  const startListening = () => {
    if (!supported) {
      alert("Voice recognition isn't supported on this browser. Try Chrome on desktop or Android.");
      return;
    }
    if (phase === "listening" || phase === "opening" || phase === "open") return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 5;
    recogRef.current = r;
    setHeard("");
    setPhase("listening");

    r.onresult = (ev: any) => {
      let combined = "";
      for (let i = 0; i < ev.results.length; i++) {
        const res = ev.results[i];
        for (let j = 0; j < res.length; j++) combined += " " + res[j].transcript;
      }
      setHeard(combined.trim());
      if (matchesSecret(combined)) {
        try { r.stop(); } catch {}
        triggerSequence();
      }
    };
    r.onerror = () => {
      setPhase((p) => (p === "listening" ? "denied" : p));
      setTimeout(() => setPhase((p) => (p === "denied" ? "idle" : p)), 1600);
    };
    r.onend = () => {
      setPhase((p) => {
        if (p === "listening") {
          // ran out without match
          if (matchesSecret(heard)) { triggerSequence(); return "opening"; }
          setTimeout(() => setPhase((q) => (q === "denied" ? "idle" : q)), 1600);
          return "denied";
        }
        return p;
      });
    };
    try { r.start(); } catch {}
  };

  const triggerSequence = () => {
    setPhase("opening");
    window.dispatchEvent(new Event("pause-music"));
    setRevealStep(0);
    // play magical sound
    try {
      const ac = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (f: number, t: number, dur: number) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.frequency.value = f;
        o.type = "sine";
        g.gain.setValueAtTime(0, ac.currentTime + t);
        g.gain.linearRampToValueAtTime(0.18, ac.currentTime + t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t + dur);
        o.connect(g).connect(ac.destination);
        o.start(ac.currentTime + t);
        o.stop(ac.currentTime + t + dur + 0.05);
      };
      [523, 659, 784, 1047, 1319].forEach((f, i) => playTone(f, i * 0.12, 0.5));
    } catch {}

    // staged reveals
    setTimeout(() => setRevealStep(1), 1200); // "Tum pookiee ho..."
    setTimeout(() => setRevealStep(2), 3200); // "And you're my Barbiee 🌸"
    setTimeout(() => { setRevealStep(3); setPhase("open"); }, 5200);
  };

  const closeDimension = () => {
    setPhase("idle");
    setRevealStep(0);
    setShowNote(false);
    window.dispatchEvent(new Event("play-music"));
  };

  useEffect(() => () => stopListening(), []);

  return (
    <>
      {/* Floating Mic */}
      <button
        onClick={startListening}
        aria-label="Voice secret"
        className="fixed bottom-24 right-5 z-[70] grid h-16 w-16 place-items-center rounded-full border border-white/30 backdrop-blur-2xl transition active:scale-95 sm:bottom-28 sm:right-7"
        style={{
          background: "linear-gradient(135deg, oklch(0.78 0.22 340 / 0.45), oklch(0.65 0.25 320 / 0.35))",
          boxShadow: phase === "listening"
            ? "0 0 35px oklch(0.85 0.25 340), 0 0 70px oklch(0.78 0.25 340 / 0.7), inset 0 0 20px rgba(255,255,255,0.18)"
            : "0 0 22px oklch(0.78 0.25 340 / 0.7), 0 8px 30px rgba(0,0,0,0.45), inset 0 0 16px rgba(255,255,255,0.15)",
          animation: "float-y 4.5s ease-in-out infinite",
        }}
      >
        <motion.span
          animate={phase === "listening" ? { scale: [1, 1.18, 1] } : { scale: 1 }}
          transition={{ repeat: Infinity, duration: 1.1 }}
          className="text-2xl drop-shadow-[0_0_8px_rgba(255,150,210,0.9)]"
        >🎤</motion.span>
        {phase === "listening" && (
          <span className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              animation: "pulse-glow 1.4s ease-out infinite",
              boxShadow: "0 0 0 0 oklch(0.85 0.25 340 / 0.7)",
            }} />
        )}
      </button>

      {/* Listening / denied toast */}
      <AnimatePresence>
        {(phase === "listening" || phase === "denied") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 right-5 z-[70] max-w-[260px] rounded-2xl border border-white/20 px-4 py-3 text-right text-sm text-white backdrop-blur-2xl sm:right-7"
            style={{ background: "rgba(20,5,30,0.55)", boxShadow: "0 0 30px oklch(0.78 0.25 340 / 0.5)" }}>
            {phase === "listening" ? (
              <>
                <div className="text-xs uppercase tracking-[0.3em] text-pink-200">Listening…</div>
                {heard && <div className="mt-1 text-xs italic text-white/70">"{heard}"</div>}
                <div className="mt-1 text-[10px] text-white/50">whisper a secret word ✨</div>
              </>
            ) : (
              <div className="text-pink-100">Try one of our secret words ✨</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opening / Open overlay */}
      <AnimatePresence>
        {(phase === "opening" || phase === "open") && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[80] overflow-y-auto"
            style={{ background: "radial-gradient(ellipse at center, oklch(0.18 0.10 320) 0%, #000 75%)" }}>
            {/* rushing stars */}
            {phase === "opening" && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 80 }).map((_, i) => {
                  const a = (i / 80) * Math.PI * 2;
                  const r = 600 + (i % 8) * 60;
                  return (
                    <motion.span key={i}
                      className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-white"
                      style={{ boxShadow: "0 0 10px white" }}
                      initial={{ x: Math.cos(a) * r, y: Math.sin(a) * r, opacity: 0 }}
                      animate={{ x: 0, y: 0, opacity: [0, 1, 0] }}
                      transition={{ duration: 1.6, delay: (i % 10) * 0.04, ease: "easeIn" }}
                    />
                  );
                })}
              </div>
            )}

            {/* Portal */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: phase === "open" ? 6 : 1, opacity: 1 }}
              transition={{ duration: 1.8, ease: [0.7, 0, 0.3, 1] }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "radial-gradient(circle, oklch(0.85 0.25 340 / 0.95), oklch(0.55 0.28 300 / 0.7) 50%, transparent 80%)",
                boxShadow: "0 0 120px oklch(0.85 0.25 340), 0 0 240px oklch(0.65 0.28 320 / 0.7)",
                filter: "blur(2px)",
              }} />

            {/* Hearts + sparkles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.span key={`h${i}`}
                  className="absolute text-2xl"
                  style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
                  initial={{ opacity: 0, scale: 0.4, y: 30 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.6], y: -60 }}
                  transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.15 }}>
                  💖
                </motion.span>
              ))}
              {Array.from({ length: 60 }).map((_, i) => (
                <motion.span key={`sp${i}`}
                  className="absolute h-1 w-1 rounded-full bg-white"
                  style={{ left: `${(i * 17) % 100}%`, top: `${(i * 23) % 100}%`, boxShadow: "0 0 8px white" }}
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
                  transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: (i % 10) * 0.2 }} />
              ))}
            </div>

            {/* Reveal text – opening phase */}
            <AnimatePresence mode="wait">
              {phase === "opening" && (
                <motion.div key={`r${revealStep}`}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.7 }}
                  className="absolute inset-0 z-10 grid place-items-center px-6 text-center">
                  {revealStep === 0 && (
                    <div className="text-pink-100">
                      <div className="text-xs uppercase tracking-[0.5em] text-pink-200/80">Secret phrase detected 💖</div>
                    </div>
                  )}
                  {revealStep === 1 && (
                    <div className="text-4xl font-light text-white sm:text-6xl"
                      style={{ fontFamily: "var(--font-display)", textShadow: "0 0 30px oklch(0.85 0.25 340)" }}>
                      Tum pookiee ho...
                    </div>
                  )}
                  {revealStep === 2 && (
                    <div className="text-4xl font-light text-white sm:text-6xl"
                      style={{ fontFamily: "var(--font-display)", textShadow: "0 0 30px oklch(0.85 0.25 340)" }}>
                      And you're my Barbiee 🌸
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* The dimension */}
            {phase === "open" && (
              <PookieDimension onClose={closeDimension}
                showNote={showNote} setShowNote={setShowNote} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PookieDimension({ onClose, showNote, setShowNote }: {
  onClose: () => void; showNote: boolean; setShowNote: (b: boolean) => void;
}) {
  const [showQuote, setShowQuote] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowQuote(true), 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="relative min-h-screen w-full text-white"
      style={{ background: "radial-gradient(ellipse at top, oklch(0.45 0.22 340) 0%, oklch(0.18 0.14 310) 50%, #0a0212 100%)" }}>
      {/* nebula */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-[500px] w-[500px] rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.28 340 / 0.8), transparent 70%)" }} />
        <div className="absolute -right-32 bottom-0 h-[600px] w-[600px] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.30 295 / 0.7), transparent 70%)" }} />
      </div>
      {/* fireflies */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.span key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%`,
              background: "oklch(0.92 0.18 340)",
              boxShadow: "0 0 14px oklch(0.85 0.22 340)" }}
            animate={{
              x: [0, ((i % 2 ? 1 : -1) * 60), 0],
              y: [0, -80 - (i % 5) * 15, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{ duration: 8 + (i % 5), repeat: Infinity, delay: i * 0.2 }} />
        ))}
      </div>
      {/* floating hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span key={i} className="absolute text-xl opacity-80"
            style={{ left: `${(i * 71) % 100}%`, bottom: -30 }}
            animate={{ y: [-30, -800], opacity: [0, 0.9, 0], rotate: [0, 20, -10] }}
            transition={{ duration: 12 + (i % 5), repeat: Infinity, delay: i * 1.1, ease: "easeOut" }}>
            {i % 3 === 0 ? "💕" : i % 3 === 1 ? "🌸" : "✨"}
          </motion.span>
        ))}
      </div>

      <button onClick={onClose}
        className="fixed left-4 top-4 z-[90] rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 backdrop-blur hover:bg-white/20">
        ← Back
      </button>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center px-6 py-20 text-center">
        <div className="text-xs uppercase tracking-[0.5em] text-pink-200/80">Hidden World</div>
        <h1 className="mt-3 text-4xl font-light sm:text-6xl"
          style={{ fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, #ffd6e8, #ff5fa2, #ffb3d1)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Pookie Dimension
        </h1>

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-8 text-2xl italic text-white sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}>
          Welcome Snowy Owgy ✨
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-3 text-base text-pink-100/85">
          Flamobita created this place only for you.
        </motion.p>

        {/* Special photo (Memory 7) */}
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="relative mt-10 h-72 w-60 overflow-hidden rounded-3xl border border-pink-200/40 sm:h-96 sm:w-80"
          style={{ boxShadow: "0 0 80px oklch(0.85 0.25 340 / 0.7), inset 0 0 30px rgba(255,255,255,0.1)" }}>
          <img src={p7.url} alt="Our memory" className="h-full w-full object-cover" style={{ objectPosition: "center 18%" }} />
          <div className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{ boxShadow: "inset 0 0 60px oklch(0.85 0.25 340 / 0.4)" }} />
        </motion.div>

        <AnimatePresence>
          {showQuote && !showNote && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 1 }} className="mt-10 max-w-md">
              <p className="text-lg italic text-pink-100 sm:text-xl" style={{ fontFamily: "var(--font-hand)" }}>
                "Some places aren't on any map.<br />They're built from memories."
              </p>
              <button onClick={() => setShowNote(true)}
                className="mt-6 rounded-full border border-pink-200/50 bg-white/10 px-7 py-3 text-xs uppercase tracking-[0.35em] text-white backdrop-blur transition hover:scale-105 hover:bg-white/20"
                style={{ boxShadow: "0 0 30px oklch(0.85 0.25 340 / 0.6)" }}>
                Continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 16, delay: 0.2 }}
              className="paper-texture mt-10 max-w-lg rounded-3xl p-8 text-stone-800 shadow-2xl"
              style={{ fontFamily: "var(--font-hand)",
                boxShadow: "0 0 120px oklch(0.85 0.25 340 / 0.6), 0 30px 60px rgba(0,0,0,0.6)" }}>
              <div className="text-xs uppercase tracking-[0.4em] text-stone-500">Handwritten</div>
              <p className="mt-5 text-xl leading-relaxed sm:text-2xl">
                "No matter how many universes exist,<br /><br />
                my favorite one is the one where I met you."
              </p>
              <div className="mt-6 text-right text-lg">— Flamobita ❤</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* confetti + shooting stars when note shown */}
      {showNote && (
        <div className="pointer-events-none fixed inset-0 z-[85] overflow-hidden">
          {Array.from({ length: 70 }).map((_, i) => (
            <motion.span key={`c${i}`}
              className="absolute h-2 w-1.5"
              style={{
                left: `${(i * 13) % 100}%`, top: -20,
                background: ["#ff5fa2", "#ffd6e8", "#b388ff", "#ffffff"][i % 4],
                borderRadius: i % 2 ? "50%" : "2px",
              }}
              initial={{ y: -20, opacity: 0, rotate: 0 }}
              animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 720 }}
              transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: (i % 10) * 0.2, ease: "linear" }} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={`s${i}`} className="absolute h-0.5 w-40 rounded-full bg-gradient-to-r from-white to-transparent"
              style={{
                top: `${10 + i * 14}%`, left: "-10%",
                animation: `shoot ${5 + i}s linear ${i * 1.2}s infinite`,
                boxShadow: "0 0 20px white",
              }} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
