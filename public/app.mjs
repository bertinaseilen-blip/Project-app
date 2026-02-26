import { createUser, deleteUser, getUsers } from "./controllers/userController.mjs";

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("usernameInput");
  const checkbox = document.getElementById("tosCheck");
  const button = document.getElementById("createUserBtn");
  const list = document.getElementById("userList");

  async function loadUsers() {
    const users = await getUsers();
    list.innerHTML = "";

    users.forEach(user => {
      const li = document.createElement("li");
      li.textContent = user.username;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";

      deleteBtn.addEventListener("click", async () => {
        await deleteUser(user.id);
        loadUsers();
      });

      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  }

  button.addEventListener("click", async () => {
    const username = input.value.trim();

    if (!username) {
      alert("Username required");
      return;
    }

    if (!checkbox.checked) {
      alert("You must agree to the Terms of Service.");
      return;
    }

    await createUser(username);

    input.value = "";
    checkbox.checked = false;
    loadUsers();
  });

  loadUsers();
});