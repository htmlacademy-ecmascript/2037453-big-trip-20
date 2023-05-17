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
    const offersList = this.#offersData.find((el) => el.type === routePoint.type);
    const routePointPresenter = new RoutePointPresenter({
      routeListContainer: this.#routeListComponent.element
    });

    routePointPresenter.init(routePoint, offersList, this.#offersData, this.#destinationsData);
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
}
