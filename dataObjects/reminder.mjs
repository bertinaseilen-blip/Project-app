import * as storage from "../modules/storageProviders/storageProviderSQL.mjs";

export async function createReminder(id, userId, title, description, category, date) {
  return await storage.createReminder(id, userId, title, description, category, date);
}

export async function getRemindersForUser(userId) {
  return await storage.getRemindersForUser(userId);
}

export async function completeReminder(id, userId) {
  return await storage.completeReminder(id, userId);
}

export async function deleteReminder(id, userId) {
  return await storage.deleteReminder(id, userId);
}

export async function updateReminder(id, userId, title, description, category, date) {
  return await storage.updateReminder(id, userId, title, description, category, date);
}