import { get, post, del } from "../utils/fetchManager.mjs";

const BASE_URL = "/user";

export async function createUser(username) {
    return await post(BASE_URL, {
        username,
        consentToToS: true
    });
}

export async function deleteUser(id) {
    return await del(`${BASE_URL}/${id}`);
}

export async function getUsers() {
    return await get(BASE_URL);
}
