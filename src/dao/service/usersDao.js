import { userModel } from "../models/users.model.js";
import { cartService } from "./cartsDao.js";

class UserService {
  constructor() {
    this.model = userModel;
  }

  async createUser(userData) {
    const userCart = await cartService.addNewCart({ products: [] });
    userData.cart = userCart._id;
    return await this.model.create(userData);
  }

  async getUserByEmail(email) {
    return await this.model.findOne({ email: email });
  }
}

export const userService = new UserService();
