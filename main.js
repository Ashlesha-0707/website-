const API = "http://localhost:5000/api/auth";

// Register
async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  alert(data.msg);
  window.location.href = "login.html";
}

// Login
async function login() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Login failed");
      return;
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid login response");
    }

  } catch (error) {
    console.error("Login Error:", error);
    alert("Server error. Make sure backend is running.");
  }
}
async function resetPassword() {
  try {
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newPassword").value;

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword })
    });

    const data = await res.json();
    alert(data.msg);

    if (res.ok) {
      window.location.href = "login.html";
    }

  } catch (err) {
    alert("Server error");
  }
}
// Socket
if (window.location.pathname.includes("dashboard")) {
  const socket = io();
  const counter = document.getElementById("counter");

  socket.on("updateCounter", (data) => {
    counter.innerText = data;
  });

  function sendWorkout() {
    socket.emit("workout");
  }

  window.sendWorkout = sendWorkout;
}