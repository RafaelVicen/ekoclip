
// --- LÓGICA DO FORMULÁRIO DE CONTATO ---
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector("form[action*=\"formspree\"]");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      // Validação básica
      if (name.length < 2) {
        alert("Por favor, insira um nome válido.");
        e.preventDefault();
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Por favor, insira um email válido.");
        e.preventDefault();
        return;
      }
      if (message.length < 10) {
        alert("Por favor, insira uma mensagem com pelo menos 10 caracteres.");
        e.preventDefault();
        return;
      }

      // Sanitização básica
      document.getElementById("name").value = name.replace(/[<>\"']/g, "");
      document.getElementById("message").value = message.replace(/[<>\"']/g, "");
    });
  }
});

// --- LÓGICA DO MODO ESCURO ---
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  themeToggle.textContent = currentTheme === "dark" ? "���" : "☀️";

  themeToggle.addEventListener("click", () => {
    const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "���" : "☀️";
  });
});

// --- REGISTRO DO SERVICE WORKER PARA PWA ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      (registration) => console.log("SW registrado: ", registration),
      (error) => console.log("SW falhou: ", error)
    );
  });
}
