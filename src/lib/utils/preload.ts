import { getMedia } from "@/lib/db/media";
import type { Slide } from "@/types";

export async function preloadSlideMedia(
  slides: Slide[]
): Promise<Map<string, string>> {
  const urlMap = new Map<string, string>();
  const mediaPattern = /media:\/\/([a-f0-9-]+)/g;

  const mediaIds = new Set<string>();
  for (const slide of slides) {
    const matches = slide.bodyMarkdown.matchAll(mediaPattern);
    for (const match of matches) {
      mediaIds.add(match[1]);
    }
    for (const id of slide.mediaIds) {
      mediaIds.add(id);
    }
  }

  await Promise.all(
    [...mediaIds].map(async (id) => {
      const url = await getMedia(id);
      if (url) urlMap.set(id, url);
    })
  );

  return urlMap;
}
