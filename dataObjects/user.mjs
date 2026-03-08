// user.mjs
import * as storage from "../modules/storageProviders/storageProviderSQL.mjs";
import { hashPassword, generateToken, generateID } from "../modules/security.mjs";

export async function createUser(username, password, consentToToS) {
  if (!username || username.trim().length < 3)
    throw new Error("Username must be at least 3 characters long");
  if (!password || password.length < 6)
    throw new Error("Password must be at least 6 characters long");
  if (!consentToToS) throw new Error("Consent required");

  const id = generateID();
  const hashedPassword = hashPassword(password);

  return await storage.createUser(id, username.trim(), hashedPassword, consentToToS);
}

export async function loginUser(username, password) {


  const user = await storage.getUserByUsername(username);


  if (!user) throw new Error("Invalid credentials");

  const hashed = hashPassword(password);

  if (hashed !== user.password) throw new Error("Invalid credentials");

  const token = generateToken(user.id);

  return { token };
}

export async function getUsers() {
  return await storage.getUsers();
}

export async function deleteUser(id) {
  return await storage.deleteUser(id);
}