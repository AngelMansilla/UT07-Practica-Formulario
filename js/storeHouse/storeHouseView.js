"use strict";
import StoreHouse from './storeHouseModel.js';
import { showFeedBack, defaultCheckElement, newCategoryValidation, newStoreValidation, newProductValidation } from './validation.js';


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
    if (this.stores.children().length > 0)
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
    if (this.categories.children().length > 0)
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
      <a id="newCategory" class="dropdown-item" href="#newCategory">Crear categoría</a>
      <a id="delCategory" class="dropdown-item" href="#removeCategory">Eliminar categoría</a>
      <a id="newStore" class="dropdown-item" href="#newStore">Crear tienda</a>
      <a id="delStore" class="dropdown-item" href="#removeStore">Eliminar tienda</a>
      <a id="newProduct" class="dropdown-item" href="#newProduct">Crear producto</a>
      <a id="delProduct" class="dropdown-item" href="#removeProduct">Eliminar producto</a>
      <a id="modStock" class="dropdown-item" href="#modStock">Modificar stock</a>
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
            <input type="text" id="title" name="title" placeholder="Título de categoría" value="" required>
            <div class="invalid-feedback">El título es obligatorio.</div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>
        <div>
          <label for="description">Descripción </label>
          <div class="input-group">
            <input type="text" id="description" name="description" placeholder="Descripcion de categoría" value="">
            <div class="invalid-feedback"></div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>
        <button class="btn btn-primary" type="submit">Añadir</button>
        <button class="btn btn-primary" type="reset" id="reset">Resetear</button>
      </form>
    </section>
    `);
    this.main.append(container);
  }

  showNewCategoryModal(done, cat, error) {
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
			<h1 class="display-5">Eliminar una categoría</h1>
			<form id="formRemoveCategory" class="formRemoveCategory">
        <label for="title">Titulo de la categoría:</label>
        <select id="selCategories">
          <option></option>
        </select>
        <button class="btn btn-primary" type="submit">Eliminar</button>
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
    $('#remove-category').find('.error').remove();
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
      //Borrar de opciones la categoria borrada
      $("option[value='" + cat.title + "']").remove();
    } else {
      $('#remove-category').prepend(`<div class="error text-danger p-3"><i class="fas fa-exclamation-triangle"></i>Debes seleccionar una categoría</div>`);
    }
  }

  showNewStoreForm() {
    this.main.empty();
    let container = $(`
    <section id="new-store" class="new-store">
      <h1>Nueva tienda</h1>
      <form name="formNewStore" class="formNewStore" id="formNewStore" novalidate>
        <div class="row">
          <div class="col">
              <label for="CIF">CIF *</label>
              <div class="input-group">
                <input type="text" id="CIF" name="CIF" placeholder="CIF de la tienda" value="" required>
                <div class="invalid-feedback">El CIF es obligatorio.</div>
                <div class="valid-feedback">Correcto.</div>
              </div>
          </div>
          <div class="col">
              <label for="name">Nombre *</label>
              <div class="input-group">
                <input type="text"  id="name" name="name" placeholder="Nombre de la tienda" value="" required>
                <div class="invalid-feedback">El Nombre es obligatorio.</div>
                <div class="valid-feedback">Correcto.</div>
              </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label for="address">Dirección: </label>
            <div class="input-group">
              <input type="text" id="address" name="address" placeholder="Dirección de la tienda" value="">
              <div class="invalid-feedback">La dirección no es válida</div>
              <div class="valid-feedback">Correcto.</div>
            </div>
          </div>
          <div class="col">
            <label for="phone">Telefono </label>
            <div class="input-group">
              <input type="text" id="phone" name="phone" placeholder="Telefono de la tienda" value="">
              <div class="invalid-feedback">Teléfono incorrecto</div>
              <div class="valid-feedback">Correcto.</div>
            </div>
          </div>
        </div>
        <div>
          <label for="coords">Coordenadas </label>
          <div class="input-group coords">
            <label for="coords">Latitud </label>
            <input type="text"  id="latitud" name="latitud" placeholder="Latitud de la tienda" value="">
            <label for="coords">Longitud </label>
            <input type="text"  id="longitud" name="longitud" placeholder="Longitud de la tienda" value="">
            <div class="invalid-feedback">Coordenadas incorrectas</div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>
        <button class="btn btn-primary justify-content: center;" type="submit">Añadir</button>
        <button class="btn btn-primary row-auto" type="reset" id="reset">Resetear</button>
      </form>
    </section>
    `);
    this.main.append(container);
  }

  showNewStoreModal(done, store, error) {
    let form = $('#formNewStore');
    form.find('.error').remove();
    if (done) {
      let modal = $(`<div class="modal fade" id="newStoreModal" tabindex="-1"
				data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="newStoreModalLabel" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="newStoreModalLabel">Tienda creada</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							La tienda <strong>${store.name}</strong> ha sido creada correctamente.
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
						</div>
					</div>
				</div>
			</div>`);
      $('body').append(modal);
      let newStoreModal = $('#newStoreModal');
      newStoreModal.modal('show');
      newStoreModal.find('button').click(() => {
        newStoreModal.on('hidden.bs.modal', function (event) {
          $("#CIF").focus();
          this.remove();
        });
        newStoreModal.modal('hide');
      })
    } else {
      form.prepend(`<div class="error text-danger p-3"><i class="fas fa-exclamation-triangle"></i> La tienda con CIF: <strong>${store.cif}</strong> ya está creada.</div>`);
    }
  }

  showRemoveStoreForm(stores) {
    this.main.empty();
    let container = $(`
    <div id="remove-store" class="container my-3">
			<h1 class="display-5">Eliminar una tienda</h1>
			<form id="formRemoveStore" class="formRemoveStore">
        <label for="title">Nombre de la tienda:</label>
        <select id="selStores">
          <option></option>
        </select>
        <button class="btn btn-primary" type="submit">Eliminar</button>
      <form>`);
    this.main.append(container);

    for (let store of stores) {
      //Segun el planteamiento dado a esta web donde HouseStore es el alamacen por defecto no se podra eliminar
      store = store.store;
      if (store.name != "HouseStore") {
        $('#selStores').append($('<option />', {
          text: store.name,
          value: store.name,
        }));
      }
    }
  }

  showRemoveStoreModal(done, store, error) {
    $('#remove-store').find('.error').remove();
    if (done) {
      let modal = $(`<div class="modal fade" id="removeStoreModal" tabindex="-1"
				data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="removeStoreModalLabel" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="removeStoreModalLabel">Tienda eliminada</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							La tienda <strong>${store.name}</strong> ha sido eliminada correctamente.
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
						</div>
					</div>
				</div>
			</div>`);
      $('body').append(modal);
      let removeStoreModal = $('#removeStoreModal');
      removeStoreModal.modal('show');
      removeStoreModal.find('button').click(() => {
        removeStoreModal.on('hidden.bs.modal', function (event) {
          this.remove();
        });
        removeStoreModal.modal('hide');
      })
      //Borrar de opciones la categoria borrada
      $("option[value='" + store.name + "']").remove();
    } else {
      $('#remove-store').prepend(`<div class="error text-danger p-3"><i class="fas fa-exclamation-triangle"></i>Debes seleccionar una tienda</div>`);
    }
  }

  showNewProductForm(categories, stores) {
    this.main.empty();

    let container = $(`<div id="new-product" class="container my-3">
  		<h1 class="display-5">Nuevo producto</h1>
  	</div>`);
    let form = $(`<form name="formNewProduct" id="formNewProduct" novalidate><form>`);
    form.append(`<div class="form-row">
  		<div class="col-md-12 mb-3">
  			<label for="serialNumber">Número de serie *</label>
  			<div class="input-group">
  				<input type="text" class="form-control" id="serialNumber" name="serialNumber" placeholder="Número de serie" aria-describedby="serialNumber" value="" required>
  				<div class="invalid-feedback">El número de serie es obligatorio.</div>
  				<div class="valid-feedback">Correcto.</div>
  			</div>
  		</div>
  	</div>`);
    form.append(`
    <div class="form-row">
  		<div class="col-md-6 mb-3">
  			<label for="name">Nombre *</label>
  			<div class="input-group">
  				<input type="text" class="form-control" id="name" name="name" placeholder="Nombre" aria-describedby="name" value="" required>
  				<div class="invalid-feedback">El nombre es obligatorio.</div>
  				<div class="valid-feedback">Correcto.</div>
  			</div>
  		</div>
  		<div class="col-md-6 mb-3">
  			<label for="description">Descripcion</label>
  			<div class="input-group">
  				<input type="text" class="form-control" id="description" name="description" placeholder="Descripción" aria-describedby="description" value="">
  				<div class="invalid-feedback">Descipción incorrecta</div>
  				<div class="valid-feedback">Correcto.</div>
  			</div>
  		</div>
  	</div>`);
    form.append(`<div class="form-row mb-2">
			* Tipo de producto
		</div>
		<div class="form-row" id="cType">
			<div class="col-md-3 mb-0 input-group">
				<div class="input-group-prepend">
					<div class="input-group-text">
					<input type="radio" name="type" id="processorType" value="Processor" required>
					</div>
				</div>
				<label class="form-control" for="processorType">Procesador</label>
			</div>
			<div class="col-md-3 mb-0 input-group">
				<div class="input-group-prepend">
					<div class="input-group-text">
					<input type="radio" name="type" id="graphic_CardType" value="Graphic_Card" required>
					</div>
				</div>
				<label class="form-control" for="graphic_CardType">Tarjeta Gráfica</label>
			</div>
			<div class="col-md-3 mb-0 input-group">
				<div class="input-group-prepend">
					<div class="input-group-text">
					<input type="radio" name="type" id="ramType" value="RAM" required>
					</div>
				</div>
				<label class="form-control" for="ramType">Memoria RAM</label>
			</div>
			<div class="col-md-3 mb-3 mt-1 input-group">
				<div class="invalid-feedback"><i class="fas fa-times"></i> El tipo de producto es obligatorio.</div>
				<div class="valid-feedback"><i class="fas fa-check"></i> Correcto.</div>
			</div>
		</div>`);
    form.append(`<div class="form-row">
  		<div class="col-md-3 mb-3">
  			<label for="price">Precio *</label>
  			<div class="input-group">
  				<input type="number" class="form-control" id="price" name="price" min="0" step='0.01' placeholder="Precio" aria-describedby="price" value="" required>
  				<div class="invalid-feedback">El precio es obligatorio.</div>
  				<div class="valid-feedback">Correcto.</div>
  			</div>
  		</div>
  		<div class="col-md-3 mb-3">
  			<label for="tax">Porcentaje de impuestos</label>
  			<div class="input-group">
  				<input type="number" class="form-control" id="tax" name="tax" min="0" step="1" placeholder="21%" aria-describedby="tax" value="21">
  				<div class="invalid-feedback">Los impuestos introducidos son invalidos</div>
  				<div class="valid-feedback">Correcto.</div>
  			</div>
  		</div>
  		<div class="col-md-6 mb-3">
  			<label for="images">Nombre Imagen</label>
  			<div class="input-group">
  				<input type="text" class="form-control" id="images" name="images" placeholder="i510400F.png" aria-describedby="images" value="">
  				<div class="invalid-feedback">La imagen no es válida.</div>
  				<div class="valid-feedback">Correcto.</div>
  			</div>
  		</div>
  	</div>`);

    let selectCat = $(`<select class="custom-select" id="fCategories" name="fCategories" aria-describedby="fCategories" multiple></select>`);
    for (let category of categories) {
      selectCat.append(`<option value="${category.title}">${category.title}</option>`);
    }
    let selectStores = $(`<select class="select" id="fStore" name="fStore" aria-describedby="fStore" requiered></select>`);
    for (let store of stores) {
      store = store.store;
      selectStores.append(`<option value="${store.name}">${store.name}</option>`);
    }
    let selectContainer = $(`<div class="form-row">
  		<div class="col-md-3 mb-3">
  			<label for="fCategories">Categorías</label>
  			<div class="input-group">
  				<div class="input-group mb-3" id="categoriesContainer">
  				</div>
  			</div>
  		</div>
  		<div class="col-md-3 mb-3">
  			<label for="fStore">Tiendas*</label>
  			<div class="input-group">
  				<div class="input-group mb-3" id="storesContainer">
  				</div>
  			</div>
  		</div>
  	</div>`);
    selectContainer.find('#categoriesContainer').first().append(selectCat);
    selectContainer.find('#categoriesContainer').first().append(`<div class="invalid-feedback"><i class="fas fa-times"></i> Categorias invalidas.</div>`);
    selectContainer.find('#categoriesContainer').first().append(`<div class="valid-feedback"><i class="fas fa-check"></i> Correcto.</div>`);
    selectContainer.find('#storesContainer').first().append(selectStores);
    selectContainer.find('#storesContainer').first().append(`<div class="invalid-feedback"><i class="fas fa-times"></i> La tienda del producto es obligatorio.</div>`);
    selectContainer.find('#storesContainer').first().append(`<div class="valid-feedback"><i class="fas fa-check"></i> Correcto.</div>`);
    form.append(selectContainer);
    form.append(`<button class="btn btn-primary m-1" type="submit">Enviar</button>`);
    form.append(`<button class="btn btn-primary m-1" type="reset" id="reset">Resetear</button>`);
    container.append(form);
    this.main.append(container);
  }

  showNewProductModal(done, product, error) {
    let form = $('#formNewProduct');
    form.find('.error').remove();
    if (done) {
      let modal = $(`<div class="modal fade" id="newProductModal" tabindex="-1"
  			data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="newProductModalLabel" aria-hidden="true">
  			<div class="modal-dialog" role="document">
  				<div class="modal-content">
  					<div class="modal-header">
  						<h5 class="modal-title" id="newProductModalLabel">Producto creado</h5>
  						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
  							<span aria-hidden="true">&times;</span>
  						</button>
  					</div>
  					<div class="modal-body">
  						El producto <strong>${product.name}</strong> ha sido creado correctamente.
  					</div>
  					<div class="modal-footer">
  						<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
  					</div>
  				</div>
  			</div>
  		</div>`);
      $('body').append(modal);
      let newProductModal = $('#newProductModal');
      newProductModal.modal('show');
      newProductModal.find('button').click(() => {
        newProductModal.on('hidden.bs.modal', function (event) {
          form.serial.focus();
          this.remove();
        });
        newProductModal.modal('hide');
      })
    } else {
      form.prepend(`<div class="error text-danger p-3"><i class="fas fa-exclamation-triangle"></i> El producto <strong>${product.name} </strong> no ha podido crearse correctamente.</div>`);
    }
  }

  showRemoveProductForm(products) {
    this.main.empty();
    let container = $(`
    <div id="remove-product" class="container my-3">
			<h1 class="display-5">Eliminar un producto</h1>
			<form id="formRemoveProduct" class="formRemoveProduct">
        <label for="selProducts">Nombre del producto:</label>
        <select id="selProducts">
          <option></option>
        </select>
        <button class="btn btn-primary" type="submit">Eliminar</button>
      <form>`);
    this.main.append(container);

    for (let product of products) {
      product = product.product;
      $('#selProducts').append($('<option />', {
        text: product.name,
        value: product.serialNumber,
      }));
    }
  }

  showRemoveProductModal(done, product, error) {
    $('#remove-product').find('.error').remove();
    if (done) {
      let modal = $(`<div class="modal fade" id="removeProductModal" tabindex="-1"
				data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="removeProductModalLabel" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="removeProductModalLabel">Producto eliminada</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							El producto <strong>${product.product.name}</strong> ha sido eliminada correctamente.
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
						</div>
					</div>
				</div>
			</div>`);
      $('body').append(modal);
      let removeProductModal = $('#removeProductModal');
      removeProductModal.modal('show');
      removeProductModal.find('button').click(() => {
        removeProductModal.on('hidden.bs.modal', function (event) {
          this.remove();
        });
        removeProductModal.modal('hide');
      })
      //Borrar de opciones del producto borrado
      $("option[value='" + product.product.serialNumber + "']").remove();
    } else {
      $('#remove-product').prepend(`<div class="error text-danger p-3"><i class="fas fa-exclamation-triangle"></i>Debes seleccionar un producto</div>`);
    }
  }

  showModStockForm(stores) {
    this.main.empty();
    let container = $(`
    <div id="mod-stock" class="container my-3">
			<h1 class="display-5">Modificar stock de un producto</h1>
			<form id="formModStock" class="formModStock">
				<div class="form-row">
					<div class="col-md-6 mb-3">
						<label for="msStore">Tiendas</label>
						<div class="input-group">
							<select class="select" id="msStore" name="msStore" aria-describedby="msStore">
								<option disabled selected>Selecciona una tienda</option>
							</select>
						</div>
					</div>
				</div>
				<div id="product-list" class="container my-3"><div class="row"></div></div>
      </form>
		</div>`);

    let storesSelect = container.find('#msStore');
    for (let store of stores) {
      storesSelect.append(`<option value="${store.store.name}">${store.store.name}</option>`);
    }
    this.main.append(container);
  }


  showModStockList(products) {
    let listContainer = $('#product-list div.row');
    let modificar = $('button');
    modificar.remove();
    let form = $('#formModStock');
    listContainer.empty();
    let container = $(`
    <div id="mod-stock" class="container my-3">
			<div class="form-row">
				<div class="col-md-6 mb-3">
					<label for="product">Productos</label>
					<div class="input-group">
						<select class="select" id="product" name="product" aria-describedby="product" required>
							<option value="" disabled selected>Selecciona un producto</option>
						</select>
					</div>
				</div>
        <div class="col-md-3 mb-3">
  			  <label for="stock">Stock del producto</label>
  			  <div class="input-group">
  				  <input type="number" class="form-control" id="stock" name="stock" min="0" step="1" aria-describedby="stock" value="1" required>
  				  <div class="invalid-feedback">Debes introducir una cantidad de stock</div>
  				  <div class="valid-feedback">Correcto.</div>
  		    </div>
        </div>
			</div>
		</div>`);
    let exist = false;
    let productSelect = container.find('#product');
    for (let product of products) {
      exist = true;
      productSelect.append(`<option value="${product.product.serialNumber}">${product.product.name}</option>`);
    }
    if (!exist) {
      listContainer.append($('<p class="text-danger"><i class="fas fa-exclamation-circle"></i> No existen productos para esta tienda.</p>'));
    } else {
      listContainer.append(container);
      form.append('<button class="btn btn-primary" type="submit" id="modificar">Modificar</button>');
    }
  }

  showModStockModal(done, store, product, stock, error) {
    $('#mod-stock').find('.error').remove();
    if (done) {
      let modal = $(`
      <div class="modal fade" id="modStockModal" tabindex="-1"
				data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="modStockModalLabel" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="modStockModalLabel">Stock Modificado</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							El stock del producto <strong>`+product.product.name+` de la tienda `+store.name+`</strong> ha sido modificado correctamente a <strong>`+stock+`</strong>.
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
						</div>
					</div>
				</div>
			</div>`);
      $('body').append(modal);
      let modStockModal = $('#modStockModal');
      modStockModal.modal('show');
      modStockModal.find('button').click(() => {
        modStockModal.on('hidden.bs.modal', function (event) {
          this.remove();
        });
        modStockModal.modal('hide');
        //Borrar de opciones del producto
        if(stock==='0'){
          $("option[value='" + product.product.serialNumber + "']").remove();
        }
      })
    } else {
      $('#mod-stock').prepend(`<div class="error text-danger p-3"><i class="fas fa-exclamation-triangle"></i>No se pudo modificar el stock.</div>`);
    }
  }

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

  bindAdministracionMenu(handlerNewCategory, handlerRemoveCategory, handlerNewStore, handlerRemoveStore, handlerNewProduct, handlerRemoveProduct, handlerModStock) {
    $('#newCategory').click((event) => {
      this.#excecuteHandler(
        handlerNewCategory,
        [],
        '#new-category',
        { action: 'newCategory' },
        '#new-category',
        event);
    });
    $('#delCategory').click((event) => {
      this.#excecuteHandler(
        handlerRemoveCategory,
        [],
        '#remove-category',
        { action: 'removeCategory' },
        '#remove-category',
        event);
    });
    $('#newStore').click((event) => {
      this.#excecuteHandler(
        handlerNewStore,
        [],
        '#new-store',
        { action: 'newStore' },
        '#new-store',
        event);
    });
    $('#delStore').click((event) => {
      this.#excecuteHandler(
        handlerRemoveStore,
        [],
        '#remove-store',
        { action: 'removeStore' },
        '#remove-store',
        event);
    });
    $('#newProduct').click((event) => {
      this.#excecuteHandler(
        handlerNewProduct,
        [],
        '#new-product',
        { action: 'newProduct' },
        '#new-product',
        event);
    });
    $('#delProduct').click((event) => {
      this.#excecuteHandler(
        handlerRemoveProduct,
        [],
        '#remove-product',
        { action: 'removeProduct' },
        '#remove-product',
        event);
    });
    $('#modStock').click((event) => {
      this.#excecuteHandler(
        handlerModStock,
        [],
        '#mod-stock',
        { action: 'modStock' },
        '#mod-stock',
        event);
    });
  }

  bindNewCategoryForm(handler) {
    newCategoryValidation(handler);
  }

  bindRemoveCategoryForm(handler) {
    let form = $('#formRemoveCategory');
    form.on('submit', function (event) {
      //Pasamos el valor de la categoria selecionada el cual es el titulo
      handler($("#selCategories").val());
    })
  }

  bindNewStoreForm(handler) {
    newStoreValidation(handler);
  }

  bindRemoveStoreForm(handler) {
    let form = $('#formRemoveStore');
    form.on('submit', function (event) {
      //Pasamos el valor de la tienda selecionada el cual es el nombre
      handler($("#selStores").val());
    })
  }

  bindNewProductForm(handler) {
    newProductValidation(handler);
  }

  bindRemoveProductForm(handler) {
    let form = $('#formRemoveProduct');
    form.on('submit', function (event) {
      //Pasamos el valor de la tienda selecionada el cual es el nombre
      handler($("#selProducts").val());
    })
  }

  bindModStockSelects(handler) {
    $('#msStore').change((event) => {
      this.#excecuteHandler(
        handler,
        [event.target.value],
        '#mod-stock',
        { action: 'modStock', store: event.target.value },
        '#mod-stock', event
      );
    });
  }

  bindModStock(handler) {
    $('#modificar').click(function (event) {
      handler($('#msStore').val(), $('#product').val(), $('#stock').val());
      event.preventDefault();
    });
  }

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
