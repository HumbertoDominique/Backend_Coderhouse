const socket = io();

let user;

Swal.fire({
  position: "center",
  title: "Bienvenido al Chat",
  input: "text",
  text: "Por favor ingresa tu e-mail para ingresar al chat",
  inputValidator: (value) => {
    return !value && "Debes ingresar un email";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("greetings", user);
});

const inputMSJ = document.getElementById("msj");
const buttonMsj = document.getElementById("buttonMsj");

inputMSJ.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    let message = inputMSJ.value;
    if (message.trim().length > 0) {
      socket.emit("message", { user, message });
      inputMSJ.value = "";
    }
  }
});

buttonMsj.addEventListener("click", (event) => {
  let message = inputMSJ.value;
  if (message.trim().length > 0) {
    socket.emit("message", { user, message });
    inputMSJ.value = "";
  }
});

function render(data) {
  const html = data
    .map((e, index) => {
      return `<div class="mt-1 bg-white rounded">
                    <strong>${e.user}</strong>
                    <p>${e.message}</p>
                </div>`;
    })
    .join("");

  document.getElementById("history").innerHTML = html;
}

socket.on("messages", (data) => {
  render(data);
});

socket.on("connected", (data) => {
  Swal.fire({
    text: `Se conectó ${data}`,
    toast: true,
    position: "top-right",
  });
});
