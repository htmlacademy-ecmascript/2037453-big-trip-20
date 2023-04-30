import {render} from '../render.js';
import FilterView from '../view/filters-view';
import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import RoutePointView from '../view/route-point-view';
import EditFormView from '../view/edit-form-view';
import EventsDataModel from '../models/events-data-model';

export default class ContentPresenter {
  #eventDataModel = new EventsDataModel();
  #filterComponent = new FilterView();
  #sortComponent = new SortView();
  #eventsListComponent = new EventsListView();
  #routePointerComponent = null;
  #editFormComponent = null;
  #filterContainer = null;
  #contentContainer = null;
  #eventsData = null;
  #offersData = null;
  #destinationsData = null;

  constructor({filterContainer, contentContainer}) {
    this.#filterContainer = filterContainer;
    this.#contentContainer = contentContainer;
  }

  async init() {
    this.#eventsData = await this.#eventDataModel.getRoutePoints();
    this.#offersData = await this.#eventDataModel.getOffers();
    this.#destinationsData = await this.#eventDataModel.getDestinations();
    this.#renderContent();
  }

  #renderContent() {
    render(this.#filterComponent, this.#filterContainer);
    render(this.#sortComponent, this.#contentContainer);
    render(this.#eventsListComponent, this.#contentContainer);

    for (let i = 0; i < this.#eventsData.length; i++) {
      const event = this.#eventsData[i];
      const props = {event};
      if(i === 0) {
        props.offersList = this.#offersData;
        props.destination = this.#destinationsData;
        this.#editFormComponent = new EditFormView(props);
        render(this.#editFormComponent, this.#eventsListComponent.getElement());
        this.#editFormComponent.removeElement();
      }else{
        props.offersList = this.#offersData.find((el) => el.type === event.type);
        props.destination = this.#destinationsData.find((el) => el.id === event.destination);
        this.#routePointerComponent = new RoutePointView(props);
        render(this.#routePointerComponent, this.#eventsListComponent.getElement());
        this.#routePointerComponent.removeElement();
      }
    }
  }
}
