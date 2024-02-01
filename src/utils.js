import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

//SET DIRNAME

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

//SET BCRYPT

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compare(password, user.password);
