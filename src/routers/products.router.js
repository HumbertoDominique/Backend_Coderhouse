import { Router } from "express";
import { productService } from "../dao/service/productsDao.js";
import { isUpdate } from "../middleware/realTimeProducts.middleware.js";

const productsRouter = Router();

productsRouter.get("/", isUpdate, async (req, res) => {
  try {
    const { limit, page, sort, category, availability } = req.query;

    let products = await productService.getProducts(
      limit,
      page,
      sort,
      category,
      availability
    );

    products.hasPrevPage
      ? (products.prevLink =
          "?limit={{limit}}&page={{prevPage}}&category={{category}}&sort={{sort}}&availability={{availability}}")
      : (products.prevLink = "null");

    products.hasNextPage
      ? (products.nextLink =
          "?limit={{limit}}&page={{nextPage}}&category={{category}}&sort={{sort}}&availability={{availability}}")
      : (products.nextLink = "null");

    res.send({
      status: "success",
      payload: products,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en ProductRouter - GetProducts",
    });
  }
});

productsRouter.get("/:pid", isUpdate, async (req, res) => {
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

productsRouter.post("/", isUpdate, async (req, res) => {
  try {
    const { thumbnail, ...product } = req.body;
    const productBody = await productService.addProduct(product, thumbnail);
    res.status(201).send({
      status: "success",
      message: "Nuevo Producto generado",
      productBody,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en ProductRouter - Post nuevo Producto",
    });
  }
});

productsRouter.put("/:pid", isUpdate, async (req, res) => {
  const pid = req.params.pid;
  try {
    const { thumbnail, ...product } = req.body;
    let [productBody] = await productService.updateProduct(pid, product);

    if (thumbnail) {
      productBody.thumbnails.push({ img: thumbnail });
    }
    productBody.save();
    res.status(203).send({
      status: "success",
      message: "Producto modificado",
      productBody,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en ProductRouter - Update Producto",
    });
  }
});

productsRouter.delete("/:pid", isUpdate, async (req, res) => {
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
