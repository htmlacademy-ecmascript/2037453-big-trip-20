export default class EventsDataModel {
  #routePoints = null;
  #offers = null;

  #destinations = null;

  getRoutePoints() {
    this.#routePoints = fetch('/mockdata/points.json')
      .then((resp) => resp.json())
      .catch();
    return this.#routePoints;
  }

  getOffers() {
    this.#offers = fetch('/mockdata/offers.json')
      .then((resp) => resp.json())
      .catch();
    return this.#offers;
  }

  getDestinations() {
    this.#destinations = fetch('/mockdata/destinations.json')
      .then((resp) => resp.json())
      .catch();
    return this.#destinations;
  }
}
