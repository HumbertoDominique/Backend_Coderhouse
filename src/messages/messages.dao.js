import { messageModel } from "./messages.model.js";

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
}

export const messageService = new MessageService();
