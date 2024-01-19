import { Router } from "express";
import { messageService } from "../dao/service/messagesDao.js";
import { productService } from "../dao/service/productsDao.js";
import { cartService } from "../dao/service/cartsDao.js";
import { io } from "../app.js";

//SET DEL ROUTER.

const viewsRouter = Router();

//PARA HANDLEBARS, SE IMPORTAN LOS PRODUCTOS Y SE ENVÍAN DIRECTAMENTE A LA VISTA HOME.

viewsRouter.get("/", async (req, res) => {
  try {
    let data = await productService.getProducts();
    res.render("home", data);
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

//ENDPOINT DEL CHAT
viewsRouter.get("/chats", async (req, res) => {
  try {
    io.on("connection", async(socket));
    let chats = await messageService.getMessages();
    res.render("chat", { chats });
  } catch (err) {
    res.status(500).send({ err });
  }
});

//ENDPOINT PARA VISUALIZAR LOS PRODUCTOS CON LAS DIFERENTES QUERYS Y FILTROS SOLICITADOS
viewsRouter.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, category, availability } = req.query;

    let data = await productService.getProducts(
      limit,
      page,
      sort,
      category,
      availability
    );

    data.sort = sort;
    data.category = category;
    data.availability = availability;

    data.hasPrevPage
      ? (data.prevLink = `?limit=${limit}&page=${data.prevPage}&category=${category}&sort=${sort}&availability=${availability}`)
      : (data.prevLink = "null");

    data.hasNextPage
      ? (data.nextLink = `?limit=${limit}&page=${data.nextPage}&category=${category}&sort=${sort}&availability=${availability}`)
      : (data.nextLink = "null");

    let carts = await cartService.getCarts();
    data.carts = carts;
    res.render("products", data);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//VISTA ADICIONAL DE CARRITOS DISPONIBLES PARA UBICAR MAS FACILMENTE LOS ID DE LOS CARTS

viewsRouter.get("/carts", async (req, res) => {
  try {
    let data = await cartService.getCarts();
    res.render("carts", { data });
  } catch (err) {
    res.status(500).send({ err });
  }
});

// VISTA QUE PERMITE VISUALIZAR EL CARRITO SELECCIONADO POR ID CON LOS PRODUCTOS QUE CONTENGA ESE CARRITO
viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    let cid = req.params.cid;
    let data = await cartService.getCartById(cid);
    let [conditionalRender] = data;
    let render;
    if (conditionalRender.products.length == 0) {
      render = true;
    }
    res.render("cartById", { data, render });
  } catch (err) {
    res.status(500).send({ err });
  }
});

//VISTA INTERMEDIA QUE SE EJECUTA DESPUES DE AGREGAR UN PRODUCTO AL CARRITO DESDE LA VISTA DE PRODUCTOS.
viewsRouter.post("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    let cid = req.params.cid;
    let pid = req.params.pid;

    await cartService.addProductToCart(cid, pid);

    let data = await cartService.getCartById(cid);
    let [conditionalRender] = data;
    let render;
    if (conditionalRender.products.length == 0) {
      render = true;
    }
    res.render("cartById", { data, render });
  } catch (err) {
    res.status(500).send({ err });
  }
});

export { viewsRouter };
