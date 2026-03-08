import { get, post, del } from "../utils/fetchManager.mjs";

const BASE_URL = "/user";

export async function createUser(username, password) {

  const response = await fetch("/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password,
      consentToToS: true
    })
  });

if (!response.ok) {
  const errorText = await response.text();
  console.error("Create user error:", errorText);
  throw new Error("Failed to create user");
}

  return await response.json();
}

export async function deleteUser(id) {
    return await del(`${BASE_URL}/${id}`);
}

export async function getUsers() {
    return await get(BASE_URL);
}
