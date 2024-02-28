import dotenv from "dotenv";

let path = ".env";
dotenv.config({ path });

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  cookieParser: process.env.COOKIE_PARSER,
  clientID: process.env.CLIENT_I_D,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_U_R_L,
};
