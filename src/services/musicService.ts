export interface LyricsResult {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string;
  syncedLyrics: string;
}

const API_BASE_URL = 'https://lrclib.net/api';

/**
 * Searches for tracks on lrclib.net.
 * @param query The search query.
 * @returns A promise that resolves to an array of track results.
 */
export async function searchTracks(query: string): Promise<LyricsResult[]> {
  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error('Failed to search for tracks. The service may be down.');
  }

  const data = await response.json();
  return data.slice(0, 20); // Limit to 20 results
}

/**
 * Fetches the full details and lyrics for a specific track.
 * @param trackId The ID of the track.
 * @returns A promise that resolves to the full track data.
 */
export async function getTrackLyrics(trackId: number): Promise<LyricsResult> {
  const response = await fetch(`${API_BASE_URL}/get/${trackId}`);

  if (!response.ok) {
    throw new Error('Failed to get lyrics for the track.');
  }

  return response.json();
}