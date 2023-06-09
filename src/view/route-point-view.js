import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {TYPE_ICONS} from '../helpers/const';
import {
  routeDateFormat,
  dateFormat,
  timeFormat,
  durationFormat,
  dateISOFormat,
  getDestinationById
} from '../helpers/utils';

function createOfferTemplate({title, price}) {
  return `<li class="event__offer">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </li>`;
}

function createRoutePointTemplate({dateStart, dateStop, type, isFavorite, price}, offers, destination) {
  const offersListMarkup = offers.map((el) => createOfferTemplate(el));
  return `<li class="trip-events__item">
            <div class="event">
                <time class="event__date" datetime="${dateFormat(dateStart)}">${routeDateFormat(dateStart)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="${TYPE_ICONS[type]}" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} &minus; ${destination}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateISOFormat(dateStart)}">${timeFormat(dateStart)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateISOFormat(dateStop)}">${timeFormat(dateStop)}</time>
                  </p>
                  <p class="event__duration">${durationFormat(dateStart, dateStop)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">${offersListMarkup.join('')}</ul>
                <button class="event__favorite-btn${isFavorite ? ' event__favorite-btn--active' : ''}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
          </li>`;
}

export default class RoutePointView extends AbstractStatefulView {
  _state = null;
  #offers = null;
  #destinations = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({routePoint, offersList, destinations, onEditClick, onFavoriteClick}) {
    super();
    this._setState(RoutePointView.parseRoutePointToState(routePoint));
    this.#offers = offersList.filter((el) => routePoint.offers.includes(el.id));
    this.#destinations = getDestinationById(destinations, routePoint.destination)?.name || '';
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.#addListeners();
  }

  get template() {
    return createRoutePointTemplate(this._state, this.#offers, this.#destinations);
  }

  _restoreHandlers() {
    this.#addListeners();
  }

  static parseRoutePointToState(routePoint) {
    return {...routePoint};
  }

  static parseStateToRoutePoint(state) {
    return {...state};
  }

  #addListeners() {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick(RoutePointView.parseStateToRoutePoint(this._state));
  };
}
