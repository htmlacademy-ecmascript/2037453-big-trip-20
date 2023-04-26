import {render} from '../render.js';
import SortView from '../view/sort-view';

export default class SortPresenter {
  #sortComponent = new SortView();
  #container = null;
  constructor({container}) {
    this.#container = container;
  }

  init() {
    this.#renderEvents();
  }

  #renderEvents() {
    render(this.#sortComponent, this.#container);
  }
}
