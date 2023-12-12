import { Router } from "express";
import ProductManager from "../models/productManager.js";

const productsRouter = Router();

const productManager = new ProductManager();

//MÉTODO GET MUESTRA TODOS LOS PRODUCTOS GENERADOS.

productsRouter.get("/", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    let limit = req.query.limit;

    if (!limit) return res.send(products);

    let productSplice = products.splice(limit);
    res.send({
      status: "success",
      message: "Get Productos",
      products,
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error en ProductRouter - GetProducts",
    });
  }
});

//MÉTODO GET /:PID MUESTRA EL PRODUCTO CON EL ID SUMINISTRADO POR PARAMS
productsRouter.get("/:pid", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    let idProducto = req.params.pid;

    let product = products.find((p) => p.id == idProducto);

    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "Producto no encontrado" });

    res.send({
      status: "success",
      message: "Get Producto seleccionado por ID",
      product,
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error en ProductRouter - GetProducts por ID",
    });
  }
});

//MÉTODO POST CREA UN NUEVO PRODUCTO
//TODOS LOS CAMPOS SON REQUERIDOS EXCEPTO THUMBNAIL
//POR DEFAULT EL VALOR DE STATUS ES TRUE A MENOS QUE SE INDIQUE FALSE
//THUMBNAIL SOLO RECIBE STRINGS
productsRouter.post("/", async (req, res) => {
  let { title, description, code, price, stock, category, status, thumbnail } =
    req.body;
  try {
    productManager.addProduct(
      title,
      description,
      code,
      price,
      stock,
      category,
      status,
      thumbnail
    );
    res.send({
      status: "success",
      message: "Nuevo Producto generado",
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error en ProductRouter - Post nuevo Producto",
    });
  }
});

//MÉTODO PUT MODIFICA LAS PROPIEDADES INDICADAS EN EL BODY AL PRODUCTO SELECCIONADO POR ID EN PARAMS. LAS PROPIEDADES NO SUMINISTRADAS EN EL BODY, SERÁN DESCARTADAS POR EL MÉTODO PUT.
productsRouter.put("/:pid", async (req, res) => {
  const idProducto = parseInt(req.params.pid);
  let modificacion = req.body;

  try {
    let products = await productManager.getProducts();
    let product = products.find((p) => p.id == idProducto);

    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "Producto no encontrado" });

    productManager.updateProduct(idProducto, modificacion);
    res.send({
      status: "success",
      message: "Producto modificado",
      producto: idProducto,
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error en ProductRouter - Update Producto",
    });
  }
});

//MÉTODO DELETE ELIMINA PRODUCTO CON PID INDICADO POR PARAMS
productsRouter.delete("/:pid", async (req, res) => {
  const idProducto = parseInt(req.params.pid);

  try {
    let products = await productManager.getProducts();
    let product = products.find((p) => p.id == idProducto);

    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "Producto no encontrado" });

    productManager.deleteProduct(idProducto);
    res.send({
      status: "success",
      message: "Producto Eliminado",
      producto: idProducto,
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error en ProductRouter - Borrar Producto",
    });
  }
});

export { productsRouter };
