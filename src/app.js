import express from "express";
import ProductManager from "./productManager.js";

const app = express();

const productManager = new ProductManager();

app.use(express.urlencoded({ extended: true }));

//Se obtienen los productos a partir de la clase productManager.getProducts
//A través del método Find se encuentra el elemento que coincida o se envía error en caso de que no exista.

app.get("/products/:id", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    let idProduct = req.params.id;

    let product = products.find((p) => p.id == idProduct);

    if (!product) return res.send({ error: "Producto no encontrado" });

    res.send({ product });
  } catch (err) {
    console.log("ERROR DETECTADO AL BUSCAR ELEMENTO POR PARAM");
  }
});

//Se obtienen los productos a partir de la clase productManager.getProducts
//Se captura la query en una variable "limit"
//A través del método splice, se eliminan del arreglo original "products", todos los productos cuyo índice sea >= que el solicitado en la query.
//Se devuelve como respuesta los elementos remanentes en el arreglo original "products"

app.get("/products", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    let limit = req.query.limit;

    if (!limit) return res.send(products);

    let productSplice = products.splice(limit);
    res.send({ productos: products });
  } catch (err) {
    console.log("ERROR DETECTADO AL BUSCAR ELEMENTO POR QUERY");
  }
});

app.listen(8080, () => {
  console.log("Escuchando desde el puerto 8080");
});
