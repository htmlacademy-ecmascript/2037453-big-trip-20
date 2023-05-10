import {render} from '../framework/render';
import FilterView from '../view/filters-view';
import SortView from '../view/sort-view';
import RoutePointsListView from '../view/route-points-list-view';
import RoutePointView from '../view/route-point-view';
import EditFormView from '../view/edit-form-view';
import RoutePointsModel from '../models/route-points-model';
import OffersModel from '../models/offers-model';
import DestinationsModel from '../models/destinations-model';

export default class ContentPresenter {
  #routePointsModel = new RoutePointsModel();
  #offersModel = new OffersModel();
  #destinationsModel = new DestinationsModel();
  #filterComponent = new FilterView();
  #sortComponent = new SortView();
  #routeListComponent = new RoutePointsListView();
  #routePointerComponent = null;
  #editFormComponent = null;
  #filterContainer = null;
  #contentContainer = null;
  #routePointsData = null;
  #offersData = null;
  #destinationsData = null;

  constructor({filterContainer, contentContainer}) {
    this.#filterContainer = filterContainer;
    this.#contentContainer = contentContainer;
  }

  async init() {
    this.#routePointsData = await this.#routePointsModel.routePoints;
    this.#offersData = await this.#offersModel.offers;
    this.#destinationsData = await this.#destinationsModel.destinations;
    this.#renderContent();
  }

  #renderContent() {
    render(this.#filterComponent, this.#filterContainer);
    render(this.#sortComponent, this.#contentContainer);
    render(this.#routeListComponent, this.#contentContainer);
    this.#editFormComponent = new EditFormView({
      routePoint: this.#routePointsData[0],
      offersList: this.#offersData,
      destination: this.#destinationsData
    });
    render(this.#editFormComponent, this.#routeListComponent.element);
    this.#editFormComponent.removeElement();
    for (let i = 1; i < this.#routePointsData.length; i++) {
      const routePoint = this.#routePointsData[i];
      this.#routePointerComponent = new RoutePointView({
        routePoint,
        offersList: this.#offersData.find((el) => el.type === routePoint.type),
        destination: this.#destinationsData.find((el) => el.id === routePoint.destination)
      });
      render(this.#routePointerComponent, this.#routeListComponent.element);
      this.#routePointerComponent.removeElement();
    }
  }
}
