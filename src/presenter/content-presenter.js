import {render} from '../framework/render';
import FilterView from '../view/filters-view';
import SortView from '../view/sort-view';
import RoutePointsListView from '../view/route-points-list-view';
import RoutePointsModel from '../models/route-points-model';
import OffersModel from '../models/offers-model';
import DestinationsModel from '../models/destinations-model';
import StubView from '../view/stub-view';
import RoutePointPresenter from '../presenter/route-point-presenter';
import {SORTS} from '../helpers/const';
import {getFirstType} from '../helpers/utils';
import {logPlugin} from '@babel/preset-env/lib/debug';

export default class ContentPresenter {
  #activeFilter = null;
  #activeSortType = null;
  #routePointsModel = new RoutePointsModel();
  #offersModel = new OffersModel();
  #destinationsModel = new DestinationsModel();
  #filterComponent = null;
  #stubComponent = null;
  #sortComponent = null;
  #routeListComponent = new RoutePointsListView();
  #filterContainer = null;
  #contentContainer = null;
  #routePointsData = null;
  #offersData = null;
  #destinationsData = null;
  #routePointersList = new Map();
  #selectedRoutePointId = null;

  constructor({filterContainer, contentContainer}) {
    this.#filterContainer = filterContainer;
    this.#contentContainer = contentContainer;
    this.#activeFilter = 'Everything';
    this.#stubComponent = new StubView(this.#activeFilter);
  }

  async init() {
    this.#routePointsData = await this.#routePointsModel.routePoints;
    this.#offersData = await this.#offersModel.offers;
    this.#destinationsData = await this.#destinationsModel.destinations;
    this.#renderContent();
  }

  #renderContent() {
    this.#filterComponent = new FilterView(this.#routePointsData);
    render(this.#filterComponent, this.#filterContainer);
    if (this.#routePointsData.length <= 0) {
      render(this.#stubComponent, this.#contentContainer);
    } else {
      this.#sortComponent = new SortView(this.#handleSortChange);
      render(this.#sortComponent, this.#contentContainer);
      render(this.#routeListComponent, this.#contentContainer);

      this.#renderRoutePoint({
        id: null,
        dateStart: new Date().toISOString(),
        dateStop: new Date().toISOString(),
        type: getFirstType(this.#offersData),
        destination: null,
        offers: [],
        price: 0
      });
      this.#renderRoutePoints(this.#routePointsData);
    }
  }

  #renderRoutePoints(routePointData) {
    routePointData.forEach((routePoint) => this.#renderRoutePoint(routePoint));
  }

  #renderRoutePoint(routePoint) {
    const routePointPresenter = new RoutePointPresenter({
      routeListContainer: this.#routeListComponent.element,
      onDataChange: this.#handleRoutePointChange,
      onRoutePointSelect: this.#handleRoutePointSelect
    });
    routePointPresenter.init(routePoint, this.#offersData, this.#destinationsData);
    this.#routePointersList.set(routePoint.id, routePointPresenter);
    console.log(this.#routePointersList);
  }

  #removeEscPressEvent() {
    if (this.#selectedRoutePointId === null) {
      return;
    }
    this.#routePointersList.get(this.#selectedRoutePointId).reset();
  }

  #clearRoutePoints() {
    this.#removeEscPressEvent();
    this.#routeListComponent.element.innerHTML = '';
  }

  #handleRoutePointChange = (updateRoutePoint) => {
    if (updateRoutePoint.id === null) {
      // @todo сделать алгоритм получения последнего id и добавления новой точки маршрута
      updateRoutePoint.id = 999;
      this.#renderRoutePoint(updateRoutePoint);
    } else {
      this.#routePointersList.get(updateRoutePoint.id).init(updateRoutePoint, this.#offersData, this.#destinationsData);
    }
  };

  #handleRoutePointSelect = (id) => {
    if (this.#selectedRoutePointId === id) {
      this.#selectedRoutePointId = null;
      return;
    }

    this.#removeEscPressEvent();

    this.#selectedRoutePointId = id;
  };

  #handleSortChange = (sortType) => {
    if (sortType === this.#activeSortType) {
      return;
    }
    this.#clearRoutePoints();
    const data = {routePoints: [...this.#routePointsData]};
    if (sortType === 'Price') {
      data['offers'] = this.#offersData;
    }
    const sortRoutePoints = SORTS[sortType](data);
    this.#renderRoutePoints(sortRoutePoints);
    this.#activeSortType = sortType;
  };
}
