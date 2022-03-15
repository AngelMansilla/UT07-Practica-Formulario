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

import { Coords } from './coords.js';

class StoreException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: Store Exception.", fileName, lineNumber);
    this.name = "StoreException";
  }
}

class CoordsStoreException extends StoreException {
  constructor(fileName, lineNumber) {
    super("Error: The method needs a Coords object.", fileName, lineNumber);
    this.name = "CoordsStoreException";
  }
}

class Store {
  #CIF;
  #name;
  #address;
  #phone;
  #coords;
  constructor(CIF, name, address, phone, coords) {
    if (!new.target) throw new InvalidAccessConstructorException();
    // Considero que el CIF no puede ser vacio igual que el nombre
    if (!CIF) throw new EmptyValueException("CIF");
    if (!name) throw new EmptyValueException("name");
    // Compruebo que la variable coords es un objeto Coords
    if (!(coords instanceof Coords)) throw new CoordsStoreException();
    this.#CIF = CIF;
    this.#name = name;
    this.#address = address;
    this.#phone = phone;
    this.#coords = coords;
  }

  //Propiedades de acceso a los atributos privados
  get CIF() {
    return this.#CIF;
  }
  set CIF(value) {
    // Considero que el CIF no puede ser vacio igual que el nombre
    if (!value) throw new EmptyValueException("CIF");
    this.#CIF = value;
  }

  get name() {
    return this.#name;
  }
  set name(value) {
    if (!value) throw new EmptyValueException("name");
    this.#name = value;
  }

  get address() {
    return this.#address;
  }
  set address(value) {
    this.#address = value;
  }

  get phone() {
    return this.#phone;
  }
  set phone(value) {
    this.#phone = value;
  }

  get coords() {
    return this.#coords;
  }
  set coords(value) {
    if (!(value instanceof Coords)) throw new InvalidValueException("coords", value);
    this.#coords = value;
  }
}
Object.defineProperty(Store.prototype, "CIF", { enumerable: true });
Object.defineProperty(Store.prototype, "name", { enumerable: true });
Object.defineProperty(Store.prototype, "address", { enumerable: true });
Object.defineProperty(Store.prototype, "phone", { enumerable: true });
Object.defineProperty(Store.prototype, "coords", { enumerable: true });

export { StoreException, CoordsStoreException };
export { Store };
export { Coords } from './coords.js';
