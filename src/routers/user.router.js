import { Router } from "express";
import { userService } from "../dao/service/usersDao.js";

const userRouter = Router();

userRouter.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      let userAdmin = {
        firstName: "CODERHOUSE",
        lastName: "ACADEMIA",
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        roll: "admin",
      };

      req.session.user = userAdmin;
      req.session.admin = true;
      res.redirect("/products");
    } else {
      const user = await userService.getUserByEmail(email);

      if (!user) throw new Error("El usuario indicado no existe");
      if (user.password !== password)
        throw new Error("Error en ingreso de contraseña");

      req.session.user = user;

      res.redirect("/products");
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en userRouter - LogIn User",
    });
  }
});

userRouter.post("/", async (req, res) => {
  const userData = req.body;

  try {
    await userService.createUser(userData);

    res.redirect("/login");
  } catch (err) {
    res
      .status(500)
      .send({ status: "error", message: "Error en userRouter - Create User" });
  }
});

userRouter.post("/logout", (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (err) {
    res
      .status(500)
      .send({ status: "error", message: "Error en userRouter - User LogOut" });
  }
});

export { userRouter };
