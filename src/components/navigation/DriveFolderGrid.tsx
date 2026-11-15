'use client';

import React from 'react';
import { Folder, FolderOpen, ChevronRight, HardDrive, Video, Image as ImageIcon } from 'lucide-react';
import { ParentFolder, SubFolder } from '@/types/gallery';

interface DriveFolderGridProps {
  parentFolders?: ParentFolder[];
  subfolders: SubFolder[];
  activeParentFolderId: string | null;
  activeSubfolderId: string | null;
  onSelectParentFolder: (parentId: string | null) => void;
  onSelectSubfolder: (subfolderId: string | null) => void;
}

export const DriveFolderGrid: React.FC<DriveFolderGridProps> = ({
  parentFolders = [],
  subfolders,
  activeParentFolderId,
  activeSubfolderId,
  onSelectParentFolder,
  onSelectSubfolder,
}) => {
  // If no parent folder is active, show the top-level parent folders
  if (!activeParentFolderId) {
    if (parentFolders.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              मुख्य फ़ोल्डर • Primary Folders
            </h3>
          </div>
          <span className="text-xs text-zinc-400">
            Click to open folder & view subfolders
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {parentFolders.map((parent) => {
            const childSubs = subfolders.filter((s) => s.parentId === parent.id);
            const totalCount = childSubs.reduce((acc, curr) => acc + curr.itemCount, 0) || parent.itemCount;
            const isVideoFolder = parent.id.includes('video') || parent.id.includes('mom-dad') || parent.id.includes('shekhar');

            return (
              <button
                key={parent.id}
                onClick={() => {
                  onSelectParentFolder(parent.id);
                  onSelectSubfolder(null);
                }}
                className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 hover:border-amber-500/60 hover:shadow-lg dark:hover:shadow-amber-500/5 transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isVideoFolder 
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    <Folder className="w-5 h-5 fill-current opacity-90" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors truncate">
                      {parent.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <span>{childSubs.length} subfolders</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        {isVideoFolder ? <Video className="w-3 h-3 text-rose-400" /> : <ImageIcon className="w-3 h-3 text-amber-400" />}
                        {totalCount} items
                      </span>
                    </div>
                    {parent.localPath && (
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono truncate mt-0.5 max-w-[200px]">
                        📁 {parent.localPath.split('\\').slice(-1)[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 transition-colors flex-shrink-0 ml-2">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // A parent folder is active: show its subfolders!
  const currentParent = parentFolders.find((p) => p.id === activeParentFolderId);
  const childSubfolders = subfolders.filter((s) => s.parentId === activeParentFolderId);

  if (childSubfolders.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-indigo-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            {currentParent ? currentParent.name : 'उप-फ़ोल्डर'} • Subfolders
          </h3>
        </div>
        <button
          onClick={() => {
            onSelectParentFolder(null);
            onSelectSubfolder(null);
          }}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
        >
          <span>← Back to all main folders</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {childSubfolders.map((sub) => {
          const isActive = activeSubfolderId === sub.id;
          const isVideoSub = sub.id.includes('cd') || sub.id.includes('shekhar') || sub.id === 'videos';

          return (
            <button
              key={sub.id}
              onClick={() => onSelectSubfolder(isActive ? null : sub.id)}
              className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800 hover:border-indigo-500/60 hover:shadow-lg dark:hover:shadow-indigo-500/5'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isVideoSub
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                }`}>
                  <Folder className="w-5 h-5 fill-current opacity-90" />
                </div>
                <div className="min-w-0">
                  <h4 className={`text-sm font-bold truncate transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'
                  }`}>
                    {sub.name}
                  </h4>
                  <div className={`flex items-center gap-2 mt-0.5 text-xs ${
                    isActive ? 'text-indigo-100' : 'text-zinc-500 dark:text-zinc-400'
                  }`}>
                    <span className="flex items-center gap-1 font-medium">
                      {isVideoSub ? <Video className="w-3 h-3 text-rose-400" /> : <ImageIcon className="w-3 h-3 text-amber-400" />}
                      {sub.itemCount} {isVideoSub ? 'videos' : 'photos'}
                    </span>
                  </div>
                  {sub.localPath && (
                    <p className={`text-[10px] font-mono truncate mt-0.5 max-w-[200px] ${
                      isActive ? 'text-indigo-200' : 'text-zinc-400 dark:text-zinc-500'
                    }`}>
                      📁 {sub.localPath.split('\\').slice(-2).join(' \\ ')}
                    </p>
                  )}
                </div>
              </div>

              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ml-2 ${
                isActive ? 'text-white bg-white/10' : 'text-zinc-400 group-hover:text-indigo-500 group-hover:bg-indigo-500/10'
              }`}>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
