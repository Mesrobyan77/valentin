import { useState, useEffect } from "react";
import { Heart, Sparkles, Star } from "lucide-react";

function App() {
  const [answered, setAnswered] = useState(false);
  const [answerNo, setAnswerNo] = useState(false);
  const [answer, setAnswer] = useState("");
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noButtonRotation, setNoButtonRotation] = useState(0);
  const [noButtonScale, setNoButtonScale] = useState(1);
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
    setAnswerNo(true);
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

  const handleNoClick = () => {
    setAnswer("no");
    setAnswerNo(true);
  };

  const calculateEscapeVector = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const containerWidth = Math.min(768, window.innerWidth - 64);
    const containerHeight = Math.min(500, window.innerHeight - 200);
    const containerLeft = centerX - containerWidth / 2;
    const containerTop = centerY - containerHeight / 2;
    const containerRight = containerLeft + containerWidth;
    const containerBottom = containerTop + containerHeight;

    const dx = centerX - mousePos.x;
    const dy = centerY - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 250) {
      const angle = Math.atan2(dy, dx);
      const escapeDistance = 150 + Math.random() * 100;

      const newX = centerX + Math.cos(angle) * escapeDistance;
      const newY = centerY + Math.sin(angle) * escapeDistance;

      return {
        x: Math.max(containerLeft, Math.min(containerRight - 140, newX)),
        y: Math.max(containerTop, Math.min(containerBottom - 80, newY)),
      };
    }

    return {
      x: containerLeft + Math.random() * (containerWidth - 140),
      y: containerTop + Math.random() * (containerHeight - 80),
    };
  };

  const handleNoHover = () => {
    const newPos = calculateEscapeVector();
    setNoButtonPosition(newPos);
    setNoButtonRotation((prev) => prev + (Math.random() * 180 - 90));
    setNoButtonScale(0.95 + Math.random() * 0.15);

    if (Math.random() > 0.7) {
      setTimeout(() => {
        const escapePos = calculateEscapeVector();
        setNoButtonPosition(escapePos);
        setNoButtonRotation((prev) => prev + 360);
      }, 100);
    }
  };

  const handleNoMouseMove = () => {
    if (Math.random() > 0.85) {
      handleNoHover();
    }
  };

  if (answered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-red-100 flex items-center justify-center overflow-hidden relative">
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

        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute animate-float">
              {i % 3 === 0 ? (
                <Heart
                  className="text-pink-300"
                  style={{
                    width: `${20 + Math.random() * 40}px`,
                    height: "auto",
                    opacity: 0.4,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${8 + Math.random() * 4}s`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ) : i % 3 === 1 ? (
                <Sparkles
                  className="text-yellow-300"
                  style={{
                    width: `${15 + Math.random() * 30}px`,
                    height: "auto",
                    opacity: 0.3,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${6 + Math.random() * 4}s`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ) : (
                <Star
                  className="text-purple-200"
                  style={{
                    width: `${15 + Math.random() * 30}px`,
                    height: "auto",
                    opacity: 0.3,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${7 + Math.random() * 4}s`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <style>{`@keyframes fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`}</style>

        <div className="text-center z-10 animate-scaleIn">
          <div className="bg-gradient-to-br from-white/95 to-pink-50/95 backdrop-blur-xl rounded-[40px] shadow-2xl p-16 max-w-2xl border-2 border-pink-200/50">
            <div className="mb-8 inline-block relative">
              <Heart className="w-32 h-32 text-red-500 mx-auto animate-heartbeat filter drop-shadow-lg" />
              <Sparkles
                className="absolute top-0 right-0 w-12 h-12 text-yellow-400 animate-spin"
                style={{ animationDuration: "3s" }}
              />
              <Sparkles
                className="absolute bottom-0 left-0 w-12 h-12 text-pink-400 animate-spin"
                style={{ animationDuration: "4s" }}
              />
            </div>

            <h1
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 bg-clip-text text-transparent mb-4 animate-slideDown"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Tenc el pti liner
            </h1>

            <p
              className="text-2xl text-pink-600 font-semibold mb-8 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            >
              Forever your DODO
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              {["💕", "✨", "🌹", "💖", "🎀", "✨"].map((emoji, i) => (
                <span
                  key={i}
                  className="text-4xl animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (answerNo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-red-100 flex items-center justify-center overflow-hidden relative">
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

        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute animate-float">
              {i % 3 === 0 ? (
                <Heart
                  className="text-pink-300"
                  style={{
                    width: `${20 + Math.random() * 40}px`,
                    height: "auto",
                    opacity: 0.4,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${8 + Math.random() * 4}s`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ) : i % 3 === 1 ? (
                <Sparkles
                  className="text-yellow-300"
                  style={{
                    width: `${15 + Math.random() * 30}px`,
                    height: "auto",
                    opacity: 0.3,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${6 + Math.random() * 4}s`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ) : (
                <Star
                  className="text-purple-200"
                  style={{
                    width: `${15 + Math.random() * 30}px`,
                    height: "auto",
                    opacity: 0.3,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${7 + Math.random() * 4}s`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <style>{`@keyframes fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`}</style>

        <div className="text-center z-10 animate-scaleIn">
          <div className="bg-gradient-to-br from-white/95 to-pink-50/95 backdrop-blur-xl rounded-[40px] shadow-2xl p-16 max-w-2xl border-2 border-pink-200/50">
            <div className="mb-8 inline-block relative">
              <Heart className="w-32 h-32 text-red-500 mx-auto animate-heartbeat filter drop-shadow-lg" />
              <Sparkles
                className="absolute top-0 right-0 w-12 h-12 text-yellow-400 animate-spin"
                style={{ animationDuration: "3s" }}
              />
              <Sparkles
                className="absolute bottom-0 left-0 w-12 h-12 text-pink-400 animate-spin"
                style={{ animationDuration: "4s" }}
              />
            </div>

            <h1
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 bg-clip-text text-transparent mb-4 animate-slideDown"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Vat es AXJIK Jannnnnnn
            </h1>

            <div className="flex justify-center gap-4 flex-wrap">
              {["💕", "✨", "🌹", "💖", "🎀", "✨"].map((emoji, i) => (
                <span
                  key={i}
                  className="text-4xl animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-red-100 flex items-center justify-center overflow-hidden relative">
      <style>{`
        @keyframes shimmer {
          0%, 100% {
            opacity: 0.4;
            filter: brightness(1);
          }
          50% {
            opacity: 0.8;
            filter: brightness(1.3);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-40px) translateX(15px) rotate(8deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-80px) translateX(0px) rotate(-5deg);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-40px) translateX(-15px) rotate(8deg);
            opacity: 0.5;
          }
        }
        .animate-float { animation: float 8s ease-in-out infinite !important; }
        .shimmer { animation: shimmer 2.5s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => {
          const icons = [
            <Heart
              key="h"
              className="text-pink-300"
              style={{
                width: `${20 + Math.random() * 45}px`,
                height: "auto",
                opacity: 0.35,
              }}
            />,
            <Sparkles
              key="s"
              className="text-yellow-300"
              style={{
                width: `${18 + Math.random() * 35}px`,
                height: "auto",
                opacity: 0.3,
              }}
            />,
            <Star
              key="st"
              className="text-purple-200"
              style={{
                width: `${16 + Math.random() * 35}px`,
                height: "auto",
                opacity: 0.28,
              }}
            />,
          ];

          return (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${8 + Math.random() * 8}s`,
                filter: "drop-shadow(0 0 15px rgba(255, 182, 193, 0.4))",
              }}
            >
              {icons[i % 3]}
            </div>
          );
        })}
      </div>

      <div
        className="absolute top-10 right-10 text-6xl animate-bounce opacity-70"
        style={{ animationDelay: "0s" }}
      >
        ✨
      </div>
      <div
        className="absolute bottom-20 left-10 text-5xl animate-bounce opacity-70"
        style={{ animationDelay: "0.5s" }}
      >
        🌹
      </div>
      <div
        className="absolute top-1/3 left-20 text-4xl animate-bounce opacity-70"
        style={{ animationDelay: "0.2s" }}
      >
        💖
      </div>
      <div
        className="absolute bottom-1/4 right-20 text-5xl animate-bounce opacity-70"
        style={{ animationDelay: "0.7s" }}
      >
        ✨
      </div>

      <div className="text-center z-10 px-4">
        <div className="bg-gradient-to-br from-white/95 to-pink-50/95 backdrop-blur-xl rounded-[40px] shadow-2xl p-16 max-w-3xl border-2 border-pink-200/50 animate-fadeIn">
          <div className="mb-12 flex justify-center gap-4">
            <Sparkles
              className="w-14 h-14 text-yellow-400 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <Heart className="w-16 h-16 text-red-500 animate-heartbeat" />
            <Sparkles
              className="w-14 h-14 text-pink-400 animate-spin"
              style={{ animationDuration: "4s" }}
            />
          </div>

          <h1
            className="text-6xl md:text-7xl font-black mb-4 animate-slideDown bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 bg-clip-text text-transparent"
            style={{ fontFamily: "Georgia, serif", letterSpacing: "0.05em" }}
          >
            Will you be my valentine
          </h1>

          <p className="text-5xl md:text-6xl font-black mb-12 text-transparent bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text animate-pulse">
            DODO
          </p>

          <p className="text-xl text-pink-600 font-semibold mb-12 italic">
            You make my heart skip a beat...
          </p>

          <div className="flex gap-8 justify-between items-center relative mb-8">
            <button
              onClick={handleYesClick}
              className="relative bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 text-white px-16 py-6 rounded-full text-3xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 border-2 border-pink-300 group overflow-hidden"
              style={{
                transform: `scale(${yesButtonScale})`,
                transition: "transform 0.3s ease",
                filter: "drop-shadow(0 0 15px rgba(236, 72, 153, 0.5))",
                marginLeft: "100px",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Yes
                <Sparkles className="w-6 h-6" />
              </span>
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </button>

            <button
              onMouseEnter={handleNoHover}
              onMouseMove={handleNoMouseMove}
              onTouchStart={handleNoHover}
              onClick={handleNoClick}
              disabled={answerNo}
              className="bg-gradient-to-r disabled from-gray-400 to-gray-500 text-white px-16 py-6 rounded-full text-3xl font-black shadow-lg transition-all duration-150 fixed hover:from-gray-500 hover:to-gray-600"
              style={{
                left: `${noButtonPosition.x || 450}px`,
                top: `${noButtonPosition.y || 520}px`,
                transform: `rotate(${noButtonRotation}deg) scale(${noButtonScale})`,
                filter: `drop-shadow(0 0 ${
                  10 +
                  Math.abs(Math.sin((noButtonRotation * Math.PI) / 180)) * 10
                }px rgba(100, 100, 100, 0.6))`,
                cursor: "pointer",
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
