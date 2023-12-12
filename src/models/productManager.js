import fs from "fs";

export default class ProductManager {
  id = 0;

  constructor() {
    if (!fs.existsSync("./productos.json")) {
      fs.writeFileSync(`./productos.json`, JSON.stringify([]));
    }
  }

  //MÉTODO ADD PRODUCTS CREA NUEVOS PRODUCTOS.
  //TODOS LOS CAMPOS SON REQUERIDOS CON EXCEPCIÓN DE THUMBNAIL.
  //NO SE PERMITEN CÓDIGOS DUPLICADOS ENTRE PRODUCTOS.
  //STATUS SOLO RECIBE VALORES BOOLEANOS, EN CASO DE INGRESAR OTRO VALOR, POR DEFAULT SERÁ ASIGNADO TRUE.
  //THUMBNAIL ES UN ARREGLO QUE SOLO RECIBE STRINGS.
  async addProduct(
    title,
    description,
    code,
    price,
    stock,
    category,
    status,
    thumbnail
  ) {
    try {
      const productosGuardados = await this.getProducts();

      const producto = {
        title: title,
        description: description,
        code: code,
        price: price,
        stock: stock,
        category: category,
        status: status,
        thumbnail: [],
      };

      const codigoDuplicado = productosGuardados.findIndex(
        (producto) => producto.code === code
      );

      const valoresProductos = Object.values(producto);

      if (valoresProductos.includes(undefined)) {
        console.log("CAMPOS REQUERIDOS - PRODUCTO NO CREADO", valoresProductos);
      } else if (codigoDuplicado != -1) {
        console.log("CÓDIGO DUPLICADO - PRODUCTO NO CREADO");
        console.log(producto.code);
      } else {
        producto.id = await this.getId();

        let rutaImagenes = producto.thumbnail;
        if (typeof thumbnail === "string") {
          rutaImagenes.push(thumbnail);
        }

        if (producto.status != false) {
          producto.status = true;
        }
        await productosGuardados.push(producto);
      }

      await fs.promises.writeFile(
        `./productos.json`,
        JSON.stringify(productosGuardados)
      );
    } catch (err) {
      console.log("\nError en productManager - addProduct");
    }
  }

  //MÉTODO GET ID AUTOGENERA EL ID DE LOS PRODUCTOS.
  async getId() {
    try {
      const productosGuardados = await this.getProducts();
      if (productosGuardados.length < 1) {
        this.id = 1;
      } else {
        let check = productosGuardados.map((p) => p.id);
        check.sort((a, b) => b - a);
        let topId = parseInt(check.splice(0, 1));

        this.id = topId + 1;
      }
      return this.id;
    } catch (err) {
      console.log("\nError en productManager - getID");
    }
  }

  //MÉTODO GETPRODUCTS MUESTRA TODOS LOS PRODUCTOS GENERADOS.
  async getProducts() {
    try {
      const productosGuardados = await fs.promises.readFile(
        `./productos.json`,
        "utf-8"
      );
      return JSON.parse(productosGuardados);
    } catch (err) {
      console.log("\nError en productManager - getProducts");
    }
  }

  //MÉTODO GET PRODUCTS BY ID MUESTRA EL PRODUCTO CON EL ID SELECCIONADO
  async getProductsById(idProducto) {
    try {
      const productosGuardados = await this.getProducts();

      const productsIndex = productosGuardados.findIndex(
        (producto) => producto.id === idProducto
      );

      if (productsIndex === -1) {
        ("/n");
        console.log("\nEl producto que está tratando de buscar no existe.");
      } else {
        ("/n");
        console.log("\nEl producto que está buscando por id es:");
        console.log(productosGuardados[productsIndex]);
      }
    } catch (err) {
      console.log("\nError en productManager - getProductsById");
    }
  }

  //MÉTODO UPDATEPRODUCT MODIFICA LAS PROPIEDADES DEL PRODUCTO EXCEPTO SU ID.
  //SE MANTIENE EL CRITERIO SOBRE EL STATUS, SOLO ADMITE VALORES BOOLEANOS.
  //SE MANTIENE EL CRITERIO SOBRE THUMBNAIL, SOLO RECIBE STRINGS.
  async updateProduct(idProducto, modificacion, thumbnail) {
    try {
      const productosGuardados = await this.getProducts();

      const productsIndex = productosGuardados.findIndex(
        (producto) => producto.id === idProducto
      );

      let {
        title,
        description,
        code,
        price,
        stock,
        category,
        status,
        thumbnail,
      } = modificacion;

      let { id } = productosGuardados[productsIndex];

      let update = {
        ...productosGuardados[productsIndex],
        title,
        description,
        code,
        price,
        stock,
        category,
        status,
        id,
      };

      let rutaImagenes = productosGuardados[productsIndex].thumbnail;
      if (typeof thumbnail === "string") {
        rutaImagenes.push(thumbnail);
      }

      if (update.status != false) {
        update.status = true;
      }

      productosGuardados[productsIndex] = update;

      await fs.promises.writeFile(
        `./productos.json`,
        JSON.stringify(productosGuardados)
      );
    } catch (err) {
      console.log("\nError en productManager - updateProduct");
    }
  }

  //MÉTODO DELETEPRODUCT ELIMINA EL PRODUCTO SELECCIONADO POR SU ID.
  async deleteProduct(idProducto) {
    try {
      const productosGuardados = await this.getProducts();

      const productsIndex = productosGuardados.findIndex(
        (producto) => producto.id === idProducto
      );

      productosGuardados.splice(productsIndex, 1);

      await fs.promises.writeFile(
        `./productos.json`,
        JSON.stringify(productosGuardados)
      );
    } catch (err) {
      console.log("\nError en productManager - deleteProduct");
    }
  }
}
