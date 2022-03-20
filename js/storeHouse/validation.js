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

export { showFeedBack, defaultCheckElement, newCategoryValidation, newStoreValidation };
