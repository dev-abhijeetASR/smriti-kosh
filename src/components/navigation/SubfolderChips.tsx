'use client';

import React from 'react';
import { Folder, FolderPlus, Sparkles } from 'lucide-react';
import { SubFolder } from '@/types/gallery';

interface SubfolderChipsProps {
  subfolders: SubFolder[];
  activeSubfolderId: string | null;
  onSelectSubfolder: (subfolderId: string | null) => void;
  totalOccasionItems: number;
  onCreateFolderClick: () => void;
}

export const SubfolderChips: React.FC<SubfolderChipsProps> = ({
  subfolders,
  activeSubfolderId,
  onSelectSubfolder,
  totalOccasionItems,
  onCreateFolderClick,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
      {/* "All Photos & Videos" Chip */}
      <button
        onClick={() => onSelectSubfolder(null)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
          activeSubfolderId === null
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent shadow-sm'
            : 'bg-white dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>All Moments</span>
        <span
          className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
            activeSubfolderId === null
              ? 'bg-zinc-700 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
          }`}
        >
          {totalOccasionItems}
        </span>
      </button>

      {/* Individual Subfolder Chips (e.g. Family, Stage Ceremony, Colleagues, Dinner) */}
      {subfolders.map((folder) => {
        const isActive = activeSubfolderId === folder.id;
        return (
          <button
            key={folder.id}
            onClick={() => onSelectSubfolder(folder.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-indigo-600 text-white border-transparent shadow-sm shadow-indigo-500/20'
                : 'bg-white dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <Folder className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-amber-500'}`} />
            <span>{folder.name}</span>
            <span
              className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                isActive
                  ? 'bg-indigo-700 text-white'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
              }`}
            >
              {folder.itemCount}
            </span>
          </button>
        );
      })}

      {/* Add Subfolder Action */}
      <button
        onClick={onCreateFolderClick}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-dashed border-indigo-300 dark:border-indigo-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors whitespace-nowrap"
      >
        <FolderPlus className="w-3.5 h-3.5" />
        <span>New Folder</span>
      </button>
    </div>
  );
};
