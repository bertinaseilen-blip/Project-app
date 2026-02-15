import { createUserManager } from "./modules/userComponents.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  app.appendChild(createUserManager());
});
