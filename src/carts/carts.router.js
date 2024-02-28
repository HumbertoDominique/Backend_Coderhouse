import { Router } from "express";

import {
  getCarts,
  getCartsById,
  addNewCart,
  addProductToCart,
  updateCart,
  updateQuantityInCartProduct,
  deleteCartById,
  deleteProductInCart,
} from "./carts.controller.js";

const cartRouter = Router();

cartRouter.get("/", getCarts);

cartRouter.get("/:cid", getCartsById);

cartRouter.post("/", addNewCart);

cartRouter.post("/:cid/products/:pid", addProductToCart);

cartRouter.put("/:cid", updateCart);

cartRouter.put("/:cid/products/:pid", updateQuantityInCartProduct);

cartRouter.delete("/:cid", deleteCartById);

cartRouter.delete("/:cid/products/:pid", deleteProductInCart);

export { cartRouter };
