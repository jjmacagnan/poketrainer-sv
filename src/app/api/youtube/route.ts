import { NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

export async function GET(request: Request) {
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    return NextResponse.json({ videos: [], configured: false });
  }

  const { searchParams } = new URL(request.url);
  const rawMax = parseInt(searchParams.get("maxResults") ?? "8", 10);
  const maxResults = Number.isFinite(rawMax) && rawMax > 0 ? Math.min(rawMax, 24) : 8;

  try {
    const url =
      `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet` +
      `&channelId=${YOUTUBE_CHANNEL_ID}` +
      `&order=date` +
      `&maxResults=${maxResults}` +
      `&type=video` +
      `&key=${YOUTUBE_API_KEY}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // cache por 1 hora no servidor
    });

    if (!res.ok) {
      return NextResponse.json({ videos: [], configured: true, error: res.status });
    }

    const data = await res.json();

    const videos: YouTubeVideo[] = (data.items ?? []).map(
      (item: {
        id: { videoId: string };
        snippet: {
          title: string;
          thumbnails: {
            medium?: { url: string };
            high?: { url: string };
            default?: { url: string };
          };
          publishedAt: string;
        };
      }) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail:
          item.snippet.thumbnails.high?.url ??
          item.snippet.thumbnails.medium?.url ??
          item.snippet.thumbnails.default?.url ??
          "",
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      })
    );

    return NextResponse.json({ videos, configured: true });
  } catch {
    return NextResponse.json({ videos: [], configured: true, error: "fetch_failed" });
  }
}
