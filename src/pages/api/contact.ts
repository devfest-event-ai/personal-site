import { db } from "@/db";
import { contacts } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { APIRoute } from "astro";

const TURNSTILE_SECRET = import.meta.env.TURNSTILE_SECRET_KEY ?? "";
const RATE_LIMIT_SECONDS = 60;

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: TURNSTILE_SECRET,
      response: token,
      remoteip: ip,
    }),
  });
  const data = await res.json();
  return data.success === true;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");
    const turnstileToken = formData.get("cf-turnstile-response");

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!turnstileToken || typeof turnstileToken !== "string") {
      return new Response(
        JSON.stringify({ error: "CAPTCHA verification required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get client IP from headers
    const ip =
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for") ??
      "127.0.0.1";

    const isValid = await verifyTurnstile(turnstileToken, ip);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "CAPTCHA verification failed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check for duplicate submission (same email within rate limit window)
    const recentSubmission = await db
      .select({ submittedAt: contacts.submittedAt })
      .from(contacts)
      .where(eq(contacts.email, String(email)))
      .orderBy(contacts.submittedAt)
      .limit(1);

    if (recentSubmission.length > 0) {
      const lastSubmitTime = new Date(recentSubmission[0].submittedAt);
      const now = new Date();
      const timeDiff = (now.getTime() - lastSubmitTime.getTime()) / 1000;

      if (timeDiff < RATE_LIMIT_SECONDS) {
        const retryAfter = Math.ceil(RATE_LIMIT_SECONDS - timeDiff);
        return new Response(
          JSON.stringify({
            error: `You've recently submitted a message. Please wait ${retryAfter} seconds before trying again.`,
            retryAfter,
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Insert using Drizzle ORM
    await db.insert(contacts).values({
      name: String(name),
      email: String(email),
      subject: String(subject),
      message: String(message),
    });

    return new Response(
      JSON.stringify({
        success: true,
        retryAfter: RATE_LIMIT_SECONDS,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to submit form" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
