import { Router } from "express";
import ProductManager from "../dao/serviceFileSystem/productServiceFS.js";
import { messageService } from "../dao/service/messagesDao.js";
import { io } from "../app.js";
//SET DEL ROUTER.

const viewsRouter = Router();
const productManager = new ProductManager();
//PARA HANDLEBARS, SE IMPORTAN LOS PRODUCTOS Y SE ENVÍAN DIRECTAMENTE A LA VISTA HOME.

viewsRouter.get("/", async (req, res) => {
  try {
    let products = await productManager.getProducts();

    res.render("home", { products });
  } catch (err) {
    res.status(500).send({ err });
  }
});

//PARA WEBSOCKETS, SIMPLEMENTE SE RENDERIZA LA VISTA REALTIMEPRODUCTS ({}) DADO QUE LOS PRODUCTOS SERÁN ENVIADOS DESDE EL SOCKET.

viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realTimeProducts");
  } catch (err) {
    res.status(500).send({ err });
  }
});

viewsRouter.get("/chats", async (req, res) => {
  try {
    io.on("connection", async (socket) => {
      socket.on("message", async (data) => {
        let chats = await messageService.getMessages();
        io.emit("update", chats);
      });
    });
    let chats = await messageService.getMessages();
    res.render("chat", { chats });
  } catch (err) {
    res.status(500).send({ err });
  }
});

export { viewsRouter };
