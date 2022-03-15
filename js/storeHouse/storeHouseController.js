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
    this.#storeHouseModel.addProduct(p1, [cat1]);
    this.#storeHouseModel.addProduct(p2, [cat2]);
    this.#storeHouseModel.addProduct(p3, [cat3]);
    this.#storeHouseModel.addProduct(p4, [cat1, cat2]);
    this.#storeHouseModel.addProduct(p5, [cat2, cat3]);
    this.#storeHouseModel.addProductInShop(p2, shop1, [cat2]);
    this.#storeHouseModel.addProductInShop(p1, shop1, [cat1]);
    this.#storeHouseModel.addProductInShop(p2, shop2, [cat2]);
    this.#storeHouseModel.addProductInShop(p3, shop3, [cat3]);
    this.#storeHouseModel.addProductInShop(p4, shop1, [cat1, cat2]);
    this.#storeHouseModel.addProductInShop(p6, shop2, [cat2, cat3]);
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
    this.#storeHouseView.showCategories(this.#storeHouseModel.categories);
    this.#storeHouseView.showStores(this.#storeHouseModel.stores);
    this.#storeHouseView.bindProductsCategoryList(this.handleProductsCategoryList);
    this.#storeHouseView.bindProductsStoreList(this.handleProductsStoreList);
    this.#storeHouseView.bindCloseProductInNewWindow();
  }

  handleInit = () => {
    this.onInit();
  }

  onLoad = () => {
    this.#loadStoreHouseObjects();
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

}

export default StoreHouseController;
