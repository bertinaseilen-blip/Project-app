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
  const viewProfileBtn = document.getElementById("viewProfileBtn");

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
  const categoryInput = document.getElementById("categoryList");
  const saveReminderBtn = document.getElementById("saveReminderBtn");
  const setDate = document.getElementById("setDate");

  const profileModal = document.getElementById("profileModal");
  const closeProfileModalBtn = document.getElementById("closeProfileModal");
  const userName = document.getElementById("userName");

  let editingReminderId = null;
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

if (viewProfileBtn && profileModal) {

  viewProfileBtn.addEventListener("click", async () => {
    profileModal.classList.remove("hidden");
    loadUsers();
  });

}
if (closeProfileModalBtn) {
  closeProfileModalBtn.addEventListener("click", () => {
    profileModal.classList.add("hidden");
  });
}
  async function loadUsers() {

    userName.innerHTML = "";

    const token = localStorage.getItem("token");

    try {

      const response = await fetch("/user/me", {
      headers: {
        "Authorization": `Bearer ${token}`
      }});

      const user = await response.json();  

      const li = document.createElement("li");

      const username = document.createElement("strong");
      username.textContent = user.username;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = t.deleteAccount || "Delete account";
      deleteBtn.setAttribute("aria-label", t.deleteAccount || "Delete account");

      deleteBtn.addEventListener("click", async () => {

      if (!confirm(t.confirmDeleteAccount || "Are you sure you want to delete your account?")) return;

      await fetch(`/user/${user.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      localStorage.removeItem("token");

      alert(t.accountDeleted || "Account deleted");

       location.reload();

        });

        li.appendChild(username);
        li.appendChild(deleteBtn);

        userName.appendChild(li);


    } catch {

     const li = document.createElement("li");
      li.textContent = t.errorUsers || "Error loading profile";
      userName.appendChild(li);

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

  editingReminderId = null;

  reminderTitle.value = "";
  reminderDescription.value = "";
  categoryInput.value = "";
  setDate.value ="";
 

  reminderModal.classList.remove("hidden");

});

  /* =========================
     CREATE REMINDER
  ========================== */

  saveReminderBtn.addEventListener("click", async () => {

    const token = localStorage.getItem("token");

    const title = reminderTitle.value;
    const description = reminderDescription.value;
    const category = categoryInput.value;
    const date = setDate.value;

    const url = editingReminderId
      ? `/api/reminders/${editingReminderId}`
      : "/api/reminders";

    const method = editingReminderId ? "PUT" : "POST";

    await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        category,
        date
      })
    });

    

    editingReminderId = null;

    reminderModal.classList.add("hidden");

    reminderTitle.value = "";
    reminderDescription.value = "";
    categoryInput.value = "";
    setDate.value="";

    loadReminders();

});
closeReminderModal.addEventListener("click", () => {

  editingReminderId = null;

  reminderModal.classList.add("hidden");

  reminderTitle.value = "";
  reminderDescription.value = "";
  categoryInput.value = "";
  setDate.value = "";

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
    
    const grouped = reminders.reduce((acc, r) => {
    const category = r.category || "Other";

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(r);

      return acc;
    }, {});
    reminderList.innerHTML = "";

     Object.keys(grouped).sort().forEach(category => {

      const headerLi = document.createElement("li");
      headerLi.classList.add("category-header");

      const header = document.createElement("h3");
      header.textContent = category;

      header.textContent = category;

      headerLi.appendChild(header);
      reminderList.appendChild(headerLi);
      
      grouped[category].forEach(r => {

      const li = document.createElement("li");

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏";
      editBtn.classList.add("edit-btn");
      editBtn.setAttribute("aria-label", `Edit reminder ${r.title}`);
      editBtn.type = "button";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "x";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.setAttribute("aria-label", `Delete reminder ${r.title}`);
      deleteBtn.type = "button";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `reminder-${r.id}`;
      
      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      checkbox.checked = r.completed;
      label.textContent = `Mark "${r.title}" as completed`;
      label.classList.add("visually-hidden");
      

      li.appendChild(checkbox);
      li.appendChild(label);
      checkbox.addEventListener("change", async () => {

        await fetch(`/api/reminders/${r.id}/complete`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          }

        });  

        loadReminders();

      });
      
      deleteBtn.addEventListener("click", async () => {

        if (!confirm("Delete reminder?")) return;

        await fetch(`/api/reminders/${r.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        loadReminders();

      });

      editBtn.addEventListener("click", () => {

        editingReminderId = r.id;

        reminderTitle.value = r.title;
        reminderDescription.value = r.description;
        categoryInput.value = r.category;
        setDate.value = r.date;

        reminderModal.classList.remove("hidden");

      });

      const text = document.createElement("span");

      const title = document.createElement("strong")
      title.textContent = r.title;

      const desc = document.createElement("div");
      desc.textContent = r.description;

      const date = document.createElement("div");

      if (r.date) {
        const formattedDate = new Date(r.date).toLocaleDateString();
        date.textContent = `📅 ${formattedDate}`;
        date.classList.add("reminder-date");
      }

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("reminder-actions");

      buttonContainer.appendChild(editBtn);
      buttonContainer.appendChild(deleteBtn);

      text.append(title, desc, date)

      li.appendChild(text);
      li.appendChild(buttonContainer);

      reminderList.appendChild(li);

    });

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
