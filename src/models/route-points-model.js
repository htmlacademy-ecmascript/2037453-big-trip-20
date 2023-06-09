import Observable from '../framework/observable';
import {UpdateType} from '../helpers/const';

export default class RoutePointsModel extends Observable {
  #routePointsApiService = null;
  #offersModel = null;
  #destinationsModel = null;
  #routePoints = [];

  constructor({service, offersModel, destinationsModel}) {
    super();
    this.#routePointsApiService = service;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  async init() {
    try {
      await this.#offersModel.init();
      await this.#destinationsModel.init();
      const routePoints = await this.#routePointsApiService.routePoints;
      this.#routePoints = Object.fromEntries(routePoints.map((routePoint) => [routePoint.id, this.#adaptToClient(routePoint)]));
    } catch(err) {
      this.#routePoints = [];
    }
    this._notify(UpdateType.INIT, null);
  }

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

  #adaptToClient(routePoint) {
    const adaptedRoutePoint = {
      ...routePoint,
      price: routePoint['base_price'],
      dateStart: routePoint['date_from'],
      dateStop: routePoint['date_to'],
      isFavorite: routePoint['is_favorite']
    };
    delete adaptedRoutePoint['base_price'];
    delete adaptedRoutePoint['date_from'];
    delete adaptedRoutePoint['date_to'];
    delete adaptedRoutePoint['is_favorite'];
    return adaptedRoutePoint;
  }
}
