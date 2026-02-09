import React from "react";

interface KnowProps {
  answer: string;
  confetti: Array<{ id: number; x: number; y: number; delay: number }>;
  answeredHearts: Array<{
    id: number;
    left: number;
    size: number;
    delay: number;
    duration: number;
  }>;
  isMobile: boolean;
  emojis: string[];
}
function Know({
  answer,
  confetti,
  answeredHearts,
  isMobile,
  emojis,
}: KnowProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-lavender-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background floating subtle sparkles + tiny hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {answeredHearts.map((h) => (
          <span
            key={h.id}
            className="absolute text-3xl sm:text-5xl opacity-40 animate-float-slow"
            style={{
              left: `${h.left}%`,
              top: "100%",
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.duration * 1.6}s`,
            }}
          >
            {emojis[h.id % emojis.length]}
          </span>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {answeredHearts.map((h) => (
          <span
            key={h.id}
            className="absolute text-2xl sm:text-4xl md:text-5xl opacity-30 sm:opacity-40 text-pink-200/80 animate-petal-drop"
            style={
              {
                left: `${h.left}%`,
                top: "-10%",
                animationDelay: `${h.delay}s`,
                animationDuration: `${h.duration * 1.6}s`,
                "--wobble": `${Math.random() * 20}deg`, // Gentle rotate
              } as React.CSSProperties
            }
          >
            {emojis[h.id % emojis.length] || "🌸💕"}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes petal-drop {
          0% {
            transform: translateY(-20vh) translateX(0) rotate(0deg) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(40vh) translateX(var(--drift-x)) rotate(10deg)
              scale(1);
          }
          100% {
            transform: translateY(120vh) translateX(var(--drift-x, 0))
              rotate(var(--wobble, 20deg)) scale(0.8);
            opacity: 0;
          }
        }
        .animate-petal-drop {
          animation: petal-drop ease-out infinite;
        }
      `}</style>
      <div className="relative z-10 text-center max-w-md sm:max-w-xl">
        <div className="bg-white/40 backdrop-blur-2xl rounded-3xl sm:rounded-[3rem] p-10 sm:p-16 shadow-[0_8px_32px_rgba(255,182,193,0.4)] border border-white/50">
          <div className="mb-8">
            <span className="text-8xl sm:text-[12rem] animate-gentle-pulse">
              💗
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400 mb-4">
            Tenc el pti liner
          </h1>

          <p className="text-2xl sm:text-3xl font-medium text-pink-600/90">
            Forever your DODO 🌸💫
          </p>
        </div>
      </div>

      <style>{`
    @keyframes float-slow {
      0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
      15%  { opacity: 0.7; }
      100% { transform: translateY(-140vh) translateX(30px) rotate(20deg); opacity: 0; }
    }
    .animate-float-slow { animation: float-slow linear infinite; }

    @keyframes gentle-pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(1.12); }
    }
    .animate-gentle-pulse { animation: gentle-pulse 4s ease-in-out infinite; }
  `}</style>
    </div>
  );
}

export default Know;
