import { GENIUS_ACCESS_TOKEN } from '#config';
import { getLyrics as GL } from 'genius-lyrics-api';

async function getLyrics(title: string, artist: string) {
  const options = {
    apiKey: GENIUS_ACCESS_TOKEN!,
    title: title,
    artist,
    optimizeQuery: true,
  };

  return (await GL(options)) as string;
}

export default getLyrics;
