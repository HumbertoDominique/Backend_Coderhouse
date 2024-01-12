import { cartModel } from "../models/carts.model.js";
import { productService } from "./productsDao.js";

class CartService {
  constructor() {
    this.model = cartModel;
  }
  async getCarts() {
    return await this.model.find();
  }
  async getCartById(cid) {
    if (!cid) {
      throw new Error("Se requiere el id del carrito solicitado");
    }
    return this.model.find({ _id: cid });
  }

  async addNewCart(cart) {
    return await this.model.create(cart);
  }

  async addProductToCart(cid, pid) {
    const cart = await this.model.findOne({ _id: cid });
    const [product] = await productService.getProductById(pid);
    let check = cart.products;

    let productOnCart = check.find((p) => p.product == pid);

    if (check.includes(productOnCart)) {
      productOnCart.quantity++;
    } else {
      check.push({ product: product.id });
    }
    return await cart.save();
  }

  async deleteCartById(cid) {
    if (!cid) {
      throw new Error("Se requiere el id del carrito a eliminar");
    }
    return this.model.deleteOne({ _id: cid });
  }
}

export const cartService = new CartService();
