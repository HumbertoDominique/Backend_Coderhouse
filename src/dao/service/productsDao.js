import { productModel } from "../models/products.model.js";

class ProductService {
  constructor() {
    this.model = productModel;
  }

  async getProducts() {
    return await this.model.find();
  }
  async getProductById(pid) {
    if (!pid) {
      throw new Error("Se requiere el id del producto solicitado");
    }
    return this.model.find({ _id: pid });
  }
  async addProduct(product) {
    return await this.model.create(product);
  }
  async updateProduct(pid, product) {
    if (!pid) {
      throw new Error("Se requiere el id del producto a modificar");
    }
    return await this.model.updateOne({ _id: pid }, product);
  }
  async deleteProduct(pid) {
    if (!pid) {
      throw new Error("Se requiere el id del producto a eliminar");
    }
    return this.model.deleteOne({ _id: pid });
  }
}

export const productService = new ProductService();
