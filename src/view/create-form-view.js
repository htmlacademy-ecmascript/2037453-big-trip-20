import AbstractView from '../framework/view/abstract-view';
function createAddFormTemplate() {
  return '';
}

export default class AddFormView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createAddFormTemplate();
  }
}
