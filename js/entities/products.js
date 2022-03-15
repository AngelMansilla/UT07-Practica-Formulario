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

//Constructor de Product. Permite definir propiedades comunes para todos los productos de la tienda.
class Product {
  //Campos privados
  #serialNumber; //Obligatorio
  #name; //Obligatorio
  #description;
  #price; //Obligatorio
  #tax;
  #images;
  constructor(serialNumber, name, description, price, tax = Product.IVA, images) {
    //La función se invoca con el operador new
    if (!new.target) throw new InvalidAccessConstructorException(); // Verificación operador new
    if (new.target === Product) throw new AbstractClassException("Product"); // Comprobamos clase abstracta

    //Validación de parámetros obligatorios
    if (!serialNumber) throw new EmptyValueException("serialNumber");
    if (!name) throw new EmptyValueException("name");
    price = Number.parseFloat(price);
    if (!price || price <= 0) throw new InvalidValueException("price", price);

    // Validamos que el tax sea un valor coherente.
    if (!tax || tax < 0) throw new InvalidValueException("tax", tax);

    //Definición de atributos privados del objeto
    this.#serialNumber = serialNumber;
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tax = tax;
    this.#images = images;
  }

  //Propiedades de acceso a los atributos privados
  get serialNumber() {
    return this.#serialNumber;
  }
  set serialNumber(value) {
    if (!value) throw new EmptyValueException("serial number");
    this.#serialNumber = value;
  }

  get name() {
    return this.#name;
  }
  set name(value) {
    if (!value) throw new EmptyValueException("name");
    this.#name = value;
  }

  get description() {
    return this.#description;
  }
  set description(value) {
    this.#description = value;
  }

  get price() {
    return this.#price;
  }
  set price(value) {
    value = Number.parseFloat(value);
    if (Number.isNaN(value) && value > 0) throw new InvalidValueException("price", value);
    this.#price = value;
  }

  get tax() {
    return this.#tax;
  }
  set tax(value = Product.IVA) {
    if (!value || value < 0) throw new InvalidValueException("tax", value);
    this.#tax = value;
  }

  get images() {
    return this.#images;
  }
  set images(value) {
    this.#images = value;
  }

  //Propiedades estáticas.
  static get IVA() {
    return 21;
  }

  toString() {
    return "Serial Number: " + this.serialNumber + " Name: " + this.name + " Description: " + this.description + " Price: " + this.price + "€ Tax: " + this.tax + "%";
  }
}
Object.defineProperty(Product.prototype, "serialNumber", { enumerable: true });
Object.defineProperty(Product.prototype, "name", { enumerable: true });
Object.defineProperty(Product.prototype, "description", { enumerable: true});
Object.defineProperty(Product.prototype, "price", { enumerable: true });
Object.defineProperty(Product.prototype, "tax", { enumerable: true });
Object.defineProperty(Product.prototype, "images", { enumerable: true });

//Definimos la subclase Processor
class Processor extends Product {
  //Atributos privados
  #speed;
  #socket;
  #chipset;
  #graphics;
  #type = "processor";
  constructor(serialNumber, name, description, price, tax = Product.IVA, images, speed = "0GHz", socket = "Unknow", chipset = "Unknow", graphics = "No") {
    //La función se invoca con el operador new
    if (!new.target) throw new InvalidAccessConstructorException();
    //Llamada al superconstructor.
    super(serialNumber, name, description, price, tax, images);

    //Validación de argumentos
    if (!socket) throw new EmptyValueException("socket");
    if (!chipset) throw new EmptyValueException("chipset");
    if (!/^\d*(\.\d*)?GHz$/.test(speed)) throw new InvalidValueException("speed", speed);

    //Atributos privados
    this.#speed = speed;
    this.#socket = socket;
    this.#chipset = chipset;
    this.#graphics = graphics;
  }

  //Propiedades de acceso a los atributos privados
  get type() {
    return this.#type;
  }

  get speed() {
    return this.#speed;
  }
  set speed(value) {
    if (!/^\d*(\.\d*)?GHz$/.test(value)) throw new InvalidValueException("speed", value);
    this.#speed = value;
  }

  get socket() {
    return this.#socket;
  }
  set socket(value) {
    if (!value) throw new EmptyValueException("socket");
    this.#socket = value;
  }

  get chipset() {
    return this.#chipset;
  }
  set chipset(value) {
    if (!value) throw new EmptyValueException("chipset");
    this.#chipset = value;
  }

  get graphics() {
    return this.#graphics;
  }
  set graphics(value) {
    this.#graphics = value;
  }
  //Métodos públicos
  toString() {
    return super.toString() + " Clock speed: " + this.speed + " socket: " + this.socket +
      " chipset: " + this.chipset + " graphics: " + this.graphics + "''";
  }
}
Object.defineProperty(Processor.prototype, "speed", { enumerable: true });
Object.defineProperty(Processor.prototype, "socket", { enumerable: true });
Object.defineProperty(Processor.prototype, "chipset", { enumerable: true });
Object.defineProperty(Processor.prototype, "graphics", { enumerable: true });

//Definimos la subclase Graphic_Card
class Graphic_Card extends Product {
  //Atributos privados
  #brand;
  #model;
  #memory;
  #type = "graphic_card";
  constructor(serialNumber, name, description, price, tax = Product.IVA, images, brand = "Unknown", model = "Unknown", memory = "0GB") {
    //La función se invoca con el operador new
    if (!new.target) throw new InvalidAccessConstructorException();
    //Llamada al superconstructor.
    super(serialNumber, name, description, price, tax, images);


    //Validación de argumentos
    if (!brand) throw new EmptyValueException("brand");
    if (!model) throw new EmptyValueException("model");
    if (!/^\d*GB$/.test(memory)) throw new InvalidValueException("memory", memory);

    //Atributos privados
    this.#brand = brand;
    this.#model = model;
    this.#memory = memory;
  }

  //Propiedades de acceso a los atributos privados
  get type() {
    return this.#type;
  }

  get brand() {
    return this.#brand;
  }
  set brand(value) {
    if (!value) throw new EmptyValueException("brand");
    this.#brand = value;
  }

  get model() {
    return this.#model;
  }
  set model(value) {
    if (!value) throw new EmptyValueException("model");
    this.#model = value;
  }

  get memory() {
    return this.#memory;
  }
  set memory(value) {
    if (!/^\d*GB$/.test(value)) throw new InvalidValueException("memory", value);
    this.#memory = value;
  }

  //Métodos públicos
  toString() {
    return super.toString() +
      " Brand: " + this.brand + " Model: " + this.model + " Memory: " + this.memory + "''";
  }
}
Object.defineProperty(Graphic_Card.prototype, "brand", { enumerable: true });
Object.defineProperty(Graphic_Card.prototype, "model", { enumerable: true });
Object.defineProperty(Graphic_Card.prototype, "memory", { enumerable: true });

//Definimos la subclase RAM
class RAM extends Product {
  //Atributos privados
  #technology;
  #capacity;
  #speed;
  #type = "ram";
  constructor(serialNumber, name, description, price, tax = Product.IVA, images, technology = "Unknown", capacity = "0GB", speed = "0MHz") {
    //La función se invoca con el operador new
    if (!new.target) throw new InvalidAccessConstructorException();
    //Llamada al superconstructor.
    super(serialNumber, name, description, price, tax, images);

    //Validación de argumentos
    if (!technology) throw new EmptyValueException("technology");
    if (!/^\d*GB$/.test(capacity)) throw new InvalidValueException("memory", capacity);
    if (!/^\d*MHz$/.test(speed)) throw new InvalidValueException("speed", speed);


    //Atributos privados
    this.#technology = technology;
    this.#capacity = capacity;
    this.#speed = speed;
  }

  //Propiedades de acceso a los atributos privados
  get type() {
    return this.#type;
  }
  get technology() {
    return this.#technology;
  }
  set technology(value) {
    if (!/^((\d+GB)|(\d+TB))$/.test(value)) throw new InvalidValueException("technology", value);
    this.#technology = value;
  }

  get capacity() {
    return this.#capacity;
  }
  set capacity(value) {
    if (!/^(\d+x\d+)$/.test(value)) throw new InvalidValueException("capacity", value);
    this.#capacity = value;
  }

  get speed() {
    return this.#speed;
  }
  set speed(value) {
    if (!/^((\d+GB)|(\d+TB))$/.test(value)) throw new InvalidValueException("speed", value);
    this.#speed = value;
  }

  //Métodos públicos
  toString() {
    return super.toString() + " System: " + this.system +
      " Tecnología: " + this.technology + " Velocidad: " + this.speed + " Capacidad: " + this.capacity + "''";
  }
}
Object.defineProperty(RAM.prototype, "technology", { enumerable: true });
Object.defineProperty(RAM.prototype, "speed", { enumerable: true });
Object.defineProperty(RAM.prototype, "capacity", { enumerable: true });

export { Product, Processor, Graphic_Card, RAM }

