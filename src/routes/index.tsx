import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import couplePhoto from "@/assets/couple-cosmic.jpg";
import memTogether from "@/assets/memory-together.jpg";
import memBees from "@/assets/memory-bees.jpg";
import memCilantro from "@/assets/memory-cilantro.jpg";
import memPrincess from "@/assets/memory-princess.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Our Universe — Flamobita ❤ Snowy Owgy" },
      { name: "description", content: "A cinematic interactive love-story universe built by Flamobita for Snowy Owgy." },
    ],
  }),
  component: OurUniverse,
});

/* ---------- Starfield (canvas) ---------- */
function Starfield({ density = 220 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      c.width = c.offsetWidth * dpr;
      c.height = c.offsetHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: density }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      z: Math.random() * 1 + 0.2,
      r: Math.random() * 1.4 + 0.2,
      tw: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.7 ? 320 : 280,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      // nebula tint
      const g = ctx.createRadialGradient(c.width / 2, c.height / 2, 0, c.width / 2, c.height / 2, c.width / 1.4);
      g.addColorStop(0, "rgba(180,80,200,0.10)");
      g.addColorStop(1, "rgba(10,5,30,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, c.width, c.height);
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

/* ---------- Music Player ---------- */
function MusicPlayer() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  const toggle = async () => {
    const a = ref.current; if (!a) return;
    try {
      if (a.paused) { await a.play(); setPlaying(true); }
      else { a.pause(); setPlaying(false); }
    } catch { setMissing(true); }
  };
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <audio ref={ref} src="/music/ik-kudi.mp3" loop preload="none" onError={() => setMissing(true)} />
      <button
        onClick={toggle}
        className="glass-card flex items-center gap-3 rounded-full px-4 py-3 text-sm transition hover:scale-105"
        style={{ boxShadow: "var(--shadow-glow-pink)" }}
      >
        <span className={`grid h-9 w-9 place-items-center rounded-full ${playing ? "animate-pulse-glow" : ""}`}
          style={{ background: "var(--gradient-nebula)" }}>
          {playing ? "❚❚" : "▶"}
        </span>
        <div className="text-left leading-tight">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Now Playing</div>
          <div className="font-medium">Ik Kudi · Arpit Bala</div>
        </div>
      </button>
      {missing && (
        <div className="glass-card mt-2 max-w-[260px] rounded-xl px-3 py-2 text-[11px] text-white/70">
          Drop your audio at <code className="text-rose">/public/music/ik-kudi.mp3</code> to enable playback.
        </div>
      )}
    </div>
  );
}

/* ---------- Section 1: Welcome Portal ---------- */
function WelcomePortal({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0"><Starfield density={260} /></div>
      <NebulaBlobs />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 px-6 text-center"
      >
        <div className="mb-4 text-xs uppercase tracking-[0.5em] text-white/60">A Cinematic Love Story</div>
        <h1 className="text-gradient-rose text-5xl font-light leading-[1.05] sm:text-7xl md:text-8xl">
          Welcome Snowy Owgy <span className="inline-block animate-float-y">✨</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-white/75 sm:text-lg" style={{ fontFamily: "var(--font-hand)", fontSize: "1.5rem" }}>
          Flamobita built a universe for you...
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onEnter}
          className="animate-pulse-glow mt-12 rounded-full px-10 py-5 text-base font-medium tracking-wide text-white"
          style={{ background: "var(--gradient-nebula)" }}
        >
          🚀 Enter Our Universe
        </motion.button>
        <div className="mt-16 text-xs uppercase tracking-[0.4em] text-white/40">scroll to drift</div>
      </motion.div>
    </section>
  );
}

/* ---------- Section 2: Our Universe (3D tilt photo) ---------- */
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
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="animate-float-y relative h-[420px] w-[320px] overflow-hidden rounded-[2rem] sm:h-[560px] sm:w-[440px]"
      >
        <div className="absolute -inset-1 rounded-[2.2rem] opacity-90 blur-2xl"
          style={{ background: "var(--gradient-nebula)" }} />
        <img
          src={couplePhoto}
          alt="Flamobita and Snowy Owgy floating in their cosmic universe"
          width={1024}
          height={1280}
          className="relative h-full w-full rounded-[2rem] object-cover"
          style={{ boxShadow: "var(--shadow-glow-pink)" }}
        />
        {/* sparkle particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i}
            className="animate-twinkle absolute h-1 w-1 rounded-full bg-white"
            style={{
              top: `${(i * 53) % 100}%`,
              left: `${(i * 37) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              boxShadow: "0 0 10px white, 0 0 20px oklch(0.78 0.22 340)",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function UniverseSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden py-24">
      <NebulaBlobs />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">
        <div className="flex justify-center"><TiltPhoto /></div>
        <div className="text-center md:text-left">
          <div className="mb-3 text-xs uppercase tracking-[0.5em] text-white/60">Chapter II</div>
          <h2 className="text-gradient-rose text-5xl font-light leading-tight sm:text-6xl">
            Flamobita <span className="text-rose">❤</span> Snowy Owgy
          </h2>
          <p className="mt-8 text-2xl italic text-white/85" style={{ fontFamily: "var(--font-display)" }}>
            "In every universe,<br />I would still choose you."
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 3: Chat Galaxy (solar system) ---------- */
const CHAT_QUOTES = [
  "Tya tare rhe ho?", "Kuch nhi", "Kyaa?", "Noiii", "Toiiii", "Kyuoii",
  "IDK", "Happoo", "Tum pagal ho", "Tum bhi pagal ho", "Nachoooooo",
  "Mujhe ye pasand nhi", "Woh", "Tupppp rahoo", "Bohot maraungi",
  "Apna muh band rkhoo", "So jaooo", "Tumhe pta hai", "Aaj kya hua",
  "Ghumne taaleeee", "Bakwas mt kro", "Tum pookiee ho", "Tum barbiee ho", "🤜🏻🤛🏻",
];

function ChatGalaxy() {
  const [active, setActive] = useState<string | null>(null);
  const rings = useMemo(() => {
    const perRing = [6, 8, 10];
    const out: { text: string; ring: number; idx: number; total: number; radius: number; duration: number }[] = [];
    let i = 0;
    const radii = [150, 240, 330];
    const durations = [40, 60, 85];
    perRing.forEach((count, ringIdx) => {
      for (let k = 0; k < count && i < CHAT_QUOTES.length; k++, i++) {
        out.push({ text: CHAT_QUOTES[i], ring: ringIdx, idx: k, total: count, radius: radii[ringIdx], duration: durations[ringIdx] });
      }
    });
    return out;
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden py-24">
      <div className="absolute inset-0"><Starfield density={140} /></div>
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.5em] text-white/60">Chapter III</div>
        <h2 className="text-gradient-rose text-5xl font-light sm:text-6xl">Chat Galaxy</h2>
        <p className="mt-3 text-white/60">Every word, a planet orbiting us.</p>

        <div className="relative mx-auto mt-16 h-[720px] w-full max-w-[760px]">
          {/* orbit rings */}
          {[150, 240, 330].map((r) => (
            <div key={r}
              className="absolute left-1/2 top-1/2 rounded-full border border-white/10"
              style={{ width: r * 2, height: r * 2, transform: "translate(-50%, -50%)" }}
            />
          ))}
          {/* sun */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-pulse-glow grid h-32 w-32 place-items-center rounded-full text-center text-sm font-medium text-white sm:h-40 sm:w-40"
              style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.92 0.15 350), oklch(0.65 0.28 340) 60%, oklch(0.40 0.22 320))" }}>
              Snowy Owgy <br /> ❤
            </div>
          </div>

          {rings.map((p, i) => {
            const angle = (p.idx / p.total) * 360;
            return (
              <div key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  animation: `spin-slow ${p.duration}s linear infinite`,
                  transformOrigin: "0 0",
                }}
              >
                <div style={{ transform: `rotate(${angle}deg) translate(${p.radius}px) rotate(-${angle}deg)` }}>
                  <button
                    onClick={() => setActive(p.text)}
                    className="glass-card -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-white/90 transition hover:scale-110"
                    style={{ boxShadow: "0 0 20px oklch(0.65 0.25 340 / 0.5)" }}
                  >
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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md p-6"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              transition={{ type: "spring", damping: 18 }}
              className="glass-card max-w-md rounded-3xl p-10 text-center"
              style={{ boxShadow: "var(--shadow-glow-pink)" }}
            >
              <div className="text-xs uppercase tracking-[0.4em] text-white/60">A memory</div>
              <p className="mt-4 text-3xl text-white" style={{ fontFamily: "var(--font-display)" }}>“{active}”</p>
              <div className="mt-6 text-sm text-white/60">— from our chat universe</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Section 4: Sticker Kingdom ---------- */
const STICKERS = ["🌸","🦄","🐻","🌙","💖","🍓","🐰","✨","🧸","🌈","🍰","💫","🪐","🌷","🎀","🐼"];
function StickerKingdom() {
  return (
    <section className="relative min-h-screen overflow-hidden py-24">
      <NebulaBlobs />
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.5em] text-white/60">Chapter IV</div>
        <h2 className="text-gradient-rose text-5xl font-light sm:text-6xl">Sticker Kingdom</h2>
        <p className="mt-3 text-white/60">A floating island made of all our cuteness.</p>

        <div className="relative mx-auto mt-16 h-[500px] w-full max-w-3xl">
          {/* island base */}
          <div className="absolute bottom-10 left-1/2 h-40 w-[80%] -translate-x-1/2 rounded-[50%] blur-2xl"
            style={{ background: "radial-gradient(ellipse, oklch(0.65 0.25 340 / 0.7), transparent 70%)" }} />
          <div className="animate-float-y absolute bottom-12 left-1/2 grid h-44 w-72 -translate-x-1/2 place-items-center rounded-[50%] glass-card text-5xl"
            style={{ boxShadow: "var(--shadow-glow-pink)" }}>
            🏰
          </div>
          {STICKERS.map((s, i) => {
            const angle = (i / STICKERS.length) * Math.PI * 2;
            const r = 180 + (i % 3) * 30;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * (r * 0.6) - 60;
            return (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 cursor-pointer text-4xl sm:text-5xl"
                style={{ x, y }}
                animate={{ y: [y, y - 15, y], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                whileHover={{ scale: 1.4, rotate: 20, filter: "drop-shadow(0 0 18px oklch(0.85 0.2 340))" }}
              >
                {s}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 5: Memory Vault ---------- */
const MEMORIES = [
  { title: "Us, Together", note: "The day the universe stood still.", img: memTogether },
  { title: "Honey & Bees", note: "Sweet as the song that played.", img: memBees },
  { title: "Crowned in Green", note: "Silly, soft, unforgettable.", img: memCilantro },
  { title: "Little Princess", note: "Born to wear a crown.", img: memPrincess },
  { title: "Late Night Calls", note: "When the moon was our witness.", img: couplePhoto },
  { title: "Our Forever", note: "Just beginning.", img: memTogether },
];

function MemoryVault() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="relative min-h-screen overflow-hidden py-24">
      <div className="absolute inset-0"><Starfield density={120} /></div>
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="mb-2 text-xs uppercase tracking-[0.5em] text-white/60">Chapter V</div>
          <h2 className="text-gradient-rose text-5xl font-light sm:text-6xl">Memory Vault</h2>
          <p className="mt-3 text-white/60">A gallery from our shared sky.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MEMORIES.map((m, i) => (
            <motion.button
              key={i}
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              whileHover={{ y: -8, rotateX: 4, rotateY: -4 }}
              className="group glass-card relative h-72 overflow-hidden rounded-3xl text-left"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 transition duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${m.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-end p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-white/60">Memory {String(i + 1).padStart(2, "0")}</div>
                <div className="mt-1 text-2xl font-light text-white" style={{ fontFamily: "var(--font-display)" }}>{m.title}</div>
                <div className="mt-2 text-sm text-white/70">{m.note}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-xl p-6"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotateX: -20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }}
              className="glass-card relative w-full max-w-2xl overflow-hidden rounded-3xl p-10"
              style={{ boxShadow: "var(--shadow-glow-pink)" }}
            >
              <div className="text-xs uppercase tracking-[0.4em] text-white/60">Memory {String(open + 1).padStart(2, "0")}</div>
              <div className="mt-3 text-4xl text-white" style={{ fontFamily: "var(--font-display)" }}>{MEMORIES[open].title}</div>
              <div className="mt-4 text-white/75">{MEMORIES[open].note}</div>
              <div className="mt-8 h-64 rounded-2xl"
                style={{ background: "var(--gradient-nebula)", boxShadow: "var(--shadow-glow-violet)" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Section 6: World Tour Globe ---------- */
const PLACES = [
  { name: "Paris", flag: "🇫🇷" }, { name: "Switzerland", flag: "🇨🇭" },
  { name: "Italy", flag: "🇮🇹" }, { name: "Germany", flag: "🇩🇪" },
  { name: "Norway", flag: "🇳🇴" }, { name: "Japan", flag: "🇯🇵" },
  { name: "China", flag: "🇨🇳" }, { name: "Disney World", flag: "🏰" },
  { name: "Edinburgh", flag: "🏴" }, { name: "India", flag: "🇮🇳" },
];

function WorldTour() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section className="relative min-h-screen overflow-hidden py-24">
      <NebulaBlobs />
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.5em] text-white/60">Chapter VI</div>
        <h2 className="text-gradient-rose text-5xl font-light sm:text-6xl">World Tour Together</h2>
        <p className="mt-3 text-white/60">Tap a dream destination.</p>

        <div className="relative mx-auto mt-14 h-[520px] w-[520px] max-w-full">
          <div className="absolute inset-0 rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.55 0.25 340 / 0.7), transparent 70%)" }} />
          {/* Globe */}
          <div className="relative h-full w-full">
            <div className="animate-spin-slow absolute inset-0 rounded-full border border-white/10"
              style={{
                background: "radial-gradient(circle at 30% 30%, oklch(0.45 0.18 280), oklch(0.18 0.10 270) 70%)",
                boxShadow: "inset -40px -40px 100px oklch(0 0 0 / 0.6), 0 0 80px oklch(0.55 0.25 320 / 0.5)",
              }}>
              {/* latitude lines */}
              {[20, 40, 60, 80].map(t => (
                <div key={t} className="absolute left-1/2 -translate-x-1/2 rounded-[50%] border border-white/10"
                  style={{ top: `${t}%`, width: "96%", height: "8%" }} />
              ))}
            </div>
            {/* Place markers around globe */}
            {PLACES.map((p, i) => {
              const angle = (i / PLACES.length) * Math.PI * 2;
              const r = 240;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;
              return (
                <button key={p.name} onClick={() => setActive(p.name)}
                  className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}>
                  <div className="relative">
                    <span className="absolute -inset-3 animate-ping rounded-full bg-rose/40" />
                    <span className="relative grid h-10 w-10 place-items-center rounded-full glass-card text-lg transition group-hover:scale-125"
                      style={{ boxShadow: "0 0 20px oklch(0.78 0.22 340 / 0.7)" }}>{p.flag}</span>
                    <span className="mt-1 block text-[11px] text-white/80">{p.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/65 backdrop-blur-xl p-6">
            <motion.div
              initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85 }}
              transition={{ type: "spring", damping: 20 }}
              className="glass-card max-w-md rounded-3xl p-10 text-center"
              style={{ boxShadow: "var(--shadow-glow-pink)" }}>
              <div className="text-5xl">{PLACES.find(p => p.name === active)?.flag}</div>
              <div className="mt-4 text-3xl text-white" style={{ fontFamily: "var(--font-display)" }}>{active}</div>
              <p className="mt-4 text-white/80">
                "One day, Flamobita and Snowy Owgy will be here together."
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Section 7: Birthday Constellations ---------- */
function Constellation({ title, date, points }: { title: string; date: string; points: [number, number][] }) {
  const w = 320, h = 280;
  // build heart path
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-[0.4em] text-white/60">{date}</div>
      <div className="mt-1 text-2xl text-white" style={{ fontFamily: "var(--font-display)" }}>{title}</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full max-w-xs">
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

function BirthdayConstellations() {
  // heart-shape points
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
    <section className="relative min-h-screen overflow-hidden py-24">
      <div className="absolute inset-0"><Starfield density={200} /></div>
      {/* shooting stars */}
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i}
          className="absolute h-0.5 w-32 rounded-full bg-gradient-to-r from-white to-transparent"
          style={{
            top: `${10 + i * 18}%`, left: "-10%",
            animation: `shoot ${6 + i}s linear ${i * 2}s infinite`,
            boxShadow: "0 0 20px white",
          }} />
      ))}
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.5em] text-white/60">Chapter VII</div>
        <h2 className="text-gradient-rose text-5xl font-light sm:text-6xl">Birthday Constellations</h2>
        <p className="mt-3 text-white/60">Two stars, written into the sky.</p>

        <div className="mt-16 grid gap-12 sm:grid-cols-2">
          <Constellation title="Flamobita" date="February 6" points={heart(160, 150, 7)} />
          <Constellation title="Snowy Owgy" date="August 1" points={heart(160, 150, 7)} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 8: Letter ---------- */
const LETTER = `My dearest Snowy Owgy,

If the night sky is just a page, then I have spent every star writing your name. I built this whole universe so you can wander through it and feel — even for a second — how impossibly lucky I am to know you.

You make the ordinary glow. You make silly things sacred. You laugh, and somewhere a galaxy decides to spin a little softer.

Tum pookiee ho. Tum barbiee ho. And in every life, every universe, every quiet little forever — I will still choose you.

Yours, across every orbit,
Flamobita ❤`;

function LetterSection() {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let i = 0;
        const id = setInterval(() => {
          i += 2; setShown(i);
          if (i >= LETTER.length) clearInterval(id);
        }, 22);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden py-24">
      <NebulaBlobs />
      {/* floating particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span key={i} className="animate-float-y absolute h-1.5 w-1.5 rounded-full bg-rose/70"
          style={{
            top: `${(i * 53) % 100}%`, left: `${(i * 29) % 100}%`,
            animationDelay: `${i * 0.4}s`,
            boxShadow: "0 0 12px oklch(0.85 0.2 340)",
          }} />
      ))}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.5em] text-white/60">Chapter VIII</div>
        <h2 className="text-gradient-rose text-5xl font-light sm:text-6xl">A Letter from Flamobita</h2>
      </div>
      <div className="relative z-10 mx-auto mt-12 max-w-2xl px-6">
        <div className="paper-texture rounded-3xl p-10 text-left text-stone-800 shadow-2xl"
          style={{ boxShadow: "0 0 100px oklch(0.75 0.20 340 / 0.4), 0 30px 60px oklch(0 0 0 / 0.5)", fontFamily: "var(--font-hand)" }}>
          <pre className="whitespace-pre-wrap text-xl leading-relaxed sm:text-2xl">
            {LETTER.slice(0, shown)}
            <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-stone-700 align-middle" />
          </pre>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 9: Final Ending ---------- */
function FinalEnding() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.4, 2.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.4]);
  return (
    <section ref={ref} className="relative min-h-[140vh] overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0">
        <Starfield density={300} />
      </motion.div>
      <NebulaBlobs />
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div style={{ opacity }} className="space-y-12">
          <motion.p
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 1.5 }}
            className="text-3xl font-light text-white/90 sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            Thank you for being part of my universe.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="text-gradient-rose text-6xl font-light sm:text-7xl">
            Flamobita ❤ Snowy Owgy
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 1.8, delay: 0.8 }}
            className="mx-auto max-w-xl text-lg italic text-white/70">
            No matter where life takes us,<br />this universe will always exist.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Master Component ---------- */
function OurUniverse() {
  const [entered, setEntered] = useState(false);
  const enter = () => {
    setEntered(true);
    setTimeout(() => {
      document.getElementById("universe")?.scrollIntoView({ behavior: "smooth" });
    }, 1200);
  };
  return (
    <div className="relative">
      <MusicPlayer />

      {/* Camera-zoom transition overlay */}
      <AnimatePresence>
        {entered && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 30, opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.7, 0, 0.3, 1] }}
            className="pointer-events-none fixed left-1/2 top-1/2 z-[60] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "var(--gradient-nebula)", boxShadow: "var(--shadow-glow-pink)" }}
          />
        )}
      </AnimatePresence>

      <WelcomePortal onEnter={enter} />
      <div id="universe"><UniverseSection /></div>
      <ChatGalaxy />
      <StickerKingdom />
      <MemoryVault />
      <WorldTour />
      <BirthdayConstellations />
      <LetterSection />
      <FinalEnding />
    </div>
  );
}
