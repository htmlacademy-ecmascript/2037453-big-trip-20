import {render} from '../render.js';
import RoutePointView from '../view/route-point-view';

export default class EventsListPresenter {
  #routePointerComponent = new RoutePointView();
  #container = null;
  constructor({container}) {
    this.#container = container;
  }

  init() {
    this.#renderEvents();
  }

  #renderEvents() {
    render(this.#routePointerComponent, this.#container);
  }
}
