'use client';

import React from 'react';
import { MediaCard } from './MediaCard';
import { MediaItem, ViewLayout } from '@/types/gallery';
import { ImageOff } from 'lucide-react';

interface PhotosGridProps {
  items: MediaItem[];
  onItemClick: (index: number) => void;
  layout?: ViewLayout;
}

export const PhotosGrid: React.FC<PhotosGridProps> = ({
  items,
  onItemClick,
  layout = 'grid',
}) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
          <ImageOff className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          No photos or videos found
        </h3>
        <p className="text-sm text-zinc-500 max-w-sm mt-1">
          Try clearing your search query or switching to a different folder to see memories.
        </p>
      </div>
    );
  }

  // Grid density classes:
  // - Default: 2 cols on mobile, 3 on small tablet, 4 on tablet, 5 on desktop, 6 on xl
  //   Guarantees at least 6 photos are immediately visible in the primary viewport!
  // - Compact: 3 cols on mobile, 4 on small tablet, 5 on tablet, 6 on desktop, 7 on xl
  const gridClasses =
    layout === 'compact'
      ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5 sm:gap-2'
      : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3';

  return (
    <div className="w-full">
      <div className={gridClasses}>
        {items.map((item, index) => (
          <MediaCard
            key={item.id}
            item={item}
            index={index}
            onClick={() => onItemClick(index)}
            layout={layout === 'compact' ? 'compact' : 'grid'}
          />
        ))}
      </div>
    </div>
  );
};
