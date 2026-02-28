export const AUTH_COOKIE = "autoshield_token";

export type JwtPayload = {
  sub: string;
  login: string;
  iat: number;
  exp: number;
};

const encoder = new TextEncoder();

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof btoa === "function") {
    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary);
  }
  return Buffer.from(bytes).toString("base64");
}

function base64ToBytes(base64: string): Uint8Array {
  if (typeof atob === "function") {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(Buffer.from(base64, "base64"));
}

function base64UrlEncode(value: string | Uint8Array): string {
  const bytes = typeof value === "string" ? encoder.encode(value) : value;
  return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const bytes = base64ToBytes(padded);
  return new TextDecoder().decode(bytes);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmac(data: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return new Uint8Array(signature);
}

export async function signJwt(data: Omit<JwtPayload, "iat" | "exp">, secret: string, expiresInSeconds = 60 * 60 * 8): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    ...data,
    iat,
    exp: iat + expiresInSeconds
  };

  const headerEncoded = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const input = `${headerEncoded}.${payloadEncoded}`;
  const signature = await hmac(input, secret);

  return `${input}.${base64UrlEncode(signature)}`;
}

export async function verifyJwt(token: string, secret: string): Promise<JwtPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
  const input = `${headerEncoded}.${payloadEncoded}`;
  const expectedSig = base64UrlEncode(await hmac(input, secret));

  if (!constantTimeEqual(signatureEncoded, expectedSig)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadEncoded)) as JwtPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
