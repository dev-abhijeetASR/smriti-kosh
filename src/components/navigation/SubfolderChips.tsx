'use client';

import React from 'react';
import { Folder, FolderPlus, Sparkles, ArrowLeft, Video, Image as ImageIcon } from 'lucide-react';
import { ParentFolder, SubFolder } from '@/types/gallery';

interface SubfolderChipsProps {
  parentFolders?: ParentFolder[];
  subfolders: SubFolder[];
  activeParentFolderId: string | null;
  activeSubfolderId: string | null;
  onSelectParentFolder: (parentId: string | null) => void;
  onSelectSubfolder: (subfolderId: string | null) => void;
  totalOccasionItems: number;
  onCreateFolderClick: () => void;
}

export const SubfolderChips: React.FC<SubfolderChipsProps> = ({
  parentFolders = [],
  subfolders,
  activeParentFolderId,
  activeSubfolderId,
  onSelectParentFolder,
  onSelectSubfolder,
  totalOccasionItems,
  onCreateFolderClick,
}) => {
  // Case A: A parent folder is selected (e.g. MOM-DAD, ShaadiShekhar, ShaadiMonu)
  if (activeParentFolderId) {
    const parent = parentFolders.find((p) => p.id === activeParentFolderId);
    const childSubs = subfolders.filter((s) => s.parentId === activeParentFolderId);
    const parentTotal = childSubs.reduce((acc, curr) => acc + curr.itemCount, 0) || parent?.itemCount || 0;

    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
        {/* Back to all folders button */}
        <button
          onClick={() => {
            onSelectParentFolder(null);
            onSelectSubfolder(null);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span>All Folders</span>
        </button>

        {/* View all in this parent folder */}
        <button
          onClick={() => onSelectSubfolder(null)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
            activeSubfolderId === null
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent shadow-sm'
              : 'bg-white dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          }`}
        >
          <Folder className="w-3.5 h-3.5 text-amber-500" />
          <span>All in {parent ? parent.name.split(' ')[0] : 'Folder'}</span>
          <span
            className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
              activeSubfolderId === null
                ? 'bg-zinc-700 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
            }`}
          >
            {parentTotal}
          </span>
        </button>

        {/* Child subfolders (e.g. CD1, CD2 or HALDI, TILAK, VIVAH) */}
        {childSubs.map((sub) => {
          const isActive = activeSubfolderId === sub.id;
          const isVideo = sub.id.includes('cd') || sub.id.includes('shekhar') || sub.id === 'videos';

          return (
            <button
              key={sub.id}
              onClick={() => onSelectSubfolder(sub.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-indigo-600 text-white border-transparent shadow-sm shadow-indigo-500/20'
                  : 'bg-white dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {isVideo ? (
                <Video className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-rose-500'}`} />
              ) : (
                <Folder className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-amber-500'}`} />
              )}
              <span>{sub.name}</span>
              <span
                className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? 'bg-indigo-700 text-white'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
                }`}
              >
                {sub.itemCount}
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
          <span>New Subfolder</span>
        </button>
      </div>
    );
  }

  // Case B: At root (No parent folder selected)
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
      {/* "All Moments" Chip */}
      <button
        onClick={() => {
          onSelectParentFolder(null);
          onSelectSubfolder(null);
        }}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
          activeParentFolderId === null && activeSubfolderId === null
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent shadow-sm'
            : 'bg-white dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>All Moments</span>
        <span
          className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
            activeParentFolderId === null && activeSubfolderId === null
              ? 'bg-zinc-700 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
          }`}
        >
          {totalOccasionItems}
        </span>
      </button>

      {/* Parent Folder Chips */}
      {parentFolders.length > 0 ? (
        parentFolders.map((parent) => {
          const childSubs = subfolders.filter((s) => s.parentId === parent.id);
          const totalCount = childSubs.reduce((acc, curr) => acc + curr.itemCount, 0) || parent.itemCount;
          const isVideo = parent.id.includes('video') || parent.id.includes('mom-dad') || parent.id.includes('shekhar');

          return (
            <button
              key={parent.id}
              onClick={() => {
                onSelectParentFolder(parent.id);
                onSelectSubfolder(null);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border bg-white dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              {isVideo ? (
                <Video className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>{parent.name}</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-full font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                {totalCount}
              </span>
            </button>
          );
        })
      ) : (
        subfolders.map((folder) => {
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
        })
      )}

      {/* Add Folder Action */}
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
