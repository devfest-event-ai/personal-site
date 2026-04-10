import { getSecret } from "astro:env/server";
import type { APIRoute } from "astro";
import { createSign } from "crypto";
import { requireAdminSession } from "@/lib/admin-auth";

function createJWT(email: string, privateKey: string): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" }),
  ).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const claim = Buffer.from(
    JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/drive",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  ).toString("base64url");

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const sig = signer.sign(privateKey, "base64url");
  return `${header}.${claim}.${sig}`;
}

async function getAccessToken(
  email: string,
  privateKey: string,
): Promise<string> {
  const jwt = createJWT(email, privateKey);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${text}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export const POST: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request.headers);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const email = getSecret("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const rawKey = getSecret("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  const folderId = getSecret("GOOGLE_DRIVE_FOLDER_ID");

  if (!email || !rawKey) {
    return new Response(
      JSON.stringify({
        error:
          "Google Drive not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const privateKey = rawKey.replace(/\\n/g, "\n");

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return new Response(JSON.stringify({ error: "No file provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!file.type.startsWith("image/")) {
    return new Response(
      JSON.stringify({ error: "Only image files are allowed" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  let accessToken: string;
  try {
    accessToken = await getAccessToken(email, privateKey);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Auth failed";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const metadata: Record<string, unknown> = {
    name: file.name,
    mimeType: file.type,
  };
  if (folderId) metadata.parents = [folderId];

  const boundary = `porto_${Date.now()}`;
  const fileBytes = await file.arrayBuffer();

  const metaPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const filePart = `--${boundary}\r\nContent-Type: ${file.type}\r\n\r\n`;
  const endPart = `\r\n--${boundary}--`;

  const body = Buffer.concat([
    Buffer.from(metaPart),
    Buffer.from(filePart),
    Buffer.from(fileBytes),
    Buffer.from(endPart),
  ]);

  const uploadRes = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id&supportsAllDrives=true",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    },
  );

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    return new Response(
      JSON.stringify({ error: "Upload failed", detail: errText }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const { id: fileId } = (await uploadRes.json()) as { id: string };

  const permRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?supportsAllDrives=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "reader", type: "anyone" }),
    },
  );

  if (!permRes.ok) {
    const errText = await permRes.text();
    return new Response(
      JSON.stringify({ error: "Failed to make file public", detail: errText }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;

  return new Response(JSON.stringify({ url, fileId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
