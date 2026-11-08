'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Folder, 
  ChevronRight, 
  Calendar, 
  Sparkles, 
  Video, 
  Images,
  FolderOpen,
  HardDrive,
  ExternalLink
} from 'lucide-react';
import { getAllAlbums } from '@/lib/albums-data';
import { Navbar } from '@/components/navigation/Navbar';
import { ViewFilter, ViewLayout } from '@/types/gallery';

export default function HomePage() {
  const albums = getAllAlbums();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ViewFilter>('all');
  const [activeLayout, setActiveLayout] = useState<ViewLayout>('grid');

  const filteredAlbums = albums.filter((album) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      album.title.toLowerCase().includes(q) ||
      album.subtitle.toLowerCase().includes(q) ||
      album.subfolders.some((f) => f.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeLayout={activeLayout}
        onLayoutChange={setActiveLayout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-950 via-zinc-900 to-black text-white p-6 sm:p-10 mb-10 shadow-2xl border border-amber-900/40">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3.5 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>॥ शुभ स्मृति ॥ • Sacred Memories Vault</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              स्मृति कोष <span className="text-2xl sm:text-3xl font-light text-zinc-300 ml-1">• Smriti Kosh</span>
            </h1>
            <p className="text-amber-200/90 text-sm sm:text-base font-medium mt-2">
              जीवन के पावन उत्सव और अमूल्य क्षणों का संचय
            </p>
            <p className="text-zinc-300 text-xs sm:text-sm mt-2 leading-relaxed">
              The Sacred Treasury of Family Milestones, Ceremonies & Cherished Memories. 
              Organized with Google Drive-style folders and an immersive Google Photos viewer.
            </p>
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <a
                href="https://drive.google.com/drive/folders/1t3wSdKDUo7eSVLNxofylMkVO0zU7ChgY"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold transition-all shadow-sm"
              >
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                <span>Original 14MB Raw Photos Vault (Google Drive)</span>
                <ExternalLink className="w-3 h-3 text-amber-300 ml-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Occasions / Folders Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                पावन उत्सव एवं प्रसंग <span className="text-sm font-normal text-zinc-400">(Occasion Albums)</span>
              </h2>
            </div>
            <span className="text-xs text-zinc-500">
              {filteredAlbums.length} {filteredAlbums.length === 1 ? 'Occasion' : 'Occasions'}
            </span>
          </div>

          {/* Occasion Folder Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAlbums.map((album) => {
              const videoCount = album.items.filter((i) => i.type === 'video').length;
              const photoCount = album.items.filter((i) => i.type === 'image').length;

              return (
                <Link
                  key={album.id}
                  href={`/album/${album.id}`}
                  className="group relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 shadow-md hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col"
                >
                  {/* Album Cover Picture */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-zinc-800">
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Occasion Date & Counts */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        {album.date}
                      </span>
                    </div>

                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                        <Images className="w-3.5 h-3.5 text-amber-400" />
                        {photoCount}
                      </span>
                      {videoCount > 0 && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                          <Video className="w-3.5 h-3.5 text-rose-400" />
                          {videoCount}
                        </span>
                      )}
                    </div>

                    {/* Bottom Title in Cover */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl sm:text-2xl font-bold leading-tight group-hover:text-amber-200 transition-colors">
                        {album.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 mt-1 line-clamp-1">
                        {album.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Subfolder Previews inside this Occasion */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2.5">
                        Included Subfolders:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {album.subfolders.map((folder) => (
                          <span
                            key={folder.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-zinc-200/60 dark:border-zinc-700/60"
                          >
                            <Folder className="w-3 h-3 text-amber-500" />
                            {folder.name}
                            <span className="text-[10px] text-zinc-400 ml-0.5">
                              ({folder.itemCount})
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                      <span>Open Full Occasion Gallery</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>॥ स्मृति कोष ॥ • Smriti Kosh — Preserving life&apos;s sacred family milestones & memories</p>
      </footer>
    </div>
  );
}
