const url = window.location.href;
export default class EventsDataModel {
  #routePoints = null;
  #offers = null;

  #destinations = null;

  getRoutePoints() {
    this.#routePoints = fetch(`${url}mockdata/points.json`)
      .then((resp) => resp.json())
      .catch();
    return this.#routePoints;
  }

  getOffers() {
    this.#offers = fetch(`${url}mockdata/offers.json`)
      .then((resp) => resp.json())
      .catch();
    return this.#offers;
  }

  getDestinations() {
    this.#destinations = fetch(`${url}mockdata/destinations.json`)
      .then((resp) => resp.json())
      .catch();
    return this.#destinations;
  }
}
