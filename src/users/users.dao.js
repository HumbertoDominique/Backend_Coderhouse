import { userModel } from "./users.model.js";
import { cartService } from "../carts/carts.dao.js";

class UserService {
  createUser = async (userData) => {
    try {
      const userCart = await cartService.addNewCart({ products: [] });
      userData.cart = userCart._id;
      return await userModel.create(userData);
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en createUser",
      });
    }
  };

  getUserByEmail = async (email) => {
    try {
      return await userModel.findOne({ email: email });
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: "Error en getUserByEmail",
      });
    }
  };
}

export const userService = new UserService();
