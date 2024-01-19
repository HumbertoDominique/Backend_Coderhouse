import { Router } from "express";
import { cartService } from "../dao/service/cartsDao.js";
import { productService } from "../dao/service/productsDao.js";

const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
  try {
    let carts = await cartService.getCarts();
    res.send({
      status: "success",
      message: "Get Carts",
      carts: carts,
    });
  } catch (err) {
    res
      .status(500)
      .send({ status: "error", message: "Error en CartRouter - GetCarts" });
  }
});

//MÉTODO GET /:CID MUESTRA EL CARRITO CON EL ID SUMINISTRADO POR PARAMS
cartRouter.get("/:cid", async (req, res) => {
  try {
    let cid = req.params.cid;
    let cart = await cartService.getCartById(cid);

    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "Carrito no encontrado" });

    res.send({
      status: "success",
      message: "Get Cart By Id",
      cart,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en CartRouter - GetCarts By Id",
    });
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const cart = await cartService.addNewCart({ products: [] });
    res.status(201).send({
      status: "success",
      message: "Nuevo Carrito generado",
      cart,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en CartRouter - Post nuevo Carrito",
    });
  }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;

  try {
    let product = await productService.getProductById(pid);
    let cart = await cartService.getCartById(cid);

    if (!cart || !product)
      return res.status(404).send({
        status: "error",
        message: "Elemento seleccionado no encontrado",
      });

    cartService.addProductToCart(cid, pid);
    res.send({
      status: "success",
      message: "Producto agregado a carrito",
      carrito: cid,
      producto: pid,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Error en CartRouter - Add Product to Cart",
    });
  }
});

cartRouter.put("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    await cartService.updateCart(cid, req.body);
    res.status(203).send({
      status: "success",
      message: "Carrito modificado",
      carrito: cid,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en cartRouter - Update Cart",
    });
  }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;
  let { quantity } = req.body;
  try {
    await cartService.updateQuantityInCartProduct(cid, pid, quantity);
    res.status(200).send({
      status: "success",
      message: "Producto actualizado en el carrito",
      carrito: cid,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en CartRouter - Update Cart By Id",
    });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    await cartService.deleteCartById(cid);
    res.status(200).send({
      status: "success",
      message: "Productos eliminados del carrito",
      carrito: cid,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en CartRouter - Delete Cart By Id",
    });
  }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;
  try {
    await cartService.deleteProductInCart(cid, pid);
    res.status(200).send({
      status: "success",
      message: "Producto Eliminado del carrito",
      carrito: cid,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en CartRouter - Delete Product In Cart By Id",
    });
  }
});

export { cartRouter };
