export interface PresentationEntry {
  slug: string;
  title: string;
  weekNumber: number;
  year: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  slideCount: number;
  status: "draft" | "complete";
  /** PDF export in /public, served for download from the dashboard. */
  pdf?: string;
}

export const presentations: PresentationEntry[] = [
  {
    slug: "dtrax-company-profile",
    title: "D'trax · Company Profile",
    weekNumber: 37,
    year: 2026,
    dateRangeStart: "2026-09-07",
    dateRangeEnd: "2026-09-07",
    slideCount: 71,
    status: "draft",
    pdf: "/dtrax-company-profile-2026.pdf",
  },
  {
    slug: "dtrax-bd-deck",
    title: "D'trax · BD Deck",
    weekNumber: 44,
    year: 2026,
    dateRangeStart: "2026-10-30",
    dateRangeEnd: "2026-10-30",
    slideCount: 31,
    status: "draft",
    pdf: "/dtrax-bd-deck-2026.pdf",
  },
  {
    slug: "dtrax-employee-handbook",
    title: "D'trax · Employee Handbook",
    weekNumber: 44,
    year: 2026,
    dateRangeStart: "2026-10-30",
    dateRangeEnd: "2026-10-30",
    slideCount: 33,
    status: "draft",
    pdf: "/dtrax-employee-handbook.pdf",
  },
];
