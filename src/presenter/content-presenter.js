import {render, replace} from '../framework/render';
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

  #renderRoutePoint(routePoint) {
    const offersList = this.#offersData.find((el) => el.type === routePoint.type);
    const escPressHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escPressHandler);
      }
    };
    const routePointComponent = new RoutePointView({
      routePoint,
      offersList,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escPressHandler);
      }
    });
    const editFormComponent = new EditFormView({
      routePoint,
      offers: this.#offersData,
      destinations: this.#destinationsData,
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escPressHandler);
      },
      onCloseClick: () => {
        replaceFormToPoint();
      }
    });

    function replacePointToForm() {
      replace(editFormComponent, routePointComponent);
    }

    function replaceFormToPoint() {
      replace(routePointComponent, editFormComponent);
    }

    render(routePointComponent, this.#routeListComponent.element);
  }

  #renderContent() {
    render(this.#filterComponent, this.#filterContainer);
    render(this.#sortComponent, this.#contentContainer);
    render(this.#routeListComponent, this.#contentContainer);

    for (let i = 0; i < this.#routePointsData.length; i++) {
      const routePoint = this.#routePointsData[i];

      this.#renderRoutePoint(routePoint);
    }
  }
}
