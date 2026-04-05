import { turso } from "@/lib/turso";
import type { APIRoute } from "astro";

const TURNSTILE_SECRET = import.meta.env.TURNSTILE_SECRET_KEY ?? "";

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

    await turso.execute(
      "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [String(name), String(email), String(subject), String(message)]
    );

    return new Response(
      JSON.stringify({ success: true }),
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
