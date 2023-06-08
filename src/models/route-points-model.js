import Observable from '../framework/observable';

export default class RoutePointsModel extends Observable {
  // @todo Загружать данные с сервера
  #routePoints = Object.fromEntries([
    {
      'id': 10,
      'dateStart': '2023-07-29T00:22:00.000Z',
      'dateStop': '2023-07-30T18:54:00.000Z',
      'type': 'Restaurant',
      'offers': [
        1
      ],
      'price': 543,
      'destination': 6,
      'isFavorite': false
    },
    {
      'id': 9,
      'dateStart': '2023-05-24T20:20:00.000Z',
      'dateStop': '2023-05-26T02:10:00.000Z',
      'type': 'Drive',
      'offers': [
        1
      ],
      'price': 34,
      'destination': 8,
      'isFavorite': true
    },
    {
      'id': 8,
      'dateStart': '2023-06-01T21:41:00.000Z',
      'dateStop': '2023-06-15T00:07:00.000Z',
      'type': 'Drive',
      'offers': [
        1
      ],
      'price': 1654,
      'destination': 2,
      'isFavorite': false
    },
    {
      'id': 7,
      'dateStart': '2023-05-21T19:53:00.000Z',
      'dateStop': '2023-05-22T03:42:00.000Z',
      'type': 'Taxi',
      'offers': [
        1
      ],
      'price': 4976,
      'destination': 2,
      'isFavorite': true
    },
    {
      'id': 5,
      'dateStart': '2023-05-11T16:40:00.000Z',
      'dateStop': '2023-05-14T15:29:00.000Z',
      'type': 'Check-In',
      'offers': [
        1
      ],
      'price': 12,
      'destination': 4,
      'isFavorite': false
    },
    {
      'id': 4,
      'dateStart': '2023-05-09T22:37:00.000Z',
      'dateStop': '2023-05-11T10:34:00.000Z',
      'type': 'Restaurant',
      'offers': [
        1
      ],
      'price': 634,
      'destination': 10,
      'isFavorite': false
    },
    {
      'id': 3,
      'dateStart': '2023-05-07T16:08:00.000Z',
      'dateStop': '2023-05-09T05:37:00.000Z',
      'type': 'Sightseeing',
      'offers': [
        1
      ],
      'price': 234,
      'destination': 5,
      'isFavorite': true
    },
    {
      'id': 2,
      'dateStart': '2023-05-05T00:45:00.000Z',
      'dateStop': '2023-05-05T19:39:00.000Z',
      'type': 'Check-In',
      'offers': [
        1
      ],
      'price': 7689,
      'destination': 7,
      'isFavorite': true
    },
    {
      'id': 1,
      'dateStart': '2023-04-30T09:41:00.000Z',
      'dateStop': '2023-05-02T15:39:00.000Z',
      'type': 'Sightseeing',
      'offers': [
        1
      ],
      'price': 235,
      'destination': 5,
      'isFavorite': false
    },
    {
      'id': 6,
      'dateStart': '2023-05-17T11:44:00.000Z',
      'dateStop': '2023-05-19T01:58:00.000Z',
      'type': 'Flight',
      'offers': [
        1,
        2
      ],
      'price': 54,
      'destination': 5,
      'isFavorite': true
    }
  ].map((routePoint) => [routePoint.id, routePoint]));

  get routePoints() {
    return Object.values(this.#routePoints);
  }

  updateRoutePoint(updateType, update) {
    const id = update?.id;
    if (!this.#routePoints?.[id]) {
      throw new Error('Can\'t update unexisting route point');
    }
    this.#routePoints[id] = update;
    this._notify(updateType, update);
  }

  addRoutePoint(updateType, update) {
    const id = update?.id;
    if (this.#routePoints?.[id]) {
      throw new Error('Can\'t add existing route point');
    }
    this.#routePoints[id] = update;
    this._notify(updateType, update);
  }

  deleteRoutePoint(updateType, id) {
    if (!this.#routePoints?.[id]) {
      throw new Error('Can\'t delete unexisting route point');
    }
    delete this.#routePoints[id];
    this._notify(updateType, null);
  }
}
