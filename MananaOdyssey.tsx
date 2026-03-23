import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Sun, 
  Moon, 
  Zap, 
  Trophy, 
  RotateCcw, 
  Play, 
  ChevronRight,
  Sparkles,
  Timer,
  Info,
  ArrowRight,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Constants ---

type TimeMode = 'MORNING' | 'TOMORROW';

interface Phrase {
  text: string;
  mode: TimeMode;
  explanation: string;
}

const PHRASES: Phrase[] = [
  { text: "Toda la mañana", mode: 'MORNING', explanation: "Ամբողջ առավոտը" },
  { text: "Hasta mañana", mode: 'TOMORROW', explanation: "Մինչ վաղը" },
  { text: "Esta mañana", mode: 'MORNING', explanation: "Այս առավոտ" },
  { text: "Mañana mismo", mode: 'TOMORROW', explanation: "Հենց վաղը" },
  { text: "De la mañana", mode: 'MORNING', explanation: "Առավոտյան (ժամի հետ)" },
  { text: "Mañana por la tarde", mode: 'TOMORROW', explanation: "Վաղը կեսօրից հետո" },
  { text: "Por la mañana", mode: 'MORNING', explanation: "Առավոտյան" },
  { text: "Pasado mañana", mode: 'TOMORROW', explanation: "Վաղը չէ մյուս օրը" },
  { text: "Mañana fría", mode: 'MORNING', explanation: "Ցուրտ առավոտ" },
  { text: "Mañana voy", mode: 'TOMORROW', explanation: "Վաղը կգնամ" },
  { text: "Mañana soleada", mode: 'MORNING', explanation: "Արևոտ առավոտ" },
  { text: "Mañana de lluvia", mode: 'MORNING', explanation: "Անձրևոտ առավոտ" },
  { text: "Mañana de fiesta", mode: 'TOMORROW', explanation: "Վաղը տոն է" },
  { text: "A las 10 de la mañana", mode: 'MORNING', explanation: "Առավոտյան ժամը 10-ին" },
  { text: "Mañana temprano", mode: 'TOMORROW', explanation: "Վաղը շուտ" },
  { text: "Mañana es lunes", mode: 'TOMORROW', explanation: "Վաղը երկուշաբթի է" },
];

// --- Components ---

export default function MananaOdysseyApp() {
  const [view, setView] = useState<'intro' | 'game' | 'result'>('intro');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [mode, setMode] = useState<TimeMode>('MORNING');
  const [gameSpeed, setGameSpeed] = useState(1);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const spawnPhrase = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * PHRASES.length);
    setCurrentPhrase(PHRASES[randomIndex]);
    setFeedback(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameSpeed(1);
    spawnPhrase();
    setView('game');
  };

  const checkCollision = useCallback((selectedMode: TimeMode) => {
    if (!currentPhrase || feedback) return;

    const isCorrect = selectedMode === currentPhrase.mode;
    
    if (isCorrect) {
      setScore(s => s + 10 * level);
      setFeedback({ correct: true, explanation: currentPhrase.explanation });
      if (score > 0 && score % 50 === 0) {
        setLevel(l => l + 1);
        setGameSpeed(s => s + 0.2);
      }
      setTimeout(() => {
        spawnPhrase();
      }, 600);
    } else {
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setTimeout(() => setView('result'), 1500);
        }
        return newLives;
      });
      setFeedback({ correct: false, explanation: currentPhrase.explanation });
      setTimeout(() => {
        spawnPhrase();
      }, 1500);
    }
  }, [currentPhrase, feedback, level, score, spawnPhrase]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== 'game') return;
      if (e.key === 'ArrowLeft') setMode('MORNING');
      if (e.key === 'ArrowRight') setMode('TOMORROW');
      if (e.key === ' ') checkCollision(mode);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, mode, checkCollision]);

  return (
    <div className={`min-h-screen transition-colors duration-700 font-['Inter'] overflow-y-auto
      ${mode === 'MORNING' ? 'bg-[#FFF9E6]' : 'bg-[#0A0E1A] text-white'}`}>
      
      {/* Atmospheric Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          {mode === 'MORNING' ? (
            <motion.div 
              key="morning-bg"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-orange-100/50 to-transparent"
            />
          ) : (
            <motion.div 
              key="night-bg"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-transparent"
            />
          )}
        </AnimatePresence>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${mode === 'MORNING' ? 'bg-orange-400' : 'bg-blue-400'}`}
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl shadow-xl transition-all duration-500
            ${mode === 'MORNING' ? 'bg-orange-500 text-white' : 'bg-indigo-600 text-white'}`}>
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">MAÑANA ODYSSEY</h1>
            <p className={`text-[10px] font-bold tracking-[0.2em] uppercase opacity-60
              ${mode === 'MORNING' ? 'text-orange-900' : 'text-blue-200'}`}>
              The Time Traveler's Journey
            </p>
          </div>
        </div>

        {view === 'game' && (
          <div className="flex items-center gap-8">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`w-6 h-6 transition-all duration-300
                  ${i < lives ? 'fill-red-500 text-red-500' : 'text-gray-400 opacity-30'}`} />
              ))}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">SCORE</p>
              <p className="text-3xl font-black tabular-nums">{score}</p>
            </div>
            <div className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest
              ${mode === 'MORNING' ? 'bg-orange-200 text-orange-900' : 'bg-indigo-900 text-indigo-100'}`}>
              LVL {level}
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-5xl mx-auto p-8 pb-32 min-h-[80vh] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {view === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-12"
            >
              <div className="space-y-6">
                <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="inline-block p-8 bg-white/20 backdrop-blur-3xl rounded-[48px] shadow-2xl border border-white/30"
                >
                  <Sun className="w-20 h-20 text-orange-500" />
                </motion.div>
                <h2 className="text-7xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
                  ԺԱՄԱՆԱԿԻ <br/>ՈԴԻՍԱԿԱՆ
                </h2>
                <p className="text-xl font-medium max-w-xl mx-auto opacity-80 leading-relaxed">
                  Դու ժամանակի ճամփորդ ես: Քո աշխարհը փոխվում է կախված նրանից, թե ինչպես ես հասկանում <span className="font-black italic">Mañana</span> բառը:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="p-8 bg-white/40 backdrop-blur-md rounded-[32px] border border-white/50 shadow-lg text-left">
                  <Sun className="w-8 h-8 text-orange-500 mb-4" />
                  <h3 className="font-black uppercase text-sm mb-2 text-orange-900">Morning Mode</h3>
                  <p className="text-sm opacity-70">Ընտրիր սա, երբ Mañana-ն նշանակում է «Առավոտ»:</p>
                </div>
                <div className="p-8 bg-indigo-900/20 backdrop-blur-md rounded-[32px] border border-white/10 shadow-lg text-left">
                  <Moon className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="font-black uppercase text-sm mb-2 text-blue-200">Tomorrow Mode</h3>
                  <p className="text-sm opacity-70">Ընտրիր սա, երբ Mañana-ն նշանակում է «Վաղը»:</p>
                </div>
              </div>

              <button 
                onClick={startGame}
                className="group relative px-16 py-8 bg-black text-white rounded-[40px] font-black uppercase tracking-widest text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-4">
                  ՍԿՍԵԼ ՃԱՄՓՈՐԴՈՒԹՅՈՒՆԸ <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
            </motion.div>
          )}

          {view === 'game' && currentPhrase && (
            <motion.div 
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-4xl space-y-16"
            >
              {/* Central Phrase Display */}
              <div className="relative flex flex-col items-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentPhrase.text}
                    initial={{ y: 100, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -100, opacity: 0, scale: 1.2 }}
                    className={`
                      p-12 md:p-20 rounded-[64px] text-center shadow-2xl border-4 min-w-[300px] md:min-w-[600px]
                      ${feedback 
                        ? (feedback.correct ? 'bg-green-500 border-white text-white' : 'bg-red-500 border-white text-white') 
                        : (mode === 'MORNING' ? 'bg-white border-orange-200 text-orange-950' : 'bg-indigo-900/50 border-indigo-500 text-white')}
                      transition-colors duration-300
                    `}
                  >
                    <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
                      {currentPhrase.text}
                    </h2>
                    
                    {feedback && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/20 backdrop-blur-md p-4 rounded-2xl inline-block"
                      >
                        <p className="font-bold uppercase text-sm tracking-widest">
                          {feedback.explanation}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Mode Indicator */}
                <div className="absolute -top-12 flex gap-4">
                  <motion.div 
                    animate={mode === 'MORNING' ? { scale: 1.2, y: -10 } : { scale: 1, y: 0 }}
                    className={`p-4 rounded-full shadow-lg ${mode === 'MORNING' ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-400'}`}
                  >
                    <Sun className="w-8 h-8" />
                  </motion.div>
                  <motion.div 
                    animate={mode === 'TOMORROW' ? { scale: 1.2, y: -10 } : { scale: 1, y: 0 }}
                    className={`p-4 rounded-full shadow-lg ${mode === 'TOMORROW' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-400'}`}
                  >
                    <Moon className="w-8 h-8" />
                  </motion.div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-8">
                <div className="flex gap-6 w-full max-w-2xl">
                  <button 
                    onClick={() => setMode('MORNING')}
                    className={`flex-1 p-8 rounded-[40px] border-4 transition-all flex flex-col items-center gap-2
                      ${mode === 'MORNING' 
                        ? 'bg-orange-500 border-white text-white scale-105 shadow-2xl' 
                        : 'bg-white/10 border-transparent text-gray-400 hover:bg-white/20'}`}
                  >
                    <Sun className="w-10 h-10" />
                    <span className="font-black uppercase tracking-tighter text-xl">ԱՌԱՎՈՏ</span>
                    <span className="text-[10px] font-bold opacity-60">LA MAÑANA</span>
                  </button>

                  <button 
                    onClick={() => setMode('TOMORROW')}
                    className={`flex-1 p-8 rounded-[40px] border-4 transition-all flex flex-col items-center gap-2
                      ${mode === 'TOMORROW' 
                        ? 'bg-indigo-600 border-white text-white scale-105 shadow-2xl' 
                        : 'bg-white/10 border-transparent text-gray-400 hover:bg-white/20'}`}
                  >
                    <Moon className="w-10 h-10" />
                    <span className="font-black uppercase tracking-tighter text-xl">ՎԱՂԸ</span>
                    <span className="text-[10px] font-bold opacity-60">MAÑANA</span>
                  </button>
                </div>

                <button 
                  onClick={() => checkCollision(mode)}
                  disabled={!!feedback}
                  className={`
                    w-full max-w-md p-8 rounded-[40px] font-black uppercase tracking-[0.3em] text-2xl shadow-2xl transition-all
                    ${mode === 'MORNING' ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-indigo-500 text-white hover:bg-indigo-400'}
                    active:scale-95 disabled:opacity-50
                  `}
                >
                  ԹՌԻՉՔ! (SPACE)
                </button>
              </div>
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12"
            >
              <div className="relative inline-block">
                <div className={`p-16 rounded-[64px] transition-colors duration-500
                  ${mode === 'MORNING' ? 'bg-orange-500' : 'bg-indigo-600'}`}>
                  <Trophy className="w-32 h-32 text-white mx-auto" />
                </div>
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-6 -right-6 bg-yellow-400 text-black p-6 rounded-3xl font-black text-3xl shadow-xl"
                >
                  {score}
                </motion.div>
              </div>

              <div className="space-y-4">
                <h3 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
                  ՃԱՄՓՈՐԴՈՒԹՅՈՒՆՆ <br/>ԱՎԱՐՏՎԵՑ
                </h3>
                <p className="text-xl opacity-60 font-bold uppercase tracking-widest">
                  HIGH SCORE: {highScore}
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <button 
                  onClick={startGame}
                  className="px-12 py-6 bg-black text-white rounded-[32px] font-black uppercase tracking-widest text-xl flex items-center justify-center gap-3 hover:scale-105 transition-all"
                >
                  <RotateCcw className="w-6 h-6" /> ԿՐԿՆԵԼ
                </button>
                <button 
                  onClick={() => setView('intro')}
                  className="px-12 py-6 bg-white/20 backdrop-blur-md rounded-[32px] font-black uppercase tracking-widest text-xl border border-white/30 hover:bg-white/30 transition-all"
                >
                  ՄԵՆՅՈՒ
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Visual Mode Switcher Hint */}
      {view === 'game' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-40">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-black/20 rounded border border-white/20 text-[10px]">←</kbd>
            <span className="text-[10px] font-bold uppercase tracking-widest">Morning</span>
          </div>
          <div className="w-8 h-[1px] bg-current" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest">Tomorrow</span>
            <kbd className="px-2 py-1 bg-black/20 rounded border border-white/20 text-[10px]">→</kbd>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        html, body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
