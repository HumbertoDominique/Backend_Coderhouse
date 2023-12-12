import { Router } from "express";
import CartManager from "../models/cartManager.js";

const cartRouter = Router();

const cartManager = new CartManager();

//MÉTODO GET MUESTRA TODOS LOS CARRITOS GENERADOS.

cartRouter.get("/", async (req, res) => {
  try {
    let carritos = await cartManager.getCarritos();
    res.send({
      status: "success",
      message: "Get Carritos",
      carritos,
    });
  } catch (err) {
    res
      .status(400)
      .send({ status: "error", message: "Error en CartRouter - GetCarritos" });
  }
});

//MÉTODO GET /:CID MUESTRA EL CARRITO CON EL ID SUMINISTRADO POR PARAMS
cartRouter.get("/:cid", async (req, res) => {
  try {
    let carritos = await cartManager.getCarritos();
    let idCart = req.params.cid;

    let carrito = carritos.find((c) => c.id == idCart);

    if (!carrito)
      return res
        .status(404)
        .send({ status: "error", message: "Carrito no encontrado" });

    res.send({
      status: "success",
      message: "Get Carrito seleccionado por ID",
      carrito,
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error en CartRouter - GetCarritos por ID",
    });
  }
});

//MÉTODO POST CREA UN NUEVO CARRITO COMO UN OBJETO CON ID AUTOGENERADO Y ARREGLO DE PRODUCTOS VACÍO. NO REQUIERE BODY.
cartRouter.post("/", async (req, res) => {
  try {
    cartManager.addCart();
    res.send({
      status: "success",
      message: "Nuevo Carrito generado",
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error en CartRouter - Post nuevo Carrito",
    });
  }
});

//MÉTODO POST /:CID/PRODUCTS/:PID INGRESA PRODUCTO CON PID EN CARRITO CID SUMINISTRADOS POR PARAMS. AGREGA SOLO EL ID DEL PRODUCTO Y AGREGA +1 EN CANTIDAD DENTRO DEL CARRITO. NO REQUIERE BODY.
cartRouter.post("/:cid/products/:pid", async (req, res) => {
  let idCarrito = parseInt(req.params.cid);
  let idProducto = parseInt(req.params.pid);

  try {
    let productos = await cartManager.getProducts();
    let carritos = await cartManager.getCarritos();

    let producto = productos.find((p) => p.id == idProducto);
    let carrito = carritos.find((c) => c.id == idCarrito);

    if (!carrito || !producto)
      return res.status(404).send({
        status: "error",
        message: "Elemento seleccionado no encontrado",
      });

    cartManager.addItemtoCart(idCarrito, idProducto);
    res.send({
      status: "success",
      message: "Producto agregado a carrito",
      carrito: idCarrito,
      producto: idProducto,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Error en CartRouter - Post Productos en Carrito",
    });
  }
});

//MÉTODO DELETE ELIMINA CARRITO CON CID INDICADO POR PARAMS
cartRouter.delete("/:cid", async (req, res) => {
  const idCarrito = parseFloat(req.params.cid);

  try {
    let carritos = await cartManager.getCarritos();

    let carrito = carritos.find((c) => c.id == idCarrito);

    if (!carrito)
      return res
        .status(404)
        .send({ status: "error", message: "Carrito no encontrado" });

    cartManager.deleteCart(idCarrito);
    res.send({
      status: "success",
      message: "Carrito Eliminado",
      carrito: idCarrito,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Error en CartRouter - Borrar Carrito",
    });
  }
});

export { cartRouter };
