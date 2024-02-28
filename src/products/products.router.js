import { Router } from "express";

import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./products.controller.js";

const productsRouter = Router();

productsRouter.get("/", getProducts);

productsRouter.get("/:pid", getProductById);

productsRouter.post("/", addProduct);

productsRouter.put("/:pid", updateProduct);

productsRouter.delete("/:pid", deleteProduct);

export { productsRouter };
