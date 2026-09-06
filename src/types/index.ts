import type { ReactNode } from "react";

export type LayoutVariant =
  | "title-body"
  | "title-only"
  | "full-bleed-media"
  | "split"
  | "quote";

export type PresentationStatus = "draft" | "complete";

export type Language = "en" | "zh";

export interface Presentation {
  id: string;
  title: string;
  weekNumber: number;
  year: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  status: PresentationStatus;
  slideCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Slide {
  id: string;
  presentationId: string;
  order: number;
  title: string;
  bodyMarkdown: string;
  layoutVariant: LayoutVariant;
  sectionTag: string;
  accentColor: string;
  mediaIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SlideInteractiveElement {
  kind: "placeholder" | "iframe" | "custom";
  title: string;
  description?: string;
  src?: string;
  ctaLabel?: string;
  aspectRatio?: string;
  sandbox?: string;
  render?: ReactNode;
}

export interface PresentationSlide {
  id: string;
  content: ReactNode;
  interactive?: SlideInteractiveElement;
}

export interface Media {
  id: string;
  blob: Blob;
  mimeType: string;
  filename: string;
  size: number;
  createdAt: string;
}

export interface UserPreferences {
  id: string;
  language: Language;
  lastActiveTab: string;
  lastEditedPresentationId: string;
  createdAt: string;
  updatedAt: string;
}
