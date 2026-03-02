import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    consent BOOLEAN NOT NULL
  );
`);
// -------------------------

export async function createUser(id, username, consent) {
  const result = await pool.query(
    "INSERT INTO users (id, username, consent) VALUES ($1, $2, $3) RETURNING *",
    [id, username, consent]
  );

  return result.rows[0];
}

// -------------------------

export async function getUsers() {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
}

// -------------------------

export async function deleteUser(id) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1",
    [id]
  );

  return result.rowCount > 0;
}