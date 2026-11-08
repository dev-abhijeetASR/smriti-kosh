'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { DriveBreadcrumbs } from '@/components/navigation/DriveBreadcrumbs';
import { SubfolderChips } from '@/components/navigation/SubfolderChips';
import { PhotosGrid } from '@/components/gallery/PhotosGrid';
import { LightboxViewer } from '@/components/gallery/LightboxViewer';
import { CreateFolderModal } from '@/components/modals/CreateFolderModal';
import { UploadMediaModal } from '@/components/modals/UploadMediaModal';
import { getAlbumById } from '@/lib/albums-data';
import { MediaItem, SubFolder, ViewFilter, ViewLayout } from '@/types/gallery';
import { Share2, Calendar, Folder, Check } from 'lucide-react';

interface AlbumClientViewProps {
  albumId: string;
}

export const AlbumClientView: React.FC<AlbumClientViewProps> = ({ albumId }) => {
  const initialAlbum = getAlbumById(albumId);

  // Fallback if not found
  if (!initialAlbum) {
    notFound();
  }

  // Active state
  const [subfolders, setSubfolders] = useState<SubFolder[]>(initialAlbum.subfolders);
  const [items, setItems] = useState<MediaItem[]>(initialAlbum.items);
  const [activeSubfolderId, setActiveSubfolderId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ViewFilter>('all');
  const [activeLayout, setActiveLayout] = useState<ViewLayout>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Sync subfolder counts whenever items change
  const currentSubfolders = useMemo(() => {
    return subfolders.map((f) => ({
      ...f,
      itemCount: items.filter((item) => item.subfolderId === f.id).length,
    }));
  }, [subfolders, items]);

  // Filter items by subfolder, type (all/image/video), and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Subfolder filter
      if (activeSubfolderId && item.subfolderId !== activeSubfolderId) {
        return false;
      }
      // 2. Media Type filter
      if (activeFilter !== 'all' && item.type !== activeFilter) {
        return false;
      }
      // 3. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSubfolder = item.subfolderName.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        return matchesTitle || matchesSubfolder || matchesDesc;
      }
      return true;
    });
  }, [items, activeSubfolderId, activeFilter, searchQuery]);

  // Active subfolder object
  const activeSubfolder = currentSubfolders.find((f) => f.id === activeSubfolderId);

  // Handle creating a new subfolder
  const handleCreateFolder = (name: string, description: string) => {
    const newId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newFolder: SubFolder = {
      id: newId,
      name,
      description,
      itemCount: 0,
      coverImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
    };
    setSubfolders((prev) => [...prev, newFolder]);
    setActiveSubfolderId(newId);
  };

  // Handle uploading/adding new media
  const handleAddMedia = (newItem: MediaItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  // Copy shareable link
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* 1. Global Navigation Bar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeLayout={activeLayout}
        onLayoutChange={setActiveLayout}
        onCreateFolderClick={() => setIsFolderModalOpen(true)}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      {/* 2. Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Breadcrumb Navigation - Google Drive style */}
        <DriveBreadcrumbs
          occasionTitle={initialAlbum.title}
          occasionId={initialAlbum.id}
          activeSubfolderName={activeSubfolder?.name}
          totalItems={filteredItems.length}
        />

        {/* Occasion Header Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white p-6 sm:p-8 mb-6 shadow-xl border border-zinc-800">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs sm:text-sm font-medium mb-2">
              <Calendar className="w-4 h-4" />
              <span>{initialAlbum.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Folder className="w-3.5 h-3.5" />
                {currentSubfolders.length} Subfolders
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {initialAlbum.title}
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {initialAlbum.subtitle}
            </p>

            <div className="flex items-center gap-3 mt-5 flex-wrap">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-all shadow-sm"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share Gallery Link</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-600/30"
              >
                <span>Add Photos & Videos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Subfolder Chips Navigation (Google Drive / Photos style) */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              स्मृति उप-फ़ोल्डर • Subfolders
            </h3>
            <span className="text-xs text-zinc-400">
              Select a folder to filter or view all
            </span>
          </div>

          <SubfolderChips
            subfolders={currentSubfolders}
            activeSubfolderId={activeSubfolderId}
            onSelectSubfolder={setActiveSubfolderId}
            totalOccasionItems={items.length}
            onCreateFolderClick={() => setIsFolderModalOpen(true)}
          />
        </div>

        {/* Current Active View Banner */}
        <div className="flex items-center justify-between py-2 mb-3 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {activeSubfolder ? activeSubfolder.name : 'All Photos & Videos'}
            </h2>
            <span className="text-xs text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full font-medium">
              {filteredItems.length}
            </span>
          </div>

          <p className="text-xs text-zinc-500 hidden sm:block">
            Click any photo to open full-screen gallery with navigation arrows
          </p>
        </div>

        {/* 3. Responsive Photos & Videos Grid (Guaranteed 6+ photos on screen) */}
        <PhotosGrid
          items={filteredItems}
          onItemClick={(idx) => setLightboxIndex(idx)}
          layout={activeLayout}
        />
      </main>

      {/* 4. Fullscreen Interactive Lightbox Modal */}
      {lightboxIndex !== null && (
        <LightboxViewer
          items={filteredItems}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}

      {/* 5. Modals for Adding Folders and Uploading Media */}
      <CreateFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
        occasionTitle={initialAlbum.title}
      />

      <UploadMediaModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        subfolders={currentSubfolders}
        occasionId={initialAlbum.id}
        onAddMedia={handleAddMedia}
      />
    </div>
  );
};
