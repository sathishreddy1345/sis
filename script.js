// ---------- GREETING ----------
document.addEventListener("DOMContentLoaded", () => {
  setGreeting();
});

function setGreeting() {
  const greeting = document.getElementById("greeting");
  if (!greeting) return;

  const hour = new Date().getHours();

  greeting.classList.remove("morning", "afternoon", "evening");

  if (hour < 12) {
    greeting.textContent = "Good Morning! ";
    greeting.classList.add("morning");
  } 
  else if (hour < 18) {
    greeting.textContent = "Good Afternoon! ";
    greeting.classList.add("afternoon");
  } 
  else {
    greeting.textContent = "Good Evening! ";
    greeting.classList.add("evening");
  }
}

// ---------- LOGIN ----------
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if (username === "" || password === "") {
    error.textContent = "Username and password are required";
    return;
  }

  // Admin login
  if (username === "admin" && password === "admin123") {
    localStorage.setItem("role", "admin");
    window.location.href = "admin.html";
  }
  // Student login
  else if (username === "student" && password === "stud123") {
    localStorage.setItem("role", "student");
    window.location.href = "student.html";
  }
  else if (username === "prof" && password === "prof123") {
    localStorage.setItem("role", "student");
    window.location.href = "prof.html";
  }
  else {
    error.textContent = "Invalid username or password";
  }
}

// ---------- PASSWORD TOGGLE ----------
function togglePassword() {
  const pwd = document.getElementById("password");
  pwd.type = pwd.type === "password" ? "text" : "password";
}

const users = JSON.parse(localStorage.getItem("users")) || [];

