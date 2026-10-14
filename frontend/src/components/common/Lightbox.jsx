import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Layers } from 'lucide-react';

const Lightbox = ({ items = [], currentIndex = 0, isOpen = false, onClose, onIndexChange }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setIsZoomed(false);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, items.length]);

  if (!isOpen || !items || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    const nextIndex = (currentIndex - 1 + items.length) % items.length;
    onIndexChange(nextIndex);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    const nextIndex = (currentIndex + 1) % items.length;
    onIndexChange(nextIndex);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox Viewer"
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Action Bar */}
      <div
        className="flex items-center justify-between z-10 w-full max-w-7xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 text-white">
          <span className="text-xs font-mono bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 text-slate-300">
            {currentIndex + 1} / {items.length}
          </span>
          {currentItem.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-950/60 px-2.5 py-0.5 rounded border border-sky-800/80">
              {currentItem.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            className="p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors"
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Close Viewer (Esc)"
            className="p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-rose-400 hover:bg-slate-800 border border-slate-700/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              title="Previous Photo (Left Arrow)"
              className="absolute left-2 sm:left-4 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white border border-slate-700 shadow-xl transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              title="Next Photo (Right Arrow)"
              className="absolute right-2 sm:right-4 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white border border-slate-700 shadow-xl transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Display Image */}
        <div
          className={`transition-all duration-300 ease-out flex items-center justify-center max-w-full max-h-full ${
            isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={currentItem.imageUrl || currentItem.mainImage}
            alt={currentItem.title || currentItem.name || 'Anant Metal Finishers Industrial Showcase'}
            className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-2xl border border-slate-800"
          />
        </div>
      </div>

      {/* Bottom Metadata Bar */}
      <div
        className="w-full max-w-4xl mx-auto text-center z-10 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {currentItem.title || currentItem.name}
        </h4>
        {currentItem.description && (
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl mx-auto leading-relaxed">
            {currentItem.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
