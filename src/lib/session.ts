import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.SESSION_SECRET || "fallback_default_secret_key_change_me_in_production_982347";

function signSession(userId: string): string {
  const expires = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const data = `${userId}:${expires}`;
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}:${signature}`;
}

function verifySession(token: string): string | null {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return null;
    
    const [userId, expiresStr, signature] = parts;
    const expires = parseInt(expiresStr, 10);
    
    if (isNaN(expires) || expires < Date.now()) {
      return null; // Expired
    }
    
    const data = `${userId}:${expires}`;
    const expectedSignature = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
    
    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    
    if (sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return userId;
    }
  } catch (e) {
    console.error("Session verification failed:", e);
  }
  return null;
}

export async function setSession(userId: string) {
  const token = signSession(userId);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSessionUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;
    return verifySession(token);
  } catch (e) {
    console.error("Error reading session cookie:", e);
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
