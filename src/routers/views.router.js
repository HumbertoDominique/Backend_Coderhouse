import { Router } from "express";
import { productService } from "../dao/service/productsDao.js";
import { cartService } from "../dao/service/cartsDao.js";
import { isAuth, isGuest } from "../middleware/auth.middleware.js";
import { isUpdate } from "../middleware/realTimeProducts.middleware.js";

//SET DEL ROUTER.

const viewsRouter = Router();

//HANDLEBARS, SE IMPORTAN LOS PRODUCTOS Y SE ENVÍAN DIRECTAMENTE A LA VISTA HOME.

viewsRouter.get("/", isAuth, async (req, res) => {
  try {
    let data = await productService.getProducts();
    let { docs } = data;

    res.render("home", { docs });
  } catch (err) {
    res.status(500).send({ err });
  }
});

//WEBSOCKETS, SE RENDERIZA LA VISTA REALTIMEPRODUCTS ({}) DADO QUE LOS PRODUCTOS SON ENVIADOS DESDE EL SOCKET.

viewsRouter.get("/realtimeproducts", isUpdate, async (req, res) => {
  try {
    res.render("realTimeProducts");
  } catch (err) {
    res.status(500).send({ err });
  }
});

//ENDPOINT DEL CHAT

viewsRouter.get("/chats", async (req, res) => {
  try {
    res.render("chat");
  } catch (err) {
    res.status(500).send({ err });
  }
});

//ENDPOINT PARA VISUALIZAR LOS PRODUCTOS CON LAS DIFERENTES QUERYS Y FILTROS SOLICITADOS
viewsRouter.get("/products", isAuth, async (req, res) => {
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

    const { user } = req.session;
    let isAdmin = false;
    if (user.roll === "admin") {
      isAdmin = true;
    }

    let { docs } = data;
    res.render("products", { data, docs, user, isAdmin });
  } catch (err) {
    res.status(500).send({ err });
  }
});

//VISTA ADICIONAL DE CARRITOS DISPONIBLES PARA UBICAR MAS FACILMENTE LOS ID DE LOS CARTS

viewsRouter.get("/carts", async (req, res) => {
  try {
    let data = await cartService.getCarts();
    const { user } = req.session;
    let isAdmin = false;
    if (user.roll === "admin") {
      isAdmin = true;
    }
    res.render("carts", { data, user, isAdmin });
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
    res.status(500).send("Error al buscar carrito");
  }
});

//VISTA INTERMEDIA QUE SE EJECUTA DESPUES DE AGREGAR UN PRODUCTO AL CARRITO DESDE LA VISTA DE PRODUCTOS.
viewsRouter.post("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    res.redirect("/products");
  } catch (err) {
    res.status(500).send({ err });
  }
});

viewsRouter.get("/register", isGuest, async (req, res) => {
  try {
    res.render("register");
  } catch (err) {
    res.status(500).send({ err });
  }
});

viewsRouter.get("/login", isGuest, async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    res.status(500).send({ err });
  }
});

export { viewsRouter };
