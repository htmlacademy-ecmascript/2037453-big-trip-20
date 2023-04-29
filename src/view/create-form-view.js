import {createElement} from '../render';

function createAddFormTemplate() {
  return '';
}

export default class AddFormView {
  getTemplate() {
    return createAddFormTemplate();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
