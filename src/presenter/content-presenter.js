import {render} from '../framework/render';
import FilterView from '../view/filters-view';
import SortView from '../view/sort-view';
import RoutePointsListView from '../view/route-points-list-view';
import RoutePointsModel from '../models/route-points-model';
import OffersModel from '../models/offers-model';
import DestinationsModel from '../models/destinations-model';
import StubView from '../view/stub-view';
import RoutePointPresenter from '../presenter/route-point-presenter';

export default class ContentPresenter {
  #activeFilter = null;
  #routePointsModel = new RoutePointsModel();
  #offersModel = new OffersModel();
  #destinationsModel = new DestinationsModel();
  #filterComponent = null;
  #stubComponent = null;
  #sortComponent = new SortView();
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

  #renderRoutePoint(routePoint) {
    const routePointPresenter = new RoutePointPresenter({
      routeListContainer: this.#routeListComponent.element,
      onDataChange: this.#handleRoutePointChange,
      onRoutePointSelect: this.#handleRoutePointSelect
    });

    routePointPresenter.init(routePoint, this.#offersData, this.#destinationsData);
    this.#routePointersList.set(routePoint.id, routePointPresenter);
  }

  #renderContent() {
    this.#filterComponent = new FilterView(this.#routePointsData);
    render(this.#filterComponent, this.#filterContainer);
    if (this.#routePointsData.length <= 0) {
      render(this.#stubComponent, this.#contentContainer);
    } else {
      render(this.#sortComponent, this.#contentContainer);
      render(this.#routeListComponent, this.#contentContainer);

      for (let i = 0; i < this.#routePointsData.length; i++) {
        this.#renderRoutePoint(this.#routePointsData[i]);
      }
    }
  }

  #handleRoutePointChange = (updateRoutePoint) => {
    this.#routePointersList.get(updateRoutePoint.id).init(updateRoutePoint, this.#offersData, this.#destinationsData);
  };

  #handleRoutePointSelect = (id) => {
    if(this.#selectedRoutePointId === id) {
      this.#selectedRoutePointId = null;
      return;
    }

    if(this.#selectedRoutePointId !== null) {
      this.#routePointersList.get(this.#selectedRoutePointId).unSelect();
    }

    this.#selectedRoutePointId = id;
  };
}
