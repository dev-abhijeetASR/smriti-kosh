import { AlbumClientView } from './AlbumClientView';

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AlbumClientView albumId={id} />;
}
