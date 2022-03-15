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


class Category {
  #title;
  #description;
  constructor(title = "Default", description = "") {
    if (!new.target) throw new InvalidAccessConstructorException();
    if (!title) throw new EmptyValueException("title");
    this.#title = title;
    this.#description = description;
  }

  //Propiedades de acceso a los atributos privados
  get title() {
    return this.#title;
  }
  set title(value = "Default") {
    if (!value) throw new EmptyValueException("title");
    this.#title = value;
  }

  get description() {
    return this.#description;
  }
  set description(value = "") {
    this.#description = value;
  }
}
Object.defineProperty(Category.prototype, "title", { enumerable: true });
Object.defineProperty(Category.prototype, "description", { enumerable: true });

export {Category};
