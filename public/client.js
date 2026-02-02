const socket = io();

/* minta nama & room */
const name = prompt("Enter your name:");
const room = prompt("Enter room code:");

socket.emit("join", { name, room });

const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");

/* kirim pesan */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim() === "") return;

  socket.emit("message", input.value);
  input.value = "";
});

/* terima pesan biasa */
socket.on("message", (data) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<span>${data.name}:</span> ${data.msg}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});

/* terima pesan system */
socket.on("system", (text) => {
  const div = document.createElement("div");
  div.classList.add("system");
  typeEffect(div, text);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});

/* typing effect untuk system message */
function typeEffect(element, text) {
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 40);
}
