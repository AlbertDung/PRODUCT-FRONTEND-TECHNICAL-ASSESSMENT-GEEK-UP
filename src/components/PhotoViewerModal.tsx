import React, { useEffect, useRef } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiRepeat, FiRefreshCw, FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut, FiDownload, FiShare2, FiExternalLink, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import type { Photo } from '../types';

interface PhotoViewerModalProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoViewerModal({ photos, initialIndex, onClose }: PhotoViewerModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState<number>(initialIndex);
  const [zoomScale, setZoomScale] = React.useState<number>(1);
  const [rotationAngle, setRotationAngle] = React.useState<number>(0);
  const [isFlippedHorizontal, setIsFlippedHorizontal] = React.useState<boolean>(false);
  const [isFlippedVertical, setIsFlippedVertical] = React.useState<boolean>(false);
  const [isFullscreenMode, setIsFullscreenMode] = React.useState<boolean>(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPhotoIndex((c) => Math.min(c, photos.length - 1));
  }, [photos]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentPhotoIndex((c) => (c > 0 ? c - 1 : c));
      if (e.key === 'ArrowRight') setCurrentPhotoIndex((c) => (c < photos.length - 1 ? c + 1 : c));
      if (e.key === 'Home') setCurrentPhotoIndex(0);
      if (e.key === 'End') setCurrentPhotoIndex(photos.length - 1);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, photos.length]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === backdropRef.current) onClose();
  }

  function handleFlipHorizontal() {
    setIsFlippedHorizontal((prev) => !prev);
  }
  function handleFlipVertical() {
    setIsFlippedVertical((prev) => !prev);
  }
  function handleRotateLeft() {
    setRotationAngle((prev) => prev - 90);
  }
  function handleRotateRight() {
    setRotationAngle((prev) => prev + 90);
  }
  function handleZoomIn() {
    setZoomScale((prev) => Math.min(prev + 0.2, 3));
  }
  function handleZoomOut() {
    setZoomScale((prev) => Math.max(prev - 0.2, 0.5));
  }
  function handleReset() {
    setZoomScale(1);
    setRotationAngle(0);
    setIsFlippedHorizontal(false);
    setIsFlippedVertical(false);
  }
  function handleSave() {
    const link = document.createElement('a');
    link.href = photos[currentPhotoIndex].url;
    link.download = photos[currentPhotoIndex].title;
    link.click();
  }
  async function handleShare() {
    const photo = photos[currentPhotoIndex];
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
    window.open(photos[currentPhotoIndex].url, '_blank');
  }
  function handleToggleFullscreen() {
    setIsFullscreenMode((prev) => !prev);
  }

  if (!photos[currentPhotoIndex]) return null;
  const photo = photos[currentPhotoIndex];
  const transform = `scale(${zoomScale}) rotate(${rotationAngle}deg) scaleX(${isFlippedHorizontal ? -1 : 1}) scaleY(${isFlippedVertical ? -1 : 1})`;

  return (
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm ${
        isFullscreenMode ? 'p-0' : 'p-1 sm:p-3'
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
        onClick={() => setCurrentPhotoIndex((c) => Math.max(0, c - 1))}
        disabled={currentPhotoIndex === 0}
        aria-label="Previous photo"
      >
        <FiChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 rounded-full p-2 transition-colors disabled:opacity-30 z-10"
        onClick={() => setCurrentPhotoIndex((c) => Math.min(photos.length - 1, c + 1))}
        disabled={currentPhotoIndex === photos.length - 1}
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
              {currentPhotoIndex + 1} / {photos.length}
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
          {isFullscreenMode ? <FiMinimize2 className="w-5 h-5" /> : <FiMaximize2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
} 