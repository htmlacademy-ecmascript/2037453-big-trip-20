import ApiService from './framework/api-service';

export default class RoutePointsApiService extends ApiService {
  getOffers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  getDestinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get routePoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  async updateRoutePoint(routePoint) {
    const response = await this._load({
      url: `points/${routePoint.id}`,
      method: 'PUT',
      body: JSON.stringify(this.#adaptToServer(routePoint)),
      headers: new Headers({'Content-type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  async addRoutePoint(routePoint) {
    const response = await this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(this.#adaptToServer(routePoint)),
      headers: new Headers({'Content-type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  async deleteRoutePoint(routePoint) {
    const response = await this._load({
      url: `points/${routePoint.id}`,
      method: 'DELETE'
    });

    return await ApiService.parseResponse(response);
  }

  #adaptToServer(routePoint) {
    const adaptedRoutePoint = {
      ...routePoint,
      'base_price': routePoint.price,
      'date_from': routePoint.dateStart,
      'date_to': routePoint.dateStop,
      'is_favorite': routePoint.isFavorite
    };
    delete adaptedRoutePoint.price;
    delete adaptedRoutePoint.dateStart;
    delete adaptedRoutePoint.dateStop;
    delete adaptedRoutePoint.isFavorite;
    return adaptedRoutePoint;
  }
}
