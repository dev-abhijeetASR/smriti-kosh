export type MediaType = 'image' | 'video';
export type QualityMode = 'auto' | 'mobile' | 'hd';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  hdUrl?: string;       // Ultra HD / Original resolution for Wi-Fi & Desktop
  mobileUrl?: string;   // Data-saver compressed version for cellular networks
  thumbnailUrl: string; // Lightweight thumbnail for initial grid (6+ on screen)
  youtubeId?: string;   // For YouTube unlisted video stream
  occasionId: string;
  parentFolderId?: string;
  parentFolderName?: string;
  subfolderId: string;
  subfolderName: string;
  date: string;
  duration?: string;    // For videos (e.g., '1:24')
  width?: number;
  height?: number;
  description?: string;
  fileSize?: string;
}

export interface ParentFolder {
  id: string;
  name: string;
  localPath?: string;
  description?: string;
  coverImage?: string;
  itemCount: number;
  subfolderIds: string[];
}

export interface SubFolder {
  id: string;
  name: string;
  parentId?: string | null;
  parentName?: string | null;
  localPath?: string;
  description?: string;
  coverImage?: string;
  itemCount: number;
}

export interface OccasionAlbum {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  coverImage: string;
  parentFolders?: ParentFolder[];
  subfolders: SubFolder[];
  items: MediaItem[];
}

export type ViewFilter = 'all' | 'image' | 'video';
export type ViewLayout = 'grid' | 'masonry' | 'compact';
