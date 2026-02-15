import { createUserManager } from "./components/userComponent.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  app.appendChild(createUserManager());
});
