import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { productsRouter } from "./routers/products.router.js";
import { cartRouter } from "./routers/cart.router.js";
import { viewsRouter } from "./routers/views.router.js";
import ProductManager from "./dao/serviceFileSystem/productServiceFS.js";
import { messageService } from "./dao/service/messagesDao.js";
import { Server } from "socket.io";
import mongoose from "mongoose";

//SET EXPRESS.

const app = express();
let productManager = new ProductManager();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//SET HANDLEBARS.

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

//SET SERVIDOR WEB EN PUERTO 8080

const webServer = app.listen(8080, () => {
  console.log("Escuchando servidor web 8080");
});

//SET SERVIDOR WEBSOCKETS

//AL DETECTAR ALGUNA CONEXIÓN, ENVÍA MSJ AL CLIENTE; EL CLIENTE RETORNA SOLICITUD DE PRODUCTOS Y EL SERVIDOR ENVÍA "products" PARA SU RENDERIZADO EN LA VISTA REAL TIME PRODUCTS.

export const io = new Server(webServer);

io.on("connection", async (socket) => {
  console.log("Conexión con WebSockets");

  //CONEXIÓN CON CHAT

  const messages = await messageService.getMessages();
  socket.emit("messages", messages);

  socket.on("message", async (message) => {
    await messageService.addMessage(message);
  });

  socket.on("greetings", (data) => {
    socket.broadcast.emit("connected", data);
  });

  //CONEXIÓN CON REAL TIME PRODUCTS
  socket.emit("link", "link");

  socket.on("request", async (data) => {
    let products = await productManager.getProducts();
    io.emit("products", products);
  });
});

//MIDDLEWARE QUE DETECTA CUANDO SE REALIZA UNA SOLICITUD HTTP A LA APP.
//Emite un llamado para volver a renderizar los productos.
//Dado que la middleware se ejecuta antes que la solicitud HTTP, necesito demorar el renderizado hasta que se actualice la modificación en el arreglo de productos.
app.use(function (req, res, next) {
  io.emit("callBack", "link");
  next();
});

//SET DE ENDPOINTS.
app.use("/", viewsRouter);
app.use("/realtimeproducts", viewsRouter);
app.use("/chats", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

mongoose.connect(
  "mongodb+srv://hdominique:24Escherichia@hdominiquecluster.yb3kpy5.mongodb.net/?retryWrites=true&w=majority"
);
