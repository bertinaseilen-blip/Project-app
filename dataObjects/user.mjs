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
    createdAt: new Date().toISOString()
  };

  Users[id] = user;
  return user;
}