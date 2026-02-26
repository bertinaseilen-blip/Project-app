import { createUser, getUsers, deleteUser } from "./controllers/userController.mjs";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     USER CREATE MODAL
  ========================== */

  const userModal = document.getElementById("userModal");
  const openUserModalBtn = document.getElementById("openUserModal");
  const closeUserModalBtn = document.getElementById("closeUserModal");

  const usernameInput = document.getElementById("usernameInput");
  const tosCheckbox = document.getElementById("tosCheck");
  const createUserBtn = document.getElementById("createUserBtn");
  const userError = document.getElementById("userError");

  // Open create user modal
  openUserModalBtn.addEventListener("click", () => {
    userError.textContent = "";
    userModal.classList.remove("hidden");
  });

  // Close create user modal
  closeUserModalBtn.addEventListener("click", () => {
    userModal.classList.add("hidden");
  });

  // Close modal if clicking outside box
  userModal.addEventListener("click", (e) => {
    if (e.target === userModal) {
      userModal.classList.add("hidden");
    }
  });

  // Create user
  createUserBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    userError.textContent = "";

    if (!username) {
      userError.textContent = "Username is required.";
      return;
    }

    if (!tosCheckbox.checked) {
      userError.textContent = "You must agree to the Terms of Service.";
      return;
    }

    try {
      await createUser(username);

      // Reset form
      usernameInput.value = "";
      tosCheckbox.checked = false;

      userModal.classList.add("hidden");

    } catch (err) {
      userError.textContent = err.message;
    }
  });


  /* =========================
     USERS LIST MODAL
  ========================== */

  const usersModal = document.getElementById("usersModal");
  const viewUsersBtn = document.getElementById("viewUsersBtn");
  const closeUsersModalBtn = document.getElementById("closeUsersModal");
  const usersList = document.getElementById("usersList");

  // Open users list modal
  viewUsersBtn.addEventListener("click", async () => {
    usersModal.classList.remove("hidden");
    await loadUsers();
  });

  // Close users list modal
  closeUsersModalBtn.addEventListener("click", () => {
    usersModal.classList.add("hidden");
  });

  // Close modal if clicking outside box
  usersModal.addEventListener("click", (e) => {
    if (e.target === usersModal) {
      usersModal.classList.add("hidden");
    }
  });

  // Load users
  async function loadUsers() {
    usersList.innerHTML = "";

    try {
      const users = await getUsers();

      if (users.length === 0) {
        usersList.innerHTML = "<li>No users found.</li>";
        return;
      }

      users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = user.username;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", async () => {
          if (confirm("Are you sure you want to delete this user?")) {
            await deleteUser(user.id);
            await loadUsers();
          }
        });

        li.appendChild(deleteBtn);
        usersList.appendChild(li);
      });

    } catch (err) {
      usersList.innerHTML = "<li>Error loading users.</li>";
    }
  }

});