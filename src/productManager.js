import fs from "fs";

export default class ProductManager {
  #id = 0;

  //Se crea variable this.path que recibe desde el constructor de la instancia, la ruta del archivo en el que serán almacenados los productos.
  constructor() {
    if (!fs.existsSync("./test.json")) {
      fs.writeFileSync(`./test.json`, JSON.stringify([]));
    }
  }

  //Método addProducts que agrega productos al arreglo.

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      const productosGuardados = await this.getProducts();

      const producto = {
        title, //NOMBRE DEL PRODUCTO
        description, //DESCRIPCIÓN DEL PRODUCTO
        price, //PRECIO
        thumbnail, //RUTA DE IMAGEN
        code, //CÓDIGO IDENTIFICADOR
        stock, //NÚMERO DE PIEZAS DISPONIBLES
      };

      const codigoDuplicado = productosGuardados.findIndex(
        (producto) => producto.code === code
      );

      const valoresProductos = Object.values(producto);

      if (valoresProductos.includes(undefined)) {
        console.log(
          "\nTodos los campos son obligatorios para agregar productos.\n"
        );
      } else if (codigoDuplicado != -1) {
        console.log(
          "\nSe ha detectado que el siguiente código está duplicado:"
        );
        console.log(producto.code);
      } else {
        producto.id = this.#getId();
        productosGuardados.push(producto);
      }

      await fs.promises.writeFile(
        `${this.path}`,
        JSON.stringify(productosGuardados)
      );
    } catch (err) {
      console.log("\nError durante la lectura inicial de productos");
    }
  }

  #getId() {
    this.#id++;
    return this.#id;
  }

  //Método getProductos que trae todos los productos presentes en el arreglo.
  async getProducts() {
    try {
      const productosGuardados = await fs.promises.readFile(
        `./test.json`,
        "utf-8"
      );
      return JSON.parse(productosGuardados);
    } catch (err) {
      console.log("\nError durante la revisión de los productos");
    }
  }

  //Método getProductsById que trae el producto con el id seleccionado o indica error en caso de no existir producto con ese id.

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
      console.log("\nError al buscar producto por su id");
    }
  }

  //Método updateProduct que permite modificar las propiedades de algún producto seleccionado por su id sin modificar su id.

  async updateProduct(idProducto, modificacion) {
    try {
      const productosGuardados = await this.getProducts();

      const productsIndex = productosGuardados.findIndex(
        (producto) => producto.id === idProducto
      );

      if (productsIndex === -1) {
        console.log("\nEl producto que está tratando de modificar no existe.");
      } else {
        let objetoModificacion = modificacion;

        let { id } = productosGuardados[productsIndex];

        let update = {
          ...productosGuardados[productsIndex],
          ...objetoModificacion,
          id,
        };

        productosGuardados[productsIndex] = update;

        await fs.promises.writeFile(
          `${this.path}`,
          JSON.stringify(productosGuardados)
        );

        console.log("\nEl producto modificado es el siguiente: \n", update);
      }
    } catch (err) {
      console.log("\nError al modificar el producto");
    }
  }

  //Método deleteProduct que permite eliminar un producto del arreglo seleccionado por su id e indica error en caso de no existir producto con ese id.

  async deleteProduct(idProducto) {
    try {
      const productosGuardados = await this.getProducts();

      const productsIndex = productosGuardados.findIndex(
        (producto) => producto.id === idProducto
      );

      if (productsIndex === -1) {
        console.log("\nEl producto que está tratando de borrar no existe.");
      } else {
        console.log(
          "\nProducto eliminado con el siguiente id:",
          productosGuardados[productsIndex].id
        );
        console.log(
          "Nombre del producto: ",
          productosGuardados[productsIndex].title
        );

        productosGuardados.splice(productsIndex, 1);

        await fs.promises.writeFile(
          `${this.path}`,
          JSON.stringify(productosGuardados)
        );
      }
    } catch (err) {
      console.log("\nError al buscar producto por su id");
    }
  }
}

//TESTING DEL DESAFÍO.

//Se genera la instancia y se especifica la ruta de almacenamiento de los productos.

/*
const productManager = new ProductManager("./test.json");
const test = async () => {
  try {
    //Se evalúa que la instancia inicialmente sea un arreglo vacío.
    //Se evalúa que se cree producto con id autogenerado. Se mantienen validaciones en caso de ingresar códigos duplicados y que todos los campos sean obligatorios.
    await productManager.addProduct(
      "Producto1",
      "Descripción1",
      200,
      "Sin imagen",
      "abc123",
      25
    );
    await productManager.addProduct(
      "Producto2",
      "Descripción2",
      210,
      "Sin imagen",
      "abc124",
      25
    );
    await productManager.addProduct(
      "Producto3",
      "Descripción3",
      220,
      "Sin imagen",
      "abc125",
      25
    );
    await productManager.addProduct(
      "Producto4",
      "Descripción4",
      230,
      "Sin imagen",
      "abc126",
      25
    );
    await productManager.addProduct(
      "Producto5",
      "Descripción5",
      240,
      "Sin imagen",
      "abc127",
      25
    );
    await productManager.addProduct(
      "Producto6",
      "Descripción6",
      250,
      "Sin imagen",
      "abc128",
      25
    );
    await productManager.addProduct(
      "Producto7",
      "Descripción7",
      260,
      "Sin imagen",
      "abc129",
      25
    );
    await productManager.addProduct(
      "Producto8",
      "Descripción8",
      270,
      "Sin imagen",
      "abc130",
      25
    );
    await productManager.addProduct(
      "Producto9",
      "Descripción9",
      280,
      "Sin imagen",
      "abc131",
      25
    );
    await productManager.addProduct(
      "Producto10",
      "Descripción10",
      290,
      "Sin imagen",
      "abc132",
      25
    );
  } catch (err) {
    console.log("Error durante la ejecución del Test");
  }
};
test();*/
