import { OccasionAlbum } from '@/types/gallery';
import processedData from './processed-albums.json';
import weddingData from './wedding-album.json';
import zukData from './zuk-album.json';
import sonyData from './sony-album.json';
import onedriveData from './onedrive-album.json';

const retirementOccasion = processedData.occasion as unknown as OccasionAlbum;
const weddingOccasion = weddingData.occasion as unknown as OccasionAlbum;
const zukOccasion = zukData.occasion as unknown as OccasionAlbum;
const sonyOccasion = sonyData.occasion as unknown as OccasionAlbum;
const onedriveOccasion = onedriveData.occasion as unknown as OccasionAlbum;

export const INITIAL_ALBUMS: OccasionAlbum[] = [
  retirementOccasion,
  weddingOccasion,
  zukOccasion,
  sonyOccasion,
  onedriveOccasion,
];

export function getAlbumById(id: string): OccasionAlbum | undefined {
  return INITIAL_ALBUMS.find((album) => album.id === id);
}

export function getAllAlbums(): OccasionAlbum[] {
  return INITIAL_ALBUMS;
}
