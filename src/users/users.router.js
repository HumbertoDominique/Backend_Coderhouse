import { Router } from "express";
import passport from "passport";

import { userRegister, userLogin, userLogout } from "./users.controller.js";

const userRouter = Router();

userRouter.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/register" }),
  userRegister
);

userRouter.post(
  "/auth",
  passport.authenticate("login", { failureRedirect: "/login" }),
  userLogin
);

userRouter.post("/logout", userLogout);

export { userRouter };
