/** Base path for static hosting under a sub-directory (GitHub Pages). Empty locally. */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE}${path}`;
