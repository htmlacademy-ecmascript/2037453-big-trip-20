export default class OffersModel {
  #service = null;
  #data = null;

  constructor(service) {
    this.#service = service;
  }

  async init() {
    this.#data = await this.#service.getOffers();
  }

  get offers() {
    return this.#data;
  }
}
