import { Router } from "express";
import passport from "passport";

const sessionRouter = Router();

//IMPLEMENTACIÓN DE CURRENT

sessionRouter.get("/current", async (req, res) => {
  try {
    const user = req.session.user;

    if (!user) {
      res.send({
        status: "error",
        message: "Ningún usuario ha iniciado sesión",
      });
    }

    res.status(200).json({
      status: "success",
      message: "El siguiente usuario se encuentra logeado:",
      usuario: user,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error en captura de usuario",
    });
  }
});

//IMPLEMENTACIÓN DE AUTENTICACIÓN A TRAVÉS DE GITHUB

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

export { sessionRouter };
