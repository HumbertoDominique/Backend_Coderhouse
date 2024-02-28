import { cartService } from "./carts.dao.js";
import { productService } from "../products/products.dao.js";

export const getCarts = async (req, res) => {
  let carts = await cartService.getCarts();
  res.send({
    status: "success",
    message: "Get Carts",
    carts: carts,
  });
};

export const getCartsById = async (req, res) => {
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
};

export const addNewCart = async (req, res) => {
  const cart = await cartService.addNewCart({ products: [] });
  res.status(201).send({
    status: "success",
    message: "Nuevo Carrito generado",
    cart,
  });
};

export const addProductToCart = async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;
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
};

export const updateCart = async (req, res) => {
  const cid = req.params.cid;

  await cartService.updateCart(cid, req.body);
  res.status(203).send({
    status: "success",
    message: "Carrito modificado",
    carrito: cid,
  });
};

export const updateQuantityInCartProduct = async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;
  let { quantity } = req.body;

  await cartService.updateQuantityInCartProduct(cid, pid, quantity);
  res.status(200).send({
    status: "success",
    message: "Producto actualizado en el carrito",
    carrito: cid,
  });
};

export const deleteCartById = async (req, res) => {
  const cid = req.params.cid;

  await cartService.deleteCartById(cid);
  res.status(200).send({
    status: "success",
    message: "Productos eliminados del carrito",
    carrito: cid,
  });
};

export const deleteProductInCart = async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;

  await cartService.deleteProductInCart(cid, pid);
  res.status(200).send({
    status: "success",
    message: "Producto Eliminado del carrito",
    carrito: cid,
  });
};
