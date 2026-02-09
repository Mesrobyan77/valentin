import { useEffect, useMemo, useRef, useState } from "react";

function App() {
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState("");
  const [noButtonPosition, setNoButtonPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [noButtonRotation, setNoButtonRotation] = useState(0);
  const [noButtonScale, setNoButtonScale] = useState(1);
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  const emojis = [
    "💖",
    "✨",
    "🌸",
    "🎀",
    "💫",
    "💋",
    "💛",
    "💚",
    "💘",
    "🥰",
    "💗",
    "💓",
    "💞",
    "💝",
    "🧸",
    "🎁",
    ,
    "🌺",
    "💎",
    "🌹",
    "💐",
    "🎈",
    "🩷",
    "🤍",
    "💌",
    "🌙",
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile(); // Check on mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const floatingHearts = useMemo(() => {
    return [...Array(isMobile ? 50 : 700)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
    }));
  }, []);

  const answeredHearts = useMemo(() => {
    return [...Array(isMobile ? 50 : 700)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 20 + Math.random() * 30,
      delay: Math.random() * 5,
      duration: 12 + Math.random() * 8,
    }));
  }, []);

  useEffect(() => {
    let raf = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!glowRef.current) return;
        glowRef.current.style.setProperty("--mx", `${e.clientX}px`);
        glowRef.current.style.setProperty("--my", `${e.clientY}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setYesButtonScale((prev) => (prev === 1 ? 1.15 : 1));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    const newConfetti = [...Array(400)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setConfetti(newConfetti);
  };

  const handleYesClick = () => {
    setAnswer("yes");
    setAnswered(true);
    triggerConfetti();
  };

  const handleNoHover = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const btnWidth = window.innerWidth < 540 ? 100 : 120;
    const btnHeight = window.innerWidth < 540 ? 50 : 60;
    const padding = 0;

    let newX = Math.random() * (rect.width - btnWidth - 2 * padding) - btnWidth;
    let newY =
      Math.random() * (rect.height - btnHeight - 2 * padding) - btnWidth;

    newX = Math.min(
      Math.max(padding, newX),
      window.innerWidth - btnWidth - padding
    );
    newY = Math.min(
      Math.max(padding, newY),
      window.innerHeight - btnHeight - padding
    );

    setNoButtonPosition({ x: newX, y: newY });
    setNoButtonRotation((prev) => prev + Math.random() * 180 - 90);
    setNoButtonScale(0.9 + Math.random() * 0.2);
  };

  const handleNoMouseMove = () => {
    if (Math.random() > 0.85) {
      handleNoHover();
    }
  };

  if (answered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex items-center justify-center p-4 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {answeredHearts.map((h) => (
            <span
              key={h.id}
              className="absolute animate-float-hearts"
              style={{
                left: `${h.left}%`,
                top: "110%",
                fontSize: `${Math.max(18, h.size)}px`,
                animationDelay: `${h.delay}s`,
                animationDuration: `${h.duration}s`,
              }}
            >
              {emojis[h.id % emojis.length]}
            </span>
          ))}
        </div>

        <div className="text-center z-10 w-full max-w-lg animate-scaleIn">
          <div className="bg-white/90 backdrop-blur-xl rounded-[40px] shadow-2xl p-8 sm:p-16 border-2 border-pink-200/50">
            <div className="mx-auto mb-6 flex items-center justify-center">
              <span className="animate-heartbeat text-[80px] sm:text-[128px]">
                💖
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent mb-4">
              Tenc el pti liner
            </h1>

            <p className="text-xl sm:text-2xl text-pink-600 font-bold mb-8 animate-bounce">
              Forever your DODO 💕
            </p>

            {answer === "yes" &&
              confetti.map((item) => (
                <div
                  key={item.id}
                  className="absolute w-3 h-3 animate-pulse"
                  style={{
                    left: `${item.x}%`,
                    top: `-10px`,
                    background: "#ff69b4",
                    animation: `fall ${5 + Math.random() * 5}s linear forwards`,
                    animationDelay: `${item.delay}s`,
                    borderRadius: "50%",
                    boxShadow: "0 0 10px currentColor",
                  }}
                />
              ))}

            <style>{`
              @keyframes fall {
                to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
              }
              @keyframes floatHearts {
                0% { transform: translateY(0); opacity: 0; }
                10% { opacity: 1; }
                100% { transform: translateY(-120vh) rotate(25deg); opacity: 0; }
              }
              .animate-float-hearts {
                animation-name: floatHearts;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
              }
            `}</style>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-red-100 flex items-center justify-center p-4 overflow-hidden relative">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          ["--mx" as any]: "50%",
          ["--my" as any]: "50%",
          zIndex: 5,
          background:
            "radial-gradient(360px circle at var(--mx) var(--my), rgba(255,255,255,0.7), rgba(255,255,255,0.2) 35%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Added overflow-hidden to prevent scrollbars */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {floatingHearts.map((h, i) => (
          <span
            key={h.id}
            className={`emoji absolute ${
              i % 2 === 0 ? "text-3xl" : "text-2xl"
            }`}
            style={{
              left: `${h.left}%`,
              top: `${h.top}%`,
              animationDuration: `${i % 2 === 0 ? 28 : 18}s`,
              animationDelay: i % 2 == 0 ? `${h.delay}s` : `${h.delay + 2}s`,
              animationName: i % 2 === 0 ? "float-right-down" : "float-left-up",
              animationIterationCount: "infinite",
              animationTimingFunction:
                i % 3 == 0
                  ? "steps(3, end)"
                  : "cubic-bezier(0.45, 0.05, 0.55, 0.45)",
            }}
          >
            {emojis[h.id % emojis.length]}
          </span>
        ))}
      </div>

      <div className="text-center z-10 w-full max-w-4xl px-2">
        <div
          ref={containerRef}
          className="bg-white/95 backdrop-blur-md rounded-[40px] shadow-2xl p-6 sm:p-12 md:p-16 border border-white/50"
        >
          <div className="flex justify-center gap-4 mb-6 text-4xl sm:text-5xl">
            <span className="animate-spin">✨</span>
            <span className="animate-heartbeat">💖</span>
            <span className="animate-spin">🌸</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 bg-clip-text text-transparent leading-tight">
            Will you be my valentine
          </h1>

          <p className="text-4xl sm:text-6xl font-black mb-8 text-pink-600 animate-pulse">
            DODO
          </p>

          <p className="text-lg sm:text-xl text-pink-500 italic mb-10">
            You make my heart skip a beat...
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative min-h-[100px] sm:min-h-[150px]">
            <button
              onClick={handleYesClick}
              className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-500 text-white px-10 py-4 sm:px-16 sm:py-6 rounded-full text-2xl sm:text-3xl font-black shadow-xl hover:scale-110 transition-transform z-20"
              style={{ transform: `scale(${yesButtonScale})` }}
            >
              Yes! ✨
            </button>

            <button
              onMouseEnter={handleNoHover}
              onMouseMove={handleNoMouseMove}
              onTouchStart={handleNoHover}
              onClick={handleNoHover}
              className={`w-full sm:w-auto bg-gray-400 text-white px-10 py-4 sm:px-16 sm:py-6 rounded-full text-2xl sm:text-3xl font-black shadow-lg transition-all duration-200 ${
                noButtonPosition
                  ? "fixed !w-[140px] !h-[60px] sm:!w-[180px] sm:!h-[80px] flex items-center justify-center p-0"
                  : "relative"
              }`}
              style={{
                left: noButtonPosition ? `${noButtonPosition.x}px` : "auto",
                top: noButtonPosition ? `${noButtonPosition.y}px` : "auto",
                transform: `rotate(${noButtonRotation}deg) scale(${noButtonScale})`,
                zIndex: 50,
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
