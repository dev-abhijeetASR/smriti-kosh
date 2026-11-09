import { OccasionAlbum } from '@/types/gallery';
import processedData from './processed-albums.json';
import weddingData from './wedding-album.json';

const retirementOccasion = processedData.occasion as unknown as OccasionAlbum;
const weddingOccasion = weddingData.occasion as unknown as OccasionAlbum;

export const INITIAL_ALBUMS: OccasionAlbum[] = [
  retirementOccasion,
  weddingOccasion,
];

export function getAlbumById(id: string): OccasionAlbum | undefined {
  return INITIAL_ALBUMS.find((album) => album.id === id);
}

export function getAllAlbums(): OccasionAlbum[] {
  return INITIAL_ALBUMS;
}
