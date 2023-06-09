export default class DestinationsModel {
  #service = null;
  #data = null;

  constructor(service) {
    this.#service = service;
  }

  async init() {
    this.#data = await this.#service.getDestinations();
  }

  get destinations() {
    return this.#data;
  }
}
