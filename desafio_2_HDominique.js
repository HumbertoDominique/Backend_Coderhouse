const fs = require("fs");

class ProductManager {
  #id = 0;

  //Se crea variable this.path que recibe desde el constructor de la instancia, la ruta del archivo en el que serán almacenados los productos.
  constructor(ruta) {
    this.path = ruta;

    fs.writeFileSync(`${this.path}`, JSON.stringify([]));
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
        `${this.path}`,
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
const productManager = new ProductManager("./test.json");

const test = async () => {
  try {
    //Se evalúa que la instancia inicialmente sea un arreglo vacío.

    console.log("Arreglo vacío: ", await productManager.getProducts());

    //Se evalúa que se cree producto con id autogenerado. Se mantienen validaciones en caso de ingresar códigos duplicados y que todos los campos sean obligatorios.

    await productManager.addProduct(
      "producto prueba 1",
      "Este es un producto prueba",
      200,
      "Sin imagen",
      "abc123",
      25
    );

    await productManager.addProduct(
      "producto prueba 2",
      "Este es un producto prueba",
      200,
      "Sin imagen",
      "abc124",
      25
    );

    await productManager.addProduct(
      "producto prueba 3",
      "Este es un producto prueba",
      200,
      "Sin imagen",
      "abc125",
      25
    );

    //Se evalúa que método getProducts traiga todos los productos agregados.
    console.log("\n", await productManager.getProducts());

    //Se evalúa que método getProductsById arroje el producto con el id seleccionado o indique error en caso de no existir producto con ese id.
    await productManager.getProductsById(3);

    //Se evalúa que método updateProducts modifique las propiedades de los productos seleccionados por su id o indique error en caso de no existir producto con ese id.
    await productManager.updateProduct(1, {
      title: "SE MODIFICÓ",
      description: "SE MODIFICÓ",
      price: "SE MODIFICÓ",
    });

    await productManager.updateProduct(2, {
      thumbnail: "SE MODIFICÓ",
      stock: "SE MODIFICÓ",
      code: "SE MODIFICÓ",
    });

    //Se evalúa que método deleteProduct elimine del arreglo el producto seleccionado por su id o indique error en caso de no existir producto con ese id.
    await productManager.deleteProduct(1);
  } catch (err) {
    console.log("Error durante la ejecución del Test");
  }
};

test();
