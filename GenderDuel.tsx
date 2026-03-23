import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Zap, 
  Trophy, 
  RotateCcw, 
  Play, 
  Flame,
  Target,
  Sword,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Data ---

interface Noun {
  word: string;
  gender: 'EL' | 'LA';
  translation: string;
  isTricky?: boolean;
}

const NOUNS: Noun[] = [
  { word: "Libro", gender: 'EL', translation: "Գիրք" },
  { word: "Mesa", gender: 'LA', translation: "Սեղան" },
  { word: "Mano", gender: 'LA', translation: "Ձեռք", isTricky: true },
  { word: "Mapa", gender: 'EL', translation: "Քարտեզ", isTricky: true },
  { word: "Radio", gender: 'LA', translation: "Ռադիո", isTricky: true },
  { word: "Día", gender: 'EL', translation: "Օր", isTricky: true },
  { word: "Foto", gender: 'LA', translation: "Լուսանկար", isTricky: true },
  { word: "Sofá", gender: 'EL', translation: "Բազմոց", isTricky: true },
  { word: "Flor", gender: 'LA', translation: "Ծաղիկ" },
  { word: "Coche", gender: 'EL', translation: "Մեքենա" },
  { word: "Casa", gender: 'LA', translation: "Տուն" },
  { word: "Sol", gender: 'EL', translation: "Արև" },
  { word: "Luna", gender: 'LA', translation: "Լուսին" },
  { word: "Idioma", gender: 'EL', translation: "Լեզու", isTricky: true },
  { word: "Ciudad", gender: 'LA', translation: "Քաղաք" },
  { word: "Planeta", gender: 'EL', translation: "Մոլորակ", isTricky: true },
  { word: "Noche", gender: 'LA', translation: "Գիշեր" },
  { word: "Clima", gender: 'EL', translation: "Կլիմա", isTricky: true },
  { word: "Leche", gender: 'LA', translation: "Կաթ" },
];

// --- Components ---

export default function GenderDuel() {
  const [view, setView] = useState<'intro' | 'game' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shuffledNouns, setShuffledNouns] = useState<Noun[]>([]);

  const initGame = useCallback(() => {
    const shuffled = [...NOUNS].sort(() => Math.random() - 0.5);
    setShuffledNouns(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setFeedback(null);
  }, []);

  const handleChoice = (choice: 'EL' | 'LA') => {
    if (feedback) return;

    const current = shuffledNouns[currentIndex];
    const isCorrect = choice === current.gender;

    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 10 + (streak * 2));
      setStreak(s => {
        const newStreak = s + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
    } else {
      setFeedback('wrong');
      setStreak(0);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < shuffledNouns.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setView('result');
      }
    }, 800);
  };

  useEffect(() => {
    if (view === 'game') initGame();
  }, [view, initGame]);

  const currentNoun = shuffledNouns[currentIndex];

  return (
    <div className="min-h-screen bg-sky-500 text-white font-['Inter'] overflow-hidden selection:bg-green-500 selection:text-white">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <main className="relative z-10 max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {view === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="text-center space-y-12"
            >
              <div className="space-y-4">
                <motion.div 
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="inline-block bg-yellow-400 p-6 rounded-full shadow-[0_0_50px_rgba(250,204,21,0.5)]"
                >
                  <Sword className="w-16 h-16 text-black" />
                </motion.div>
                <h1 className="text-8xl font-black uppercase tracking-tighter italic leading-none">
                  GENDER <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-500">DUEL</span>
                </h1>
                <p className="text-xl font-bold tracking-[0.3em] opacity-50 uppercase">EL vs LA Battle</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
                <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
                  <Shield className="w-8 h-8 text-yellow-400 mb-4" />
                  <h3 className="font-black uppercase mb-2">ԿԱՆՈՆՆԵՐ</h3>
                  <p className="text-sm opacity-60">Ընտրիր ճիշտ արտիկլը (EL կամ LA) յուրաքանչյուր գոյականի համար:</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
                  <Zap className="w-8 h-8 text-green-500 mb-4" />
                  <h3 className="font-black uppercase mb-2">ԲՈՆՈՒՍՆԵՐ</h3>
                  <p className="text-sm opacity-60">Շարունակական ճիշտ պատասխանները բերում են ավելի շատ միավորներ:</p>
                </div>
              </div>

              <button 
                onClick={() => setView('game')}
                className="group relative px-16 py-8 bg-white text-black text-2xl font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                <span className="relative z-10 group-hover:text-white transition-colors">ՄԱՐՏԻ ԱՆՑՆԵԼ</span>
              </button>
            </motion.div>
          )}

          {view === 'game' && currentNoun && (
            <motion.div 
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full space-y-16"
            >
              {/* Stats Header */}
              <div className="flex justify-between items-end border-b-2 border-white/10 pb-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">STREAK</p>
                  <div className="flex items-center gap-2">
                    <Flame className={`w-6 h-6 ${streak > 0 ? 'text-orange-500' : 'text-white/20'}`} />
                    <span className="text-3xl font-black italic">{streak}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">PROGRESS</p>
                  <p className="text-xl font-black">{currentIndex + 1} / {shuffledNouns.length}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">SCORE</p>
                  <p className="text-3xl font-black text-yellow-400">{score}</p>
                </div>
              </div>

              {/* Main Card */}
              <div className="relative flex flex-col items-center justify-center py-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentNoun.word}
                    initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ scale: 1.2, opacity: 0, rotateY: -90 }}
                    className={`relative p-16 bg-white/5 border-2 rounded-[40px] backdrop-blur-2xl text-center min-w-[320px] shadow-[0_0_100px_rgba(255,255,255,0.05)]
                      ${feedback === 'correct' ? 'border-[#00FF00] shadow-[#00FF00]/20' : 
                        feedback === 'wrong' ? 'border-red-500 shadow-red-500/20' : 'border-white/20'}`}
                  >
                    {currentNoun.isTricky && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Target className="w-3 h-3" /> ԲԱՐԴ ԲԱՌ
                      </div>
                    )}
                    <h2 className="text-7xl md:text-8xl font-black uppercase tracking-tighter italic mb-4">
                      {currentNoun.word}
                    </h2>
                    <p className="text-2xl font-bold opacity-40 italic">
                      {currentNoun.translation}
                    </p>

                    {/* Feedback Icon */}
                    <AnimatePresence>
                      {feedback && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute -right-8 -top-8 bg-white p-4 rounded-full shadow-2xl"
                        >
                          {feedback === 'correct' ? 
                            <Sparkles className="w-12 h-12 text-[#00FF00]" /> : 
                            <RotateCcw className="w-12 h-12 text-red-500" />
                          }
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                <button 
                  onClick={() => handleChoice('EL')}
                  disabled={!!feedback}
                  className="group relative h-32 bg-white/5 border-4 border-yellow-400 rounded-3xl overflow-hidden transition-all hover:bg-yellow-400 hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <span className="relative z-10 text-5xl font-black italic group-hover:text-black transition-colors">EL</span>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 group-hover:h-full transition-all duration-300 opacity-20" />
                </button>

                <button 
                  onClick={() => handleChoice('LA')}
                  disabled={!!feedback}
                  className="group relative h-32 bg-white/5 border-4 border-green-500 rounded-3xl overflow-hidden transition-all hover:bg-green-500 hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <span className="relative z-10 text-5xl font-black italic group-hover:text-black transition-colors">LA</span>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 group-hover:h-full transition-all duration-300 opacity-20" />
                </button>
              </div>
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div 
              key="result"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-12"
            >
              <div className="relative inline-block">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-500 rounded-full blur-3xl opacity-30"
                />
                <div className="relative bg-white/10 border-4 border-white/20 p-12 rounded-full backdrop-blur-2xl">
                  <Trophy className="w-24 h-24 text-yellow-400" />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-7xl font-black uppercase italic tracking-tighter">ՄԱՐՏԸ ԱՎԱՐՏՎԱԾ Է</h2>
                <div className="flex justify-center gap-12">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">FINAL SCORE</p>
                    <p className="text-5xl font-black text-yellow-400">{score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">MAX STREAK</p>
                    <p className="text-5xl font-black text-green-500">{maxStreak}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <button 
                  onClick={() => setView('game')}
                  className="px-12 py-6 bg-white text-black font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors"
                >
                  ՆՈՐԻՑ ԽԱՂԱԼ <RotateCcw className="inline ml-2" />
                </button>
                <button 
                  onClick={() => setView('intro')}
                  className="px-12 py-6 bg-white/10 border-2 border-white/20 font-black uppercase tracking-widest hover:bg-white/20 transition-colors"
                >
                  ԳԼԽԱՎՈՐ ՄԵՆՅՈՒ
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 2, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
