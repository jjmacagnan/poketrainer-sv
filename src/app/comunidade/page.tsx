"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import type { YouTubeVideo } from "@/app/api/youtube/route";

function YouTubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.037.05a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .083-.026c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) return `${Math.floor(days / 7)} sem. atrás`;
  if (days < 365) return `${Math.floor(days / 30)} meses atrás`;
  return `${Math.floor(days / 365)} anos atrás`;
}

function VideoSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 animate-pulse">
      <div className="aspect-video bg-white/5" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function ComunidadePage() {
  const { t } = useI18n();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    fetch("/api/youtube?maxResults=8")
      .then((r) => r.json())
      .then((data) => {
        setVideos(data.videos ?? []);
        setConfigured(data.configured ?? false);
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1
          className="mb-3 text-4xl font-black tracking-tight sm:text-5xl"
          style={{
            background: "linear-gradient(135deg, #22D3EE, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("comunidade.title")}
        </h1>
        <p className="text-lg text-gray-400">{t("comunidade.subtitle")}</p>
      </div>

      {/* Canal YouTube */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/10 to-orange-500/10 p-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="shrink-0 overflow-hidden rounded-2xl">
            <Image
              src="/images/JJ_Bit_logo.jpg"
              alt="JJ Bit"
              width={96}
              height={96}
              className="rounded-2xl"
            />
          </div>
          <div className="flex-1">
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-red-400">
              YouTube
            </p>
            <h2 className="mb-1 text-2xl font-black text-white">JJ Bit</h2>
            <p className="mb-4 text-sm text-gray-400">{t("comunidade.youtubeDesc")}</p>
            <a
              href="https://www.youtube.com/@JJBit-games"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-500"
            >
              <YouTubeIcon />
              {t("comunidade.youtubeBtn")}
            </a>
          </div>
        </div>
      </div>

      {/* Discord */}
      <div className="mb-10 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Discord
            </p>
            <h2 className="mb-1 text-xl font-black text-white">{t("comunidade.discordTitle")}</h2>
            <p className="text-sm text-gray-400">{t("comunidade.discordDesc")}</p>
          </div>
          <a
            href="https://discord.gg/AdReDaWmBw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
          >
            <DiscordIcon />
            {t("comunidade.discordBtn")}
          </a>
        </div>
      </div>

      {/* Vídeos */}
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
          {t("comunidade.videosTitle")}
        </h3>

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <VideoSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !configured && (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-gray-500">
            Configure <code className="text-gray-400">YOUTUBE_API_KEY</code> e{" "}
            <code className="text-gray-400">YOUTUBE_CHANNEL_ID</code> no{" "}
            <code className="text-gray-400">.env.local</code> para exibir vídeos.
          </div>
        )}

        {!loading && configured && videos.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-gray-500">
            Nenhum vídeo encontrado.
          </div>
        )}

        {!loading && videos.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-colors hover:border-red-500/40 hover:bg-white/10"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold text-gray-100 group-hover:text-white">
                    {video.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatRelativeDate(video.publishedAt)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && videos.length > 0 && (
          <div className="mt-4 text-center">
            <a
              href="https://www.youtube.com/@JJBit-games"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-gray-300 transition-colors hover:border-white/20 hover:text-white"
            >
              <YouTubeIcon />
              {t("comunidade.viewAllVideos")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
