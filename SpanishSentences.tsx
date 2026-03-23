import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  ArrowRight, 
  HelpCircle,
  Sparkles,
  LayoutGrid,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Data ---

interface Sentence {
  id: number;
  spanish: string;
  armenian: string;
  words: string[];
}

const SENTENCES: Sentence[] = [
  {
    id: 1,
    spanish: "Mañana voy a la playa",
    armenian: "Վաղը ես գնում եմ լողափ",
    words: ["Mañana", "voy", "a", "la", "playa"]
  },
  {
    id: 2,
    spanish: "Me gusta el café por la mañana",
    armenian: "Ինձ դուր է գալիս սուրճը առավոտյան",
    words: ["Me", "gusta", "el", "café", "por", "la", "mañana"]
  },
  {
    id: 3,
    spanish: "Hasta mañana mis queridos amigos",
    armenian: "Մինչ վաղը, իմ սիրելի ընկերներ",
    words: ["Hasta", "mañana", "mis", "queridos", "amigos"]
  },
  {
    id: 4,
    spanish: "Esta mañana hace mucho frío",
    armenian: "Այս առավոտ շատ ցուրտ է",
    words: ["Esta", "mañana", "hace", "mucho", "frío"]
  },
  {
    id: 5,
    spanish: "Pasado mañana es mi cumpleaños",
    armenian: "Վաղը չէ մյուս օրը իմ ծննդյան օրն է",
    words: ["Pasado", "mañana", "es", "mi", "cumpleaños"]
  },
  {
    id: 6,
    spanish: "Toda la mañana estuve trabajando",
    armenian: "Ամբողջ առավոտը ես աշխատում էի",
    words: ["Toda", "la", "mañana", "estuve", "trabajando"]
  },
  {
    id: 7,
    spanish: "Mañana por la mañana iré al médico",
    armenian: "Վաղը առավոտյան կգնամ բժշկի",
    words: ["Mañana", "por", "la", "mañana", "iré", "al", "médico"]
  }
];

// --- Components ---

const shuffleArray = (array: string[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function SentenceArchitect() {
  const [view, setView] = useState<'intro' | 'game' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentSentence = SENTENCES[currentIndex];

  const initLevel = useCallback((index: number) => {
    const sentence = SENTENCES[index];
    setScrambledWords(shuffleArray(sentence.words));
    setSelectedWords([]);
    setIsCorrect(null);
    setShowHint(false);
  }, []);

  const startGame = () => {
    setScore(0);
    setCurrentIndex(0);
    initLevel(0);
    setView('game');
  };

  const handleWordClick = (word: string, fromScrambled: boolean) => {
    if (isCorrect !== null) return;

    if (fromScrambled) {
      setSelectedWords([...selectedWords, word]);
      const wordIndex = scrambledWords.indexOf(word);
      const newScrambled = [...scrambledWords];
      newScrambled.splice(wordIndex, 1);
      setScrambledWords(newScrambled);
    } else {
      const wordIndex = selectedWords.indexOf(word);
      const newSelected = [...selectedWords];
      newSelected.splice(wordIndex, 1);
      setSelectedWords(newSelected);
      setScrambledWords([...scrambledWords, word]);
    }
  };

  useEffect(() => {
    if (selectedWords.length === currentSentence.words.length && selectedWords.length > 0) {
      const isMatch = selectedWords.join(' ') === currentSentence.spanish;
      setIsCorrect(isMatch);
      if (isMatch) {
        setScore(s => s + 10);
      }
    }
  }, [selectedWords, currentSentence]);

  const nextLevel = () => {
    if (currentIndex + 1 < SENTENCES.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      initLevel(nextIdx);
    } else {
      setView('result');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#1A1A1A] font-['Inter'] selection:bg-[#00FF00] selection:text-black">
      {/* Brutalist Header */}
      <header className="border-b-4 border-black bg-white p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-black text-[#00FF00] p-2 rotate-[-2deg]">
              <LayoutGrid className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">
              FRASE <span className="text-[#00FF00] bg-black px-2">ARCHITECT</span>
            </h1>
          </div>
          
          {view === 'game' && (
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase opacity-50">PROGRESS</p>
                <p className="text-xl font-black">{currentIndex + 1} / {SENTENCES.length}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase opacity-50">SCORE</p>
                <p className="text-xl font-black text-[#00AA00]">{score}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8 py-16">
        <AnimatePresence mode="wait">
          {view === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">
                  ԿԱՌՈՒՑԻՐ <br/>
                  <span className="text-[#00FF00] stroke-black stroke-2">ՆԱԽԱԴԱՍՈՒԹՅՈՒՆԸ</span>
                </h2>
                <p className="text-2xl font-bold max-w-2xl border-l-8 border-black pl-6 py-2">
                  Դասավորիր բառերը ճիշտ հերթականությամբ: Օգտագործիր հայերեն թարգմանությունը որպես ուղեցույց:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: <Type />, title: "Բառեր", desc: "Սեղմիր բառերի վրա" },
                  { icon: <Sparkles />, title: "Ճշտություն", desc: "Ստացիր միավորներ" },
                  { icon: <Trophy />, title: "Հաղթանակ", desc: "Դարձիր վարպետ" }
                ].map((item, i) => (
                  <div key={i} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="font-black uppercase mb-1">{item.title}</h3>
                    <p className="text-sm opacity-70">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={startGame}
                className="w-full md:w-auto px-12 py-6 bg-black text-white text-2xl font-black uppercase tracking-widest hover:bg-[#00FF00] hover:text-black transition-colors shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                ՍԿՍԵԼ ԽԱՂԸ
              </button>
            </motion.div>
          )}

          {view === 'game' && (
            <motion.div 
              key="game"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              {/* Hint Section */}
              <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-black text-white px-4 py-1 text-[10px] font-black uppercase">
                  ԹԱՐԳՄԱՆՈՒԹՅՈՒՆ
                </div>
                <p className="text-3xl md:text-4xl font-black italic mt-4">
                  "{currentSentence.armenian}"
                </p>
                <button 
                  onClick={() => setShowHint(!showHint)}
                  className="mt-6 flex items-center gap-2 text-sm font-bold uppercase hover:underline"
                >
                  <HelpCircle className="w-4 h-4" /> {showHint ? "Թաքցնել հուշումը" : "Ցույց տալ հուշումը"}
                </button>
                {showHint && (
                  <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
                    className="mt-2 text-xl font-black uppercase tracking-widest"
                  >
                    {currentSentence.spanish}
                  </motion.p>
                )}
              </div>

              {/* Construction Zone */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">ՔՈ ՊԱՏԱՍԽԱՆԸ</p>
                <div className="min-h-[120px] bg-white border-4 border-dashed border-black p-6 flex flex-wrap gap-3 items-center">
                  <AnimatePresence>
                    {selectedWords.map((word, i) => (
                      <motion.button
                        key={`${word}-${i}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={() => handleWordClick(word, false)}
                        className="px-6 py-3 bg-black text-white font-black uppercase tracking-tight hover:bg-red-500 transition-colors"
                      >
                        {word}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                  {selectedWords.length === 0 && (
                    <p className="text-gray-300 font-black uppercase italic">Ընտրիր բառերը ստորև...</p>
                  )}
                </div>
              </div>

              {/* Word Bank */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">ԲԱՌԵՐԻ ԲԱՆԿ</p>
                <div className="flex flex-wrap gap-3">
                  {scrambledWords.map((word, i) => (
                    <motion.button
                      key={`${word}-${i}`}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleWordClick(word, true)}
                      className="px-6 py-3 bg-white border-4 border-black font-black uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#00FF00] transition-colors"
                    >
                      {word}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Feedback Overlay */}
              <AnimatePresence>
                {isCorrect !== null && (
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className={`p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6
                      ${isCorrect ? 'bg-[#00FF00]' : 'bg-red-500 text-white'}`}
                  >
                    <div className="flex items-center gap-4">
                      {isCorrect ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                      <div>
                        <h4 className="text-2xl font-black uppercase italic">
                          {isCorrect ? "ՃԻՇՏ Է!" : "ՍԽԱԼ Է!"}
                        </h4>
                        <p className="font-bold opacity-80">
                          {isCorrect ? "Հիանալի աշխատանք:" : "Փորձիր նորից:"}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={isCorrect ? nextLevel : () => initLevel(currentIndex)}
                      className="px-10 py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                    >
                      {isCorrect ? "ՀԱՋՈՐԴԸ" : "ՆՈՐԻՑ ՓՈՐՁԵԼ"} {isCorrect ? <ArrowRight className="inline ml-2" /> : <RotateCcw className="inline ml-2" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div 
              key="result"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-12 bg-white border-8 border-black p-16 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="inline-block bg-[#00FF00] p-8 border-4 border-black rotate-3">
                <Trophy className="w-24 h-24" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-7xl font-black uppercase italic tracking-tighter">
                  ԱՎԱՐՏ!
                </h2>
                <p className="text-3xl font-bold uppercase">
                  ՔՈ ՄԻԱՎՈՐԸ: <span className="bg-black text-[#00FF00] px-4 py-1">{score}</span>
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button 
                  onClick={startGame}
                  className="px-12 py-6 bg-black text-white text-xl font-black uppercase tracking-widest hover:bg-[#00FF00] hover:text-black transition-colors"
                >
                  ԽԱՂԱԼ ՆՈՐԻՑ
                </button>
                <button 
                  onClick={() => setView('intro')}
                  className="px-12 py-6 bg-white border-4 border-black text-xl font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                >
                  ԳԼԽԱՎՈՐ ՄԵՆՅՈՒ
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="p-8 text-center opacity-30 font-black uppercase tracking-[0.5em] text-xs">
        Spanish Sentence Architect © 2026
      </footer>
    </div>
  );
}
