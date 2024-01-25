import { io } from "../app.js";

export function isUpdate(req, res, next) {
  io.emit("link", "link");
  next();
}
