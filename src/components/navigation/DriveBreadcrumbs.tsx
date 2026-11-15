'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Folder, HardDrive } from 'lucide-react';

interface DriveBreadcrumbsProps {
  occasionTitle: string;
  occasionId: string;
  parentFolderName?: string;
  onSelectParentFolder?: () => void;
  onSelectOccasionRoot?: () => void;
  activeSubfolderName?: string;
  localPath?: string;
  totalItems: number;
}

export const DriveBreadcrumbs: React.FC<DriveBreadcrumbsProps> = ({
  occasionTitle,
  occasionId,
  parentFolderName,
  onSelectParentFolder,
  onSelectOccasionRoot,
  activeSubfolderName,
  localPath,
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
      <button
        onClick={onSelectOccasionRoot}
        className={`flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-left ${
          !parentFolderName && !activeSubfolderName ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : ''
        }`}
      >
        <Folder className="w-4 h-4 text-amber-500" />
        <span className="truncate max-w-[200px] sm:max-w-none">{occasionTitle}</span>
      </button>

      {/* Parent Folder Breadcrumb (e.g. MOM-DAD, ShaadiShekhar, ShaadiMonu, 23.8.2025_Photos) */}
      {parentFolderName && (
        <>
          <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <button
            onClick={onSelectParentFolder}
            className={`flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-left ${
              !activeSubfolderName ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : ''
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-indigo-500" />
            <span className="truncate max-w-[180px] sm:max-w-none">{parentFolderName}</span>
          </button>
        </>
      )}

      {/* Subfolder Breadcrumb (e.g. CD1, CD2, HALDI, TILAK, Ceremony) */}
      {activeSubfolderName && (
        <>
          <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 font-semibold bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-xs sm:text-sm">
            <Folder className="w-3.5 h-3.5 text-rose-500" />
            <span>{activeSubfolderName}</span>
          </div>
        </>
      )}

      {/* Local Path Tag Badge (if available) */}
      {localPath && (
        <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-700/50">
          <HardDrive className="w-3 h-3 text-zinc-400" />
          {localPath}
        </span>
      )}

      {/* Counter Badge */}
      <span className="ml-auto text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
        {totalItems} {totalItems === 1 ? 'item' : 'items'}
      </span>
    </nav>
  );
};
