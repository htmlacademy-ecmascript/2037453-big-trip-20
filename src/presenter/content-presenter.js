import {render, remove, RenderPosition} from '../framework/render';
import FilterView from '../view/filters-view';
import SortView from '../view/sort-view';
import RoutePointsListView from '../view/route-points-list-view';
import StubView from '../view/stub-view';
import RoutePointPresenter from '../presenter/route-point-presenter';
import CreateFormPresenter from '../presenter/create-form-presenter';
import {FILTERS, SORTS, UpdateType, UserAction} from '../helpers/const';
import LoadingView from '../view/loading-view';

export default class ContentPresenter {
  #activeFilterType = Object.keys(FILTERS)[0];
  #activeSortType = Object.keys(SORTS)[0];
  #noRoutePoints = false;
  #isLoading = true;
  #selectedRoutePointId = null;

  #routePointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #filterContainer = null;
  #contentContainer = null;

  #filterComponent = null;
  #stubComponent = null;
  #sortComponent = null;
  #routeListComponent = null;
  #loadingComponent = new LoadingView();

  #offersData = null;
  #destinationsData = null;
  #routePointsList = {};

  #createFormPresenter = null;


  constructor({filterContainer, contentContainer, routePointsModel, offersModel, destinationsModel}) {
    this.#filterContainer = filterContainer;
    this.#contentContainer = contentContainer;
    this.#routePointsModel = routePointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#routePointsModel.addObserver(this.#handleModelEvent);
  }

  get routePoints() {
    let routePoints = [...this.#routePointsModel.routePoints];
    this.#noRoutePoints = !routePoints.length;
    if (Object.keys(FILTERS).some((key) => key === this.#activeFilterType)) {
      routePoints = FILTERS[this.#activeFilterType](routePoints);
    }
    if (Object.keys(SORTS).some((key) => key === this.#activeSortType)) {
      routePoints = SORTS[this.#activeSortType](routePoints, this.#offersData);
    }
    return routePoints;
  }

  init() {
    this.#routePointsModel.init();
    this.#renderContent();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#contentContainer);
  }

  #renderContent() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const routePoints = this.routePoints;
    this.#offersData = this.#offersModel.offers;
    this.#destinationsData = this.#destinationsModel.destinations;
    console.log(routePoints)
    this.#filterComponent = new FilterView(this.#routePointsModel.routePoints, this.#activeFilterType, this.#handleViewAction);
    render(this.#filterComponent, this.#filterContainer);
    this.#routeListComponent = new RoutePointsListView();
    render(this.#routeListComponent, this.#contentContainer);
    if (routePoints.length <= 0) {
      this.#stubComponent = new StubView(this.#activeFilterType, this.#noRoutePoints);
      render(this.#stubComponent, this.#routeListComponent.element);
    } else {
      this.#createFormPresenter = new CreateFormPresenter({
        routeListContainer: this.#routeListComponent.element,
        onViewAction: this.#handleViewAction,
      });
      this.#createFormPresenter.init(null, this.#offersData, this.#destinationsData);
      this.#renderRoutePoints(routePoints);
      this.#sortComponent = new SortView(this.#activeSortType, this.#handleViewAction);
      render(this.#sortComponent, this.#routeListComponent.element, RenderPosition.BEFOREBEGIN);
    }
  }

  #renderRoutePoints(routePointData) {
    routePointData.forEach((routePoint) => {
      const routePointPresenter = new RoutePointPresenter({
        routeListContainer: this.#routeListComponent.element,
        onViewAction: this.#handleViewAction
      });
      this.#routePointsList[routePoint.id] = routePointPresenter;
      routePointPresenter.init(routePoint, this.#offersData, this.#destinationsData);
    });
  }

  #clearRoutePoints({resetSortType = false, resetFilterType = false} = {}) {
    Object.values(this.#routePointsList).forEach((routePoint) => routePoint.destroy());
    this.#routePointsList = {};
    remove(this.#routeListComponent);
    remove(this.#sortComponent);
    remove(this.#filterComponent);
    remove(this.#loadingComponent);
    if (this.#noRoutePoints) {
      remove(this.#stubComponent);
    }
    if (resetSortType) {
      this.#activeSortType = Object.keys(SORTS)[0];
    }
    if (resetFilterType) {
      this.#activeFilterType = Object.keys(FILTERS)[0];
    }
  }

  #handleSetCurrentRoutePointId = (data) => {
    const id = data?.id || 0;
    if (this.#selectedRoutePointId === id) {
      this.#selectedRoutePointId = null;
      return;
    }
    if (this.#selectedRoutePointId !== null) {
      if (this.#selectedRoutePointId === 0) {
        this.#createFormPresenter.destroy();
      } else {
        this.#routePointsList?.[this.#selectedRoutePointId]?.reset();
      }
    }
    this.#selectedRoutePointId = id;
  };

  #handleViewAction = (actionType, updateType, data) => {
    switch (actionType) {
      case UserAction.ADD_ROUTE_POINT:
        this.#routePointsModel.addRoutePoint(updateType, data);
        break;
      case UserAction.UPDATE_ROUTE_POINT:
        this.#routePointsModel.updateRoutePoint(updateType, data);
        break;
      case UserAction.DELETE_ROUTE_POINT:
        this.#routePointsModel.deleteRoutePoint(updateType, data);
        break;
      case UserAction.SORT_ROUTE_POINTS:
        this.#activeSortType = data;
        this.#handleModelEvent(updateType);
        break;
      case UserAction.FILTER_ROUTE_POINTS:
        this.#activeFilterType = data;
        this.#handleModelEvent(updateType);
        break;
      case UserAction.SELECT_POINT:
        this.#handleSetCurrentRoutePointId(data);
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
        this.#clearRoutePoints({resetSortType: true, resetFilterType: true});
        this.#renderContent();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderContent();
        break;
    }
  };
}
