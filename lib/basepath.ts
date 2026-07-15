/** Base path prefix — '/cabsafars' on Hostinger, '' on Vercel */
export const BP = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Prefix a public asset path with the correct base path */
export function asset(path: string): string {
  return `${BP}${path}`;
}

/** URL of the mobile app (Vercel) — used by landing page CTAs */
export const APP_URL = 'https://web-lake-nine-24.vercel.app';
