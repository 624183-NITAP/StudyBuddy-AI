"use client";

import { useState } from "react";
import { RotateCw, ChevronLeft, ChevronRight, Zap } from "lucide-react";

export default function FlashcardsPage() {
  const [cards] = useState([
    { front: "What is Time Complexity of Binary Search?", back: "O(log N)" },
    { front: "Formula: Quadratic Equation", back: "x = (-b ± √(b² - 4ac)) / 2a" },
    { front: "Define Polymorphism", back: "The ability of different objects to respond to the same method call in their own way." },
    { front: "What is a Deadlock in OS?", back: "A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process." }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 flex flex-col h-full items-center justify-center py-10">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-full mb-2">
          <Zap className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold">Quick Revision Flashcards</h1>
        <p className="text-slate-400">Master key definitions and formulas</p>
      </div>

      <div className="w-full max-w-2xl perspective-1000 relative">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-80 cursor-pointer transition-all duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-900 to-slate-900 border-2 border-indigo-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl hover:border-indigo-500/50 transition-colors">
            <span className="absolute top-6 left-6 text-indigo-400/50 font-semibold text-sm">Front</span>
            <h2 className="text-2xl md:text-3xl font-medium text-white leading-tight">
              {cards[currentIndex].front}
            </h2>
            <div className="absolute bottom-6 flex items-center text-slate-400 text-sm">
              <RotateCw className="w-4 h-4 mr-2" /> Click to flip
            </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-900 to-slate-900 border-2 border-emerald-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
            <span className="absolute top-6 left-6 text-emerald-400/50 font-semibold text-sm">Back</span>
            <h2 className="text-xl md:text-2xl font-medium text-white leading-relaxed">
              {cards[currentIndex].back}
            </h2>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button 
            onClick={prevCard}
            className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-slate-400 font-medium font-mono">
            {currentIndex + 1} / {cards.length}
          </span>
          <button 
            onClick={nextCard}
            className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
