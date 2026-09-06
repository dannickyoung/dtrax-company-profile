import { create } from "zustand";

interface EditorState {
  presentationId: string | null;
  currentSlideIndex: number;
  isDirty: boolean;
  isSaving: boolean;
  setPresentationId: (id: string | null) => void;
  setCurrentSlideIndex: (index: number) => void;
  setDirty: (dirty: boolean) => void;
  setSaving: (saving: boolean) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  presentationId: null,
  currentSlideIndex: 0,
  isDirty: false,
  isSaving: false,
  setPresentationId: (id) => set({ presentationId: id, currentSlideIndex: 0 }),
  setCurrentSlideIndex: (index) => set({ currentSlideIndex: index }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  setSaving: (saving) => set({ isSaving: saving }),
  reset: () =>
    set({
      presentationId: null,
      currentSlideIndex: 0,
      isDirty: false,
      isSaving: false,
    }),
}));
