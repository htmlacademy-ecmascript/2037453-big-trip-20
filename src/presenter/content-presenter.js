import {render} from '../render.js';
import FilterView from '../view/filters-view';
import SortView from '../view/sort-view';
import RoutePointsListView from '../view/route-points-list-view';
import RoutePointView from '../view/route-point-view';
import EditFormView from '../view/edit-form-view';
import RoutePointsModel from '../models/route-points-model';

export default class ContentPresenter {
  #routePointsModel = new RoutePointsModel();
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
    this.#routePointsData = await this.#routePointsModel.getRoutePoints();
    this.#offersData = await this.#routePointsModel.getOffers();
    this.#destinationsData = await this.#routePointsModel.getDestinations();
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
    render(this.#editFormComponent, this.#routeListComponent.getElement());
    this.#editFormComponent.removeElement();
    for (let i = 1; i < this.#routePointsData.length; i++) {
      const routePoint = this.#routePointsData[i];
      this.#routePointerComponent = new RoutePointView({
        routePoint,
        offersList: this.#offersData.find((el) => el.type === routePoint.type),
        destination: this.#destinationsData.find((el) => el.id === routePoint.destination)
      });
      render(this.#routePointerComponent, this.#routeListComponent.getElement());
      this.#routePointerComponent.removeElement();
    }
  }
}
