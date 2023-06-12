import AbstractStatefulView from '../framework/view/abstract-stateful-view';

function createAddButtonTemplate(state) {
  const isDisabled = state.isDisabled ? ' disabled' : '';
  return `<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button"${isDisabled}>New event</button>`;
}

export default class AddButtonView extends AbstractStatefulView {
  _state = {
    isDisabled: false
  };

  #handleAddClick = null;

  constructor({onAddClick}) {
    super();
    this.#handleAddClick = onAddClick;
    this.#addListeners();
  }

  get template() {
    return createAddButtonTemplate(this._state);
  }

  _restoreHandlers() {
    this.#addListeners();
  }

  #addListeners() {
    this.element.addEventListener('click', this.#addClickHandler);
  }

  #addClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleAddClick();
  };
}
