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
  const profileList = document.getElementById("profileList");

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

      if (!confirm(t.confirmLogout || "Are you sure you want to log out?")) {
        return;
      }

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
     Profile MODAL
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

    profileList.innerHTML = "";

    const token = localStorage.getItem("token");

      if (!token) {

    const li = document.createElement("li");
    li.textContent = t.profileLoginRequired || "Login to see profile";

    profileList.appendChild(li);

    return;
  }

    try {

      const response = await fetch("/user/me", {
      headers: {
        "Authorization": `Bearer ${token}`
      }});

      const user = await response.json();  

      const li = document.createElement("li");

      const username = document.createElement("p");
      const label = document.createElement("strong");
      label.textContent = t.userName || "Username:";
      const name = document.createElement("span");
      name.textContent = ` ${user.username}`;


      username.appendChild(label);
      username.appendChild(name);

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


      const details = document.createElement("details");

      const summary = document.createElement("summary");
      summary.textContent = t.changePassword || "Change password";

      const passwordContainer = document.createElement("div");

      const oldPasswordInput = document.createElement("input");
      oldPasswordInput.type = "password";
      oldPasswordInput.placeholder = t.currentPassword || "Current password";

      const newPasswordInput = document.createElement("input");
      newPasswordInput.type = "password";
      newPasswordInput.placeholder = t.newPassword || "New password";

      const changePasswordBtn = document.createElement("button");
      changePasswordBtn.textContent = t.update || "Update";

      changePasswordBtn.addEventListener("click", async () => {

        const oldPassword = oldPasswordInput.value;
        const newPassword = newPasswordInput.value;

        if (!oldPassword || !newPassword) {
          alert(t.fillBothFields || "Please fill both fields");
          return;
        }

        try {

          const response = await fetch("/user/password", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              oldPassword,
              newPassword
            })
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || t.passwordUpdateFailed || "Failed to update password");
          }

          alert(t.passwordUpdated || "Password updated successfully");

          oldPasswordInput.value = "";
          newPasswordInput.value = "";

        } catch (err) {
          alert(err.message);
        }

      });

        passwordContainer.appendChild(oldPasswordInput);
        passwordContainer.appendChild(newPasswordInput);
        passwordContainer.appendChild(changePasswordBtn);

        details.appendChild(summary);
        details.appendChild(passwordContainer);

        li.appendChild(username);
        li.appendChild(deleteBtn);
        li.appendChild(details);

        profileList.appendChild(li);


    } catch {

     const li = document.createElement("li");
      li.textContent = t.errorProfile || "Error loading profile";
      profileList.appendChild(li);

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

    try {
      const response = await fetch(url, {
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

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Something went wrong");
        return;
      }

    } catch (error) {
      alert("You are offline. Reminder not saved.");
    }

    

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
   RENDER A SINGLE REMINDER
========================== */

function renderReminder(r, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed-reminder");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `reminder-${r.id}`;
  checkbox.checked = completed;
  checkbox.disabled = completed;

  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  label.textContent = `Mark "${r.title}" as completed`;
  label.classList.add("visually-hidden");

  const text = document.createElement("span");

  const title = document.createElement("strong");
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

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏";
  editBtn.classList.add("edit-btn");
  editBtn.setAttribute("aria-label", `Edit reminder ${r.title}`);
  editBtn.disabled = completed;
  editBtn.type = "button";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "x";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.setAttribute("aria-label", `Delete reminder ${r.title}`);
  deleteBtn.type = "button";

  buttonContainer.append(editBtn, deleteBtn);

  text.append(title, desc, date);

  li.append(checkbox, label, text, buttonContainer);

  if (!completed) {
    checkbox.addEventListener("change", async () => {
      const token = localStorage.getItem("token");
      await fetch(`/api/reminders/${r.id}/complete`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      loadReminders();
    });
  }
  editBtn.addEventListener("click", () => {
    editingReminderId = r.id;
    reminderTitle.value = r.title;
    reminderDescription.value = r.description;
    categoryInput.value = r.category;
    setDate.value = r.date;
    reminderModal.classList.remove("hidden");
  });

  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete reminder?")) return;
    const token = localStorage.getItem("token");
    await fetch(`/api/reminders/${r.id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    loadReminders();
  });

  return li;
}

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

    const activeReminders = reminders.filter(r => !r.completed);
    const completedReminders = reminders.filter(r => r.completed);
    
    reminderList.innerHTML = "";

    const grouped = activeReminders.reduce((acc, r) => {
    const category = r.category || "Other";

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(r);

      return acc;
    }, {});

     Object.keys(grouped).sort().forEach(category => {

      const headerLi = document.createElement("li");
      headerLi.classList.add("category-header");

      const header = document.createElement("h3");
      header.textContent = category;

      headerLi.appendChild(header);
      reminderList.appendChild(headerLi);
      
      grouped[category].forEach(r => {
        reminderList.appendChild(renderReminder(r, false));
    });
      
     
    

  });
  if (completedReminders.length > 0) {
      const headerLi = document.createElement("li");
      headerLi.classList.add("category-header");
      const header = document.createElement("h3");
      header.textContent = "Completed";
      header.id = "completed-header";
      headerLi.appendChild(header);
      reminderList.appendChild(headerLi);

      completedReminders.forEach(r => {
        reminderList.appendChild(renderReminder(r, true));
      });
    }

  }

  /* =========================
     LOAD ON START
  ========================== */

  if (localStorage.getItem("token")) {
    loadReminders();
  }
  
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
          console.log("Service Worker registered:", registration);})

      .catch((error) => {
          console.log("Service Worker error:", error);
        });

    });
  }

});
