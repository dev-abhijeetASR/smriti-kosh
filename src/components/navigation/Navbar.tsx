'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Images, 
  Search, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Layers, 
  PlusCircle, 
  FolderPlus 
} from 'lucide-react';
import { ViewFilter, ViewLayout } from '@/types/gallery';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: ViewFilter;
  onFilterChange: (filter: ViewFilter) => void;
  activeLayout: ViewLayout;
  onLayoutChange: (layout: ViewLayout) => void;
  onCreateFolderClick?: () => void;
  onUploadClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  activeLayout,
  onLayoutChange,
  onCreateFolderClick,
  onUploadClick,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Logo & Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 text-zinc-900 dark:text-zinc-100 font-semibold text-lg tracking-tight hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-rose-500/20">
              <Images className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent font-bold">
              Moments
            </span>
          </Link>

          {/* Search Bar - Google Drive / Photos style */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search photos, videos, relatives, occasions..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 rounded-full border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Filter Pills (All / Photos / Videos) */}
            <div className="hidden md:flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 text-xs font-medium">
              <button
                onClick={() => onFilterChange('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeFilter === 'all'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onFilterChange('image')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  activeFilter === 'image'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Photos
              </button>
              <button
                onClick={() => onFilterChange('video')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  activeFilter === 'video'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <VideoIcon className="w-3.5 h-3.5" />
                Videos
              </button>
            </div>

            {/* Layout Density Switcher */}
            <button
              onClick={() => onLayoutChange(activeLayout === 'grid' ? 'compact' : 'grid')}
              title={activeLayout === 'grid' ? 'Switch to Compact Grid (More visible)' : 'Switch to Standard Grid'}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Subfolder & Upload Action Buttons */}
            {onCreateFolderClick && (
              <button
                onClick={onCreateFolderClick}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <FolderPlus className="w-3.5 h-3.5 text-indigo-500" />
                New Folder
              </button>
            )}

            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all shadow-indigo-600/20 active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Media</span>
              </button>
            )}

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/dev-abhijeetASR/moments-gallery"
              target="_blank"
              rel="noopener noreferrer"
              title="View on GitHub"
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
