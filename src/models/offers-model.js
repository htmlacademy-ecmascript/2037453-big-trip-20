import {CURRENT_URL} from '../helpers/const';

export default class OffersModel {
  #data = null;

  get offers() {
    this.#data = fetch(`${CURRENT_URL}mockdata/offers.json`)
      .then((resp) => resp.json())
      .catch();
    return this.#data;
  }
}
