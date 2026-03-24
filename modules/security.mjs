import { createHmac, randomUUID } from "node:crypto";

const secret = process.env.SECRET || "devsecret";

export function hashPassword(password) {
  const hmac = createHmac("sha256", secret);
  hmac.update(password);
  return hmac.digest("hex");
}
export function generateToken(userId) {
  const id = String(userId);
  const hmac = createHmac("sha256", secret);
  hmac.update(id);
  const signature = hmac.digest("hex");
  return `${id}.${signature}`;
}

export function verifyToken(token) {
  const [userId, signature] = token.split(".");
  if (!userId || !signature) return null;

  const hmac = createHmac("sha256", secret);
  hmac.update(String(userId));
  const expected = hmac.digest("hex");

  return signature === expected ? userId : null;
}

export function generateID() {
  return randomUUID();
}