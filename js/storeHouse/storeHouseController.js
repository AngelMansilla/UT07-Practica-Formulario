"use strict";
import StoreHouse from './storeHouseModel.js';
import {
  BaseException,
  InvalidAccessConstructorException,
  EmptyValueException,
  InvalidValueException,
  AbstractClassException,
  NotExistException,
  ExistException
} from '../exceptions.js';
import { Product, Processor, Graphic_Card, RAM } from './storeHouseModel.js';
import { Category } from './storeHouseModel.js';
import { StoreException, CoordsStoreException, Store, Coords } from './storeHouseModel.js';

class StoreHouseController {
  //Campos privados
  #storeHouseModel;
  #storeHouseView;

  #loadStoreHouseObjects() {

    let cat1 = new Category("Gaming RGB", "Componentes destinados al gaming con leds añadidos");
    let cat2 = new Category("Gaming minimal", "Componetes destinados al gaming con un diseño minimalista");
    let cat3 = new Category("Ofimatica", "Componentes destinados para un uso básico");


    let shop1 = new Store("12345", "Amazon", "Ramirez de prado, 5, 28045, Madrid, Madrid, España", "34697632123", new Coords(7698769.3, 647));
    let shop2 = new Store("54321", "PC Componentes", "Avenida de Europa (pg ind las Salinas Parc. 2-5 y 2-6), , Alhama de Murcia, Murcia, España", "34785723102", new Coords(54231.23, 15423.2));
    let shop3 = new Store("32145", "Aliexpress", "Carrer de Laureà Miró, 20, 08950 Esplugues de Llobregat, Barcelona, España.", "34612321102", new Coords(143, 23));


    let p1 = new Processor("432214321423", "I5 10400F", "Not bad", 125, 21, "i510400f.png", "2.9GHz", "LG20", "R300", "No");
    let p2 = new Processor("13141111", "I5 12400F", "GOOD", 175, 21, "i512400f.png", "3.5GHz", "LG20", "R300", "No");
    let p3 = new Graphic_Card("432214321429", "3080", "So GOOD", 1225, 21, "3080.png", "NVIDIA", "basic", "10GB");
    let p4 = new Graphic_Card("23423151234", "3060 ti", "GOOD", 525, 21, "3060ti.png", "NVIDIA", "TI1", "8GB");
    let p5 = new RAM("14321423", "Kingstom", "bad", 35, 21, "kingstom8gb.png", "DDR2", "8GB", "2666MHz");
    let p6 = new RAM("413531", "ASUS", "Not bad", 55, 21, "asus4gb.png", "DDR2", "4GB", "2666MHz");

    this.#storeHouseModel.addShop(shop1);
    this.#storeHouseModel.addShop(shop2);
    this.#storeHouseModel.addShop(shop3);
    this.#storeHouseModel.addCategory(cat1);
    this.#storeHouseModel.addCategory(cat2);
    this.#storeHouseModel.addCategory(cat3);
    this.#storeHouseModel.addProduct(p6, [cat3]);
    // this.#storeHouseModel.addProduct(p1, [cat1]);
    this.#storeHouseModel.addProduct(p2, [cat2]);
    this.#storeHouseModel.addProduct(p3, [cat3]);
    this.#storeHouseModel.addProduct(p4, [cat1, cat2]);
    this.#storeHouseModel.addProduct(p5, [cat2, cat3]);
    this.#storeHouseModel.addProductInShop(p2, shop1, [cat2.title]);
    this.#storeHouseModel.addProductInShop(p1, shop1, [cat1.title]);
    this.#storeHouseModel.addProductInShop(p2, shop2, [cat2.title]);
    this.#storeHouseModel.addProductInShop(p3, shop3, [cat3.title]);
    this.#storeHouseModel.addProductInShop(p4, shop1, [cat1.title, cat2.title]);
    this.#storeHouseModel.addProductInShop(p6, shop2, [cat2.title, cat3.title]);
    this.#storeHouseModel.addQuantityProductInShop(p3, shop3, 5);
    this.#storeHouseModel.addQuantityProductInShop(p2, shop1, 7);
    this.#storeHouseModel.addQuantityProductInShop(p2, shop2, 3);
    this.#storeHouseModel.addQuantityProductInShop(p6, shop2, 9);
    this.#storeHouseModel.addQuantityProductInShop(p4, shop1, 2);
  }

  constructor(storeHouseModel, storeHouseView) {
    this.#storeHouseModel = storeHouseModel;
    this.#storeHouseView = storeHouseView;

    // Eventos iniciales del Controlador
    this.onLoad();
    this.onInit();

    // Enlazamos handlers con la vista
    this.#storeHouseView.bindInit(this.handleInit);
  }

  onInit = () => {
    this.onAddCategory();
    this.onAddStore();
    this.#storeHouseView.bindCloseProductInNewWindow();
  }

  onLoad = () => {
    this.#loadStoreHouseObjects();
    this.#storeHouseView.showAdministracion();
    this.#storeHouseView.bindAdministracionMenu(
      this.handleNewCategoryForm,
      this.handleRemoveCategoryForm,
      this.handleNewStoreForm,
      this.handleRemoveStoreForm,
      this.handleNewProductForm,
      this.handleRemoveProductForm,
      this.handleModStockForm
    );
  }


  onAddCategory = () => {
    this.#storeHouseView.showCategories(this.#storeHouseModel.categories);
    this.#storeHouseView.bindProductsCategoryList(this.handleProductsCategoryList);
  }

  onAddStore = () => {
    this.#storeHouseView.showStores(this.#storeHouseModel.stores);
    this.#storeHouseView.bindProductsStoreList(this.handleProductsStoreList);
  }


  handleInit = () => {
    this.onInit();
  }


  handleProductsCategoryList = (title) => {
    let category = this.#storeHouseModel.getCategory(title);
    this.#storeHouseView.listProducts(this.#storeHouseModel.getCategoryProducts(category), category.title);
    this.#storeHouseView.bindShowProduct(this.handleShowProduct);
    this.#storeHouseView.bindProductsStoreCategoryTypeList(this.handleProductsType, "", category);
  }
  handleProductsStoreList = (name) => {
    let store = this.#storeHouseModel.getStore(name);
    this.#storeHouseView.showCategories(this.#storeHouseModel.getShopCategories(store));
    this.#storeHouseView.listProducts(this.#storeHouseModel.getShopProducts(store), store.name);
    this.#storeHouseView.bindShowProduct(this.handleShowProduct);
    this.#storeHouseView.bindProductsStoreCategoryList(this.handleProductsStoreCategoryList, store);
    this.#storeHouseView.bindProductsStoreCategoryTypeList(this.handleProductsType, store, "");
  }
  handleProductsStoreCategoryList = (name, title) => {
    let store = this.#storeHouseModel.getStore(name);
    let category = this.#storeHouseModel.getCategory(title);
    this.#storeHouseView.listProducts(this.#storeHouseModel.getShowCategoryProducts(store, category), store.name + " - " + category.title);
    this.#storeHouseView.bindShowProduct(this.handleShowProduct);
    this.#storeHouseView.bindProductsStoreCategoryTypeList(this.handleProductsType, store, category);
  }

  handleProductsType = (type, store, category) => {
    // En caso de pasar nombre de la tienda o de la categoria, cambiamos la variable al objeto de estos.
    if (store) {
      store = this.#storeHouseModel.getStore(store);
    }
    if (category) {
      category = this.#storeHouseModel.getCategory(category);
    }
    if (type) {
      if (store && category) {
        this.#storeHouseView.listProducts(this.#storeHouseModel.getShowCategoryProducts(store, category, type), store.name + " - " + category.title);
      } else if (store) {
        this.#storeHouseView.listProducts(this.#storeHouseModel.getShopProducts(store, type), store.name);
      } else if (category) {
        this.#storeHouseView.listProducts(this.#storeHouseModel.getCategoryProducts(category, type), category.title);
      } else {
        throw new EmptyValueException("store and category");
      }
    }
    this.#storeHouseView.bindShowProduct(this.handleShowProduct);
    this.#storeHouseView.bindProductsStoreCategoryTypeList(this.handleProductsType, store, category);
    this.#storeHouseView.showType(type);
  }

  handleShowProduct = (serialNumber) => {
    try {
      let product = this.#storeHouseModel.getProduct(Number.parseInt(serialNumber));
      this.#storeHouseView.showProduct(product);
      this.#storeHouseView.bindProductsCategoryList(this.handleProductsCategoryList);
      this.#storeHouseView.bindShowProductInNewWindow(this.handleShowProductInNewWindow);
    } catch (error) {
      this.#storeHouseView.showProduct(null, 'No existe este producto en la página.');
    }
  }

  handleShowProductInNewWindow = (serial) => {
    try {
      let product = this.#storeHouseModel.getProduct(Number.parseInt(serial));
      this.#storeHouseView.showProductInNewWindow(product);
    }
    catch (error) {
      this.#storeHouseView.showProductInNewWindow(null, 'No existe este producto en la página.');
    }
  }

  handleNewCategoryForm = () => {
    this.#storeHouseView.showNewCategoryForm();
    this.#storeHouseView.bindNewCategoryForm(this.handleCreateCategory);
  }

  handleCreateCategory = (title, desc) => {
    let cat = new Category(title);
    cat.description = desc;

    let done = false;
    let error;
    try {
      this.#storeHouseModel.addCategory(cat);
      done = true;
      this.onAddCategory();
    } catch (exception) {
      error = exception;
    }
    this.#storeHouseView.showNewCategoryModal(done, cat, error);
  }

  handleRemoveCategoryForm = () => {
    this.#storeHouseView.showRemoveCategoryForm(this.#storeHouseModel.categories);
    this.#storeHouseView.bindRemoveCategoryForm(this.handleRemoveCategory);
  }

  handleRemoveCategory = (title) => {
    let error, cat;
    let done = false;
    try {
      cat = this.#storeHouseModel.getCategory(title);
      this.#storeHouseModel.removeCategory(cat);
      done = true;
      this.onAddCategory();
    } catch (exception) {
      error = exception;
    }
    this.#storeHouseView.showRemoveCategoryModal(done, cat, error);
  }

  handleNewStoreForm = () => {
    this.#storeHouseView.showNewStoreForm();
    this.#storeHouseView.bindNewStoreForm(this.handleCreateStore);
  }

  handleCreateStore = (cif, name, address, phone, latitude, longitude) => {
    let store = new Store(cif, name);
    store.address = address;
    store.phone = phone;
    // store.coords = new Coords(latitude, longitude);
    let done = false;
    let error;
    try {
      this.#storeHouseModel.addShop(store);
      done = true;
      this.onAddStore();
    } catch (exception) {
      error = exception;
    }
    this.#storeHouseView.showNewStoreModal(done, store, error);
  }

  handleRemoveStoreForm = () => {
    this.#storeHouseView.showRemoveStoreForm(this.#storeHouseModel.stores);
    this.#storeHouseView.bindRemoveStoreForm(this.handleRemoveStore);
  }

  handleRemoveStore = (name) => {
    let error, store;
    let done = false;
    try {
      store = this.#storeHouseModel.getStore(name);
      this.#storeHouseModel.removeShop(store);
      done = true;
      this.onAddStore();
      //Se necesita volver a mostrar el formulario para mantenernos en él y no ir a las tiendas.
      this.handleRemoveStoreForm();
    } catch (exception) {
      error = exception;
    }
    this.#storeHouseView.showRemoveStoreModal(done, store, error);
  }

  handleNewProductForm = () => {
    this.#storeHouseView.showNewProductForm(this.#storeHouseModel.categories, this.#storeHouseModel.stores);
    this.#storeHouseView.bindNewProductForm(this.handleCreateProduct);
  }

  handleCreateProduct = (serialNumber, name, description, type, price, tax, images, categories, storeName) => {
    let instance = {
      Processor: Processor,
      Graphic_Card: Graphic_Card,
      RAM: RAM,
    }

    let done = false;
    let error, product, store;
    try {
      store = this.#storeHouseModel.getStore(storeName);
      product = new instance[type](serialNumber, name, "", price);
      product.description = description;
      product.tax = tax;
      product.images = images;
      this.#storeHouseModel.addProductInShop(product, store, categories);
      done = true;
    } catch (exception) {
      error = exception;
    }
    this.#storeHouseView.showNewProductModal(done, product, error);
  }

  handleRemoveProductForm = () => {
    let products = this.#storeHouseModel.getAllProducts();
    this.#storeHouseView.showRemoveProductForm(products);
    this.#storeHouseView.bindRemoveProductForm(this.handleRemoveProduct);
  }

  handleRemoveProduct = (serialNumber) => {
    let error, product;
    let done = false;
    try {
      product = this.#storeHouseModel.getProduct(serialNumber);
      this.#storeHouseModel.removeProduct(product.product);
      done = true;
    } catch (exception) {
      error = exception;
    }
    this.#storeHouseView.showRemoveProductModal(done, product, error);
  }

  handleModStockForm = () => {
    this.#storeHouseView.showModStockForm(this.#storeHouseModel.stores);
    this.#storeHouseView.bindModStockSelects(this.handleModStockSelects);
  }

  handleModStockSelects = (nameStore) => {
    let store = this.#storeHouseModel.getStore(nameStore);
    this.#storeHouseView.showModStockList(this.#storeHouseModel.getShopProducts(store));
    this.#storeHouseView.bindModStock(this.handleModStock);
  }

  handleModStock = (storeName, productSerial, stock) => {
    let done = false;
    let error;
    let store = this.#storeHouseModel.getStore(storeName);
    let product = this.#storeHouseModel.getProductStore(productSerial,store);
    try {
      if (stock > 0) {
        this.#storeHouseModel.addQuantityProductInShop(product.product, store, parseInt(stock));
      } else {
        this.#storeHouseModel.removeProductInShop(product.product, store);
      }
      done = true;
    } catch (exception) {
      error = exception;
    }
    this.#storeHouseView.showModStockModal(done, store, product, stock, error);
  }
}

export default StoreHouseController;
