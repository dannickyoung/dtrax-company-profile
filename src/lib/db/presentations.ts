import { v4 as uuid } from "uuid";
import { db } from "./index";
import { createSlide, listSlides, deleteSlide } from "./slides";
import { deleteMedia } from "./media";
import { getCurrentWeek, formatDateRange } from "@/lib/utils/week";
import type { Presentation } from "@/types";

export async function createPresentation(): Promise<Presentation> {
  const now = new Date().toISOString();
  const week = getCurrentWeek();
  const dateLabel = formatDateRange(week.dateRangeStart, week.dateRangeEnd);

  const presentation: Presentation = {
    id: uuid(),
    title: `Week ${week.weekNumber}: ${dateLabel}`,
    weekNumber: week.weekNumber,
    year: week.year,
    dateRangeStart: week.dateRangeStart,
    dateRangeEnd: week.dateRangeEnd,
    status: "draft",
    slideCount: 5,
    createdAt: now,
    updatedAt: now,
  };

  await db.presentations.add(presentation);

  await createSlide(presentation.id, 0, {
    title: `Week ${week.weekNumber}: ${dateLabel}`,
    layoutVariant: "title-only",
  });
  await createSlide(presentation.id, 1, {
    title: "Accomplishments",
    layoutVariant: "title-only",
    sectionTag: "Accomplishments",
  });
  await createSlide(presentation.id, 2, {
    layoutVariant: "title-body",
    sectionTag: "Accomplishments",
  });
  await createSlide(presentation.id, 3, {
    title: "Explorations",
    layoutVariant: "title-only",
    sectionTag: "Explorations",
  });
  await createSlide(presentation.id, 4, {
    layoutVariant: "title-body",
    sectionTag: "Explorations",
  });

  return presentation;
}

export async function getPresentation(
  id: string
): Promise<Presentation | undefined> {
  return db.presentations.get(id);
}

export async function updatePresentation(
  id: string,
  updates: Partial<Omit<Presentation, "id" | "createdAt">>
): Promise<void> {
  await db.presentations.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deletePresentation(id: string): Promise<void> {
  const slides = await listSlides(id);

  const mediaIdsToCheck = new Set<string>();
  for (const slide of slides) {
    for (const mediaId of slide.mediaIds) {
      mediaIdsToCheck.add(mediaId);
    }
  }

  await db.transaction("rw", [db.presentations, db.slides], async () => {
    for (const slide of slides) {
      await deleteSlide(slide.id);
    }
    await db.presentations.delete(id);
  });

  for (const mediaId of mediaIdsToCheck) {
    const usedElsewhere = await db.slides
      .filter((s) => s.mediaIds.includes(mediaId))
      .count();
    if (usedElsewhere === 0) {
      await deleteMedia(mediaId);
    }
  }
}

export async function listPresentations(): Promise<Presentation[]> {
  return db.presentations.orderBy("createdAt").reverse().toArray();
}

export async function duplicatePresentation(id: string): Promise<Presentation> {
  const original = await getPresentation(id);
  if (!original) throw new Error(`Presentation ${id} not found`);

  const now = new Date().toISOString();
  const copy: Presentation = {
    ...original,
    id: uuid(),
    title: `${original.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };

  await db.presentations.add(copy);

  const originalSlides = await listSlides(id);
  for (const slide of originalSlides) {
    await createSlide(copy.id, slide.order, {
      title: slide.title,
      bodyMarkdown: slide.bodyMarkdown,
      layoutVariant: slide.layoutVariant,
      sectionTag: slide.sectionTag,
      accentColor: slide.accentColor,
      mediaIds: [...slide.mediaIds],
    });
  }

  return copy;
}

export async function renamePresentation(
  id: string,
  newTitle: string
): Promise<void> {
  await updatePresentation(id, { title: newTitle });
}

export async function toggleStatus(id: string): Promise<void> {
  const presentation = await getPresentation(id);
  if (!presentation) return;
  const newStatus = presentation.status === "draft" ? "complete" : "draft";
  await updatePresentation(id, { status: newStatus });
}
