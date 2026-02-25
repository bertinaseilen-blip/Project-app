const Users = {};

export function generateID() {
  let id;
  do {
    id = (Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
  } while (Users[id]);
  return id;
}

export function createUser(username, consentToToS) {

  if (!username || username.trim().length < 3) {
    throw new Error("Username must be at least 3 characters long");
  }

  if (!consentToToS) {
    throw new Error("Consent to Terms of Service is required");
  }

  const exists = Object.values(Users).some(
    user => user.username === username
  );

  if (exists) {
    throw new Error("Username already exists");
  }

  const id = generateID();

  const user = {
    id,
    username: username.trim(),
    consentToToS
  };

  Users[id] = user;

  return user;
}

export function deleteUser(id) {
  if (!Users[id]) return false;

  delete Users[id]; // removes data + consent

  return true;
}

export function getUsers() {
  return Object.values(Users);
}
