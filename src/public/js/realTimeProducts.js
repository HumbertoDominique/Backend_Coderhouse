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
