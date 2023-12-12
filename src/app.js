import express from "express";
import { productsRouter } from "./routers/products.router.js";
import { cartRouter } from "./routers/carts.router.js";

//SE IMPORTAN LOS DOS ARCHIVOS DE RUTAS PARA PRODUCTOS Y CARRITOS.

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//SE INDICAN LOS ENDPOINTS PARA TRABAJAR CON CADA RUTA.
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

//SE INDICA EL SERVIDOR LOCAL DONDE SE DESARROLLARÁ EL SERVIDOR.
app.listen(8080, () => {
  console.log("Escuchando servidor 8080");
});
