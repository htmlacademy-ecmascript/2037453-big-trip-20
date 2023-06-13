import {render, remove, RenderPosition} from '../framework/render';
import FilterView from '../view/filters-view';
import SortView from '../view/sort-view';
import RoutePointsListView from '../view/route-points-list-view';
import StubView from '../view/stub-view';
import TripInfoView from '../view/trip-info-view';
import RoutePointPresenter from '../presenter/route-point-presenter';
import CreateFormPresenter from '../presenter/create-form-presenter';
import LoadingView from '../view/loading-view';
import {FILTERS, SORTS, UpdateType, UserAction, TimeLimit} from '../helpers/const';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const SORT_DEFAULT = Object.keys(SORTS)[0];
const FILTER_DEFAULT = Object.keys(FILTERS)[0];

export default class ContentPresenter {
  #activeFilterType = FILTER_DEFAULT;
  #activeSortType = SORT_DEFAULT;
  #noRoutePoints = false;
  #isLoading = true;
  #selectedRoutePointId = null;

  #routePointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #tripInfoContainer = null;
  #filterContainer = null;
  #contentContainer = null;

  #filterComponent = null;
  #stubComponent = null;
  #tripInfoComponent = null;
  #sortComponent = null;
  #routeListComponent = null;
  #loadingComponent = new LoadingView();

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  #offersData = null;
  #destinationsData = null;
  #routePointsList = {};

  #createFormPresenter = null;


  constructor({
    tripInfoContainer,
    filterContainer,
    contentContainer,
    routePointsModel,
    offersModel,
    destinationsModel
  }) {
    this.#tripInfoContainer = tripInfoContainer;
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

    this.#filterComponent = new FilterView(this.#routePointsModel.routePoints, this.#activeFilterType, this.#handleViewAction);
    render(this.#filterComponent, this.#filterContainer);

    this.#routeListComponent = new RoutePointsListView();
    render(this.#routeListComponent, this.#contentContainer);

    this.#createFormPresenter = new CreateFormPresenter({
      tripInfoContainer: this.#tripInfoContainer,
      routeListContainer: this.#routeListComponent.element,
      onViewAction: this.#handleViewAction,
    });
    this.#createFormPresenter.init(this.#offersData, this.#destinationsData);

    if (routePoints.length <= 0) {
      this.#stubComponent = new StubView(this.#activeFilterType, this.#noRoutePoints);
      render(this.#stubComponent, this.#routeListComponent.element);
    } else {
      this.#tripInfoComponent = new TripInfoView([...this.#routePointsModel.routePoints], this.#offersData, this.#destinationsData);
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);

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
    this.#createFormPresenter.destroy();

    Object.values(this.#routePointsList).forEach((routePoint) => routePoint.destroy());
    this.#routePointsList = {};

    remove(this.#routeListComponent);
    remove(this.#sortComponent);
    remove(this.#filterComponent);
    remove(this.#loadingComponent);
    remove(this.#tripInfoComponent);

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

  #handleViewAction = async (actionType, updateType, data) => {
    switch (actionType) {
      case UserAction.ADD_ROUTE_POINT:
        this.#createFormPresenter.setSaving();
        this.#uiBlocker.block();
        try {
          await this.#routePointsModel.addRoutePoint(updateType, data);
        } catch (err) {
          this.#createFormPresenter.setAborting();
        }
        break;
      case UserAction.UPDATE_ROUTE_POINT:
        this.#routePointsList[data.id].setSaving();
        this.#uiBlocker.block();
        try {
          await this.#routePointsModel.updateRoutePoint(updateType, data);
        } catch (err) {
          this.#routePointsList[data.id].setAborting();
        }
        break;
      case UserAction.DELETE_ROUTE_POINT:
        this.#routePointsList[data.id].setDeleting();
        this.#uiBlocker.block();
        try {
          await this.#routePointsModel.deleteRoutePoint(updateType, data);
        } catch (err) {
          this.#routePointsList[data.id].setAborting();
        }
        break;
      case UserAction.SORT_ROUTE_POINTS:
        this.#activeSortType = data;
        this.#handleModelEvent(updateType);
        break;
      case UserAction.FILTER_ROUTE_POINTS:
        this.#activeSortType = SORT_DEFAULT;
        this.#activeFilterType = data;
        this.#handleModelEvent(updateType);
        break;
      case UserAction.SELECT_POINT:
        this.#handleSetCurrentRoutePointId(data);
        break;
    }
    this.#uiBlocker.unblock();
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
