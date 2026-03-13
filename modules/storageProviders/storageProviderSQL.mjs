import "dotenv/config";
import pkg from "pg";
import crypto from "crypto";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// -------------------------
// RETRY HELPER
// -------------------------
async function retry(fn, retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      console.warn(`Retry ${i + 1} failed: ${err.message}`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error("Database connection failed after retries");
}

// -------------------------
// DATABASE INITIALIZATION
// -------------------------
export async function initDB() {
  await retry(async () => {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        consent BOOLEAN NOT NULL
      );
    `);

    // Reminders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        category TEXT,
        date DATE
      );
    `);
  });

  await pool.query(`
  ALTER TABLE reminders
  ADD COLUMN IF NOT EXISTS category TEXT;
  UPDATE reminders SET category = ' ' WHERE category IS NULL;
`);
  await pool.query(`
    ALTER TABLE reminders
    ADD COLUMN IF NOT EXISTS date DATE;
  `);

  console.log("Database initialized!");
}

// -------------------------
// USERS FUNCTIONS
// -------------------------
export async function createUser(id, username, password, consent) {
  const result = await pool.query(
    `INSERT INTO users (id, username, password, consent) VALUES ($1, $2, $3, $4) RETURNING *`,
    [id, username, password, consent]
  );
  return result.rows[0];
}

export async function getUserByUsername(username) {
  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
  return result.rows[0];
}

export async function getUsers() {
  const result = await pool.query(`SELECT id, username FROM users ORDER BY username`);
  return result.rows;
}

export async function deleteUser(id) {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows.length > 0;
}

// -------------------------
// REMINDERS FUNCTIONS
// -------------------------
export async function createReminder(id, userId, title, description, category, date) {
  const result = await pool.query(
    `INSERT INTO reminders (id, user_id, title, description, category, date) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [id, userId, title, description, category, date]
  );
  return result.rows[0];
}

export async function getRemindersForUser(userId) {
  const result = await pool.query(
    `SELECT * FROM reminders WHERE user_id = $1 ORDER BY completed, date NULLS LAST`,
    [userId]
  );
  return result.rows;
}

export async function completeReminder(id, userId) {
  const result = await pool.query(
    `UPDATE reminders SET completed = TRUE WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, userId]
  );
  return result.rows[0];
}

export async function deleteReminder(id, userId) {
  const result = await pool.query(
    `DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, userId]
  );

  return result.rows[0];
}

export async function updateReminder(id, userId, title, description, category, date) {
  const result = await pool.query(
    `UPDATE reminders
     SET title = $3, description = $4, category = $5, date = $6
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId, title, description, category, date]
  );

  return result.rows[0];
}
// -------------------------
// EXPORT POOL
// -------------------------
export { pool };