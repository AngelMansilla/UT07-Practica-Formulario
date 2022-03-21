"use strict";
import * as StoreHouseTest from './storeHouse/storeHouseTest.js';
import StoreHouseApp from './storeHouse/storeHouseApp.js';

// StoreHouseTest.testERP();

const historyActions = {
  init: () => {
    StoreHouseApp.handleInit();
  },
  showShoppingCart: () => StoreHouseApp.handleShowShoppingCart(),
  productsCategoryList: (event) => StoreHouseApp.handleProductsCategoryList(event.state.category),
  productsStoreList: (event) => StoreHouseApp.handleProductsStoreList(event.state.store),
  productsStoreCategoryList: (event) => StoreHouseApp.handleProductsStoreCategoryList(event.state.store, event.state.category),
  productsStoreCategoryTypeList: (event) => StoreHouseApp.handleProductsType(event.state.type, event.state.store, event.state.category),
  showProduct: (event) => StoreHouseApp.handleShowProduct(event.state.serial),
  newCategory: (event) => StoreHouseApp.handleNewCategoryForm(),
  removeCategory: (event) => StoreHouseApp.handleRemoveCategoryForm(),
  newStore: (event) => StoreHouseApp.handleNewStoreForm(),
  removeStore: (event) => StoreHouseApp.handleRemoveStoreForm(),
  newProduct: (event) => StoreHouseApp.handleNewProductForm(),
  removeProduct: (event) => StoreHouseApp.handleRemoveProductForm(),
  modStock: (event) => StoreHouseApp.handleModStockForm(event.state.store)
}

window.addEventListener('popstate', function (event) {
  if (event.state) {
    historyActions[event.state.action](event);
  }
});

history.replaceState({ action: 'init' }, null);
