'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Download, 
  Info, 
  Maximize, 
  Minimize, 
  Play, 
  Folder,
  Calendar,
  HardDrive,
  Sparkles
} from 'lucide-react';
import { MediaItem } from '@/types/gallery';

interface LightboxViewerProps {
  items: MediaItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  initialQuality?: 'mobile' | 'hd';
}

export const LightboxViewer: React.FC<LightboxViewerProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  initialQuality = 'mobile',
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHdQuality, setIsHdQuality] = useState(initialQuality === 'hd');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHdQuality(initialQuality === 'hd');
  }, [initialQuality]);

  const currentItem = items[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === items.length - 1;

  // Previous item navigation
  const handlePrev = useCallback(() => {
    if (!isFirst) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, isFirst, onNavigate]);

  // Next item navigation
  const handleNext = useCallback(() => {
    if (!isLast) {
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, isLast, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'i' || e.key === 'I') {
        setShowInfo((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Scroll active thumbnail into view in filmstrip
  useEffect(() => {
    if (filmstripRef.current && isOpen) {
      const activeThumb = filmstripRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentIndex, isOpen]);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left -> Next
        handleNext();
      } else {
        // Swiped right -> Prev
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Prevent background scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !currentItem) return null;

  const isVideo = currentItem.type === 'video';
  const displayImageUrl =
    isHdQuality && currentItem.hdUrl
      ? currentItem.hdUrl
      : currentItem.mobileUrl || currentItem.url;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none animate-in fade-in duration-200"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. TOP HEADER / ACTION BAR */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white">
        {/* Left: Counter & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/10">
            {currentIndex + 1} / {items.length}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold truncate leading-tight">
              {currentItem.title}
            </h4>
            <p className="text-[11px] text-zinc-400 truncate">
              {currentItem.subfolderName} • {currentItem.date}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quality Mode Toggle Badge (Data Saver vs Ultra HD) */}
          {!isVideo && currentItem.hdUrl && (
            <button
              onClick={() => setIsHdQuality((prev) => !prev)}
              title={
                isHdQuality
                  ? 'Currently in Ultra HD. Click to switch to Data Saver (Mobile Data)'
                  : 'Currently in Data Saver. Click to load Ultra HD'
              }
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                isHdQuality
                  ? 'bg-amber-500/25 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                  : 'bg-white/10 hover:bg-white/20 text-zinc-300 border-white/15'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isHdQuality ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span>{isHdQuality ? 'Ultra HD' : 'Data Saver'}</span>
            </button>
          )}

          {/* Info Panel Toggle */}
          <button
            onClick={() => setShowInfo((prev) => !prev)}
            title="Photo Information (I)"
            className={`p-2 rounded-full transition-colors ${
              showInfo ? 'bg-indigo-600 text-white' : 'hover:bg-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            <Info className="w-5 h-5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors hidden sm:block"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          {/* Download Button */}
          <a
            href={currentItem.hdUrl || currentItem.url}
            download={currentItem.title}
            target="_blank"
            rel="noopener noreferrer"
            title="Download Original High-Res"
            className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
          >
            <Download className="w-5 h-5" />
          </a>

          {/* Close Button (X) */}
          <button
            onClick={onClose}
            title="Close (Esc)"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all ml-1 border border-white/10 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. MAIN VIEWER STAGE */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* ======================================================== */}
        {/* LEFT ARROW (Strictly disabled on first photo)             */}
        {/* ======================================================== */}
        <button
          onClick={handlePrev}
          disabled={isFirst}
          aria-label="Previous Photo"
          title={isFirst ? 'First photo (No previous photo)' : 'Previous photo (Left Arrow)'}
          className={`absolute left-2 sm:left-6 z-30 p-3 sm:p-4 rounded-full transition-all duration-200 border ${
            isFirst
              ? 'opacity-25 bg-zinc-900/40 text-zinc-600 border-zinc-800 cursor-not-allowed pointer-events-none'
              : 'opacity-90 hover:opacity-100 bg-black/60 hover:bg-black/90 text-white border-white/20 hover:scale-105 active:scale-95 shadow-xl shadow-black/50 backdrop-blur-md cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Center: Image or Video */}
        <div className="relative max-w-full max-h-[75vh] sm:max-h-[80vh] flex items-center justify-center">
          {isVideo ? (
            currentItem.youtubeId ? (
              <div className="relative w-[90vw] max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${currentItem.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={currentItem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden bg-black max-w-4xl max-h-[75vh] flex items-center justify-center shadow-2xl border border-white/10">
                <video
                  ref={videoRef}
                  src={currentItem.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[72vh] w-auto rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )
          ) : (
            <div className="relative flex items-center justify-center">
              <img
                src={displayImageUrl}
                alt={currentItem.title}
                className="max-h-[75vh] sm:max-h-[80vh] max-w-full w-auto h-auto object-contain rounded-md shadow-2xl pointer-events-auto transition-all"
                loading="eager"
              />
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* RIGHT ARROW (Strictly disabled on last photo)             */}
        {/* ======================================================== */}
        <button
          onClick={handleNext}
          disabled={isLast}
          aria-label="Next Photo"
          title={isLast ? 'Last photo (No next photo)' : 'Next photo (Right Arrow)'}
          className={`absolute right-2 sm:right-6 z-30 p-3 sm:p-4 rounded-full transition-all duration-200 border ${
            isLast
              ? 'opacity-25 bg-zinc-900/40 text-zinc-600 border-zinc-800 cursor-not-allowed pointer-events-none'
              : 'opacity-90 hover:opacity-100 bg-black/60 hover:bg-black/90 text-white border-white/20 hover:scale-105 active:scale-95 shadow-xl shadow-black/50 backdrop-blur-md cursor-pointer'
          }`}
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Slide-in Info Drawer (Google Photos style) */}
        {showInfo && (
          <aside className="absolute right-0 top-0 bottom-0 w-80 bg-zinc-900/95 backdrop-blur-xl border-l border-zinc-800 p-5 text-white z-40 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h5 className="font-semibold text-sm">Media Info</h5>
              <button
                onClick={() => setShowInfo(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <p className="text-zinc-400">Title</p>
                <p className="font-medium text-zinc-200 mt-0.5 text-sm">{currentItem.title}</p>
              </div>

              {currentItem.description && (
                <div>
                  <p className="text-zinc-400">Description</p>
                  <p className="text-zinc-300 mt-0.5 leading-relaxed">{currentItem.description}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                <Folder className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="text-zinc-400">Folder</p>
                  <p className="text-zinc-200 font-medium">{currentItem.subfolderName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-zinc-400">Date Captured</p>
                  <p className="text-zinc-200 font-medium">{currentItem.date}</p>
                </div>
              </div>

              {currentItem.fileSize && (
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-zinc-400">Original Size</p>
                    <p className="text-zinc-200 font-medium">{currentItem.fileSize}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-zinc-400">Resolution Mode</p>
                <p className="text-amber-300 font-semibold mt-0.5">
                  {isHdQuality ? '🌟 Ultra HD (High Resolution)' : '⚡ Data Saver (Compressed WebP)'}
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* 3. BOTTOM FILMSTRIP THUMBNAIL SCROLLER (Google Photos style) */}
      <div className="relative z-20 py-2.5 px-4 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div
          ref={filmstripRef}
          className="flex items-center justify-center gap-2 overflow-x-auto max-w-4xl mx-auto py-1 scrollbar-none no-scrollbar"
        >
          {items.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(idx)}
                className={`relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                  isActive
                    ? 'border-amber-500 ring-2 ring-amber-500/40 scale-110 shadow-lg'
                    : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                }`}
              >
                <Image
                  src={item.thumbnailUrl || item.url}
                  alt={item.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="w-3 h-3 fill-white text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
