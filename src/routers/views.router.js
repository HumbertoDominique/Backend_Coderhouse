import { Router } from "express";
import ProductManager from "../models/productManager.js";

//SET DEL ROUTER.

const viewsRouter = Router();

const productManager = new ProductManager();

//PARA HANDLEBARS, SE IMPORTAN LOS PRODUCTOS Y SE ENVÍAN DIRECTAMENTE A LA VISTA HOME.

viewsRouter.get("/", async (req, res) => {
  let products = await productManager.getProducts();

  res.render("home", { products });
});

//PARA WEBSOCKETS, SIMPLEMENTE SE RENDERIZA LA VISTA REALTIMEPRODUCTS ({}) DADO QUE LOS PRODUCTOS SERÁN ENVIADOS DESDE EL SOCKET.

viewsRouter.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

export { viewsRouter };
