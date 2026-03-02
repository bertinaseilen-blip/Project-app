import * as storage from "../modules/storageProviders/storageProvider.mjs";

export function generateID() {
  return (Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
}

export async function createUser(username, consentToToS) {

  if (!username || username.trim().length < 3) {
    throw new Error("Username must be at least 3 characters long");
  }

  if (!consentToToS) {
    throw new Error("Consent to Terms of Service is required");
  }

  const id = generateID();

  return await storage.createUser(id, username.trim(), consentToToS);
}

export async function getUsers() {
  return await storage.getUsers();
}

export async function deleteUser(id) {
  return await storage.deleteUser(id);
}
