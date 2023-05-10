import {CURRENT_URL} from '../helpers/const';
export default class DestinationsModel {
  #data = null;
  get destinations() {
    this.#data = fetch(`${CURRENT_URL}mockdata/destinations.json`)
      .then((resp) => resp.json())
      .catch();
    return this.#data;
  }
}
