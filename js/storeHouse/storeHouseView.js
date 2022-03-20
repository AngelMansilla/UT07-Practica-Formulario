"use strict";
import StoreHouse from './storeHouseModel.js';
import { showFeedBack, defaultCheckElement, newCategoryValidation } from './validation.js';


class StoreHouseView {

  #excecuteHandler(
    handler, handlerArguments, scrollElement, data, url, event) {
    handler(...handlerArguments);
    $(scrollElement).get(0).scrollIntoView();
    history.pushState(data, null, url);
    event.preventDefault();
  }

  constructor() {
    this.main = $('main');
    this.categories = $('#categories');
    this.stores = $('#stores');
    this.productWindow = null;
    this.aWindows = [];
    this.menu = $('#menu');
  }

  //Mostrar las tiendas tanto en el menu como en el main
  showStores(_stores) {
    this.main.empty();
    if (this.stores.children().length > 1)
      this.stores.children().remove();
    let container = `<section class="stores" id="container_stores">`;
    for (let store of _stores) {
      this.stores.append(`<a data-store="${store.store.name}" class='dropdown-item' href='#product-list-store'>${store.store.name}</a>`);
      container += `<a href="#product-list-store" data-store="${store.store.name}"><article class="store"><img class="img_stores" src="img/${store.store.name}.png"></article></a>`;
    }
    container += "</section>";
    container = $(container);
    this.main.append(container);
  }

  showCategories(_categories) {
    if (this.categories.children().length > 1)
      this.categories.children().remove();
    for (let category of _categories) {
      this.categories.append(`<a data-category="${category.title}" class='dropdown-item' href='#product-list-category'>${category.title}</a>`);
    }
  }



  listProducts(products, title) {
    this.main.empty();
    let container = $(`<div id="product-list" class="container my-3"><div class="row row-cols-1 row-cols-md-3 g-4"> </div></div>`);
    for (let product of products) {
      let div = $(`
      <div class="col">
        <div class="card h-100">
          <a data-serial="${product.product.serialNumber}" href="#single-product" class="img-wrap"><img class="${product.product.constructor.name}-style card-img-top" src="img/${product.product.images}"></a>
          <div class="card-body">
            <h5 class="card-title"> <a data-serial="${product.product.serialNumber}" href="#single-product" class="title">${product.product.name}</a> </h5>
          </div>
          <div class="card-footer">
            <small class="text-muted price">${product.product.price}€</small>
          </div>
        </div>
      </div>
      `);
      container.children().first().append(div);
    }
    let header = $(`<header class="main__header"></header>`);
    header.append(`<h1>${title}</h1>`);
    header.append(`
    <select id="type">
      <option value=""></option>
      <option value="Processor">Procesadores</option>
      <option value="Graphic_Card">Tarjetas Gráficas</option>
      <option value="RAM">Memorias RAM</option>
    </select>
    `);
    this.main.append(header);
    this.main.append(container);
  }

  showProduct(product, message) {
    this.main.empty();
    let container;
    if (product) {
      container = $(`<div id="single-product" class="${product.product.constructor.name}-style container mt-5 mb-5">
				<div class="row d-flex justify-content-center">
					<div class="col-md-10">
						<div class="card">
							<div class="row">
								<div class="col-md-6">
									<div class="images p-3">
										<div class="text-center p-4"> <img id="main-image" src="img/${product.product.images}"/> </div>
									</div>
								</div>
								<div class="col-md-6">
									<div class="product p-4">
										<div class="mt-4 mb-3"> <span class="text-uppercase text-muted brand">${product.product.constructor.name}</span>
											<h5 class="text-uppercase">${product.product.name}</h5>
											<div class="price d-flex flex-row align-items-center">
												<span class="act-price">${product.product.price}€</span>
											</div>
										</div>
										<p class="about">${product.product.description}</p>
										<div class="sizes mt-5">
                      <button id="b-open" data-serial="${product.product.serialNumber}" class="btn btn-primary text-uppercase mr-2 px-4">Abrir en nueva ventana</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`);

      container.find('h6').after(this.#instance[product.constructor.name]);

    } else {
      container = $(` <div class="container mt-5 mb-5">
				<div class="row d-flex justify-content-center">
					${message}
				</div>
			</div>`);
    }
    this.main.append(container);
  }

  showProductInNewWindow(product, message) {
    let main = $(this.productWindow.document).find('main');
    let header = $(this.productWindow.document).find('header nav');
    main.empty();
    header.empty();
    let container;
    if (product) {
      this.productWindow.document.title = `${product.product.constructor.name} - ${product.product.name} `;
      header.append(`<h1 data-serial="${product.product.serialNumber}" class="display5 text-light text-center"> ${product.product.constructor.name} - ${product.product.name}</h1>`);
      container = $(`<div id = "singleproduct" class="${product.product.constructor.name}-style container mt-5 mb-5">
			<div class="row d-flex justify-content-center">
				<div class="col-md-10">
					<div class="card">
						<div class="row">
							<div class="col-md-12">
								<div class="images p-3">
									<div class="text-center p-4"> <img id="mainimage" src="img/${product.product.images}" /> </div>
								</div>
							</div>
							<div class="col-md-12">
								<div class="product p-4">
									<div class="mt-4 mb-3">
                    <span class="textuppercase text-muted name">${product.product.name}</span>
										<h5 class="text-uppercase">${product.product.constructor.name}</h5>
										<div class="price d-flex flex-row align-itemscenter">
											<span class="actprice">${product.product.price}€</span>
										</div>
										</div>
										<p class="about">${product.product.description}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
      <div class="d-flex justify-content-center">
			<button class="btn btn-primary text-uppercase m-2 px4 " onClick="window.close()">Cerrar</button>
      </div>`);
      container.find('h6').after(this.#instance[product.constructor.name]);
    } else {
      container = $(`<div class="container mt-5 mb-5"><div class="row d-flex justify-content-center">${message}</div></div>`);
    }
    main.append(container);
    this.productWindow.document.body.scrollIntoView();
  }

  //Marcamos como sleccionado el tipo que hemos filtrado
  showType(type) {
    $('#type').val(type);
  }


    showAdministracion() {
    let li = $(`
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Administración</a>
          </li>
    `);
    let container = $(`
    <ul class="dropdown-menu" id="management">
      <a id="newCategory" class="dropdown-item" href="#newcategory">Crear categoría</a>
      <a id="delCategory" class="dropdown-item" href="#delcategory">Eliminar categoría</a>
      <a id="newProduct" class="dropdown-item" href="#newproduct">Crear producto</a>
      <a id="delProduct" class="dropdown-item" href="#delproduct">Eliminar producto</a>
      <a id="newStore" class="dropdown-item" href="#newstore">Crear tienda</a>
      <a id="delStore" class="dropdown-item" href="#delstore">Eliminar tienda</a>
      <a id="modStock" class="dropdown-item" href="#modstock">Modificar stock</a>
    </ul>
    `);
    li.append(container);
    this.menu.append(li);
  }

  showNewCategoryForm() {
    this.main.empty();
    let container = $(`
    <section id="new-category" class="new-category">
      <h1>Nueva categoría</h1>
      <form name="formNewCategory" class="formNewCategory" id="formNewCategory" novalidate>
        <div>
            <label for="title">Título *</label>
            <div class="input-group">
              <input type="text" class="formcontrol" id="title" name="title" placeholder="Título de categoría" value="" required>
              <div class="invalid-feedback">El título es obligatorio.</div>
              <div class="valid-feedback">Correcto.</div>
            </div>
        </div>
        <div>
            <label for="description">Descripción </label>
            <div class="input-group">
              <input type="text" class="formcontrol" id="description" name="description" placeholder="Descripcion de categoría" value="">
              <div class="invalid-feedback"></div>
              <div class="valid-feedback">Correcto.</div>
            </div>
          <button class="btn btn-primary" type="submit">Añadir</button>
          <button class="btn btn-primary" type="reset" id="reset">Resetear</button>
      </form>
    </section>
    `);
    this.main.append(container);
  }

  showNewCategoryModal(done, cat, error){
    let form = $('#formNewCategory');
    form.find('.error').remove();
    if (done) {
      let modal = $(`<div class="modal fade" id="newCategoryModal" tabindex="-1"
				data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="newCategoryModalLabel" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="newCategoryModalLabel">Categoría creada</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							La categoría <strong>${cat.title}</strong> ha sido creada correctamente.
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
						</div>
					</div>
				</div>
			</div>`);
      $('body').append(modal);
      let newCategoryModal = $('#newCategoryModal');
      newCategoryModal.modal('show');
      newCategoryModal.find('button').click(() => {
        newCategoryModal.on('hidden.bs.modal', function (event) {
          $("#title").focus();
          this.remove();
        });
        newCategoryModal.modal('hide');
      })
    } else {
      form.prepend(`<div class="error text-danger p-3"><i class="fas fa-exclamation-triangle"></i> La categoría <strong>${cat.title}</strong> ya está creada.</div>`);
    }
  }

  showRemoveCategoryForm(categories) {
    this.main.empty();
    let container = $(`
    <div id="remove-category" class="container my-3">
			<h1 class="display-5">Eliminar una categoría categoría</h1>
			<form id="formRemoveCategory" class="formRemoveCategory">
        <label for="title">Titulo de la categoría:</label>
        <select id="selCategories">
          <option></option>
        </select>
        <input type="submit" name="Eliminar" value="Eliminar">
      <form>`);

    this.main.append(container);

    for (let category of categories) {
      $('#selCategories').append($('<option />', {
        text: category.title,
        value: category.title,
      }));
    }
  }

  showRemoveCategoryModal(done, cat, error) {
    $('remove-category').find('div.error').remove();
    if (done) {
      let modal = $(`<div class="modal fade" id="removeCategoryModal" tabindex="-1"
				data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="removeCategoryModalLabel" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="removeCategoryModalLabel">Categoría eliminada</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							La categoría <strong>${cat.title}</strong> ha sido eliminada correctamente.
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
						</div>
					</div>
				</div>
			</div>`);
      $('body').append(modal);
      let removeCategoryModal = $('#removeCategoryModal');
      removeCategoryModal.modal('show');
      removeCategoryModal.find('button').click(() => {
        removeCategoryModal.on('hidden.bs.modal', function (event) {
          this.remove();
        });
        removeCategoryModal.modal('hide');
      })
    } else {
      $('#removeCategoryModal').prepend(`<div class="error text-danger p-3"><i class="fas fa-exclamation-triangle"></i> La categoría <strong>${cat.title}</strong> no exite.</div>`);
    }
  }

  // showNewProductForm(categories) {
  //   this.main.empty();
  //   if (this.categories.children().length > 1)
  //     this.categories.children()[1].remove();

  //   let container = $(`<div id="new-product" class="container my-3">
  // 		<h1 class="display-5">Nueva producto</h1>
  // 	</div>`);
  //   let form = $(`<form name="fNewProduct" role="form" novalidate><form>`);
  //   form.append(`<div class="form-row">
  // 		<div class="col-md-12 mb-3">
  // 			<label for="ncTitle">Número de serie *</label>
  // 			<div class="input-group">
  // 				<div class="input-group-prepend">
  // 					<span class="input-group-text" id="serialPrepend"><i class="fas fa-key"></i></span>
  // 				</div>
  // 				<input type="text" class="form-control" id="npSerial" name="npSerial" placeholder="Número de serie" aria-describedby="serialPrepend" value="" required>
  // 				<div class="invalid-feedback">El número de serie es obligatorio.</div>
  // 				<div class="valid-feedback">Correcto.</div>
  // 			</div>
  // 		</div>
  // 	</div>`);
  //   form.append(`<div class="form-row">
  // 		<div class="col-md-6 mb-3">
  // 			<label for="ncTitle">Marca *</label>
  // 			<div class="input-group">
  // 				<div class="input-group-prepend">
  // 					<span class="input-group-text" id="brandPrepend"><i class="fas fa-pen-fancy"></i></span>
  // 				</div>
  // 				<input type="text" class="form-control" id="npBrand" name="npBrand" placeholder="Marca" aria-describedby="brandPrepend" value="" required>
  // 				<div class="invalid-feedback">La marca es obligatoria.</div>
  // 				<div class="valid-feedback">Correcto.</div>
  // 			</div>
  // 		</div>
  // 			<div class="col-md-6 mb-3">
  // 			<label for="ncUrl">Modelo *</label>
  // 			<div class="input-group">
  // 				<div class="input-group-prepend">
  // 					<span class="input-group-text" id="modelPrepend"><i class="fas fa-mobile-alt"></i></span>
  // 				</div>
  // 				<input type="text" class="form-control" id="npModel" name="npModel" placeholder="Modelo" aria-describedby="modelPrepend" value="" required>
  // 				<div class="invalid-feedback">El modelo es obligatorio.</div>
  // 				<div class="valid-feedback">Correcto.</div>
  // 			</div>
  // 		</div>
  // 	</div>`);
  //   form.append(`<div class="form-row mb-2">
  // 		* Tipo de producto
  // 	</div>
  // 	<div class="form-row" id="cType">
  // 		<div class="col-md-3 mb-0 input-group">
  // 			<div class="input-group-prepend">
  // 				<div class="input-group-text">
  // 				<input type="radio" name="npType" id="npCameraType" value="Camera" required>
  // 				</div>
  // 			</div>
  // 			<label class="form-control" for="npCameraType">Cámara</label>
  // 		</div>
  // 		<div class="col-md-3 mb-0 input-group">
  // 			<div class="input-group-prepend">
  // 				<div class="input-group-text">
  // 				<input type="radio" name="npType" id="npLaptopType" value="Laptop" required>
  // 				</div>
  // 			</div>
  // 			<label class="form-control" for="npLaptopType">Portátil</label>
  // 		</div>
  // 		<div class="col-md-3 mb-0 input-group">
  // 			<div class="input-group-prepend">
  // 				<div class="input-group-text">
  // 				<input type="radio" name="npType" id="npTabletType" value="Tablet" required>
  // 				</div>
  // 			</div>
  // 			<label class="form-control" for="npTabletType">Tablet</label>
  // 		</div>
  // 		<div class="col-md-3 mb-0 input-group">
  // 			<div class="input-group-prepend">
  // 				<div class="input-group-text">
  // 				<input type="radio" name="npType" id="npSmartphoneType" value="Smartphone" required>
  // 				</div>
  // 			</div>
  // 			<label class="form-control" for="npSmartphoneType">Teléfono móvil</label>
  // 		</div>
  // 		<div class="col-md-3 mb-3 mt-1 input-group">
  // 			<div class="invalid-feedback"><i class="fas fa-times"></i> El tipo de producto es obligatorio.</div>
  // 			<div class="valid-feedback"><i class="fas fa-check"></i> Correcto.</div>
  // 		</div>
  // 	</div>`);
  //   form.append(`<div class="form-row">
  // 		<div class="col-md-3 mb-3">
  // 			<label for="ncTitle">Precio *</label>
  // 			<div class="input-group">
  // 				<div class="input-group-prepend">
  // 					<span class="input-group-text" id="pricePrepend"><i class="fas fa-euro-sign"></i></span>
  // 				</div>
  // 				<input type="number" class="form-control" id="npPrice" name="npPrice" min="0" step="10" placeholder="Precio" aria-describedby="pricePrepend" value="" required>
  // 				<div class="invalid-feedback">El precio es obligatorio.</div>
  // 				<div class="valid-feedback">Correcto.</div>
  // 			</div>
  // 		</div>
  // 		<div class="col-md-3 mb-3">
  // 			<label for="npTax">Porcentaje de impuestos</label>
  // 			<div class="input-group">
  // 				<div class="input-group-prepend">
  // 					<span class="input-group-text" id="taxPrepend"><i class="fas fa-percentage"></i></span>
  // 				</div>
  // 				<input type="number" class="form-control" id="npTax" name="npTax" min="0" step="1" placeholder="21%" aria-describedby="taxPrepend" value="21" required>
  // 				<div class="invalid-feedback">Los impuestos son obligatorios.</div>
  // 				<div class="valid-feedback">Correcto.</div>
  // 			</div>
  // 		</div>
  // 		<div class="col-md-6 mb-3">
  // 			<label for="npUrl">URL *</label>
  // 			<div class="input-group">
  // 				<div class="input-group-prepend">
  // 					<span class="input-group-text" id="urlPrepend"><i class="fas fa-image"></i></span>
  // 				</div>
  // 				<input type="url" class="form-control" id="npUrl" name="npUrl" placeholder="http://www.test.es" aria-describedby="urlPrepend" value="" required>
  // 				<div class="invalid-feedback">La URL no es válida.</div>
  // 				<div class="valid-feedback">Correcto.</div>
  // 			</div>
  // 		</div>
  // 	</div>`);

  //   let select = $(`<select class="custom-select" id="npCategories" name="npCategories" aria-describedby="categoryPrepend" required multiple></select>`);
  //   for (let category of categories) {
  //     select.append(`<option value="${category.title}">${category.title}</option>`);
  //   }
  //   let selectContainer = $(`<div class="form-row">
  // 		<div class="col-md-3 mb-3">
  // 			<label for="npCategories">Categorías *</label>
  // 			<div class="input-group">
  // 				<div class="input-group mb-3" id="categoriesContainer">
  // 					<div class="input-group-prepend">
  // 						<span class="input-group-text" id="categoryPrepend"><i class="fas fa-list-alt"></i></span>
  // 					</div>
  // 				</div>
  // 			</div>
  // 		</div>
  // 		<div class="col-md-9 mb-3">
  // 			<label for="npDescription">Descripción</label>
  // 			<div class="input-group">
  // 				<div class="input-group-prepend">
  // 					<span class="input-group-text" id="descPrepend"><i class="fas fa-align-left"></i></span>
  // 				</div>
  // 				<textarea class="form-control" id="npDescription" name="npDescription" aria-describedby="descPrepend" rows="4">
  // 				</textarea>
  // 				<div class="invalid-feedback"></div>
  // 				<div class="valid-feedback">Correcto.</div>
  // 			</div>
  // 		</div>
  // 	</div>`);
  //   selectContainer.find('#categoriesContainer').first().append(select);
  //   selectContainer.find('#categoriesContainer').first().append(`<div class="invalid-feedback"><i class="fas fa-times"></i> El tipo de producto es obligatorio.</div>`);
  //   selectContainer.find('#categoriesContainer').first().append(`<div class="valid-feedback"><i class="fas fa-check"></i> Correcto.</div>`);
  //   form.append(selectContainer);
  //   form.append(`<button class="btn btn-primary m-1" type="submit">Enviar</button>`);
  //   form.append(`<button class="btn btn-primary m-1" type="reset">Cancelar</button>`);
  //   container.append(form);
  //   this.main.append(container);
  // }

  // showNewProductModal(done, product, error) {
  //   $(document.fNewProduct).find('div.error').remove();
  //   if (done) {
  //     let modal = $(`<div class="modal fade" id="newProductModal" tabindex="-1"
  // 			data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="newCategoryModalLabel" aria-hidden="true">
  // 			<div class="modal-dialog" role="document">
  // 				<div class="modal-content">
  // 					<div class="modal-header">
  // 						<h5 class="modal-title" id="newCategoryModalLabel">Producto creado</h5>
  // 						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
  // 							<span aria-hidden="true">&times;</span>
  // 						</button>
  // 					</div>
  // 					<div class="modal-body">
  // 						El producto <strong>${product.brand} - ${product.model}</strong> ha sido creada correctamente.
  // 					</div>
  // 					<div class="modal-footer">
  // 						<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
  // 					</div>
  // 				</div>
  // 			</div>
  // 		</div>`);
  //     $('body').append(modal);
  //     let newProductModal = $('#newProductModal');
  //     newProductModal.modal('show');
  //     newProductModal.find('button').click(() => {
  //       newProductModal.on('hidden.bs.modal', function (event) {
  //         document.fNewProduct.reset();
  //         document.fNewProduct.npSerial.focus();
  //         this.remove();
  //       });
  //       newProductModal.modal('hide');
  //     })
  //   } else {
  //     $(document.fNewProduct).prepend(`<div class="error text-danger p-3"><i class="fas fa-exclamation-triangle"></i> El producto <strong>${product.brand} - ${product.model}</strong> no ha podido crearse correctamente.</div>`);
  //   }
  // }


  // showRemoveProductForm(categories) {
  //   this.main.empty();
  //   if (this.categories.children().length > 1)
  //     this.categories.children()[1].remove();
  //   let container = $(`<div id="remove-product" class="container my-3">
  // 		<h1 class="display-5">Eliminar un producto</h1>
  // 			<div class="form-row">
  // 				<div class="col-md-6 mb-3">
  // 					<label for="ncTitle">Tipos de productos</label>
  // 					<div class="input-group">
  // 						<div class="input-group-prepend">
  // 							<span class="input-group-text" id="typePrepend"><i class="fas fa-list-alt"></i></span>
  // 						</div>
  // 						<select class="custom-select" id="rpType" name="rpType" aria-describedby="typePrepend">
  // 							<option disabled selected>Selecciona un tipo</option>
  // 							<option value="Camera">Cámara</option>
  // 							<option value="Laptop">Portátil</option>
  // 							<option value="Tablet">Tablet</option>
  // 							<option value="Smartphone">Teléfono móvil</option>
  // 						</select>
  // 					</div>
  // 				</div>
  // 				<div class="col-md-6 mb-3">
  // 					<label for="ncUrl">Categorías</label>
  // 					<div class="input-group">
  // 						<div class="input-group-prepend">
  // 							<span class="input-group-text" id="categoryPrepend"><i
  // 									class="fas fa-list-alt"></i></span>
  // 						</div>
  // 						<select class="custom-select" id="rpCategories" name="rpCategories" aria-describedby="categoryPrepend">
  // 							<option disabled selected>Selecciona una categoría</option>
  // 						</select>
  // 					</div>
  // 				</div>
  // 			</div>
  // 			<div id="product-list" class="container my-3"><div class="row"></div></div>
  // 	</div>`);

  //   let categoriesSelect = container.find('#rpCategories');
  //   for (let category of categories) {
  //     categoriesSelect.append(`<option value="${category.title}">${category.title}</option>`);
  //   }
  //   this.categories.append(container);

  //   this.main.append(container);
  // }



  // showRemoveProductList(products) {
  //   let listContainer = $('#product-list div.row');
  //   listContainer.empty();

  //   let exist = false;
  //   for (let product of products) {
  //     exist = true;
  //     let div = $(`<div class="col-md-4 rProduct">
  // 			<figure class="card card-product-grid card-lg"> <a data-serial="${product.serial}" href="#single-product" class="img-wrap"><img class="${product.constructor.name}-style" src="${product.url}"></a>
  // 				<figcaption class="info-wrap">
  // 					<div class="row">
  // 						<div class="col-md-8"> <a data-serial="${product.serial}" href="#single-product" class="title">${product.brand} - ${product.model}</a> </div>
  // 						<div class="col-md-4">
  // 							<div class="rating text-right"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> </div>
  // 						</div>
  // 					</div>
  // 				</figcaption>
  // 				<div class="bottom-wrap"> <a href="#" data-serial="${product.serial}" class="btn btn-primary float-right"> Eliminar </a>
  // 					<div class="price-wrap"> <span class="price h5">${product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span> <br> <small class="text-success">Free shipping</small> </div>
  // 				</div>
  // 			</figure>
  // 		</div>`);
  //     listContainer.append(div);
  //   }
  //   if (!exist) {
  //     listContainer.append($('<p class="text-danger"><i class="fas fa-exclamation-circle"></i> No existen productos para esta categoría o tipo.</p>'));
  //   }
  // }


  // showRemoveProductModal(done, product, position, error) {
  //   $('#remove-product').find('div.error').remove();
  //   if (done) {
  //     let modal = $(`<div class="modal fade" id="removeProductModal" tabindex="-1"
  // 			data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="removeProductModalLabel" aria-hidden="true">
  // 			<div class="modal-dialog" role="document">
  // 				<div class="modal-content">
  // 					<div class="modal-header">
  // 						<h5 class="modal-title" id="removeProductModalLabel">Producto eliminado</h5>
  // 						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
  // 							<span aria-hidden="true">&times;</span>
  // 						</button>
  // 					</div>
  // 					<div class="modal-body">
  // 						El producto <strong>${product.brand} - ${product.model}</strong> ha sido eliminado correctamente.
  // 					</div>
  // 					<div class="modal-footer">
  // 						<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
  // 					</div>
  // 				</div>
  // 			</div>
  // 		</div>`);
  //     $('body').append(modal);
  //     let removeCategoryModal = $('#removeProductModal');
  //     removeCategoryModal.modal('show');
  //     removeCategoryModal.find('button').click(() => {
  //       removeCategoryModal.on('hidden.bs.modal', function (event) {
  //         this.remove();
  //       });
  //       removeCategoryModal.modal('hide');
  //       position++;
  //       let divCat = $('#product-list').find(`div.rProduct:nth-child(${position})`);
  //       divCat.remove();
  //     })
  //   } else {
  //     $('#remove-product').prepend(`<div class="error text-danger p-3"><i class="fas fa-exclamation-triangle"></i> El producto no exite en el Manager.</div>`);
  //   }
  // }



  bindInit(handler) {
    $('#init').click((event) => {
      this.#excecuteHandler(handler, [], 'body', { action: 'init' }, '#', event);
    });
    $('#logo').click((event) => {
      this.#excecuteHandler(handler, [], 'body', { action: 'init' }, '#', event);
    });
  }

  bindProductsCategoryList(handler) {
    this.categories.children().click((event) => {
      let category =
        $(event.target).closest($('a')).get(0).dataset.category;
      this.#excecuteHandler(
        handler, [category],
        '#product-list',
        { 'action': 'productsCategoryList', 'category': category },
        '#category-list', event);
    });
  }

  bindProductsStoreList(handler) {
    this.stores.children().click((event) => {
      let store =
        $(event.target).closest($('a')).get(0).dataset.store;
      this.#excecuteHandler(
        handler, [store],
        '#product-list',
        { 'action': 'productsStoreList', 'store': store },
        '#store-list', event);
    });
    $('#container_stores').children().click((event) => {
      let store =
        $(event.target).closest($('a')).get(0).dataset.store;
      this.#excecuteHandler(
        handler, [store],
        '#product-list',
        { 'action': 'productsStoreList', 'store': store },
        '#store-list', event);
    });
  }

  bindProductsStoreCategoryList(handler, store) {
    this.categories.children().click((event) => {
      let category =
        $(event.target).closest($('a')).get(0).dataset.category;
      this.#excecuteHandler(
        handler, [store.name, category],
        '#product-list',
        { 'action': 'productsStoreCategoryList', 'store': store.name, 'category': category },
        '#store-category-list', event);
    });
  }

  bindProductsStoreCategoryTypeList(handler, store, category) {
    if (category) {
      category = category.title;
    }
    if (store) {
      store = store.name;
    }
    $('#type').change((event) => {
      let type =
        $(event.target).get(0).value;
      this.#excecuteHandler(
        handler, [type, store, category],
        '#product-list',
        { 'action': 'productsStoreCategoryTypeList', 'type': type, 'store': store, 'category': category },
        '#store-category-type-list', event);
    });
  }

  bindShowProduct(handler) {
    $('#product-list').find('a.img-wrap').click((event) => {
      let serial = $(event.target).closest($('a')).get(0).dataset.serial;
      this.#excecuteHandler(
        handler,
        [serial],
        '#single-product',
        { 'action': 'showProduct', 'serial': serial }, '#single-product', event);
    });
    $('#product-list').find('figcaption a').click((event) => {
      this.#excecuteHandler(
        handler,
        [event.target.dataset.serial],
        '#single-product',
        { 'action': 'showProduct', 'serial': event.target.dataset.serial }, '#single-product', event);
    });
  }

  bindShowProductInNewWindow(handler) {
    $('#b-open').click((event) => {
      if (!this.productWindow || this.productWindow.closed) {
        this.productWindow = window.open("product.html", "ProductWindow-" + event.target.dataset.serial, "width=800, height=600, top=250, left=250, titlebar=yes, toolbar=no, menubar=no, location=no", "popup");
        this.aWindows.push(this.productWindow);
        this.productWindow.addEventListener('DOMContentLoaded', () => {
          handler(event.target.dataset.serial)
        });
      } else {
        if ($(this.productWindow.document).find('header nav h1').get(0).dataset.serial !== event.target.dataset.serial) {
          this.productWindow = window.open("product.html", "ProductWindow-" + event.target.dataset.serial, "width=800, height=600, top=250, left=250, titlebar=yes, toolbar=no, menubar=no, location=no", "popup");
          this.aWindows.push(this.productWindow);
          this.productWindow.addEventListener('DOMContentLoaded', () => {
            handler(event.target.dataset.serial)
          });
        } else {
          this.productWindow.focus();
        }
      }
    });
  }

  bindCloseProductInNewWindow() {
    $('#close-windows').click((event) => {
      this.aWindows.forEach(window => {
        window.close();
      });
    })
  }

  bindAdministracionMenu(handlerNewCategory, handlerRemoveCategory) {
    $('#newCategory').click((event) => {
      this.#excecuteHandler(
        handlerNewCategory,
        [],
        '#new-category',
        { 'action': 'newCategory' }, '#', event);
    });
    $('#delCategory').click((event) => {
      this.#excecuteHandler(
        handlerRemoveCategory,
        [],
        '#remove-category',
        { action: 'removeCategory' },
        '#',
        event);
    });
  }

  bindNewCategoryForm(handler) {
    newCategoryValidation(handler);
  }

  bindRemoveCategoryForm(handler) {
    let form = $(document.getElementById('#formRemoveCategory'));
    form.submit(function (event) {
      handler(this.value);
    })
  }
  //Revisar faltan todos los hadnler validaciones...
  // bindNewProductForm(handler) {
  //   newProductValidation(handler);
  // }

  // bindRemoveProductSelects(handlerTypes, handlerCategories) {
  //   $('#rpType').change((event) => {
  //     this.#excecuteHandler(
  //       handlerTypes,
  //       [event.target.value],
  //       '#remove-product',
  //       { action: 'removeProductByType', type: event.target.value },
  //       '#remove-product', event
  //     );
  //   });
  //   $('#rpCategories').change((event) => {
  //     this.#excecuteHandler(
  //       handlerCategories,
  //       [event.target.value],
  //       '#remove-product',
  //       { action: 'removeProductByCategory', category: event.target.value },
  //       '#remove-product', event
  //     );
  //   });
  // }

  // bindRemoveProduct(handler) {
  //   $('#product-list a.btn').click(function (event) {
  //     handler(this.dataset.serial, $(this).closest('div.rProduct').index());
  //     event.preventDefault();
  //   });
  // }

  #instance = {
    Processor: this.#ProcessorCharacteristics,
    Graphics_Card: this.#Graphics_CardCharacteristics,
    RAM: this.#RAMCharacteristics,
  }
  #ProcessorCharacteristics(product) {
    return $('<div>Características de Procesador.</div>');
  }
  #Graphics_CardCharacteristics(product) {
    return $('<div>Características de tarjeta gráfica.</div>');
  }
  #RAMCharacteristics(product) {
    return $('<div>Características de memoria RAM</div>');
  }






}

export default StoreHouseView;
