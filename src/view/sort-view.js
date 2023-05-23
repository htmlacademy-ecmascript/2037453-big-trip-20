import AbstractView from '../framework/view/abstract-view';
import {SORTS} from '../helpers/const';

function createSortTemplate() {
  const sortsMakeup = Object.entries(SORTS).map(([key, val]) => {
    const isDisabled = !val ? ' disabled' : '';
    const isChecked = key === 'Day' ? ' checked' : '';
    return `<div class="trip-sort__item  trip-sort__item--${key.toLowerCase()}">
              <input id="sort-${key.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${key.toLowerCase()}" data-sort-type="${key}"${isChecked}${isDisabled}>
              <label class="trip-sort__btn" for="sort-${key.toLowerCase()}">${key}</label>
            </div>`;
  });
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${sortsMakeup.join('')}
          </form>`;
}

export default class SortView extends AbstractView {
  #handleSortChange = null;

  constructor(onSortChange) {
    super();
    this.#handleSortChange = onSortChange;

    this.element.addEventListener('change', this.#sortChangeHandler);
  }

  get template() {
    return createSortTemplate();
  }

  #sortChangeHandler = (evt) => {
    evt.preventDefault();
    const sortType = evt.target?.dataset?.sortType;
    if (!sortType) {
      return;
    }
    this.#handleSortChange(sortType);
  };
}
