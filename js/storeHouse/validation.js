"use strict";

function showFeedBack(input, valid, message) {
  let validClass = (valid) ? 'is-valid' : 'is-invalid';
  let div = (valid) ? input.nextAll("div.valid-feedback") : input.nextAll("div.invalid-feedback");
  input.nextAll('div').removeClass('d-block');
  div.removeClass('d-none').addClass('d-block');
  input.removeClass('is-valid is-invalid').addClass(validClass);
  if (message) {
    div.empty();
    div.append(message);
  }
}

function defaultCheckElement(event) {
  this.value = this.value.trim();
  if (!this.checkValidity()) {
    showFeedBack($(this), false);
  } else {
    showFeedBack($(this), true);
  }
}

function newCategoryValidation(handler) {
  let form = $('#formNewCategory');
  form.attr('novalidate', true);
  form.on('submit', function (event) {
    let isValid = true;
    let firstInvalidElement = null;
    this.description.value = this.description.value.trim();
    showFeedBack($(this.description), true);
    if (!this.title.checkValidity()) {
      isValid = false;
      showFeedBack($(this.title), false);
      firstInvalidElement = this.title;
    } else {
      showFeedBack($(this.title), true);
    }
    if (!isValid) {
      firstInvalidElement.focus();
    } else {
      handler(this.title.value, this.description.value);
    }
    event.preventDefault();
    event.stopPropagation();
  });
  $("#reset").click(function (event) {
    let feedDivs = form.find('div.valid-feedback, div.invalid-feedback');
    feedDivs.removeClass('d-block').addClass('d-none');
    let inputs = form.find('input');
    inputs.removeClass('is-valid is-invalid');
    form.find(".error").remove();
  })
  $("#title").change(defaultCheckElement);
}

function newStoreValidation(handler) {
  let form = $('#formNewStore');
  form.attr('novalidate', true);
  form.on('submit', function (event) {
    let isValid = true;
    let firstInvalidElement = null;
    // if (!this.coords.checkValidity()) {
    //   isValid = false;
    //   showFeedBack($(this.coords), false);
    //   firstInvalidElement = this.coords;
    // } else {
    //   showFeedBack($(this.coords), true);
    // }
    if (!this.phone.checkValidity()) {
      isValid = false;
      showFeedBack($(this.phone), false);
      firstInvalidElement = this.phone;
    } else {
      showFeedBack($(this.phone), true);
    }
    if (!this.address.checkValidity()) {
      isValid = false;
      showFeedBack($(this.address), false);
      firstInvalidElement = this.address;
    } else {
      showFeedBack($(this.address), true);
    }
    if (!this.name.checkValidity()) {
      isValid = false;
      showFeedBack($(this.name), false);
      firstInvalidElement = this.name;
    } else {
      showFeedBack($(this.name), true);
    }
    if (!this.CIF.checkValidity()) {
      isValid = false;
      showFeedBack($(this.CIF), false);
      firstInvalidElement = this.CIF;
    } else {
      showFeedBack($(this.CIF), true);
    }
    if (!isValid) {
      firstInvalidElement.focus();
    } else {
      handler(this.CIF.value, this.name.value, this.address.value, this.phone.value);
    }
    event.preventDefault();
    event.stopPropagation();
  });
  $("#reset").click(function (event) {
    let feedDivs = form.find('div.valid-feedback, div.invalid-feedback');
    feedDivs.removeClass('d-block').addClass('d-none');
    let inputs = form.find('input');
    inputs.removeClass('is-valid is-invalid');
    form.find(".error").remove();
  })
  $("#CIF").change(defaultCheckElement);
}

function newProductValidation(handler) {
  let form = $('#formNewProduct');
  form.attr('novalidate', true);

  form.on('submit', function (event) {
    let isValid = true;
    let firstInvalidElement = null;

    this.description.value = this.description.value.trim();
    showFeedBack($(this.description), true);
    this.images.value = this.images.value.trim();
    showFeedBack($(this.images), true);
    this.tax.value = this.tax.value.trim();
    showFeedBack($(this.tax), true);

    if (!this.fStore.checkValidity()) {
      isValid = false;
      showFeedBack($(this.fStore), false);
      firstInvalidElement = this.fStore;
    } else {
      showFeedBack($(this.fStore), true);
    }

    if (!this.fCategories.checkValidity()) {
      isValid = false;
      showFeedBack($(this.fCategories), false);
      firstInvalidElement = this.fCategories;
    } else {
      showFeedBack($(this.fCategories), true);
    }


    if (!this.price.checkValidity()) {
      isValid = false;
      showFeedBack($(this.price), false);
      firstInvalidElement = this.price;
    } else {
      showFeedBack($(this.price), true);
    }

    if (!this.type[0].checkValidity()) {
      isValid = false;
      let container = $('#cType');
      let div = container.find('div.invalid-feedback');
      container.last().find('div').removeClass('d-block');
      div.removeClass('d-none').addClass('d-block');
      $(this).find('input[type="radio"').parent().parent().next().removeClass('is-valid is-invalid').addClass('is-invalid');
      firstInvalidElement = this.type[0];
    } else {
      let container = $('#cType');
      let div = container.find('div.valid-feedback');
      container.last().find('div').removeClass('d-block');
      div.removeClass('d-none').addClass('d-block');
      $(this).find('input[type="radio"]').parent().parent().next().removeClass('is-valid is-invalid');
      $(this).find('input[type="radio"]:checked').parent().parent().next().addClass('is-valid');
    }

    if (!this.name.checkValidity()) {
      isValid = false;
      showFeedBack($(this.name), false);
      firstInvalidElement = this.name;
    } else {
      showFeedBack($(this.name), true);
    }

    if (!this.serialNumber.checkValidity()) {
      isValid = false;
      showFeedBack($(this.serialNumber), false);
      firstInvalidElement = this.serialNumber;
    } else {
      showFeedBack($(this.serialNumber), true);
    }

    if (!isValid) {
      firstInvalidElement.focus();
    } else {
      let categories = [...this.fCategories.selectedOptions].map(function (option) {
        return option.value;
      })
      handler(this.serialNumber.value, this.name.value, this.description.value,
        this.type.value, this.price.value, this.tax.value, this.images.value,
        categories, this.fStore.value);
    }
    event.preventDefault();
    event.stopPropagation();
  });

  $("#reset").click(function (event) {
    let feedDivs = form.find('div.valid-feedback, div.invalid-feedback');
    feedDivs.removeClass('d-block').addClass('d-none');
    let inputs = form.find('input, select, label');
    inputs.removeClass('is-valid is-invalid');
    form.find(".error").remove();
  });

  $("#serialNumber").change(defaultCheckElement);
  $("#name").change(defaultCheckElement);
  $("#price").change(defaultCheckElement);
  $("#fStore").change(defaultCheckElement);
}


export { showFeedBack, defaultCheckElement, newCategoryValidation, newStoreValidation, newProductValidation };
