import React, { useState } from 'react';
import { VFile } from '../types';
import { Play, ChevronLeft, ChevronRight, Maximize2, Minimize2, Plus, Edit3, Tv } from 'lucide-react';

interface Props {
  file: VFile;
  onClose?: () => void;
}

export const PowerPointViewer: React.FC<Props> = ({ file, onClose }) => {
  const slides = file.slides || [
    {
      title: file.name.replace('.pptx', ''),
      bullets: ['Präsentationsfolie 1', 'Schule Lernportal A-Zug', 'Vorbereitung Abschluss'],
      notes: 'Notizen des Vortragenden...',
    },
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className={`flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden ${
        isPresentationMode ? 'fixed inset-0 z-50 rounded-none' : 'h-full min-h-[500px]'
      }`}
    >
      {/* Orange PowerPoint Top Bar */}
      <div className="bg-[#c43e1c] text-white px-4 py-2 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-extrabold text-sm">
            <span className="w-6 h-6 rounded-md bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
              P
            </span>
            <span>Microsoft PowerPoint</span>
          </div>
          <div className="h-4 w-px bg-orange-300/40" />
          <span className="font-bold text-xs sm:text-sm">{file.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPresentationMode(!isPresentationMode)}
            className="flex items-center gap-1.5 bg-orange-700 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-xs font-bold transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPresentationMode ? 'Beenden' : 'Bildschirmpräsentation'}</span>
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-orange-700 rounded text-white">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Presentation Area */}
      <div className="flex-1 flex overflow-hidden bg-slate-950">
        {/* Left Thumbnails (Hidden in presentation mode) */}
        {!isPresentationMode && (
          <div className="w-48 bg-slate-900 border-r border-slate-800 p-3 overflow-y-auto flex flex-col gap-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Folien ({slides.length})
            </span>
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`p-2 rounded-lg text-left transition-all border ${
                  currentSlideIndex === idx
                    ? 'border-orange-500 bg-orange-950/40 ring-1 ring-orange-500'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] text-orange-400 font-bold mb-1">Folie {idx + 1}</div>
                <div className="text-xs text-white font-medium truncate">{s.title}</div>
              </button>
            ))}
          </div>
        )}

        {/* Center Active Slide Canvas */}
        <div className="flex-1 p-6 sm:p-12 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-4xl aspect-[16/9] bg-white rounded-xl shadow-2xl p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Slide Header Decoration */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500" />

            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-6 font-serif">
                {currentSlide.title}
              </h2>
              <ul className="space-y-4 text-slate-700 text-sm sm:text-lg">
                {currentSlide.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-100">
              <span>Schule Lernportal • Präsentationsmodul</span>
              <span>
                Folie {currentSlideIndex + 1} von {slides.length}
              </span>
            </div>
          </div>

          {/* Slide Navigation Overlay */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white text-xs font-mono">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
