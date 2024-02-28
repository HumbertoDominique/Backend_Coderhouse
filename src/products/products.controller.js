import { productService } from "./products.dao.js";

export const getProducts = async (req, res) => {
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
};

export const getProductById = async (req, res) => {
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
};

export const addProduct = async (req, res) => {
  const { thumbnail, ...product } = req.body;
  const productBody = await productService.addProduct(product, thumbnail);
  res.status(201).send({
    status: "success",
    message: "Nuevo Producto generado",
    productBody,
  });
};

export const updateProduct = async (req, res) => {
  const pid = req.params.pid;
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
};

export const deleteProduct = async (req, res) => {
  const pid = req.params.pid;
  await productService.deleteProduct(pid);
  res.status(200).send({
    status: "success",
    message: "Producto Eliminado",
    producto: pid,
  });
};
