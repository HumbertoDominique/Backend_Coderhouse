import { productModel } from "./products.model.js";

class ProductService {
  getProducts = async (
    limit = 10,
    page = 1,
    sort = undefined,
    category = false,
    availability = undefined
  ) => {
    try {
      let filter = {};

      if (category) {
        filter = { category };
      }

      if (availability === "true") {
        filter = { ...filter, stock: { $gt: 0 } };
      } else if (availability === "false") {
        filter = { ...filter, stock: 0 };
      }

      if (sort === "asc") {
        sort = 1;
      } else if (sort === "desc") {
        sort = -1;
      } else {
        sort = undefined;
      }

      return await productModel.paginate(filter, {
        lean: true,
        limit,
        page,
        sort: { price: sort },
      });
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en getProducts",
      });
    }
  };

  getProductById = async (pid) => {
    try {
      if (!pid) {
        throw new Error("Se requiere el id del producto solicitado");
      }
      return productModel.find({ _id: pid });
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en getProductsById",
      });
    }
  };

  addProduct = async (product, thumbnail) => {
    try {
      let productAdded = await productModel.create(product);
      productAdded.thumbnails.push({ img: thumbnail });
      productAdded.save();
      return productAdded;
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en addProducts",
      });
    }
  };

  updateProduct = async (pid, product) => {
    try {
      if (!pid) {
        throw new Error("Se requiere el id del producto a modificar");
      }
      await productModel.updateOne({ _id: pid }, product);
      let productUpdated = this.model.find({ _id: pid });
      return productUpdated;
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en updateProducts",
      });
    }
  };

  deleteProduct = async (pid) => {
    try {
      if (!pid) {
        throw new Error("Se requiere el id del producto a eliminar");
      }
      return this.model.deleteOne({ _id: pid });
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en deleteProducts",
      });
    }
  };
}

export const productService = new ProductService();
