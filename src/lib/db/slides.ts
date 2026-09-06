import { v4 as uuid } from "uuid";
import { db } from "./index";
import type { Slide, LayoutVariant } from "@/types";

export async function createSlide(
  presentationId: string,
  order: number,
  options: {
    title?: string;
    bodyMarkdown?: string;
    layoutVariant?: LayoutVariant;
    sectionTag?: string;
    accentColor?: string;
    mediaIds?: string[];
  } = {}
): Promise<Slide> {
  const now = new Date().toISOString();
  const slide: Slide = {
    id: uuid(),
    presentationId,
    order,
    title: options.title ?? "",
    bodyMarkdown: options.bodyMarkdown ?? "",
    layoutVariant: options.layoutVariant ?? "title-body",
    sectionTag: options.sectionTag ?? "",
    accentColor: options.accentColor ?? "",
    mediaIds: options.mediaIds ?? [],
    createdAt: now,
    updatedAt: now,
  };

  await db.slides.add(slide);
  return slide;
}

export async function getSlide(id: string): Promise<Slide | undefined> {
  return db.slides.get(id);
}

export async function updateSlide(
  id: string,
  updates: Partial<Omit<Slide, "id" | "presentationId" | "createdAt">>
): Promise<void> {
  await db.slides.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteSlide(id: string): Promise<void> {
  await db.slides.delete(id);
}

export async function listSlides(presentationId: string): Promise<Slide[]> {
  return db.slides
    .where("presentationId")
    .equals(presentationId)
    .sortBy("order");
}

export async function reorderSlides(
  presentationId: string,
  fromIndex: number,
  toIndex: number
): Promise<void> {
  const slides = await listSlides(presentationId);
  if (fromIndex < 0 || fromIndex >= slides.length) return;
  if (toIndex < 0 || toIndex >= slides.length) return;

  const [moved] = slides.splice(fromIndex, 1);
  slides.splice(toIndex, 0, moved);

  await db.transaction("rw", db.slides, async () => {
    const now = new Date().toISOString();
    for (let i = 0; i < slides.length; i++) {
      await db.slides.update(slides[i].id, { order: i, updatedAt: now });
    }
  });
}
