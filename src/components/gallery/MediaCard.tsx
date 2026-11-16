'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Video as VideoIcon, FileText, FileSpreadsheet, FileCode, File, Download } from 'lucide-react';
import { MediaItem } from '@/types/gallery';

interface MediaCardProps {
  item: MediaItem;
  index: number;
  onClick: () => void;
  layout?: 'grid' | 'compact';
}

function getDocumentConfig(ext?: string) {
  const e = (ext || '').toLowerCase().replace('.', '');
  if (e === 'pdf') {
    return {
      icon: FileText,
      color: 'from-rose-500/20 to-red-600/30 text-rose-400 border-rose-500/30',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      label: 'PDF Document'
    };
  }
  if (['xlsx', 'xls', 'xlsb', 'csv'].includes(e)) {
    return {
      icon: FileSpreadsheet,
      color: 'from-emerald-500/20 to-green-600/30 text-emerald-400 border-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      label: 'Spreadsheet'
    };
  }
  if (['docx', 'doc', 'txt', 'rtf'].includes(e)) {
    return {
      icon: FileText,
      color: 'from-blue-500/20 to-indigo-600/30 text-blue-400 border-blue-500/30',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      label: 'Word Document'
    };
  }
  if (['html', 'css', 'js', 'md', 'json'].includes(e)) {
    return {
      icon: FileCode,
      color: 'from-amber-500/20 to-orange-600/30 text-amber-400 border-amber-500/30',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      label: 'Code / Markup'
    };
  }
  return {
    icon: File,
    color: 'from-zinc-500/20 to-zinc-600/30 text-zinc-400 border-zinc-500/30',
    badge: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
    label: 'Document'
  };
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  index,
  onClick,
  layout = 'grid',
}) => {
  const isVideo = item.type === 'video';
  const isDoc = item.type === 'document';
  const docConfig = isDoc ? getDocumentConfig(item.fileExtension) : null;
  const DocIcon = docConfig?.icon || FileText;

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
      {/* 1. Media Image or Document Canvas */}
      {!isDoc ? (
        <Image
          src={item.thumbnailUrl || item.url}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          priority={index < 6}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${docConfig?.color} flex flex-col justify-between p-4 transition-transform duration-300 group-hover:scale-[1.02]`}>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/10 dark:bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-sm">
              <DocIcon className="w-5 h-5 text-zinc-100" />
            </div>
            {item.fileExtension && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${docConfig?.badge}`}>
                {item.fileExtension.replace('.', '')}
              </span>
            )}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-tight drop-shadow-sm">
              {item.title}
            </h4>
            <div className="flex items-center justify-between text-[11px] text-zinc-300/80 mt-1.5 font-mono">
              <span className="truncate max-w-[120px]">{item.subfolderName}</span>
              {item.fileSize && <span>{item.fileSize}</span>}
            </div>
          </div>
        </div>
      )}

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

      {/* Hover Info Overlay - Google Photos style (for images/videos) */}
      {!isDoc && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 text-white pointer-events-none">
          <p className="text-xs font-semibold leading-tight line-clamp-1">
            {item.title}
          </p>
          <div className="flex items-center justify-between text-[11px] text-zinc-300 mt-1">
            <span>{item.subfolderName}</span>
            <span>{item.date}</span>
          </div>
        </div>
      )}
    </div>
  );
};
