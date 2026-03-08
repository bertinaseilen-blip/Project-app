import { createUser, getUsers, deleteUser } from "./controllers/userController.mjs";

let t = {}

async function loadLanguage(){

  let lang = navigator.language.substring(0,2)

if(lang === "nb"){
  lang = "no"
}

if(!["en","no"].includes(lang)){
  lang = "en"
}

 const response = await fetch(`/localization/${lang}.json`)

if(!response.ok){
  console.error("Language file not found")
  return
}

t = await response.json()
  translatePage()

}

function translatePage(){

  document.querySelectorAll("[data-i18n]").forEach(el => {

    const key = el.dataset.i18n

    if(t[key]){
      el.textContent = t[key]
    }

  })

}
document.addEventListener("DOMContentLoaded", async () => {

  await loadLanguage();
  /* =========================
     ELEMENTS
  ========================== */

  const openUserModalBtn = document.getElementById("openUserModal");
  const viewUsersBtn = document.getElementById("viewUsersBtn");

  const userModal = document.getElementById("userModal");
  const closeUserModalBtn = document.getElementById("closeUserModal");

  const loginView = document.getElementById("loginView");
  const signupView = document.getElementById("signupView");

  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");

  const usernameInput = document.getElementById("usernameInput");
  const passwordInput = document.getElementById("passwordInput");

  const signupUsername = document.getElementById("signupUsername");
  const signupPassword = document.getElementById("signupPassword");

  const tosCheckbox = document.getElementById("tosCheck");

  const createUserBtn = document.getElementById("createUserBtn");
  const loginBtn = document.getElementById("loginBtn");

  const userError = document.getElementById("userError");

  const reminderList = document.getElementById("reminderList");

  const reminderModal = document.getElementById("reminderModal");
  const addReminderBtn = document.getElementById("addReminderBtn");
  const closeReminderModal = document.getElementById("closeReminderModal");

  const reminderTitle = document.getElementById("reminderTitle");
  const reminderDescription = document.getElementById("reminderDescription");
  const saveReminderBtn = document.getElementById("saveReminderBtn");

  const usersModal = document.getElementById("usersModal");
  const closeUsersModalBtn = document.getElementById("closeUsersModal");
  const usersList = document.getElementById("usersList");


  /* =========================
     LOGIN BUTTON STATE
  ========================== */

  const token = localStorage.getItem("token");

  if (token) {
    openUserModalBtn.textContent = "Logout";
  } else {
    openUserModalBtn.textContent = "Log in";
  }


  /* =========================
     SWITCH LOGIN / SIGNUP
  ========================== */

  showSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginView.classList.add("hidden");
    signupView.classList.remove("hidden");
    userError.textContent = "";
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupView.classList.add("hidden");
    loginView.classList.remove("hidden");
    userError.textContent = "";
  });


  /* =========================
     OPEN LOGIN / LOGOUT
  ========================== */

  openUserModalBtn.addEventListener("click", () => {

    const token = localStorage.getItem("token");

    if (token) {

      localStorage.removeItem("token");

      alert(t.logout);

      openUserModalBtn.textContent = t.login;

      reminderList.innerHTML = "";

    } else {

      userModal.classList.remove("hidden");

    }

  });


  /* =========================
     CLOSE USER MODAL
  ========================== */

  
  closeUserModalBtn.addEventListener("click", () => {
    userModal.classList.add("hidden");
  });

  userModal.addEventListener("click", (e) => {
    if (e.target === userModal) {
      userModal.classList.add("hidden");
    }
  });


  /* =========================
     CREATE USER
  ========================== */

  createUserBtn.addEventListener("click", async () => {

    const username = signupUsername.value.trim();
    const password = signupPassword.value;

    userError.textContent = "";

    if (!username || !password) {
      userError.textContent = t.userRequired;
      return;
    }

    if (!tosCheckbox.checked) {
      userError.textContent = "You must agree to the Terms of Service.";
      return;
    }

    try {

      await createUser(username, password, tosCheckbox.checked);

      alert(t.userCreated);

      signupUsername.value = "";
      signupPassword.value = "";
      tosCheckbox.checked = false;

      signupView.classList.add("hidden");
      loginView.classList.remove("hidden");

    } catch (err) {

      userError.textContent = err.message;

    }

  });


  /* =========================
     LOGIN
  ========================== */

  loginBtn.addEventListener("click", async () => {

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    userError.textContent = "";

    if (!username || !password) {
      userError.textContent = t.userRequired;
      return;
    }

    try {

      const response = await fetch("/user/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          username,
          password
        })

      });

      if (!response.ok) {
        throw new Error(t.invalidCredentials);
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);

      openUserModalBtn.textContent = "Logout";

      usernameInput.value = "";
      passwordInput.value = "";

      userModal.classList.add("hidden");

      alert(t.loginSuccess);

      loadReminders();

    } catch (err) {

      userError.textContent = err.message;

    }

  });


  /* =========================
     USERS MODAL
  ========================== */

if (viewUsersBtn && usersModal) {

  viewUsersBtn.addEventListener("click", async () => {
    usersModal.classList.remove("hidden");
    loadUsers();
  });

}
if (closeUsersModalBtn) {
  closeUsersModalBtn.addEventListener("click", () => {
    usersModal.classList.add("hidden");
  });
}
  async function loadUsers() {

    usersList.innerHTML = "";

    try {

      const users = await getUsers();

      users.forEach(user => {

        const li = document.createElement("li");

        li.textContent = user.username;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", async () => {

          if (confirm("Delete user?")) {

            await deleteUser(user.id);

            loadUsers();

          }

        });

        li.appendChild(deleteBtn);

        usersList.appendChild(li);

      });

    } catch {

     const li = document.createElement("li");
      li.textContent = t.errorUsers || "Error loading users";
      usersList.appendChild(li);

    }

  }


  /* =========================
     REMINDER MODAL
  ========================== */

  addReminderBtn.addEventListener("click", () => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert(t.loginRequired);
      return;
    }

    reminderModal.classList.remove("hidden");

  });

  closeReminderModal.addEventListener("click", () => {
    reminderModal.classList.add("hidden");
  });


  /* =========================
     CREATE REMINDER
  ========================== */

  saveReminderBtn.addEventListener("click", async () => {

    const token = localStorage.getItem("token");

    const title = reminderTitle.value;
    const description = reminderDescription.value;

    const response = await fetch("/api/reminders", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify({
        title,
        description
      })

    });

    reminderModal.classList.add("hidden");

    reminderTitle.value = "";
    reminderDescription.value = "";

    loadReminders();

  });


  /* =========================
     LOAD REMINDERS
  ========================== */

  async function loadReminders() {

    const token = localStorage.getItem("token");

    if (!token) return;

    const response = await fetch("/api/reminders", {

      headers: {
        "Authorization": `Bearer ${token}`
      }

    });

    if (!response.ok) {
     console.log("Server error:", response.status);
      return;
    }

    const reminders = await response.json();

    reminderList.innerHTML = "";

    reminders.forEach(r => {

      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      checkbox.addEventListener("change", async () => {

        await fetch(`/api/reminders/${r.id}/complete`, {

          method: "PUT",

          headers: {
            "Authorization": `Bearer ${token}`
          }

        });

        loadReminders();

      });

      const text = document.createElement("span");

      const title = document.createElement("strong")
      title.textContent = r.title

      const br = document.createElement("br")

      const desc = document.createTextNode(r.description)

      text.append(title, br, desc)

      li.appendChild(checkbox);
      li.appendChild(text);

      reminderList.appendChild(li);

    });

  }


  /* =========================
     LOAD ON START
  ========================== */

  if (localStorage.getItem("token")) {
    loadReminders();
  }
  
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch((error) => console.log("Service Worker error:", error));
}

});