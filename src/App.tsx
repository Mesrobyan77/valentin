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

  // track mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // yes button pulse
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

  // calculate button position responsively
  const calculateEscapeVector = () => {
    const padding = 16; // padding from edges
    const btnWidth = 120; // responsive approximate width
    const btnHeight = 60; // responsive approximate height

    const containerLeft = padding;
    const containerTop = padding;
    const containerRight = window.innerWidth - padding - btnWidth;
    const containerBottom = window.innerHeight - padding - btnHeight;

    const dx = window.innerWidth / 2 - mousePos.x;
    const dy = window.innerHeight / 2 - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 250) {
      const angle = Math.atan2(dy, dx);
      const escapeDistance = 100 + Math.random() * 100;

      const newX = window.innerWidth / 2 + Math.cos(angle) * escapeDistance;
      const newY = window.innerHeight / 2 + Math.sin(angle) * escapeDistance;

      return {
        x: Math.max(containerLeft, Math.min(containerRight, newX)),
        y: Math.max(containerTop, Math.min(containerBottom, newY)),
      };
    }

    return {
      x: containerLeft + Math.random() * (containerRight - containerLeft),
      y: containerTop + Math.random() * (containerBottom - containerTop),
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

  // ================= ANSWER SCREEN =================
  if (answered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-red-100 flex items-center justify-center overflow-hidden relative">
        {answer === "yes" &&
          confetti.map((item) => (
            <div
              key={item.id}
              className="absolute w-3 h-3 animate-pulse rounded-full"
              style={{
                left: `${item.x}%`,
                top: `-10px`,
                background: ["#ff69b4", "#ff1493", "#ffc0cb", "#ffb6d9"][
                  Math.floor(Math.random() * 4)
                ],
                animation: `fall ${2 + Math.random() * 2}s linear forwards`,
                animationDelay: `${item.delay}s`,
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
          <div className="bg-gradient-to-br from-white/95 to-pink-50/95 backdrop-blur-xl rounded-[40px] shadow-2xl p-8 md:p-16 max-w-2xl border-2 border-pink-200/50">
            <Heart className="w-24 md:w-32 h-auto text-red-500 mx-auto animate-heartbeat filter drop-shadow-lg mb-4" />
            <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 bg-clip-text text-transparent mb-4">
              Tenc el pti liner
            </h1>
            <p className="text-xl md:text-2xl text-pink-600 font-semibold mb-4">
              Forever your DODO
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (answerNo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-red-100 flex items-center justify-center overflow-hidden relative">
        <h1 className="text-3xl md:text-5xl font-black text-pink-600">
          Vat es AXJIK Jannnnnnn
        </h1>
      </div>
    );
  }

  // ================= MAIN SCREEN =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-red-100 flex items-center justify-center overflow-hidden relative">
      <style>{`
        @keyframes float {0%,100%{transform:translateY(0);}25%{transform:translateY(-40px) translateX(15px);}50%{transform:translateY(-80px) translateX(0);}75%{transform:translateY(-40px) translateX(-15px);}}
        .animate-float {animation: float 8s ease-in-out infinite !important;}
      `}</style>

      {/* floating hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => {
          const icons = [
            <Heart key="h" className="text-pink-300" style={{ width: `${20 + Math.random() * 45}px`, opacity: 0.35 }} />,
            <Sparkles key="s" className="text-yellow-300" style={{ width: `${18 + Math.random() * 35}px`, opacity: 0.3 }} />,
            <Star key="st" className="text-purple-200" style={{ width: `${16 + Math.random() * 35}px`, opacity: 0.28 }} />,
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
              }}
            >
              {icons[i % 3]}
            </div>
          );
        })}
      </div>

      <div className="text-center z-10 px-4">
        <div className="bg-gradient-to-br from-white/95 to-pink-50/95 backdrop-blur-xl rounded-[40px] shadow-2xl p-8 md:p-16 max-w-3xl border-2 border-pink-200/50 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-black mb-12 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            Will you be my valentine
          </h1>

          <div className="flex gap-8 justify-center mb-8 flex-wrap">
            <button
              onClick={handleYesClick}
              className="bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 text-white px-8 md:px-16 py-4 md:py-6 rounded-full text-2xl md:text-3xl font-black shadow-2xl transition-all duration-300 hover:from-red-600 hover:via-pink-600 hover:to-rose-600"
              style={{
                transform: `scale(${yesButtonScale})`,
              }}
            >
              Yes
            </button>

            <button
              onMouseEnter={handleNoHover}
              onMouseMove={handleNoMouseMove}
              onTouchStart={handleNoHover}
              onClick={handleNoClick}
              disabled={answerNo}
              className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 md:px-12 py-3 md:py-6 rounded-full text-xl md:text-2xl font-black shadow-lg transition-all duration-150 fixed hover:from-gray-500 hover:to-gray-600"
              style={{
                left: `${(noButtonPosition.x / window.innerWidth) * 100}vw`,
                top: `${(noButtonPosition.y / window.innerHeight) * 100}vh`,
                transform: `rotate(${noButtonRotation}deg) scale(${noButtonScale})`,
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