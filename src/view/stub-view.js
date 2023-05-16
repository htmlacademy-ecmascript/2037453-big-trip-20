import AbstractView from '../framework/view/abstract-view';
import {STUBS} from '../helpers/const';

function createStubTemplate(filter) {
  return `<p class="trip-events__msg">${STUBS[filter]}</p>`;
}

export default class StubView extends AbstractView {
  #activeFilter = null;

  constructor(activeFilter) {
    super();
    this.#activeFilter = activeFilter;
  }

  get template() {
    return createStubTemplate(this.#activeFilter);
  }
}
