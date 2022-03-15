"use strict";

import {
  BaseException,
  InvalidAccessConstructorException,
  EmptyValueException,
  InvalidValueException,
  AbstractClassException,
  NotExistException,
  ExistException
} from '../exceptions.js';


import { StoreException, CoordsStoreException, Store, Coords } from '../entities/stores.js';

import { Category } from '../entities/categories.js';

import { Product, Processor, Graphic_Card, RAM } from '../entities/products.js';

/*

  *** ACLARACIONES ***

  Utilizare la siguiente estructura, donde los productos se almacenan con sus caracteristicas en cada tienda.
  Por ello algunas excepciones son modificadas para poder usar esta estructura. Estas modificaciones seran comentadas.

  Estructura:
    - Categorias []
    - Tiendas -> [Tienda, productos -> [producto, categorias [], stock]]

*/

class StoreHouseException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: Store House Exception.", fileName, lineNumber);
    this.name = "StoreHouseException";
  }
}

class CategoryStoreHouseException extends StoreHouseException {
  constructor(fileName, lineNumber) {
    super("Error: The method needs a Category object.", fileName, lineNumber);
    this.name = "CategoryStoreHouseException";
  }
}

class ProductStoreHouseException extends StoreHouseException {
  constructor(fileName, lineNumber) {
    super("Error: The method needs a Product object.", fileName, lineNumber);
    this.name = "ProductStoreHouseException";
  }
}

class ShopStoreHouseException extends StoreHouseException {
  constructor(fileName, lineNumber) {
    super("Error: The method needs a Store object.", fileName, lineNumber);
    this.name = "ShopStoreHouseException";
  }
}

//Declaración objeto StoreHouse mediante patrón Singleton
let StoreHouse = (function () { //La función anónima devuelve un método getInstance que permite obtener el objeto único
  let instantiated;//Objeto con la instancia única StoreHouse

  function init(name) {//Inicialización del Singleton
    class StoreHouse {
      #name;
      #categories = []; // Inicializamos con una categoria por defecto
      #stores = [{
        store: new Store("XXXX", "HouseStore", "Default", "0", new Coords(1, 1)),
        products: []
      }]; // Inicializamos con una tienda por defecto

      constructor(name) { // asignamos nombre por defecto si no se le introduce ninguno
        if (!new.target) throw new InvalidAccessConstructorException();
        if (!name) throw new EmptyValueException("name");
        this.#name = name;
      }

      //Propiedades de acceso a los atributos privados
      get name() {
        return this.#name;
      }
      set name(value) {
        if (!value) throw new EmptyValueException("name");
        this.#name = value;
      }

      //Devuelve un iterator de las categorias
      get categories() {
        let array = this.#categories;
        return {
          *[Symbol.iterator]() {
            for (let category of array) {
              yield category;
            }
          }
        }
      }

      //Devuelve un iterator de las tiendas
      get stores() {
        let array = this.#stores;
        return {
          *[Symbol.iterator]() {
            for (let store of array) {
              yield store;
            }
          }
        }
      }
      //Devolvemos la tienda que tiene ese nombre
      getStore(name) {
        let shop;
        this.#stores.forEach(store => {
          if (store.store.name === name) {
            shop = store.store;
          }
        });
        if (!shop) throw new NotExistException(name);
        return shop;
      }
      //Devolvemos la categoria que tiene ese titulo
      getCategory(title) {
        let categorySelect;
        this.#categories.forEach(category => {
          if (category.title === title) {
            categorySelect = category;
          }
        });
        if (!categorySelect) throw new NotExistException(title);
        return categorySelect;
      }

      //Devolvemos un producto por el SerialNumber
      getProduct(serial) {
        let producSelect;
        this.#stores.forEach(store => {
          store.products.forEach(product => {
            if ((product.product.serialNumber == serial)) {
              producSelect = product;
            }
          })
        });
        if (!producSelect) throw new NotExistException(serial);
        return producSelect;
      }

      //Dado una categoria, devuelve la posición de esa categoria o -1 si no la encontramos.
      getCategoryPosition(category) {
        // Como comprobamos que la categoria sea un obejto Category no hace falta en el add y remove
        if (!(category instanceof Category)) throw new CategoryStoreHouseException(category);
        return this.#categories.findIndex(x => x.title === category.title);
      }
      // Dando nombre categoria , comprobamos la posicion
      //Como comprobamos que la categoria sea un obejto Category no hace falta en el add y remove
      getCategoryPositionByName(category) {
        return this.#categories.findIndex(x => x.title === category);
      }

      //Dado un producto, devuelve la posición de ese producto o -1 si no la encontramos.
      getProductPosition(product, store = this.#stores[0].store) { // Si no pasamos en que tienda buscar, buscaremos en la por defecto.
        // Como comprobamos que el producto sea un obejto Product no hace falta en el add y remove
        if (!(product instanceof Product)) throw new ProductStoreHouseException(product);
        if (!(store instanceof Store)) throw new ShopStoreHouseException(store);
        let position = this.getStorePosition(store);
        if (position === -1) throw new NotExistException(store);
        return this.#stores[position].products.findIndex(x => x.product.serialNumber === product.serialNumber);
      }

      //Dado un tienda, devuelve la posición de ese tienda o -1 si no la encontramos.
      getStorePosition(store) {
        // Como comprobamos que el tienda sea un obejto Store no hace falta en el add y remove
        if (!(store instanceof Store)) throw new ShopStoreHouseException(store);

        return this.#stores.findIndex(x => x.store.CIF === store.CIF);
      }

      // Añade una nueva categoría
      addCategory(category) {
        if (!category) throw new EmptyValueException("category");
        // Vamos comprobando si existe una categoría y si existe lanzamos excepción
        if (this.getCategoryPosition(category) !== -1) throw new ExistException(category);
        this.#categories.push(category);
        return this.#categories.length;
      }
      // Elimina una categoría. Al eliminar la categoría, sus productos pasan a la de por defecto.
      removeCategory(category) {
        // Vamos comprobando si existe una categoría con ese titulo y si existe lanzamos excepción
        let position = this.getCategoryPosition(category);
        if (position === -1) throw new NotExistException(category);
        // Comprobamos en todas las tiendas
        this.#stores.forEach(store => {
          store.products.forEach(product => {
            //Para cada producto comprobamos si tiene solo 1 categoría y si es la que vamos a eliminar para asignarle la default
            if ((product.categories.length === 1) && (product.categories[0].title === category.title)) {
              product.categories.push(new Category); // Añadimos categoria por defecto ya que eliminaremos la que tiene, así tendremos la categoría por defecto
            }
          })
        });
        this.#categories.splice(position, 1);
        return this.#categories.length;
      }
      // Añade un nuevo producto asociado a una o más categorías.
      // Entiendo que con addProduct añadimos los productos siempre a la tienda por defecto.
      addProduct(product, category = [this.#categories[0]]) { // Si no introducimos categoría, seleccionamos por defecto
        if (!product) throw new EmptyValueException("product"); // product no es null
        //Comprobamos cada categoria si existe
        let categories = [];
        category.forEach(cat => {
          if (this.getCategoryPositionByName(cat.title) === -1) throw new NotExistException(cat.title); // Comprobamos que exista la categoría
          categories.push(cat.title); // Aprovechando el bucle para la excepcion, guardamos solo el nombre de la categoria como clave
        });
        if (this.getProductPosition(product) !== -1) throw new ExistException(product); // El producto ya existe y lanzamos excepción
        this.#stores[0].products.push({ product: product, categories: categories, stock: 1 }); // Añadimos 1 por defectoo
        return this.#stores[0].products.length;
      }
      // Elimina un producto de la tienda por defecto.
      removeProduct(product) {
        let position = this.getProductPosition(product);
        if (position === -1) throw new NotExistException(product); // El producto no existe
        this.#stores[0].products.splice(position, 1);
        return this.#stores[0].products.length;
      }
      // Añade un Product en una tienda con un nº de unidades.
      // En este metodo añadire productos no existentes en una tienda, así el metodo addQuantityProductInShop lo usaremos para añadir sotck en un producto existente en una tienda.
      // También añado la opcion de agregar un array de categorias del producto.
      addProductInShop(product, shop, category = [this.#categories[0]]) {
        if (!product) throw new EmptyValueException("product"); // product no es null
        // Voy a quitar la excepcion de shop no existe.
        // Es mas util el metodo si podemos añadir productos diferentes a una misma tienda. Siendo poco eficiente tener los productos seprados de una misma tienda.
        if (this.getProductPosition(product, shop) !== -1) throw new ExistException(product); // A la vez que comprobamos si existe el producto comprobamos si existe la tienda
        //Comprobamos cada categoria si existe
        let categories = [];
        category.forEach(cat => {
          if (this.getCategoryPositionByName(cat.title) === -1) throw new NotExistException(cat.title); // Comprobamos que exista la categoría
          categories.push(cat.title); // Aprovechando el bucle para la excepcion, guardamos solo el nombre de la categoria como clave
        });
        this.#stores[this.getStorePosition(shop)].products.push({ product: product, categories: categories, stock: 1 });
        return this.#stores.length; // Devolvemos el tamaño del array tiendas
      }

      // Elimina un producto de una tienda concreta
      removeProductInShop(product, shop = this.#stores[0]) {
        let position = this.getProductPosition(product, shop);
        if (this.getProductPosition(product, shop) === -1) throw new NotExistException(product); // A la vez que comprobamos si no existe el producto comprobamos si existe la tienda
        if (position === -1) throw new NotExistException(product); // El producto no existe
        this.#stores[this.getStorePosition(shop)].products.splice(position, 1);
        return this.#stores[this.getStorePosition(shop)].products.length;
      }
      // Dado un Product y un Shop, se suman la cantidad de elementos al stock de esa tienda. Por defecto 1.
      addQuantityProductInShop(product, shop, stock = 1) {
        if (this.getProductPosition(product, shop) === -1) throw new NotExistException(product); // A la vez que comprobamos si existe el producto comprobamos si existe la tienda
        if (!Number.isInteger(stock) || stock < 1) throw new InvalidValueException("stock", stock);
        this.#stores[this.getStorePosition(shop)].products[this.getProductPosition(product, shop)].stock += stock;
        return this.#stores[this.getStorePosition(shop)].products[this.getProductPosition(product, shop)].stock;
      }
      // Devuelve la relación de todos los productos añadidos en una categoría con sus cantidades en stock. Si pasamos un tipo de producto, el resultado estará filtrado por ese tipo.
      getCategoryProducts(category, type = "") { // Si no introducimos tipo se asigna la clase Product
        if (!category) throw new EmptyValueException("category");
        if (this.getCategoryPosition(category) === -1) throw new NotExistException(category);
        let array = [];
        this.#stores.forEach(store => {
          store.products.forEach(product => {
            // Comprobamos si es del tipo de producto que queremos, si es el pordefecto pasa siempre el condicional sino lo filtra segun el tipo.
            if (type == "" || product.product.constructor.name == type) {
              if (product.categories.indexOf(category.title) !== -1) { // Comprobamos que tenga esa categoria por el titulo, que es lo que guardamos en el array categories de los productos
                array.push({ product: product.product, stock: product.stock }); // Pasamos el objeto producto y stock. Así no pasamos la variable categories del producto
              }
            }
          });
        });
        // Una vez quet enemos el array de los productos filtrado, retornamos el iterador de estos.
        return {
          *[Symbol.iterator]() {
            for (let product of array) {
              yield product;
            }
          }
        }
      }

      // Añade una nueva tienda.
      addShop(shop) {
        if (!shop) throw new EmptyValueException("shop");
        if (this.getStorePosition(shop) !== -1) throw new ExistException(shop);
        this.#stores.push({ store: shop, products: [] }); // Añadimos la tienda sin productos
        return this.#stores.length;
      }

      // Eliminar una tienda. Al eliminar una tienda, los productos de la tienda pasan a la tienda genérica.
      removeShop(shop) {
        if (!shop) throw new EmptyValueException("shop");
        let position = this.getStorePosition(shop);
        if (position === -1) throw new NotExistException(shop);
        // Añadimos todos los productos a la tienda por defecto
        this.#stores.forEach(store => {
          if (store.store.CIF == shop.CIF) {
            store.products.forEach(product => {
              this.stores[0].products.push(product);
            });
          }
        })
        this.#stores.splice(position, 1);
        return this.#stores.length; // Devolvemos la nueva cantidad de tienda que tenemos
      }
      // Devuelve la relación de todos los productos añadidos en una tienda con su stock. Si pasamos un tipo de producto, el resultado estará filtrado por ese tipo.
      getShopProducts(shop, type = "") {
        if (!shop) throw new EmptyValueException("shop");
        let position = this.getStorePosition(shop);
        if (position === -1) throw new NotExistException(shop);
        let array = [];
        this.#stores[position].products.forEach(product => {
          // Comprobamos si es del tipo de producto que queremos, si es el por defecto pasa siempre el condicional sino lo filtra segun el tipo.
          if (type == "" || product.product.constructor.name == type) {
            array.push({ product: product.product, stock: product.stock }); // Pasamos el objeto producto y stock. Así no pasamos la variable categories del producto
          }
        });
        return {
          *[Symbol.iterator]() {
            for (let product of array) {
              yield product;
            }
          }
        }
      }
      // Devuelve las categorias de una tienda
      getShopCategories(shop) {
        if (!shop) throw new EmptyValueException("shop");
        let position = this.getStorePosition(shop);
        if (position === -1) throw new NotExistException(shop);
        let array = [];
        this.#stores[position].products.forEach(product => {
          product.categories.forEach(title => {
            this.#categories.forEach(category => {
              if (category.title == title) {
                if (!(array.includes(category))) {
                  array.push(category);
                }
              }
            })
          })
        });
        return {
          *[Symbol.iterator]() {
            for (let product of array) {
              yield product;
            }
          }
        }
      }

      //Devuelve los productos de una categoria dentro de una tienda
      getShowCategoryProducts(shop, category, type = "") {
        if (!shop) throw new EmptyValueException("shop");
        let position = this.getStorePosition(shop);
        if (position === -1) throw new NotExistException(shop);
        if (!category) throw new EmptyValueException("category");
        if (this.getCategoryPosition(category) === -1) throw new NotExistException(category);
        let array = [];
        this.#stores[position].products.forEach(product => {
          if (product.categories.includes(category.title)) {
            if (type == "" || product.product.constructor.name == type) {
              array.push(product);
            }
          }
        });
        return {
          *[Symbol.iterator]() {
            for (let product of array) {
              yield product;
            }
          }
        }
      }

    }
    Object.defineProperty(StoreHouse.prototype, "name", { enumerable: true });
    Object.defineProperty(StoreHouse.prototype, "categories", { enumerable: true });
    Object.defineProperty(StoreHouse.prototype, "stores", { enumerable: true });

    let sh = new StoreHouse(name); // Congelamos el objeto StoreHouse para que sea una instancia única.
    Object.freeze(sh);
    return sh;
  } // Fin inicialización del Singleton
  return {
    //Devuelve un objeto con el método getInstance
    getInstance: function (name) {
      if (!instantiated) { //Si la variable instantiated es undefined, priemera ejecución, ejecuta init.
        instantiated = init(name); //instantiated contiene el objeto único
      }
      return instantiated; //Si ya está asignado devuelve la asignación.
    }
  };
})();

export default StoreHouse;
export {
  BaseException,
  InvalidAccessConstructorException,
  EmptyValueException,
  InvalidValueException,
  AbstractClassException,
  NotExistException,
  ExistException
} from '../exceptions.js';

export { StoreException, CoordsStoreException, Store, Coords } from '../entities/stores.js';

export { Category } from '../entities/categories.js';

export { Product, Processor, Graphic_Card, RAM } from '../entities/products.js';
