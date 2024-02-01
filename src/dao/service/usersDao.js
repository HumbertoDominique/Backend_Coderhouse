import { userModel } from "../models/users.model.js";

class UserService {
  constructor() {
    this.model = userModel;
  }

  async createUser(userData) {
    return await this.model.create(userData);
  }

  async getUserByEmail(email) {
    return await this.model.findOne({ email: email });
  }

  async getUserByfirstName(name) {
    return await this.model.findOne({ firstName: name });
  }
}

export const userService = new UserService();
