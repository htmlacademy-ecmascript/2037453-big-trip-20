import {render, remove} from '../framework/render';
import FilterView from '../view/filters-view';
import SortView from '../view/sort-view';
import RoutePointsListView from '../view/route-points-list-view';
import RoutePointsModel from '../models/route-points-model';
import OffersModel from '../models/offers-model';
import DestinationsModel from '../models/destinations-model';
import StubView from '../view/stub-view';
import RoutePointPresenter from '../presenter/route-point-presenter';
import {SORTS, UpdateType, UserAction} from '../helpers/const';
// import {getFirstType} from '../helpers/utils';
// import {logPlugin} from '@babel/preset-env/lib/debug';

export default class ContentPresenter {
  #activeFilterType = null;
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
  // #routePointsData = null;
  #offersData = null;
  #destinationsData = null;
  #routePointsList = {};
  #selectedRoutePointId = null;

  constructor({filterContainer, contentContainer}) {
    this.#filterContainer = filterContainer;
    this.#contentContainer = contentContainer;
    this.#activeFilterType = 'Everything';
    this.#stubComponent = new StubView(this.#activeFilterType);

    this.#routePointsModel.addObserver(this.#handleModelEvent);
  }

  get routePoints() {
    // switch (this.#activeSortType) {
    //   case 'Time':
    //     return [...this.#routePointsModel.routePoints];
    //   case 'Price':
    //     return [...this.#routePointsModel.routePoints];
    // }
    return this.#routePointsModel.routePoints;
  }

  async init() {
    // this.#routePointsData = await this.#routePointsModel.routePoints;
    this.#offersData = await this.#offersModel.offers;
    this.#destinationsData = await this.#destinationsModel.destinations;
    this.#renderContent();
  }

  #renderContent() {
    const routePoints = this.routePoints;
    this.#filterComponent = new FilterView(this.routePoints);
    render(this.#filterComponent, this.#filterContainer);
    if (routePoints.length <= 0) {
      render(this.#stubComponent, this.#contentContainer);
    } else {
      this.#sortComponent = new SortView(this.#handleSortChange);
      render(this.#sortComponent, this.#contentContainer);
      render(this.#routeListComponent, this.#contentContainer);

      // @todo Доработать во время реализации функционала формы добавления нового маршрута
      // this.#renderRoutePoint({
      //   id: null,
      //   dateStart: new Date().toISOString(),
      //   dateStop: new Date().toISOString(),
      //   type: getFirstType(this.#offersData),
      //   destination: null,
      //   offers: [],
      //   price: 0
      // });
      this.#renderRoutePoints(routePoints);
    }
  }

  #renderRoutePoints(routePointData) {
    routePointData.forEach((routePoint) => this.#renderRoutePoint(routePoint));
  }

  #renderRoutePoint(routePoint) {
    const routePointPresenter = new RoutePointPresenter({
      routeListContainer: this.#routeListComponent.element,
      onViewAction: this.#handleViewAction,
      onRoutePointSelect: this.#handleRoutePointSelect
    });
    this.#routePointsList[routePoint.id] = routePointPresenter;
    routePointPresenter.init(routePoint, this.#offersData, this.#destinationsData);
  }

  #removeEscPressEvent() {
    if (this.#selectedRoutePointId === null) {
      return;
    }
    this.#routePointsList.get(this.#selectedRoutePointId).reset();
  }

  #clearRoutePoints({resetSortType = false, resetFilterType = false} = {}) {
    Object.values(this.#routePointsList).forEach((routePoint) => routePoint.destroy());
    this.#routePointsList = {};
    remove(this.#routeListComponent);
    remove(this.#sortComponent);
    remove(this.#filterComponent);

    if (resetSortType) {
      this.#activeSortType = 'Day';
    }

    if (resetFilterType) {
      this.#activeFilterType = 'Everything';
    }
  }

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
    const data = {routePoints: [...this.routePoints]};
    if (sortType === 'Price') {
      data['offers'] = this.#offersData;
    }
    const sortRoutePoints = SORTS[sortType](data);
    this.#renderRoutePoints(sortRoutePoints);
    this.#activeSortType = sortType;
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_ROUTE_POINT:
        this.#routePointsModel.addRoutePoint(updateType, update);
        break;
      case UserAction.UPDATE_ROUTE_POINT:
        this.#routePointsModel.updateRoutePoint(updateType, update);
        break;
      case UserAction.DELETE_ROUTE_POINT:
        this.#routePointsModel.deleteRoutePoint(updateType, update);
        break;
      case UserAction.SORT_ROUTE_POINTS:
        this.#routePointsModel.sortRoutePoints(updateType, update);
        break;
      case UserAction.FILTER_ROUTE_POINTS:
        this.#routePointsModel.filterRoutePoints(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#routePointsList[data.id].init(data, this.#offersData, this.#destinationsData);
        break;
      case UpdateType.MINOR:
        this.#clearRoutePoints();
        this.#renderContent();
        break;
      case UpdateType.MAJOR:
        this.#clearRoutePoints({resetSortTyp: true, resetFilterType: true});
        this.#renderContent();
        break;
    }
  };
}
