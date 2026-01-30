const Users = {};

export function generateID() {
  let id;
  do {
    id = (Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
  } while (Users[id]);
  return id;
}

export function createUser(username, consentToToS) {
  if (!consentToToS) {
    throw new Error("Consent to Terms of Service is required");
  }

  const id = generateID();

  const user = {
    id,
    username,
    consentToToS,
  };

  Users[id] = user;
  return user;
}

export function deleteUser(id) {
  if (!Users[id]) return false;
  delete Users[id];
  return true;
}

export function getUsers() {
  return Object.values(Users);
}
