import { defineMiddleware } from "astro:middleware";
import { ALLOWED_EMAILS } from "@/lib/auth-whitelist.js";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Bypass: auth API routes
  if (pathname.startsWith("/api/auth")) {
    return next();
  }

  // Protect all /admin/* except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    try {
      const { auth } = await import("@/lib/auth.js");

      const session = await auth.api
        .getSession({ headers: context.request.headers })
        .catch(() => null);

      if (!session) {
        return context.redirect("/admin/login");
      }

      if (!ALLOWED_EMAILS.includes(session.user.email)) {
        await auth.api
          .signOut({ headers: context.request.headers })
          .catch(() => {});
        return context.redirect("/admin/login?error=unauthorized");
      }
    } catch {
      return context.redirect("/admin/login");
    }
  }

  return next();
});
