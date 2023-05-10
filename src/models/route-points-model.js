import {CURRENT_URL} from '../helpers/const';
export default class RoutePointsModel {
  #data = null;
  get routePoints() {
    this.#data = fetch(`${CURRENT_URL}mockdata/points.json`)
      .then((resp) => resp.json())
      .catch();
    return this.#data;
  }
}
