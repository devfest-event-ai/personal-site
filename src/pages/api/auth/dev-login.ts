import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { db } from "@/db/index.js";
import * as schema from "@/db/schema.js";
import { ALLOWED_EMAILS } from "@/lib/auth-whitelist.js";

export const prerender = false;

/** Serialize an error including its full cause chain */
function serializeError(err: unknown): object {
  if (!(err instanceof Error)) return { raw: String(err) };
  return {
    message: err.message,
    stack: err.stack,
    cause: err.cause ? serializeError(err.cause) : undefined,
  };
}

export const GET: APIRoute = async ({ request }) => {
  if (!import.meta.env.DEV) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const devEmail = ALLOWED_EMAILS[0];
    if (!devEmail) {
      return new Response(
        JSON.stringify({ error: "No email configured in ALLOWED_EMAILS" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Find existing user by email (may already exist from a real Google login)
    const rows = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(eq(schema.user.email, devEmail))
      .limit(1);

    let userId: string;

    if (rows.length > 0) {
      userId = rows[0].id;
    } else {
      userId = `dev-${crypto.randomUUID()}`;
      await db.insert(schema.user).values({
        id: userId,
        name: "Dev User",
        email: devEmail,
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Clean up old sessions for this user to avoid buildup
    await db.delete(schema.session).where(eq(schema.session.userId, userId));

    const sessionToken = crypto.randomUUID();
    await db.insert(schema.session).values({
      id: crypto.randomUUID(),
      token: sessionToken,
      userId,
      expiresAt,
      createdAt: now,
      updatedAt: now,
      ipAddress: request.headers.get("x-forwarded-for") ?? "127.0.0.1",
      userAgent: request.headers.get("user-agent") ?? "",
    });

    const maxAge = 7 * 24 * 60 * 60;
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin",
        "Set-Cookie": `better-auth.session_token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
      },
    });
  } catch (err) {
    return new Response(JSON.stringify(serializeError(err), null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
