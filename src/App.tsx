import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, Sparkles, Star } from "lucide-react";

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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  const floatingHearts = useMemo(() => {
    return [...Array( 50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
    }));
  }, []);

  const answeredHearts = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 20 + Math.random() * 30,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    }));
  }, []);

  useEffect(() => {
    let raf = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      // update the glow smoothly without re-rendering
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

  const handleYesClick = () => {
    setAnswer("yes");
    setAnswered(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const newConfetti = [...Array(40)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setConfetti(newConfetti);
  };

  const handleNoHover = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // small screens: smaller button math
    const btnWidth = window.innerWidth < 640 ? 100 : 120;
    const btnHeight = window.innerWidth < 640 ? 50 : 60;
    const padding = 20;

    // random inside the card rect (in viewport px)
    let newX =
      Math.random() * (rect.width - btnWidth - 2 * padding) +
      rect.left +
      padding;
    let newY =
      Math.random() * (rect.height - btnHeight - 2 * padding) +
      rect.top +
      padding;

    // clamp to screen
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
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {answeredHearts.map((h) => (
            <Heart
              key={h.id}
              className="absolute text-pink-300/40 animate-float-hearts"
              style={{
                left: `${h.left}%`,
                top: "110%",
                width: `${h.size}px`,
                animationDelay: `${h.delay}s`,
                animationDuration: `${h.duration}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center z-10 w-full max-w-lg animate-scaleIn">
          <div className="bg-white/90 backdrop-blur-xl rounded-[30px] sm:rounded-[40px] shadow-2xl p-8 sm:p-16 border-2 border-pink-200/50">
            <Heart className="w-20 h-20 sm:w-32 sm:h-32 text-red-500 mx-auto animate-heartbeat mb-6" />
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
                    background: [
                      "#ff69b4",
                      "#ff1493",
                      "#ffc0cb",
                      "#ffb6d9",
                      "#ff69b4",
                    ][Math.floor(Math.random() * 5)],
                    animation: `fall ${2 + Math.random() * 2}s linear forwards`,
                    animationDelay: `${item.delay}s`,
                    borderRadius: "50%",
                    boxShadow: "0 0 10px currentColor",
                  }}
                />
              ))}

            <style>{`@keyframes fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`}</style>
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

      {/* ✅ NEW: mouse-follow glow layer (no rerender needed) */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          // defaults until first mouse move
          ["--mx" as any]: "50%",
          ["--my" as any]: "50%",
          background:
            "radial-gradient(220px circle at var(--mx) var(--my), rgba(255, 255, 255, 0.35), transparent 65%)",
        }}
      />

      {/* Floating Icons (stable positions) */}

      <div className="absolute top-10 right-10 text-6xl animate-bounce opacity-70" style={{animationDelay: '0s'}}>✨</div>
      <div className="absolute bottom-20 left-10 text-5xl animate-bounce opacity-70" style={{animationDelay: '0.5s'}}>🌹</div>
      <div className="absolute top-1/3 left-20 text-4xl animate-bounce opacity-70" style={{animationDelay: '0.2s'}}>💖</div>
      <div className="absolute bottom-1/4 right-20 text-5xl animate-bounce opacity-70" style={{animationDelay: '0.7s'}}>✨</div>
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {floatingHearts.map((h) => {
          return (
            <Heart
              key={h.id}
              className="absolute animate-float"
              style={{
                left: `${h.left}%`,
                top: `${h.top}%`,
                animationDelay: `${5}s`,
              }}
              size={24 + Math.random() * 8 + 24}
            />
          );
        })}
      </div>

      <div className="text-center z-10 w-full max-w-4xl px-2">
        <div
          ref={containerRef}
          className="bg-white/95 backdrop-blur-md rounded-[30px] sm:rounded-[40px] shadow-2xl p-6 sm:p-12 md:p-16 border border-white/50"
        >
          <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-10">
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400 animate-spin" />
            <Heart className="w-10 h-10 sm:w-14 sm:h-14 text-red-500 animate-heartbeat" />
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-pink-400 animate-spin" />
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
