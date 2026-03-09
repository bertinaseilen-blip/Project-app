import * as storage from "../modules/storageProviders/storageProviderSQL.mjs";

export async function createReminder(id, userId, title, description, category) {
  return await storage.createReminder(id, userId, title, description, category);
}

export async function getRemindersForUser(userId) {
  return await storage.getRemindersForUser(userId);
}

export async function completeReminder(id, userId) {
  return await storage.completeReminder(id, userId);
}