import React, { useEffect, useRef } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiRepeat, FiRefreshCw, FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut, FiDownload, FiShare2, FiExternalLink, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import type { Photo } from '../types';

interface PhotoViewerModalProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoViewerModal({ photos, initialIndex, onClose }: PhotoViewerModalProps) {
  const [current, setCurrent] = React.useState(initialIndex);
  const [scale, setScale] = React.useState(1);
  const [rotate, setRotate] = React.useState(0);
  const [flipH, setFlipH] = React.useState(false);
  const [flipV, setFlipV] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent((c) => Math.min(c, photos.length - 1));
  }, [photos]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrent((c) => (c > 0 ? c - 1 : c));
      if (e.key === 'ArrowRight') setCurrent((c) => (c < photos.length - 1 ? c + 1 : c));
      if (e.key === 'Home') setCurrent(0);
      if (e.key === 'End') setCurrent(photos.length - 1);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, photos.length]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === backdropRef.current) onClose();
  }

  function handleFlipHorizontal() {
    setFlipH((f) => !f);
  }
  function handleFlipVertical() {
    setFlipV((f) => !f);
  }
  function handleRotateLeft() {
    setRotate((r) => r - 90);
  }
  function handleRotateRight() {
    setRotate((r) => r + 90);
  }
  function handleZoomIn() {
    setScale((s) => Math.min(s + 0.2, 3));
  }
  function handleZoomOut() {
    setScale((s) => Math.max(s - 0.2, 0.5));
  }
  function handleReset() {
    setScale(1);
    setRotate(0);
    setFlipH(false);
    setFlipV(false);
  }
  function handleSave() {
    const link = document.createElement('a');
    link.href = photos[current].url;
    link.download = photos[current].title;
    link.click();
  }
  async function handleShare() {
    const photo = photos[current];
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          url: photo.url,
        });
      } catch {
        // Ignore share errors (e.g., user cancelled)
      }
    } else {
      window.open(photo.url, '_blank');
    }
  }
  function handleViewOriginal() {
    window.open(photos[current].url, '_blank');
  }
  function handleToggleFullscreen() {
    setIsFullscreen((f) => !f);
  }

  if (!photos[current]) return null;
  const photo = photos[current];
  const transform = `scale(${scale}) rotate(${rotate}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;

  return (
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm ${
        isFullscreen ? 'p-0' : 'p-1 sm:p-3'
      }`}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white bg-black/40 hover:bg-black/70 rounded-full p-2 transition-colors z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <FiX className="h-6 w-6" />
      </button>

      {/* Navigation Buttons */}
      <button
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 rounded-full p-2 transition-colors disabled:opacity-30 z-10"
        onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        disabled={current === 0}
        aria-label="Previous photo"
      >
        <FiChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 rounded-full p-2 transition-colors disabled:opacity-30 z-10"
        onClick={() => setCurrent((c) => Math.min(photos.length - 1, c + 1))}
        disabled={current === photos.length - 1}
        aria-label="Next photo"
      >
        <FiChevronRight className="h-6 w-6" />
      </button>

      {/* Photo Display */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-full h-full flex justify-center items-center overflow-auto">
          <img
            src={photo.url}
            alt={photo.title}
            className="max-w-full max-h-[60vh] sm:max-h-[80vh] object-contain bg-black animate-fade-in touch-none rounded-lg"
            style={{ transform, transition: 'transform 0.3s' }}
            draggable={false}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4">
          <div className="text-white text-center">
            <h3 className="text-base sm:text-lg font-medium mb-1">{photo.title}</h3>
            <p className="text-xs sm:text-sm text-white/80">
              {current + 1} / {photos.length}
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 flex flex-wrap justify-center items-center space-x-2 sm:space-x-4 p-2 sm:p-4">
        <button onClick={handleFlipHorizontal} className="p-2 text-white hover:bg-white/10 rounded-lg" aria-label="Flip horizontally">
          <FiRepeat className="w-5 h-5" />
        </button>
        <button onClick={handleFlipVertical} className="p-2 text-white hover:bg-white/10 rounded-lg" aria-label="Flip vertically">
          <FiRefreshCw className="w-5 h-5" />
        </button>
        <button onClick={handleRotateLeft} className="p-2 text-white hover:bg-white/10 rounded-lg" aria-label="Rotate left">
          <FiRotateCcw className="w-5 h-5" />
        </button>
        <button onClick={handleRotateRight} className="p-2 text-white hover:bg-white/10 rounded-lg" aria-label="Rotate right">
          <FiRotateCw className="w-5 h-5" />
        </button>
        <button onClick={handleZoomIn} className="p-2 text-white hover:bg-white/10 rounded-lg" aria-label="Zoom in">
          <FiZoomIn className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} className="p-2 text-white hover:bg-white/10 rounded-lg" aria-label="Zoom out">
          <FiZoomOut className="w-5 h-5" />
        </button>
        <button onClick={handleReset} className="p-2 text-white hover:bg-white/10 rounded-lg" aria-label="Reset">
          <span className="text-xs sm:text-sm">Reset</span>
        </button>
        <button onClick={handleSave} className="p-2 text-white hover:bg-white/10 rounded-lg" aria-label="Save">
          <FiDownload className="w-5 h-5" />
        </button>
        <button onClick={handleShare} className="p-2 text-white hover:bg-white/10 rounded-lg" aria-label="Share">
          <FiShare2 className="w-5 h-5" />
        </button>
        <button onClick={handleViewOriginal} className="p-2 text-white hover:bg-white/10 rounded-lg" aria-label="View original">
          <FiExternalLink className="w-5 h-5" />
        </button>
        <button onClick={handleToggleFullscreen} className="p-2 text-white hover:bg-white/10 rounded-lg" aria-label="Toggle fullscreen">
          {isFullscreen ? <FiMinimize2 className="w-5 h-5" /> : <FiMaximize2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
} 