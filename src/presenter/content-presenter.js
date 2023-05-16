import {render, replace} from '../framework/render';
import FilterView from '../view/filters-view';
import SortView from '../view/sort-view';
import RoutePointsListView from '../view/route-points-list-view';
import RoutePointView from '../view/route-point-view';
import EditFormView from '../view/edit-form-view';
import RoutePointsModel from '../models/route-points-model';
import OffersModel from '../models/offers-model';
import DestinationsModel from '../models/destinations-model';
import StubView from '../view/stub-view';

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
    this.#filterComponent = new FilterView(this.#routePointsData);
    render(this.#filterComponent, this.#filterContainer);
    if(this.#routePointsData.length <= 0) {
      render(this.#stubComponent, this.#contentContainer);
    }else {
      render(this.#sortComponent, this.#contentContainer);
      render(this.#routeListComponent, this.#contentContainer);

      for (let i = 0; i < this.#routePointsData.length; i++) {
        this.#renderRoutePoint(this.#routePointsData[i]);
      }
    }
  }
}
