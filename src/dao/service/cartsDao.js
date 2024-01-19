import { cartModel } from "../models/carts.model.js";
import { productService } from "./productsDao.js";

class CartService {
  constructor() {
    this.model = cartModel;
  }
  async getCarts() {
    return await this.model.find().lean();
  }
  async getCartById(cid) {
    if (!cid) {
      throw new Error("Se requiere el id del carrito solicitado");
    }
    return this.model.find({ _id: cid }).lean();
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

  //MÉTODO QUE PERMITE ACTUALIZAR EL CONTENIDO DE UN CARRITO A TRAVÉS DE LO QUE SE LE PASE EN EL BODY DEL REQUEST.
  //EL REQ.BODY DEBE RESPETAR LO INDICADO EN EL SCHEMA, ES DECIR, SOLO SE RECIBE UN ARREGLO DE PRODUCTOS Y SUS CANTIDADADES (QUANTITY), DONDE LOS PRODUCTOS SON OBJETOS QUE EN SU PROPIEDAD "PRODUCTO", RECIBEN EL ID DEL PRODUCTO.
  async updateCart(cid, update) {
    if (!cid) {
      throw new Error("Se requiere el id del carrito a eliminar");
    }
    return await this.model.updateOne({ _id: cid }, update);
  }

  //MÉTODO QUE PERMITE ACTUALIZAR LA CANTIDAD DE UN PRODUCTO DENTRO DE UN CARRITO SELECCIONADO POR SU ID
  async updateQuantityInCartProduct(cid, pid, quantity) {
    if (!cid || !pid) {
      throw new Error(
        "Se requiere el id del carrito y del producto a modificar"
      );
    }
    const cart = await this.model.findOne({ _id: cid });
    let check = cart.products;
    let productIndex = check.findIndex((p) => p.product == pid);

    let updateQuantity = (cart.products[productIndex].quantity = quantity);

    return await cart.save();
  }

  //MÉTODO QUE PERMITE BORRAR TODOS LOS PRODUCTOS DENTRO DE UN CARRITO SELECCIONADO
  async deleteCartById(cid) {
    if (!cid) {
      throw new Error("Se requiere el id del carrito a eliminar");
    }
    let [cart] = await this.model.find({ _id: cid });
    cart.products = [];

    return await cart.save();
  }

  //MÉTODO QUE PERMITE ELIMITAR UN PRODUCTO PARTICULAR DENTRO DE UN CARRITO, SELECCIONADOS AMBOS A TRAVÉS DE SU ID.
  async deleteProductInCart(cid, pid) {
    if (!cid || !pid) {
      throw new Error(
        "Se requiere el id del carrito y del producto a eliminar"
      );
    }

    let [cart] = await this.model.find({ _id: cid });
    let check = cart.products;

    let productIndex = check.findIndex((p) => p.product == pid);

    let cartSplice = check.splice(productIndex, 1);
    return await cart.save();
  }
}

export const cartService = new CartService();
