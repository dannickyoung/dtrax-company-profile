export interface PresentationEntry {
  slug: string;
  title: string;
  weekNumber: number;
  year: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  slideCount: number;
  status: "draft" | "complete";
}

export const presentations: PresentationEntry[] = [
  {
    slug: "dtrax-company-profile",
    title: "D'trax · Company Profile",
    weekNumber: 37,
    year: 2026,
    dateRangeStart: "2026-09-07",
    dateRangeEnd: "2026-09-07",
    slideCount: 24,
    status: "draft",
  },
];
