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
  Sparkles, 
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  RefreshCw
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

  // Zoom, Pan & Rotation State
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch gesture state (Swipe & Pinch)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [pinchDist, setPinchDist] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHdQuality(initialQuality === 'hd');
  }, [initialQuality]);

  // Reset zoom, pan, and rotation whenever current photo changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  }, [currentIndex]);

  const currentItem = items[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === items.length - 1;

  // Zoom Controls
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.25, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  }, []);

  // Rotation Controls (90 deg increments)
  const handleRotateCw = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleRotateCcw = useCallback(() => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (!isFirst) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, isFirst, onNavigate]);

  const handleNext = useCallback(() => {
    if (!isLast) {
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, isLast, onNavigate]);

  // Comprehensive Keyboard Shortcuts (Windows & Mac)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        if (zoom > 1) {
          handleResetZoom();
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        if (zoom === 1) handlePrev();
      } else if (e.key === 'ArrowRight') {
        if (zoom === 1) handleNext();
      } else if (e.key === 'r' || e.key === 'R') {
        handleRotateCw();
      } else if (e.key === 'l' || e.key === 'L') {
        handleRotateCcw();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      } else if (e.key === 'i' || e.key === 'I') {
        setShowInfo((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, zoom, handlePrev, handleNext, handleRotateCw, handleRotateCcw, handleZoomIn, handleZoomOut, handleResetZoom, onClose]);

  // Scroll active thumbnail in filmstrip
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

  // Mouse Drag / Pan for Desktop (Windows & Mac)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      e.preventDefault();
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (currentItem?.type === 'video') return;
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Double Click / Tap to toggle zoom
  const handleDoubleClick = () => {
    if (currentItem?.type === 'video') return;
    if (zoom === 1) {
      setZoom(2);
    } else {
      handleResetZoom();
    }
  };

  // Touch handling for Mobile (Android & iPhone)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch to zoom start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setPinchDist(dist);
    } else if (e.touches.length === 1) {
      if (zoom > 1) {
        // Pan mode
        setIsDragging(true);
        setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
      } else {
        // Swipe navigation mode
        setTouchStartX(e.touches[0].clientX);
        setTouchStartY(e.touches[0].clientY);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchDist !== null) {
      // Pinch to zoom active
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleDelta = currentDist / pinchDist;
      setZoom((prev) => Math.min(Math.max(prev * scaleDelta, 1), 4));
      setPinchDist(currentDist);
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      // Pan active
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    setPinchDist(null);

    // If not zoomed, detect swipe
    if (zoom === 1 && touchStartX !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
      setTouchStartX(null);
      setTouchStartY(null);
    }
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

  // Prevent background scrolling
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
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between select-none animate-in fade-in duration-200 overflow-hidden"
      style={{ touchAction: zoom > 1 ? 'none' : 'pan-y' }}
    >
      {/* 1. TOP HEADER / ACTION BAR */}
      <div className="relative z-30 flex items-center justify-between px-3 sm:px-6 py-3 bg-gradient-to-b from-black/90 via-black/50 to-transparent text-white">
        {/* Left: Counter & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] sm:text-xs font-semibold tracking-wide border border-white/10">
            {currentIndex + 1} / {items.length}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold truncate leading-tight">
              {currentItem.title}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate">
              {currentItem.subfolderName} • {currentItem.date}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quality Mode Toggle Badge (Data Saver vs Ultra HD) */}
          {!isVideo && currentItem.hdUrl && (
            <button
              onClick={() => setIsHdQuality((prev) => !prev)}
              title={
                isHdQuality
                  ? 'Currently in Ultra HD. Click to switch to Data Saver (Mobile Data)'
                  : 'Currently in Data Saver. Click to load Ultra HD'
              }
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border transition-all ${
                isHdQuality
                  ? 'bg-amber-500/25 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                  : 'bg-white/10 hover:bg-white/20 text-zinc-300 border-white/15'
              }`}
            >
              <Sparkles className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${isHdQuality ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span className="hidden xs:inline">{isHdQuality ? 'Ultra HD' : 'Data Saver'}</span>
            </button>
          )}

          {/* Info Panel Toggle */}
          <button
            onClick={() => setShowInfo((prev) => !prev)}
            title="Photo Information (I)"
            className={`p-2 rounded-full transition-colors ${
              showInfo ? 'bg-amber-600 text-white' : 'hover:bg-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Fullscreen Toggle (Windows / Mac) */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors hidden md:block"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          {/* Download Button */}
          <a
            href={currentItem.hdUrl || currentItem.url}
            download={currentItem.title}
            target="_blank"
            rel="noopener noreferrer"
            title="Download Full Resolution"
            className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>

          {/* Close Button (X) */}
          <button
            onClick={onClose}
            title="Close (Esc)"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all ml-1 border border-white/10 active:scale-95"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* 2. MAIN VIEWER STAGE */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        className={`relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden ${
          zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
      >
        {/* ======================================================== */}
        {/* LEFT ARROW (Strictly disabled on first photo)             */}
        {/* ======================================================== */}
        {zoom === 1 && (
          <button
            onClick={handlePrev}
            disabled={isFirst}
            aria-label="Previous Photo"
            title={isFirst ? 'First photo (No previous photo)' : 'Previous photo (Left Arrow)'}
            className={`absolute left-2 sm:left-6 z-30 p-2.5 sm:p-4 rounded-full transition-all duration-200 border ${
              isFirst
                ? 'opacity-20 bg-zinc-900/40 text-zinc-600 border-zinc-800 cursor-not-allowed pointer-events-none'
                : 'opacity-90 hover:opacity-100 bg-black/60 hover:bg-black/90 text-white border-white/20 hover:scale-105 active:scale-95 shadow-xl shadow-black/50 backdrop-blur-md cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Center Media: Image or Video */}
        <div className="relative max-w-full max-h-[75vh] sm:max-h-[80vh] flex items-center justify-center pointer-events-none">
          {isVideo ? (
            currentItem.youtubeId ? (
              <div className="relative w-[92vw] max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black pointer-events-auto">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${currentItem.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={currentItem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden bg-black max-w-4xl max-h-[75vh] flex items-center justify-center shadow-2xl border border-white/10 pointer-events-auto">
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
            <div 
              className="relative flex items-center justify-center transition-transform duration-200 ease-out pointer-events-auto"
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={displayImageUrl}
                alt={currentItem.title}
                draggable={false}
                className="max-h-[70vh] sm:max-h-[78vh] max-w-[95vw] sm:max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl user-select-none"
                loading="eager"
              />
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* RIGHT ARROW (Strictly disabled on last photo)             */}
        {/* ======================================================== */}
        {zoom === 1 && (
          <button
            onClick={handleNext}
            disabled={isLast}
            aria-label="Next Photo"
            title={isLast ? 'Last photo (No next photo)' : 'Next photo (Right Arrow)'}
            className={`absolute right-2 sm:right-6 z-30 p-2.5 sm:p-4 rounded-full transition-all duration-200 border ${
              isLast
                ? 'opacity-20 bg-zinc-900/40 text-zinc-600 border-zinc-800 cursor-not-allowed pointer-events-none'
                : 'opacity-90 hover:opacity-100 bg-black/60 hover:bg-black/90 text-white border-white/20 hover:scale-105 active:scale-95 shadow-xl shadow-black/50 backdrop-blur-md cursor-pointer'
            }`}
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

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
                <p className="text-zinc-400">Current View State</p>
                <p className="text-amber-300 font-semibold mt-0.5">
                  Zoom: {Math.round(zoom * 100)}% • Rotation: {rotation}°
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800">
                <a
                  href="https://drive.google.com/drive/folders/1t3wSdKDUo7eSVLNxofylMkVO0zU7ChgY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-amber-400" />
                    <span className="font-medium">Raw 14MB File (Drive)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                </a>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* FLOATING ZOOM & ROTATION TOOLBAR (FOR ALL DEVICES: ANDROID, IPHONE, WINDOWS, MAC) */}
      {!isVideo && (
        <div className="relative z-30 flex items-center justify-center py-1">
          <div className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 backdrop-blur-xl border border-white/15 shadow-2xl text-white">
            {/* Rotate Left 90° */}
            <button
              onClick={handleRotateCcw}
              title="Rotate Left 90° (L)"
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/15 text-zinc-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Rotate Right 90° */}
            <button
              onClick={handleRotateCw}
              title="Rotate Right 90° (R)"
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/15 text-zinc-300 hover:text-white transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-zinc-700 mx-1" />

            {/* Zoom Out (-) */}
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              title="Zoom Out (-)"
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/15 text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Zoom Level / Reset */}
            <button
              onClick={handleResetZoom}
              title="Click to Reset Zoom & Rotation (0)"
              className="px-2 py-0.5 rounded text-[11px] font-mono font-bold text-amber-300 hover:bg-white/15 transition-colors"
            >
              {Math.round(zoom * 100)}%
            </button>

            {/* Zoom In (+) */}
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 4}
              title="Zoom In (+)"
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/15 text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {(zoom > 1 || rotation !== 0) && (
              <button
                onClick={handleResetZoom}
                title="Reset View"
                className="ml-1 p-1.5 rounded-full hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. BOTTOM FILMSTRIP THUMBNAIL SCROLLER (Google Photos style) */}
      <div className="relative z-20 py-2 sm:py-2.5 px-3 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div
          ref={filmstripRef}
          className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto max-w-4xl mx-auto py-1 scrollbar-none no-scrollbar"
        >
          {items.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(idx)}
                className={`relative flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                  isActive
                    ? 'border-amber-500 ring-2 ring-amber-500/40 scale-105 sm:scale-110 shadow-lg'
                    : 'border-transparent opacity-45 hover:opacity-100 hover:scale-105'
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
