import AbstractView from '../framework/view/abstract-view';
import './loading-view.css';

function createSpinnerTemplate() {
  return ('<div class="spinner"></div>');
}

export default class LoadingView extends AbstractView {
  get template() {
    return createSpinnerTemplate();
  }
}
