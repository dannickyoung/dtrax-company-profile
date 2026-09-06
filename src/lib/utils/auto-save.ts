import { updateSlide } from "@/lib/db/slides";
import { updatePresentation } from "@/lib/db/presentations";
import { listSlides } from "@/lib/db/slides";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Slide } from "@/types";

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export function scheduleSave(
  slide: Slide,
  updates: Partial<Slide>,
  presentationId: string
) {
  if (saveTimeout) clearTimeout(saveTimeout);

  useEditorStore.getState().setDirty(true);

  saveTimeout = setTimeout(async () => {
    useEditorStore.getState().setSaving(true);
    try {
      await updateSlide(slide.id, updates);

      const slides = await listSlides(presentationId);
      await updatePresentation(presentationId, {
        slideCount: slides.length,
      });

      useEditorStore.getState().setDirty(false);
    } finally {
      useEditorStore.getState().setSaving(false);
    }
  }, 500);
}

export function cancelPendingSave() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }
}
