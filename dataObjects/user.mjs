import * as storage from "../modules/storageProviders/storageProviderSQL.mjs";
import { hashPassword, generateToken, generateID } from "../modules/security.mjs";

export async function createUser(username, password, consentToToS) {
  if (!username || username.trim().length < 3)
    throw new Error("usernameTooShort");
  if (!password || password.length < 6)
    throw new Error("passwordTooShort");
  if (!consentToToS)  
    throw new Error("consentRequired");

  const id = generateID();
  const hashedPassword = hashPassword(password);

  return await storage.createUser(id, username.trim(), hashedPassword, consentToToS);
}

export async function loginUser(username, password) {

  const user = await storage.getUserByUsername(username);

  if (!user) throw new Error("invalidCredentials");

  const hashed = hashPassword(password);

  if (hashed !== user.password) throw new Error("invalidCredentials");

  const token = generateToken(user.id);

  return { token };
}

export async function getUsers() {
  return await storage.getUsers();
}

export async function getUserById(id) {
  return await storage.getUserById(id);
}

export async function deleteUser(id) {
  return await storage.deleteUser(id);
}

export async function getUserWithPasswordById(id) {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

export async function changePassword(userId, oldPassword, newPassword) {

  if (!newPassword || newPassword.length < 6) {
    throw new Error("passwordTooShort");
  }

  const user = await storage.getUserWithPasswordById(userId);

  if (!user) throw new Error("userNotFound");

  const oldHashed = hashPassword(oldPassword);

  if (oldHashed !== user.password) {
    throw new Error("invalidCredentials");
  }

  const newHashed = hashPassword(newPassword);

  return await storage.updateUserPassword(userId, newHashed);
}