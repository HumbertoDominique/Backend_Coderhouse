class ProductManager {
  #id = 0;

  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const producto = {
      title, //NOMBRE DEL PRODUCTO
      description, //DESCRIPCIÓN DEL PRODUCTO
      price, //PRECIO
      thumbnail, //RUTA DE IMAGEN
      code, //CÓDIGO IDENTIFICADOR
      stock, //NÚMERO DE PIEZAS DISPONIBLES
    };

    const codigoDuplicado = this.products.findIndex(
      (producto) => producto.code === code
    );

    const valoresProductos = Object.values(producto);

    if (valoresProductos.includes(undefined)) {
      console.log(
        "\nTodos los campos son obligatorios para agregar productos.\n"
      );
    } else if (codigoDuplicado != -1) {
      console.log("\nSe ha detectado que el siguiente código está duplicado:");
      console.log(producto.code);
    } else {
      producto.id = this.#getId();
      this.products.push(producto);
    }
  }

  #getId() {
    this.#id++;
    return this.#id;
  }

  getProducts() {
    return this.products;
  }

  getProductsById(idProducto) {
    const productsIndex = this.products.findIndex(
      (producto) => producto.id === idProducto
    );

    if (productsIndex === -1) {
      console.log("\nEl producto que está tratando de buscar no existe.");
    } else {
      console.log("\nEl producto que está buscando por id es:");
      console.log(this.products[productsIndex]);
    }
  }
}

//TESTING DEL DESAFÍO.

const productManager = new ProductManager();

//  SE LEE EN ARREGLO INICIAL DE PRODUCTOS - ARREGLO VACÍO
console.log("\nARREGLO INICIAL DE PRODUCTOS", productManager.getProducts());

// SE CREA PRIMER PRODUCTO PARA AGREGAR AL ARREGLO.
productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

// SE CREA SEGUNDO PRODUCTO CON VALORES DISTINTOS PERO MISMO CÓDIGO QUE PRODUCTO 1 - NO SE AGREGA AL ARREGLO.
productManager.addProduct(
  "ProductoB",
  "DEF",
  "2000",
  "Con Imagen",
  "abc123",
  "20"
);

//SE CREA TERCER PRODUCTO CON MISMOS VALORES DEL PRIMER PRODUCTO PERO CON CÓDIGO DISTINTO PARA VALIDAR QUE LA RESTRICCIÓN ES SOLO POR CÓDIGO - SI SE AGREGA AL ARREGLO.
productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "def456",
  25
);

//SE CREA CUARTO PRODUCTO SIN NÚMERO DE STOCK PARA VALIDAR QUE SE SOLICITE QUE TODOS LOS CAMPOS SON OBLIGATORIOS ANTES DE AGREGARLOS AL ARREGLO - NO SE AGREGA AL ARREGLO.
productManager.addProduct("ProductoC", "GHI", "3000", "Sin imagen", "789");

// SE UTILIZA EL MÉTODO GET PRODUCTS PARA EVALUAR QUE PRODUCTOS FUERON AGREGADOS AL ARREGLO.
console.log(productManager.getProducts());

// SE UTILIZA MÉTODO GET PRODUCTS BY ID PARA EVALUAR QUE LA BUSQUEDA ENCUENTRA EL ELEMENTO CON EL ID SELECCIONADO.
productManager.getProductsById(2);

// SE COLOCA UN NÚMERO DE ID NO EXISTENTE PARA VALIDAR LA RESPUESTA "NOT FOUND" SI EL ELEMENTO SOLICITADO NO EXISTE.
productManager.getProductsById(4);
