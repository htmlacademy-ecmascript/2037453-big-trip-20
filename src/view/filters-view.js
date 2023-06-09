import AbstractView from '../framework/view/abstract-view';
import {FILTERS} from '../helpers/const';
import {UserAction, UpdateType} from '../helpers/const';

function createFilterTemplate(routePoints, activeFilterType) {
  const filtersMakeup = Object.entries(FILTERS).map(([key, val]) => {
    const isDisabled = val(routePoints).length <= 0 ? ' disabled' : '';
    const isChecked = key === activeFilterType ? ' checked' : '';
    return `<div class="trip-filters__filter">
              <input id="filter-${key.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" 
              type="radio" name="trip-filter" data-filter-type="${key}"${isChecked}${isDisabled}>
              <label class="trip-filters__filter-label" for="filter-${key.toLowerCase()}">${key}</label>
            </div>`;
  });
  return `<form class="trip-filters" action="#" method="get">
            ${filtersMakeup.join('')}
            
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
}

export default class FilterView extends AbstractView {
  #routePoints = null;
  #activeFilterType = null;
  #handleViewAction = null;

  constructor(routePoints, activeFilterType, onViewAction) {
    super();
    this.#routePoints = routePoints;
    this.#handleViewAction = onViewAction;
    this.#activeFilterType = activeFilterType;
    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#routePoints, this.#activeFilterType);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    const filterType = evt.target?.dataset?.filterType;
    if (!filterType) {
      return;
    }
    this.#handleViewAction(
      UserAction.FILTER_ROUTE_POINTS,
      UpdateType.MINOR,
      filterType
    );
  };
}
