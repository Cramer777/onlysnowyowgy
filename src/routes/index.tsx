import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// Stickers (10) — IMG_20260616_*
import s1 from "@/assets/uploads/IMG_20260616_145518.jpg.asset.json";
import s2 from "@/assets/uploads/IMG_20260616_145719.jpg.asset.json";
import s3 from "@/assets/uploads/IMG_20260616_145738.jpg.asset.json";
import s4 from "@/assets/uploads/IMG_20260616_145808.jpg.asset.json";
import s5 from "@/assets/uploads/IMG_20260616_145824.jpg.asset.json";
import s6 from "@/assets/uploads/IMG_20260616_145854.jpg.asset.json";
import s7 from "@/assets/uploads/IMG_20260616_145923.jpg.asset.json";
import s8 from "@/assets/uploads/IMG_20260616_150135.jpg.asset.json";
import s9 from "@/assets/uploads/IMG_20260616_150308.jpg.asset.json";
import s10 from "@/assets/uploads/IMG_20260616_150417.jpg.asset.json";

// Photos (7) — real memories
import p1 from "@/assets/photos/1770644205624.jpg.asset.json";
import p2 from "@/assets/photos/1780219210123.jpg.asset.json";
import p3 from "@/assets/photos/1780219210141.jpg.asset.json";
import p4 from "@/assets/photos/1780219237742.jpg.asset.json";
import p5 from "@/assets/photos/1781427501184.jpg.asset.json";
import p6 from "@/assets/photos/IMG_20260112_065136.jpg.asset.json";
import p7 from "@/assets/photos/Snapchat-2044494905.jpg.asset.json";

const STICKERS = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
const PHOTOS = [p1, p2, p3, p4, p5, p6, p7];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Our Universe — Flamobita ❤ Snowy Owgy" },
      { name: "description", content: "A cinematic interactive love-story universe built by Flamobita for Snowy Owgy." },
    ],
  }),
  component: OurUniverse,
});

/* ---------------- Backdrops ---------------- */
function Starfield({ density = 220 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => { c.width = c.offsetWidth * dpr; c.height = c.offsetHeight * dpr; };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: density }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      z: Math.random() * 1 + 0.2, r: Math.random() * 1.4 + 0.2,
      tw: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.7 ? 320 : 280,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      const g = ctx.createRadialGradient(c.width/2, c.height/2, 0, c.width/2, c.height/2, c.width/1.4);
      g.addColorStop(0, "rgba(180,80,200,0.10)"); g.addColorStop(1, "rgba(10,5,30,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height);
      for (const s of stars) {
        s.tw += 0.02;
        const a = 0.4 + Math.sin(s.tw) * 0.5;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 90%, 85%, ${a})`;
        ctx.arc(s.x, s.y, s.r * s.z * dpr, 0, Math.PI * 2);
        ctx.fill();
        s.y += 0.08 * s.z * dpr;
        if (s.y > c.height) { s.y = 0; s.x = Math.random() * c.width; }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [density]);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

function NebulaBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 top-1/4 h-[480px] w-[480px] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.28 340 / 0.7), transparent 70%)" }} />
      <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.25 295 / 0.7), transparent 70%)" }} />
      <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.50 0.22 260 / 0.7), transparent 70%)" }} />
    </div>
  );
}

/* ---------------- Music ---------------- */
function MusicPlayer() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  const toggle = async () => {
    const a = ref.current; if (!a) return;
    try {
      if (a.paused) { a.muted = false; a.volume = 0.85; await a.play(); setPlaying(true); }
      else { a.pause(); setPlaying(false); }
    } catch { setMissing(true); }
  };
  useEffect(() => {
    const start = async () => {
      const a = ref.current; if (!a) return;
      try { a.muted = false; a.volume = 0.85; await a.play(); setPlaying(true); }
      catch { setMissing(true); }
    };
    window.addEventListener("play-music", start);
    const onGesture = () => { start(); window.removeEventListener("pointerdown", onGesture); window.removeEventListener("keydown", onGesture); };
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    return () => {
      window.removeEventListener("play-music", start);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, []);
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <audio ref={ref} src="/music/ik-kudi.mp3" loop preload="auto" onError={() => setMissing(true)} />
      <button onClick={toggle}
        className="glass-card flex items-center gap-3 rounded-full px-4 py-3 text-sm transition hover:scale-105"
        style={{ boxShadow: "var(--shadow-glow-pink)" }}>
        <span className={`grid h-9 w-9 place-items-center rounded-full ${playing ? "animate-pulse-glow" : ""}`}
          style={{ background: "var(--gradient-nebula)" }}>{playing ? "❚❚" : "▶"}</span>
        <div className="text-left leading-tight">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Now Playing</div>
          <div className="font-medium">Ik Kudi · Arpit Bala</div>
        </div>
      </button>
      {missing && (
        <div className="glass-card mt-2 max-w-[260px] rounded-xl px-3 py-2 text-[11px] text-white/70">Tap ▶ to play music.</div>
      )}
    </div>
  );
}

/* ---------------- Scene 0: Welcome ---------------- */
function WelcomePortal({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0"><Starfield density={260} /></div>
      <NebulaBlobs />
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="relative z-10 px-6 text-center"
      >
        <h1 className="text-gradient-rose text-5xl font-light leading-[1.05] sm:text-7xl md:text-8xl">
          Welcome Snowy Owgy <span className="inline-block animate-float-y">✨</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-white/80 sm:text-lg"
          style={{ fontFamily: "var(--font-hand)", fontSize: "1.5rem" }}>
          Flamobita built a universe for you...
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={onEnter}
          className="animate-pulse-glow mt-12 rounded-full px-10 py-5 text-base font-medium tracking-wide text-white"
          style={{ background: "var(--gradient-nebula)" }}
        >
          🚀 Enter Our Universe
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ---------------- Scene 1: Universe (couple avatar) ---------------- */
function TiltPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 15 });
  const sry = useSpring(ry, { stiffness: 120, damping: 15 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ry.set(x * 18); rx.set(-y * 18);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return (
    <div className="relative" style={{ perspective: 1200 }}>
      <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="animate-float-y relative h-[360px] w-[300px] overflow-hidden rounded-[2rem] sm:h-[520px] sm:w-[420px]">
        <div className="absolute -inset-1 rounded-[2.2rem] opacity-90 blur-2xl"
          style={{ background: "var(--gradient-nebula)" }} />
        <img src={p6.url} alt="Flamobita and Snowy Owgy"
          className="relative h-full w-full rounded-[2rem] object-cover"
          style={{ boxShadow: "var(--shadow-glow-pink)" }} />
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="animate-twinkle absolute h-1 w-1 rounded-full bg-white"
            style={{
              top: `${(i * 53) % 100}%`, left: `${(i * 37) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              boxShadow: "0 0 10px white, 0 0 20px oklch(0.78 0.22 340)",
            }} />
        ))}
      </motion.div>
    </div>
  );
}

function UniverseScene() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden py-12">
      <NebulaBlobs />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <div className="flex justify-center"><TiltPhoto /></div>
        <div className="text-center md:text-left">
          <div className="mb-3 text-xs uppercase tracking-[0.5em] text-white/60">Chapter I</div>
          <h2 className="text-gradient-rose text-5xl font-light leading-tight sm:text-6xl">
            Flamobita <span className="text-rose">❤</span> Snowy Owgy
          </h2>
          <p className="mt-8 text-2xl italic text-white/85" style={{ fontFamily: "var(--font-display)" }}>
            "In every universe,<br />I would still choose you."
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Scene 2: Chat Galaxy ---------------- */
const CHAT_QUOTES = [
  "Tya tare rhe ho?", "Kuch nhi", "Kyaa?", "Noiii", "Toiiii", "Kyuoii",
  "IDK", "Happoo", "Tum pagal ho", "Tum bhi pagal ho", "Nachoooooo",
  "Mujhe ye pasand nhi", "Woh", "Tupppp rahoo", "Bohot maraungi",
  "Apna muh band rkhoo", "So jaooo", "Tumhe pta hai", "Aaj kya hua",
  "Ghumne taaleeee", "Bakwas mt kro", "Tum pookiee ho", "Tum barbiee ho", "🤜🏻🤛🏻",
];

function ChatGalaxyScene() {
  const [active, setActive] = useState<string | null>(null);
  const rings = useMemo(() => {
    const perRing = [6, 8, 10];
    const out: { text: string; ring: number; idx: number; total: number; radius: number; duration: number }[] = [];
    let i = 0;
    const radii = [110, 180, 250];
    const durations = [40, 60, 85];
    perRing.forEach((count, ringIdx) => {
      for (let k = 0; k < count && i < CHAT_QUOTES.length; k++, i++) {
        out.push({ text: CHAT_QUOTES[i], ring: ringIdx, idx: k, total: count, radius: radii[ringIdx], duration: durations[ringIdx] });
      }
    });
    return out;
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0"><Starfield density={140} /></div>
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center px-6 pt-10 text-center">
        <div className="text-xs uppercase tracking-[0.5em] text-white/60">Chapter II</div>
        <h2 className="text-gradient-rose mt-1 text-4xl font-light sm:text-5xl">Chat Galaxy</h2>
        <p className="mt-2 text-sm text-white/60">Every word, a planet orbiting us.</p>

        <div className="relative mx-auto mt-4 h-[560px] w-full max-w-[640px] flex-1">
          {[110, 180, 250].map((r) => (
            <div key={r}
              className="absolute left-1/2 top-1/2 rounded-full border border-white/10"
              style={{ width: r * 2, height: r * 2, transform: "translate(-50%, -50%)" }} />
          ))}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-pulse-glow grid h-28 w-28 place-items-center rounded-full text-center text-sm font-medium text-white sm:h-32 sm:w-32"
              style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.92 0.15 350), oklch(0.65 0.28 340) 60%, oklch(0.40 0.22 320))" }}>
              Snowy Owgy<br />❤
            </div>
          </div>
          {rings.map((p, i) => {
            const angle = (p.idx / p.total) * 360;
            return (
              <div key={i} className="absolute left-1/2 top-1/2"
                style={{ animation: `spin-slow ${p.duration}s linear infinite`, transformOrigin: "0 0" }}>
                <div style={{ transform: `rotate(${angle}deg) translate(${p.radius}px) rotate(-${angle}deg)` }}>
                  <button onClick={() => setActive(p.text)}
                    className="glass-card -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-white/90 transition hover:scale-110"
                    style={{ boxShadow: "0 0 20px oklch(0.65 0.25 340 / 0.5)" }}>
                    {p.text}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              transition={{ type: "spring", damping: 18 }}
              className="glass-card max-w-md rounded-3xl p-10 text-center"
              style={{ boxShadow: "var(--shadow-glow-pink)" }}>
              <div className="text-xs uppercase tracking-[0.4em] text-white/60">A memory</div>
              <p className="mt-4 text-3xl text-white" style={{ fontFamily: "var(--font-display)" }}>"{active}"</p>
              <div className="mt-6 text-sm text-white/60">— from our chat universe</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Scene 3: Sticker Kingdom (bears) ---------------- */
const STICKER_CAPTIONS = [
  "Soft hellos 💗",
  "Boop 🌸",
  "Heartbeat 💓",
  "Eyy you 😏",
  "Giggle attack 🤭",
  "Achaaa 🙄",
  "Aww moment 🥺",
  "Tasty thoughts 🤤",
  "Tiny warrior 🪓",
  "Big silly grin 😬",
];
const BEAR_STICKERS = STICKERS.map((s, i) => ({ img: s.url, caption: STICKER_CAPTIONS[i], mood: "From Snowy's sticker pack" }));

function StickerKingdomScene() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="relative h-full w-full overflow-hidden">
      <NebulaBlobs />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center px-6 pt-10 text-center">
        <div className="text-xs uppercase tracking-[0.5em] text-white/60">Chapter III</div>
        <h2 className="text-gradient-rose mt-1 text-4xl font-light sm:text-5xl">Sticker Kingdom</h2>
        <p className="mt-2 text-sm text-white/60">Your favorite little bears, floating in our sky.</p>

        <div className="relative mt-10 grid w-full max-w-4xl flex-1 place-items-center">
          {/* aurora pad */}
          <div className="absolute inset-0 mx-auto h-72 w-72 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.65 0.25 340 / 0.6), transparent 70%)" }} />

          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
            {BEAR_STICKERS.map((s, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                whileHover={{ scale: 1.08, rotate: i % 2 ? 4 : -4 }}
                className="group relative"
              >
                <motion.div
                  animate={{ y: [0, -14, 0], rotate: [0, i % 2 ? 3 : -3, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  className="relative grid h-56 w-56 place-items-center rounded-[2rem] glass-card sm:h-60 sm:w-60"
                  style={{ boxShadow: "var(--shadow-glow-pink)" }}
                >
                  <div className="absolute inset-3 rounded-[1.6rem] opacity-50 blur-2xl"
                    style={{ background: "var(--gradient-nebula)" }} />
                  <img src={s.img} alt={s.caption}
                    className="relative h-44 w-44 object-contain drop-shadow-[0_8px_24px_rgba(255,180,230,0.55)]" />
                </motion.div>
                <div className="mt-3 text-sm text-white/85" style={{ fontFamily: "var(--font-hand)", fontSize: "1.25rem" }}>
                  {s.caption}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-xl p-6">
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card relative w-full max-w-sm rounded-3xl p-8 text-center"
              style={{ boxShadow: "var(--shadow-glow-pink)" }}>
              <img src={BEAR_STICKERS[active].img} alt="" className="mx-auto h-60 w-60 object-contain" />
              <div className="mt-4 text-2xl text-white" style={{ fontFamily: "var(--font-display)" }}>
                {BEAR_STICKERS[active].caption}
              </div>
              <div className="mt-1 text-sm text-white/65">{BEAR_STICKERS[active].mood}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Scene 4: Memory Vault ---------------- */
const MEMORIES = [
  { title: "Us, Together", note: "The day the universe stood still.", img: couplePhoto.url },
  { title: "You Make My Heart", note: "Hand-built into a tiny heart.", img: girlHeart.url },
  { title: "My Pookie", note: "Soft, silly, perfect.", img: girlGingham.url },
  { title: "Don't Mess With Snowy", note: "Cute. Dangerous. Iconic.", img: girlKnife.url },
  { title: "Giggles & Glasses", note: "Your laugh is my favorite song.", img: girlGiggle.url },
  { title: "Achaa…", note: "That look. Every time.", img: girlAcha.url },
  { title: "Awwwww 🌷", note: "Maximum cuteness overload.", img: girlAww.url },
];

function MemoryVaultScene() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="relative h-full w-full overflow-y-auto overflow-x-hidden">
      <div className="absolute inset-0"><Starfield density={120} /></div>
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.5em] text-white/60">Chapter IV</div>
          <h2 className="text-gradient-rose mt-1 text-4xl font-light sm:text-5xl">Memory Vault</h2>
          <p className="mt-2 text-sm text-white/60">A gallery from our shared sky.</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {MEMORIES.map((m, i) => (
            <motion.button
              key={i} onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              whileHover={{ y: -8, rotateX: 4, rotateY: -4 }}
              className="group glass-card relative h-56 overflow-hidden rounded-3xl text-left sm:h-64"
              style={{ transformStyle: "preserve-3d" }}>
              <div className="absolute inset-0 transition duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${m.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-end p-4">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/60">Memory {String(i + 1).padStart(2, "0")}</div>
                <div className="mt-1 text-lg font-light text-white sm:text-xl" style={{ fontFamily: "var(--font-display)" }}>{m.title}</div>
                <div className="mt-1 text-xs text-white/70">{m.note}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-xl p-6">
            <motion.div initial={{ scale: 0.7, opacity: 0, rotateX: -20 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.85, opacity: 0 }} transition={{ type: "spring", damping: 22 }}
              className="glass-card relative w-full max-w-2xl overflow-hidden rounded-3xl p-8"
              style={{ boxShadow: "var(--shadow-glow-pink)" }}>
              <div className="text-xs uppercase tracking-[0.4em] text-white/60">Memory {String(open + 1).padStart(2, "0")}</div>
              <div className="mt-2 text-3xl text-white" style={{ fontFamily: "var(--font-display)" }}>{MEMORIES[open].title}</div>
              <div className="mt-2 text-white/75">{MEMORIES[open].note}</div>
              <div className="mt-6 h-72 overflow-hidden rounded-2xl" style={{ boxShadow: "var(--shadow-glow-violet)" }}>
                <img src={MEMORIES[open].img} alt={MEMORIES[open].title} className="h-full w-full object-cover" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Scene 5: World Tour (real photos in 3D) ---------------- */
const PLACES = [
  { name: "Paris",       flag: "🇫🇷", landmark: "Eiffel Tower",         img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80", color: "oklch(0.78 0.18 30)" },
  { name: "Switzerland", flag: "🇨🇭", landmark: "The Matterhorn",       img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&q=80", color: "oklch(0.85 0.10 220)" },
  { name: "Italy",       flag: "🇮🇹", landmark: "Roman Colosseum",      img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&q=80", color: "oklch(0.75 0.18 80)" },
  { name: "Germany",     flag: "🇩🇪", landmark: "Neuschwanstein",       img: "https://images.unsplash.com/photo-1583951166052-e0c8d4d72b2c?w=900&q=80", color: "oklch(0.70 0.20 60)" },
  { name: "Norway",      flag: "🇳🇴", landmark: "Norwegian Fjords",     img: "https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?w=900&q=80", color: "oklch(0.70 0.20 240)" },
  { name: "Japan",       flag: "🇯🇵", landmark: "Fushimi Inari Shrine", img: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=900&q=80", color: "oklch(0.75 0.22 20)" },
  { name: "China",       flag: "🇨🇳", landmark: "The Great Wall",       img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=900&q=80", color: "oklch(0.78 0.20 40)" },
  { name: "Disney World",flag: "🏰", landmark: "Magic Kingdom",         img: "https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=900&q=80", color: "oklch(0.80 0.22 320)" },
  { name: "Edinburgh",   flag: "🏴", landmark: "Edinburgh Castle",      img: "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=900&q=80", color: "oklch(0.70 0.15 160)" },
  { name: "India",       flag: "🇮🇳", landmark: "Taj Mahal",            img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&q=80", color: "oklch(0.80 0.20 90)" },
];

function PlaceDiorama({ img, color, particles }: { img: string; color: string; particles: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ry.set(x * 22); rx.set(-y * 16);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return (
    <div className="mx-auto" style={{ perspective: 1000 }}>
      <motion.div
        ref={ref} onMouseMove={onMove} onMouseLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d",
          boxShadow: `0 30px 70px ${color}, inset 0 -40px 80px ${color}` }}
        className="relative h-[260px] w-[320px] overflow-hidden rounded-3xl"
      >
        {/* Far layer: photo */}
        <motion.img src={img} alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "translateZ(-40px) scale(1.15)" }}
          animate={{ scale: [1.15, 1.22, 1.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        {/* Ambient color wash */}
        <div className="absolute inset-0 mix-blend-overlay"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${color}, transparent 70%)` }} />
        {/* Vignette */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />
        {/* Foreground floating particles */}
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {Array.from({ length: 14 }).map((_, i) => {
            const left = (i * 53 + 11) % 100;
            const dur = 4 + ((i * 1.3) % 5);
            return (
              <motion.span key={i}
                className="absolute"
                style={{
                  left: `${left}%`, top: "100%", fontSize: 14,
                  filter: `drop-shadow(0 0 6px ${color})`,
                  transform: "translateZ(40px)",
                }}
                animate={{ y: [0, -260], x: [0, ((i % 2 === 0 ? 1 : -1) * 24)], opacity: [0, 1, 0], rotate: [0, 180] }}
                transition={{ duration: dur, repeat: Infinity, delay: (i * 0.3) % 4, ease: "linear" }}
              >{particles}</motion.span>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

const PARTICLE_FOR: Record<string, string> = {
  Paris: "❤️", Switzerland: "❄️", Italy: "✨", Germany: "🍂",
  Norway: "✦", Japan: "🌸", China: "🏮", "Disney World": "✨",
  Edinburgh: "💧", India: "🪔",
};

function WorldTourScene() {
  const [active, setActive] = useState<string | null>(null);
  const current = PLACES.find(p => p.name === active);
  return (
    <div className="relative h-full w-full overflow-hidden">
      <NebulaBlobs />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center px-6 pt-10 text-center">
        <div className="text-xs uppercase tracking-[0.5em] text-white/60">Chapter V</div>
        <h2 className="text-gradient-rose mt-1 text-4xl font-light sm:text-5xl">World Tour Together</h2>
        <p className="mt-2 text-sm text-white/60">Tap a dream destination — each opens its own tiny world.</p>

        <div className="relative mt-6 flex-1 w-full max-w-[560px] aspect-square">
          <div className="absolute inset-0 rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.55 0.25 340 / 0.7), transparent 70%)" }} />
          <div className="relative h-full w-full">
            <div className="animate-spin-slow absolute inset-[10%] rounded-full border border-white/10"
              style={{
                background: "radial-gradient(circle at 30% 30%, oklch(0.45 0.18 280), oklch(0.18 0.10 270) 70%)",
                boxShadow: "inset -40px -40px 100px oklch(0 0 0 / 0.6), 0 0 80px oklch(0.55 0.25 320 / 0.5)",
              }}>
              {[20, 40, 60, 80].map(t => (
                <div key={t} className="absolute left-1/2 -translate-x-1/2 rounded-[50%] border border-white/10"
                  style={{ top: `${t}%`, width: "96%", height: "8%" }} />
              ))}
            </div>
            {PLACES.map((p, i) => {
              const angle = (i / PLACES.length) * Math.PI * 2;
              const x = Math.cos(angle) * 44;
              const y = Math.sin(angle) * 44;
              return (
                <button key={p.name} onClick={() => setActive(p.name)}
                  className="group absolute left-1/2 top-1/2"
                  style={{ transform: `translate(calc(-50% + ${x}%), calc(-50% + ${y}%))` }}>
                  <div className="relative">
                    <span className="absolute -inset-2 animate-ping rounded-full bg-rose/40" />
                    <span className="relative grid h-10 w-10 place-items-center rounded-full glass-card text-base transition group-hover:scale-125"
                      style={{ boxShadow: `0 0 20px ${p.color}` }}>{p.flag}</span>
                    <span className="mt-1 block whitespace-nowrap text-[10px] text-white/80">{p.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && current && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-xl p-6">
            <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85 }}
              transition={{ type: "spring", damping: 20 }} onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-md rounded-3xl p-8 text-center"
              style={{ boxShadow: "var(--shadow-glow-pink)" }}>
              <div className="text-xs uppercase tracking-[0.4em] text-white/60">{current.flag} {current.landmark}</div>
              <div className="mt-1 text-3xl text-white" style={{ fontFamily: "var(--font-display)" }}>{current.name}</div>
              <div className="my-6">
                <PlaceDiorama img={current.img} color={current.color}
                  particles={PARTICLE_FOR[current.name] ?? "✨"} />
              </div>
              <p className="text-white/80 italic">"One day, Flamobita and Snowy Owgy will be here together."</p>
              <button onClick={() => setActive(null)}
                className="mt-6 rounded-full px-5 py-2 text-xs uppercase tracking-[0.3em] text-white"
                style={{ background: "var(--gradient-nebula)" }}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Scene 6: Birthday Constellations ---------------- */
function Constellation({ title, date, points }: { title: string; date: string; points: [number, number][] }) {
  const w = 320, h = 280;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-[0.4em] text-white/60">{date}</div>
      <div className="mt-1 text-2xl text-white" style={{ fontFamily: "var(--font-display)" }}>{title}</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full max-w-[260px]">
        <defs>
          <filter id={`glow-${title}`}>
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={path + " Z"} stroke="oklch(0.85 0.18 340)" strokeWidth="1" fill="none" opacity="0.5" filter={`url(#glow-${title})`} />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill="white" filter={`url(#glow-${title})`}>
            <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}

function BirthdayConstellationsScene() {
  const heart = (cx: number, cy: number, s: number): [number, number][] => {
    const pts: [number, number][] = [];
    for (let i = 0; i < 14; i++) {
      const t = (i / 14) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      pts.push([cx + x * s, cy + y * s]);
    }
    return pts;
  };
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0"><Starfield density={200} /></div>
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i}
          className="absolute h-0.5 w-32 rounded-full bg-gradient-to-r from-white to-transparent"
          style={{
            top: `${10 + i * 18}%`, left: "-10%",
            animation: `shoot ${6 + i}s linear ${i * 2}s infinite`,
            boxShadow: "0 0 20px white",
          }} />
      ))}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center px-6 pt-10 text-center">
        <div className="text-xs uppercase tracking-[0.5em] text-white/60">Chapter VI</div>
        <h2 className="text-gradient-rose mt-1 text-4xl font-light sm:text-5xl">Birthday Constellations</h2>
        <p className="mt-2 text-sm text-white/60">Two stars, written into the sky.</p>
        <div className="mt-8 grid w-full flex-1 place-items-center gap-8 sm:grid-cols-2">
          <Constellation title="Flamobita" date="February 6" points={heart(160, 150, 7)} />
          <Constellation title="Snowy Owgy" date="August 1" points={heart(160, 150, 7)} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Scene 7: Letter ---------------- */
const LETTER = `My dearest Snowy Owgy,

If the night sky is just a page, then I have spent every star writing your name. I built this whole universe so you can wander through it and feel — even for a second — how impossibly lucky I am to know you.

You make the ordinary glow. You make silly things sacred. You laugh, and somewhere a galaxy decides to spin a little softer.

Tum pookiee ho. Tum barbiee ho. And in every life, every universe, every quiet little forever — I will still choose you.

Yours, across every orbit,
Flamobita ❤`;

function LetterScene() {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => { i += 2; setShown(i); if (i >= LETTER.length) clearInterval(id); }, 22);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative h-full w-full overflow-y-auto">
      <NebulaBlobs />
      {Array.from({ length: 18 }).map((_, i) => (
        <span key={i} className="animate-float-y absolute h-1.5 w-1.5 rounded-full bg-rose/70"
          style={{
            top: `${(i * 53) % 100}%`, left: `${(i * 29) % 100}%`,
            animationDelay: `${i * 0.4}s`,
            boxShadow: "0 0 12px oklch(0.85 0.2 340)",
          }} />
      ))}
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-10 text-center">
        <div className="text-xs uppercase tracking-[0.5em] text-white/60">Chapter VII</div>
        <h2 className="text-gradient-rose mt-1 text-4xl font-light sm:text-5xl">A Letter from Flamobita</h2>
      </div>
      <div className="relative z-10 mx-auto mt-8 max-w-2xl px-6 pb-12">
        <div className="paper-texture rounded-3xl p-8 text-left text-stone-800 shadow-2xl"
          style={{ boxShadow: "0 0 100px oklch(0.75 0.20 340 / 0.4), 0 30px 60px oklch(0 0 0 / 0.5)", fontFamily: "var(--font-hand)" }}>
          <pre className="whitespace-pre-wrap text-lg leading-relaxed sm:text-xl">
            {LETTER.slice(0, shown)}
            <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-stone-700 align-middle" />
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Scene 8: Final ---------------- */
function FinalScene() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0"><Starfield density={300} /></div>
      <NebulaBlobs />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-2xl font-light text-white/90 sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
          Thank you for being part of my universe.
        </motion.p>
        <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="text-gradient-rose mt-8 text-5xl font-light sm:text-7xl">
          Flamobita ❤ Snowy Owgy
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.8 }}
          className="mx-auto mt-8 max-w-xl text-base italic text-white/70 sm:text-lg">
          No matter where life takes us,<br />this universe will always exist.
        </motion.p>
      </div>
    </div>
  );
}

/* ---------------- Guided Cinematic Shell ---------------- */
type SceneDef = { id: string; title: string; render: () => React.ReactElement };

const SCENES: SceneDef[] = [
  { id: "universe",   title: "Our Universe",         render: () => <UniverseScene /> },
  { id: "chat",       title: "Chat Galaxy",          render: () => <ChatGalaxyScene /> },
  { id: "stickers",   title: "Sticker Kingdom",      render: () => <StickerKingdomScene /> },
  { id: "memories",   title: "Memory Vault",         render: () => <MemoryVaultScene /> },
  { id: "tour",       title: "World Tour",           render: () => <WorldTourScene /> },
  { id: "stars",      title: "Birthday Constellations", render: () => <BirthdayConstellationsScene /> },
  { id: "letter",     title: "A Letter",             render: () => <LetterScene /> },
  { id: "final",      title: "Forever",              render: () => <FinalScene /> },
];

function CinematicShell() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const total = SCENES.length;

  const go = useCallback((next: number) => {
    if (next < 0 || next >= total) return;
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  }, [idx, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(idx + 1);
      if (e.key === "ArrowLeft") go(idx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, go]);

  const scene = SCENES[idx];

  return (
    <div className="fixed inset-0 z-30">
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={scene.id} custom={dir}
          initial={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.3, 1] }}
          className="absolute inset-0"
        >
          {scene.render()}
        </motion.div>
      </AnimatePresence>

      {/* Top progress / chapters */}
      <div className="pointer-events-auto absolute left-1/2 top-4 z-50 -translate-x-1/2">
        <div className="glass-card flex items-center gap-1.5 rounded-full px-3 py-2">
          {SCENES.map((s, i) => (
            <button key={s.id} onClick={() => go(i)}
              aria-label={s.title}
              className="group relative h-2 rounded-full transition-all"
              style={{
                width: i === idx ? 28 : 8,
                background: i === idx ? "var(--gradient-nebula)" : "rgba(255,255,255,0.25)",
                boxShadow: i === idx ? "0 0 16px oklch(0.78 0.22 340)" : undefined,
              }}>
              <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-white/80 group-hover:block">
                {s.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Side navigation */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-40 flex items-center px-2 sm:px-4">
        <button
          onClick={() => go(idx - 1)} disabled={idx === 0}
          className="pointer-events-auto glass-card grid h-12 w-12 place-items-center rounded-full text-xl text-white/85 transition hover:scale-110 disabled:opacity-30"
          aria-label="Previous">‹</button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-40 flex items-center px-2 sm:px-4">
        <button
          onClick={() => go(idx + 1)} disabled={idx === total - 1}
          className="pointer-events-auto glass-card grid h-12 w-12 place-items-center rounded-full text-xl text-white/85 transition hover:scale-110 disabled:opacity-30"
          style={{ boxShadow: "var(--shadow-glow-pink)" }}
          aria-label="Next">›</button>
      </div>

      {/* Bottom label */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-40 -translate-x-1/2 text-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">
          Chapter {idx + 1} of {total} · {scene.title}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Master ---------------- */
function OurUniverse() {
  const [entered, setEntered] = useState(false);
  const enter = () => {
    window.dispatchEvent(new Event("play-music"));
    setEntered(true);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MusicPlayer />

      <AnimatePresence>
        {entered && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }} animate={{ scale: 30, opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.7, 0, 0.3, 1] }}
            className="pointer-events-none fixed left-1/2 top-1/2 z-[60] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "var(--gradient-nebula)", boxShadow: "var(--shadow-glow-pink)" }}
          />
        )}
      </AnimatePresence>

      {!entered && (
        <div className="fixed inset-0 z-20">
          <WelcomePortal onEnter={enter} />
        </div>
      )}

      {entered && <CinematicShell />}
    </div>
  );
}
