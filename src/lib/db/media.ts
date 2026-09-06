import { v4 as uuid } from "uuid";
import { db } from "./index";
import type { Media } from "@/types";

const objectUrlCache = new Map<string, string>();

export async function storeMedia(file: File): Promise<Media> {
  const media: Media = {
    id: uuid(),
    blob: file,
    mimeType: file.type,
    filename: file.name,
    size: file.size,
    createdAt: new Date().toISOString(),
  };

  await db.media.add(media);
  return media;
}

export async function getMedia(id: string): Promise<string | null> {
  if (objectUrlCache.has(id)) {
    return objectUrlCache.get(id)!;
  }

  const media = await db.media.get(id);
  if (!media) return null;

  const url = URL.createObjectURL(media.blob);
  objectUrlCache.set(id, url);
  return url;
}

export async function getMediaRecord(id: string): Promise<Media | undefined> {
  return db.media.get(id);
}

export async function deleteMedia(id: string): Promise<void> {
  const cached = objectUrlCache.get(id);
  if (cached) {
    URL.revokeObjectURL(cached);
    objectUrlCache.delete(id);
  }
  await db.media.delete(id);
}

export async function getStorageUsage(): Promise<{
  used: number;
  quota: number;
  percentage: number;
}> {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    const used = estimate.usage ?? 0;
    const quota = estimate.quota ?? 0;
    return {
      used,
      quota,
      percentage: quota > 0 ? (used / quota) * 100 : 0,
    };
  }
  return { used: 0, quota: 0, percentage: 0 };
}

export function revokeAllObjectUrls(): void {
  for (const url of objectUrlCache.values()) {
    URL.revokeObjectURL(url);
  }
  objectUrlCache.clear();
}
