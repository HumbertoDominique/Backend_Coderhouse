import fs from "fs";

export default class CartManager {
  id = 0;

  constructor() {
    if (!fs.existsSync("./carrito.json")) {
      fs.writeFileSync(`./carrito.json`, JSON.stringify([]));
    }
  }

  //MÉTODO ADDCART GENERA UN NUEVO CARRO COMO ARREGLO CON ID AUTOGENERADO Y ARREGLO DE PRODUCTOS VACÍO.
  async addCart() {
    try {
      const carritosGuardados = await this.getCarritos();

      const cart = {};

      cart.id = await this.getId();
      cart.products = [];

      carritosGuardados.push(cart);

      await fs.promises.writeFile(
        `./carrito.json`,
        JSON.stringify(carritosGuardados)
      );
    } catch (err) {
      console.log("\nError en cartManager - addCart");
    }
  }

  //MÉTODO GETID GENERA ID AUTOINCREMENTABLE A CADA CARRITO GENERADO
  async getId() {
    try {
      const carritosGuardados = await this.getCarritos();
      if (carritosGuardados.length < 1) {
        this.id = 1;
      } else {
        let check = carritosGuardados.map((p) => p.id);
        check.sort((a, b) => b - a);
        let topId = parseInt(check.splice(0, 1));

        this.id = topId + 1;
      }
      return this.id;
    } catch (err) {
      console.log("\nError en cartManager - getID");
    }
  }

  //MÉTODO GET CARRITOS MUESTRA TODOS LOS CARRITOS DISPONIBLES EN carrito.json
  async getCarritos() {
    try {
      const carritosGuardados = await fs.promises.readFile(
        `./carrito.json`,
        "utf-8"
      );
      return JSON.parse(carritosGuardados);
    } catch (err) {
      console.log("\nError en cartManager - getCarritos");
    }
  }

  //MÉTODO GET PRODUCTS CONSIGUE LOS PRUDUCTOS DISPONIBLES EN productos.json
  async getProducts() {
    try {
      const productosGuardados = await fs.promises.readFile(
        `./productos.json`,
        "utf-8"
      );
      return JSON.parse(productosGuardados);
    } catch (err) {
      console.log("\nError en cartManager - getProducts");
    }
  }

  //MÉTODO ADD ITEM TO CART AGREGA EL PRODUCTO INDICADO EN EL CARRITO SELECCIONADO A TRAVÉS DE SU ID
  async addItemtoCart(idCarrito, idProducto) {
    try {
      let carritosGuardados = await this.getCarritos();

      let productosGuardados = await this.getProducts();

      let carritoSelect = await carritosGuardados.find(
        (c) => c.id === idCarrito
      );

      let productoPorAgregar = await productosGuardados.find(
        (p) => p.id == idProducto
      );

      let producto = {
        idProducto: productoPorAgregar.id,
        quantity: 1,
      };

      let anterior = carritoSelect.products;

      let productoRepetido = await anterior.find(
        (p) => p.idProducto === producto.idProducto
      );

      if (anterior.includes(productoRepetido)) {
        productoRepetido.quantity++;
      } else {
        anterior.push(producto);
      }

      await fs.promises.writeFile(
        `./carrito.json`,
        JSON.stringify(carritosGuardados)
      );
    } catch (err) {
      console.log("\nError en cartManager - addItemToCart");
    }
  }

  //MÉTODO DELETECART ELIMINA EL CARRITO SELECCIONADO
  async deleteCart(idCarrito) {
    try {
      const carritosGuardados = await this.getCarritos();

      const cartIndex = carritosGuardados.findIndex(
        (carrito) => carrito.id === idCarrito
      );

      carritosGuardados.splice(cartIndex, 1);

      await fs.promises.writeFile(
        `./carrito.json`,
        JSON.stringify(carritosGuardados)
      );
    } catch (err) {
      console.log("\nError en cartManager - deleteCart");
    }
  }
}
