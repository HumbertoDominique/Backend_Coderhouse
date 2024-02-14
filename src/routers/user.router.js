import { Router } from "express";
import passport from "passport";

const userRouter = Router();

//IMPLEMENTACIÓN DE PASSPORT PARA REGISTER

userRouter.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/register" }),
  async (req, res) => {
    res.redirect("/login");
  }
);

//IMPLEMENTACIÓN DE PASSPORT PARA LOGIN

userRouter.post(
  "/auth",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", error: "Credenciales inválidas" });
    req.session.user = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      age: req.user.age,
      cart: req.user.cart,
    };
    res.redirect("/products");
  }
);

userRouter.post("/logout", (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en servidor para cierre de sesión",
    });
  }
});

export { userRouter };
