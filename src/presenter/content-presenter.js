import {render} from '../render.js';
import FilterView from '../view/filters-view';
import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import RoutePointView from '../view/route-point-view';
import EditFormView from '../view/edit-form-view';

export default class ContentPresenter {
  #filterComponent = new FilterView();
  #sortComponent = new SortView();
  #eventsListComponent = new EventsListView();
  #routePointerComponent = new RoutePointView();
  #editFormComponent = new EditFormView();
  #filterContainer = null;
  #contentContainer = null;
  #eventsListContainer = null;

  constructor({filterContainer, contentContainer}) {
    this.#filterContainer = filterContainer;
    this.#contentContainer = contentContainer;
  }

  init() {
    this.#renderContent();
  }

  #renderContent() {
    render(this.#filterComponent, this.#filterContainer);
    render(this.#sortComponent, this.#contentContainer);
    render(this.#eventsListComponent, this.#contentContainer);
    this.#eventsListContainer = document.querySelector('.trip-events__list');
    render(this.#editFormComponent, this.#eventsListContainer);
    for (let i = 0; i < 3; i++) {
      render(this.#routePointerComponent, this.#eventsListContainer);
    }
  }
}
