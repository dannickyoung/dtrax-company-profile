function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getISOWeekYear(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
}

function getMondayOfWeek(weekNumber: number, year: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (weekNumber - 1) * 7);
  return monday;
}

export function getCurrentWeek(): {
  weekNumber: number;
  year: number;
  dateRangeStart: string;
  dateRangeEnd: string;
} {
  const now = new Date();
  const weekNumber = getISOWeekNumber(now);
  const year = getISOWeekYear(now);
  return {
    weekNumber,
    year,
    ...getWeekDateRange(weekNumber, year),
  };
}

export function formatWeekLabel(weekNumber: number, year: number): string {
  return `Week ${weekNumber}, ${year}`;
}

export function getWeekDateRange(
  weekNumber: number,
  year: number
): { dateRangeStart: string; dateRangeEnd: string } {
  const monday = getMondayOfWeek(weekNumber, year);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  return {
    dateRangeStart: monday.toISOString().split("T")[0],
    dateRangeEnd: sunday.toISOString().split("T")[0],
  };
}

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00Z");
  const e = new Date(end + "T00:00:00Z");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = s.toLocaleDateString("en-US", opts);
  const endStr = e.toLocaleDateString("en-US", opts);
  return `${startStr} – ${endStr}`;
}
