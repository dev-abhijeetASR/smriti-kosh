export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  thumbnailUrl: string;
  occasionId: string;
  subfolderId: string;
  subfolderName: string;
  date: string;
  duration?: string; // For videos (e.g., '1:24')
  width?: number;
  height?: number;
  description?: string;
  fileSize?: string;
}

export interface SubFolder {
  id: string;
  name: string;
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
  subfolders: SubFolder[];
  items: MediaItem[];
}

export type ViewFilter = 'all' | 'image' | 'video';
export type ViewLayout = 'grid' | 'masonry' | 'compact';
