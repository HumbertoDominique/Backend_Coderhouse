import { cartModel } from "./carts.model.js";
import { productService } from "../products/products.dao.js";

class CartService {
  getCarts = async () => {
    try {
      return await cartModel.find().lean();
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en getCarts",
      });
    }
  };

  getCartById = async (cid) => {
    try {
      if (!cid) {
        throw new Error("Se requiere el id del carrito solicitado");
      }
      return cartModel.find({ _id: cid }).lean();
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en getCartsById",
      });
    }
  };

  addNewCart = async (cart) => {
    try {
      return await cartModel.create(cart);
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en addNewCart",
      });
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      const [product] = await productService.getProductById(pid);
      let check = cart.products;

      let productOnCart = check.find((p) => p.product == pid);

      if (check.includes(productOnCart)) {
        productOnCart.quantity++;
      } else {
        check.push({ product: product.id });
      }
      return await cart.save();
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en addProductToCart",
      });
    }
  };

  updateCart = async (cid, update) => {
    try {
      if (!cid) {
        throw new Error("Se requiere el id del carrito a eliminar");
      }
      return await cartModel.updateOne({ _id: cid }, update);
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en updateCart",
      });
    }
  };

  updateQuantityInCartProduct = async (cid, pid, quantity) => {
    try {
      if (!cid || !pid) {
        throw new Error(
          "Se requiere el id del carrito y del producto a modificar"
        );
      }
      const cart = await cartModel.findOne({ _id: cid });
      let check = cart.products;
      let productIndex = check.findIndex((p) => p.product == pid);

      let updateQuantity = (cart.products[productIndex].quantity = quantity);

      return await cart.save();
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en updateQuantityInCartProduct",
      });
    }
  };

  deleteCartById = async (cid) => {
    try {
      if (!cid) {
        throw new Error("Se requiere el id del carrito a eliminar");
      }
      let [cart] = await cartModel.find({ _id: cid });
      cart.products = [];

      return await cart.save();
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en deleteCartById",
      });
    }
  };

  deleteProductInCart = async (cid, pid) => {
    try {
      if (!cid || !pid) {
        throw new Error(
          "Se requiere el id del carrito y del producto a eliminar"
        );
      }

      let [cart] = await cartModel.find({ _id: cid });
      let check = cart.products;

      let productIndex = check.findIndex((p) => p.product == pid);

      let cartSplice = check.splice(productIndex, 1);
      return await cart.save();
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en deleteProductInCart",
      });
    }
  };
}

export const cartService = new CartService();
