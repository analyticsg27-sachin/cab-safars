/** Base path prefix — '/cabsafars' on Hostinger, '' on Vercel */
export const BP = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Prefix a public asset path with the correct base path */
export function asset(path: string): string {
  return `${BP}${path}`;
}
