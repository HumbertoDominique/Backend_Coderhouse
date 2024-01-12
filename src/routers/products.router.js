import { Router } from "express";
import { productService } from "../dao/service/productsDao.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    let products = await productService.getProducts();
    let limit = req.query.limit;

    if (!limit) return res.send(products);
    let productSplice = products.splice(limit);

    res.send({
      status: "success",
      message: "Get Products",
      products,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en ProductRouter - GetProducts",
    });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    let pid = req.params.pid;
    let product = await productService.getProductById(pid);

    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "Producto no encontrado" });

    res.send({
      status: "success",
      message: "Get Product By Id",
      product,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en ProductRouter - GetProducts por ID",
    });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const product = await productService.addProduct(req.body);
    res.status(201).send({
      status: "success",
      message: "Nuevo Producto generado",
      product,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en ProductRouter - Post nuevo Producto",
    });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await productService.updateProduct(pid, req.body);
    res.status(203).send({
      status: "success",
      message: "Producto modificado",
      producto: pid,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en ProductRouter - Update Producto",
    });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  const pid = req.params.pid;
  try {
    await productService.deleteProduct(pid);
    res.status(200).send({
      status: "success",
      message: "Producto Eliminado",
      producto: pid,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en ProductRouter - Delete Product By Id",
    });
  }
});
export { productsRouter };
