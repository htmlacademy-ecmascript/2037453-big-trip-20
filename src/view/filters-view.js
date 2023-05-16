import AbstractView from '../framework/view/abstract-view';
import {FILTERS} from '../helpers/const';

function createFilterTemplate(data) {
  const filtersMakeup = Object.entries(FILTERS).map(([key, val]) => {
    const isDisabled = val(data).length <= 0 ? ' disabled' : '';
    const isChecked = key === 'Everything' ? ' checked' : '';
    return `<div class="trip-filters__filter">
              <input id="filter-${key.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" 
              type="radio" name="trip-filter" value="${key.toLowerCase()}"${isChecked}${isDisabled}>
              <label class="trip-filters__filter-label" for="filter-${key.toLowerCase()}">${key}</label>
            </div>`;
  });

  return `<form class="trip-filters" action="#" method="get">
            ${filtersMakeup.join('')}
            
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
}

export default class FilterView extends AbstractView {
  #data = [];
  #handleFilterChange = null;

  constructor(routePointsData, onFilterChange) {
    super();
    this.#data = routePointsData;
    this.#handleFilterChange = onFilterChange;
    this.element
      .addEventListener('submit', this.#filterChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#data);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterChange();
  };
}
