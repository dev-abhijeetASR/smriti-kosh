'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Folder } from 'lucide-react';

interface DriveBreadcrumbsProps {
  occasionTitle: string;
  occasionId: string;
  activeSubfolderName?: string;
  totalItems: number;
}

export const DriveBreadcrumbs: React.FC<DriveBreadcrumbsProps> = ({
  occasionTitle,
  occasionId,
  activeSubfolderName,
  totalItems,
}) => {
  return (
    <nav className="flex items-center flex-wrap gap-2 text-sm text-zinc-600 dark:text-zinc-400 py-4">
      {/* Home Breadcrumb */}
      <Link 
        href="/"
        className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
      >
        <Home className="w-4 h-4 text-zinc-400" />
        <span>Occasions</span>
      </Link>

      <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />

      {/* Occasion Breadcrumb */}
      <Link
        href={`/album/${occasionId}`}
        className={`flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium ${
          !activeSubfolderName ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : ''
        }`}
      >
        <Folder className="w-4 h-4 text-amber-500" />
        <span className="truncate max-w-[200px] sm:max-w-none">{occasionTitle}</span>
      </Link>

      {/* Optional Subfolder Breadcrumb */}
      {activeSubfolderName && (
        <>
          <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 font-semibold bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-xs sm:text-sm">
            <Folder className="w-3.5 h-3.5 text-indigo-500" />
            <span>{activeSubfolderName}</span>
          </div>
        </>
      )}

      {/* Counter Badge */}
      <span className="ml-auto text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
        {totalItems} {totalItems === 1 ? 'item' : 'items'}
      </span>
    </nav>
  );
};
