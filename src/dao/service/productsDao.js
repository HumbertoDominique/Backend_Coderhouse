import { productModel } from "../models/products.model.js";

class ProductService {
  constructor() {
    this.model = productModel;
  }

  async getProducts(
    limit = 10,
    page = 1,
    sort = undefined,
    category = false,
    availability = undefined
  ) {
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

    return await this.model.paginate(filter, {
      lean: true,
      limit,
      page,
      sort: { price: sort },
    });
  }

  async getProductById(pid) {
    if (!pid) {
      throw new Error("Se requiere el id del producto solicitado");
    }
    return this.model.find({ _id: pid });
  }

  async addProduct(product, thumbnail) {
    let productAdded = await this.model.create(product);
    productAdded.thumbnails.push({ img: thumbnail });
    productAdded.save();
    return productAdded;
  }
  async updateProduct(pid, product) {
    if (!pid) {
      throw new Error("Se requiere el id del producto a modificar");
    }
    await this.model.updateOne({ _id: pid }, product);
    let productUpdated = this.model.find({ _id: pid });
    return productUpdated;
  }
  async deleteProduct(pid) {
    if (!pid) {
      throw new Error("Se requiere el id del producto a eliminar");
    }
    return this.model.deleteOne({ _id: pid });
  }
}

export const productService = new ProductService();
