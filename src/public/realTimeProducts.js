const socket = io();

//FUNCIÓN QUE RENDERIZA LOS PRODUCTOS RECIBIDOS A TRAVÉS DE WEBSOCKETS EN LA VISTA REAL TIME PRODUCTS.

function render(data) {
  const html = data.map(function (elem, index) {
    return `<li>
              ${elem.title},
              ${elem.description},
              ${elem.code},
              ${elem.price},
              ${elem.stock},
              ${elem.category},
              ${elem.status},
              ${elem.thumbnail},
            </li>`;
  });

  let renderProducts = document.getElementById("renderProducts");
  renderProducts.innerHTML = html;

  callBackRender();
}

//FUNCIONES DE LLAMADO Al SERVIDOR PARA RENDERIZAR NUEVAMENTE LOS CAMBIOS DETECTADOS TRAS LA SOLICITUD HTTP REALIZADA.

function callBackRender() {
  setTimeout(callBack, 200);
}
function callBack() {
  socket.emit("request", "request");
}

//SET WEBSOCKETS DESDE EL CLIENTE PARA SOLICITAR LOS PRODUCTOS QUE SERÁN RENDERIZADOS.
//EL PRIMER PASO ("link") SE ENVÍA CUANDO SE ESTABLECE CONEXIÓN CON EL SERVIDOR.
//EL SEGUNDO PASO RECIBE LOS PRODUCTOS Y LOS RENDERIZA.

socket.on("link", (data) => {
  socket.emit("request", "request");
});

socket.on("products", (data) => {
  render(data);
});

//FUNCIÓN QUE RECIBE UN LLAMADO DE LA MIDDLEWARE CUANDO SE REALIZA UNA SOLICITUD HTTP AL SERVIDOR.
//EL PROPÓSITO DEL TIMEOUT ES DEMORAR BREVEMENTE EL CALLBACK PARA QUE EL RENDERIZADO SE EJECUTE DESPUES DE LA SOLICITUD HTTP Y SE PUEDAN VER LOS CAMBIOS EN TIEMPO REAL.

socket.on("callback", (data) => {
  callBackRender();
});
