import { io } from "socket.io-client";   // 👈 ADD THIS
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 👇 SOCKET.IO CONNECTION
const socket = io(); // connects automatically to the same host (Render URL)

socket.on("connect", () => {
  console.log("✅ Connected with ID:", socket.id);
  socket.emit("hello", "Hello from " + socket.id);
});

socket.on("hello", (msg) => {
  console.log("📩 Opponent says:", msg);
  alert(msg);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err);
});

// 👇 You can also pass the socket into your App later if needed
createRoot(document.getElementById("root")!).render(<App />);
