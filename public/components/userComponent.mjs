import { createUser, deleteUser, getUsers } from "../controllers/userController.mjs";

function createUserManager() {
  const element = document.createElement("div");

  element.innerHTML = `
    <h2>User Management</h2>

    <input type="text" placeholder="Enter username" />

    <div>
      <label>
        <input type="checkbox" id="tosCheck" />
        I agree to the 
        <a href="/tos.html" target="_blank">Terms of Service</a> and 
        <a href="/privacy.html" target="_blank">Privacy Policy</a>
      </label>
    </div>

    <button>Create User</button>
    <ul></ul>
  `;

  const input = element.querySelector("input[type='text']");
  const checkbox = element.querySelector("#tosCheck");
  const createBtn = element.querySelector("button");
  const list = element.querySelector("ul");

  async function loadUsers() {
    const users = await getUsers();
    list.innerHTML = "";

    users.forEach(user => {
      const li = document.createElement("li");
      li.textContent = user.username;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = async () => {
        await deleteUser(user.id);
        loadUsers();
      };

      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  }

  createBtn.addEventListener("click", async () => {
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

  return element;
}

export { createUserManager };

