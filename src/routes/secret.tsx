import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/secret")({
  head: () => ({
    meta: [{ title: "The Secret Dimension ✨" }],
  }),
  component: SecretDimension,
});

function Fireflies({ count = 40 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 100}%`,
            background: "oklch(0.92 0.18 340)",
            boxShadow: "0 0 14px oklch(0.85 0.22 340), 0 0 28px oklch(0.78 0.22 340 / 0.6)",
          }}
          animate={{
            x: [0, ((i % 2 ? 1 : -1) * 80), 0],
            y: [0, -100 - (i % 5) * 20, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{ duration: 8 + (i % 5), repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function Confetti() {
  const colors = ["#ff5fa2", "#b388ff", "#ffd6e8", "#9c7bff", "#ffffff"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 80 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2"
          style={{
            left: `${(i * 13) % 100}%`,
            top: -20,
            background: colors[i % colors.length],
            borderRadius: i % 2 ? "50%" : "2px",
          }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 720 }}
          transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: (i % 10) * 0.3, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function SecretDimension() {
  const [openChest, setOpenChest] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const a = audioRef.current;
    if (a) { a.volume = 0.4; a.play().catch(() => {}); }
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white"
      style={{ background: "radial-gradient(ellipse at center, oklch(0.30 0.18 320) 0%, oklch(0.08 0.05 280) 70%)" }}>
      <audio ref={audioRef} src="/music/ik-kudi.mp3" loop />
      {/* Nebula */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-[600px] w-[600px] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.70 0.30 340 / 0.8), transparent 70%)" }} />
        <div className="absolute -right-32 bottom-0 h-[700px] w-[700px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.30 295 / 0.7), transparent 70%)" }} />
      </div>
      {/* Stars */}
      {Array.from({ length: 120 }).map((_, i) => (
        <motion.span key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`,
            boxShadow: "0 0 8px white" }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: (i % 10) * 0.2 }}
        />
      ))}
      <Fireflies />
      <Confetti />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <Link to="/" className="absolute left-4 top-4 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
          ← Back to Universe
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4 }}>
          <div className="text-xs uppercase tracking-[0.5em] text-white/60">Hidden Chapter</div>
          <h1 className="mt-3 text-4xl font-light leading-tight sm:text-6xl"
            style={{ fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, #ffd6e8, #ff5fa2, #b388ff)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            The Secret Dimension
          </h1>
          <p className="mt-6 text-lg italic text-white/90 sm:text-2xl" style={{ fontFamily: "var(--font-display)" }}>
            Congratulations Snowy Owgy ✨<br />
            You found every piece of our universe.
          </p>
          <p className="mt-4 text-sm tracking-[0.3em] uppercase text-rose-200/80">
            Flamobita hid this place only for you ❤
          </p>
        </motion.div>

        {/* Treasure chest */}
        <motion.button
          onClick={() => setOpenChest(true)}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-12 rounded-3xl border border-white/20 bg-white/10 px-10 py-8 backdrop-blur-2xl"
          style={{ boxShadow: "0 0 80px oklch(0.70 0.25 340 / 0.5), inset 0 0 30px rgba(255,255,255,0.1)" }}
        >
          <motion.div animate={{ rotate: [0, -2, 2, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="text-7xl drop-shadow-[0_0_20px_rgba(255,180,230,0.7)]">
            🎁
          </motion.div>
          <div className="mt-3 text-xs uppercase tracking-[0.4em] text-white/70">Open the treasure</div>
        </motion.button>

        <AnimatePresence>
          {openChest && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-xl p-6"
              onClick={() => setOpenChest(false)}>
              <motion.div initial={{ scale: 0.7, rotate: -4, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 18 }}
                onClick={(e) => e.stopPropagation()}
                className="paper-texture max-w-lg rounded-3xl p-10 text-stone-800 shadow-2xl"
                style={{ fontFamily: "var(--font-hand)",
                  boxShadow: "0 0 120px oklch(0.75 0.22 340 / 0.5), 0 30px 60px rgba(0,0,0,0.6)" }}>
                <div className="text-center text-xs uppercase tracking-[0.4em] text-stone-500">A handwritten note</div>
                <p className="mt-6 text-2xl leading-relaxed sm:text-3xl">
                  "No matter how many universes exist,<br /><br />
                  my favorite one is the one where I met you."
                </p>
                <div className="mt-8 text-right text-lg">— Flamobita ❤</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
