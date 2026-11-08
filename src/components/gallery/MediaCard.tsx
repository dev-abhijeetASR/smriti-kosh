'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Video as VideoIcon } from 'lucide-react';
import { MediaItem } from '@/types/gallery';

interface MediaCardProps {
  item: MediaItem;
  index: number;
  onClick: () => void;
  layout?: 'grid' | 'compact';
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  index,
  onClick,
  layout = 'grid',
}) => {
  const isVideo = item.type === 'video';

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 cursor-pointer select-none transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-0.5 border border-zinc-200/50 dark:border-zinc-800/80 ${
        layout === 'compact' ? 'aspect-[4/3]' : 'aspect-square sm:aspect-[4/3]'
      }`}
    >
      {/* Media Image */}
      <Image
        src={item.thumbnailUrl || item.url}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        priority={index < 6}
      />

      {/* Video Indicator Badges */}
      {isVideo && (
        <>
          {/* Centered Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300">
              <Play className="w-5 h-5 ml-0.5 fill-white text-white" />
            </div>
          </div>

          {/* Top Video Tag */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
            <VideoIcon className="w-3 h-3 text-indigo-400" />
            <span>Video</span>
          </div>

          {/* Bottom Duration Badge */}
          {item.duration && (
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-mono font-medium">
              {item.duration}
            </div>
          )}
        </>
      )}

      {/* Hover Info Overlay - Google Photos style */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 text-white pointer-events-none">
        <p className="text-xs font-semibold leading-tight line-clamp-1">
          {item.title}
        </p>
        <div className="flex items-center justify-between text-[11px] text-zinc-300 mt-1">
          <span>{item.subfolderName}</span>
          <span>{item.date}</span>
        </div>
      </div>
    </div>
  );
};
