import { messageModel } from "../models/messages.model.js";

class MessageService {
  constructor() {
    this.model = messageModel;
  }

  async getMessages() {
    return await this.model.find().lean();
  }

  async addMessage(message) {
    return await this.model.create(message);
  }

  async deleteMsj(uname) {
    return await this.model.deleteMany({ user: uname });
  }
}

export const messageService = new MessageService();
