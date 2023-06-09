import AbstractView from '../framework/view/abstract-view';

function createAddButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class AddButtonView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createAddButtonTemplate();
  }
}
