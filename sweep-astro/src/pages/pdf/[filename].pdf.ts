import type { APIRoute } from 'astro';
import { fetchPdfFile, fetchPdfFiles } from '@/lib/fetchCMSData';

interface CustomAPIRoute extends APIRoute {
  params: {
    filename: string;
  };
}

const data = await fetchPdfFiles();
const medias = data?.mediaItems?.nodes;

export async function GET({ params }: CustomAPIRoute) {
  const { filename } = params;
  const data = await fetchPdfFile(filename);
  if (!data.mediaItem?.mediaItemUrl) throw new Error('No mediaItemUrl found');
  const response = await fetch(data.mediaItem?.mediaItemUrl);

  return new Response(await response.arrayBuffer());
}

export function getStaticPaths() {
  const paths =
    medias?.map((media) => {
      if (media?.slug) {
        return {
          params: {
            filename: media?.slug,
          },
        };
      }
      return null;
    }) ?? [];

  const validPaths = paths.filter((path) => path !== null);

  return validPaths;
}
