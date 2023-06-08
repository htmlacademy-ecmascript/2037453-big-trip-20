import AbstractView from '../framework/view/abstract-view';
import {STUBS} from '../helpers/const';
import {FILTERS} from '../helpers/const';

function createStubTemplate(filter) {
  return `<p class="trip-events__msg">${STUBS[filter]}</p>`;
}

export default class StubView extends AbstractView {
  #activeFilter = null;

  constructor(activeFilter, noRoutePoints) {
    super();
    this.#activeFilter = noRoutePoints ? Object.keys(FILTERS)[0] : activeFilter;
  }

  get template() {
    return createStubTemplate(this.#activeFilter);
  }
}
