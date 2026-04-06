import { auth } from "@/lib/auth.js";
import type { APIContext } from "astro";

/**
 * Check if the current request has a valid admin session.
 * Returns the session if valid, null otherwise.
 */
export async function requireAdminSession(headers: Headers) {
  try {
    const session = await auth.api.getSession({ headers });
    if (!session) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Validate that an ID is a valid number string.
 * Returns the ID as a number, or null if invalid.
 */
export function validateId(id: string | FormDataEntryValue | null): number | null {
  if (!id) return null;
  const num = Number(id);
  if (isNaN(num) || num <= 0) return null;
  return num;
}
