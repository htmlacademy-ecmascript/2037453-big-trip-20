import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import {ICONS} from '../helpers/const';
import {
  dateTimeFormat,
  getOffersByType,
  getDestinationById,
  getDestinationByName
} from '../helpers/utils';

function createDestinationTemplate(allDestinations, destination) {
  if (destination === null) {
    return '';
  }

  const {
    name = '',
    description = '',
    photos = []
  } = getDestinationById(allDestinations, destination);

  const eventPhotosListMarkup = photos.map((el) => (`<img class="event__photo" src="${el}" alt="Event photo">`));

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">${name}</h3>
            <p class="event__destination-description">${description}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">${eventPhotosListMarkup.join('')}</div>
            </div>                    
          </section>`;
}

function createOfferTemplate({id, title, price}, routePoint) {
  const type = routePoint.type.toLowerCase();
  const isChecked = routePoint.offers.includes(id) ? 'checked' : '';

  return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${id}-${routePoint.id}" type="checkbox" name="event-offer-${type}-${id}" value="${id}" ${isChecked}>
            <label class="event__offer-label" for="event-offer-${type}-${id}-${routePoint.id}">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>`;
}

function createTypeTemplate({type}, routePoint) {
  const isChecked = routePoint.type === type ? 'checked' : '';
  const value = type.toLowerCase();

  return `<div class="event__type-item">
            <input id="event-type-${value}-${routePoint.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
            <label class="event__type-label  event__type-label--${value}" for="event-type-${value}-${routePoint.id}">${type}</label>
          </div>`;
}

function createEditFormTemplate(routePoint, allOffers, allDestinations) {
  const {id, dateStart, dateStop, type, offers, destination, price} = routePoint;

  const availableOffers = getOffersByType(allOffers, type);
  const destinationName = getDestinationById(allDestinations, destination)?.name || '';

  const typesListMarkup = allOffers.map((el) => createTypeTemplate(el, {id, type}));
  const eventOffersListMarkup = availableOffers.map((el) => createOfferTemplate(el, {id, type, offers}));
  const destinationsListMarkup = allDestinations.map((el) => (`<option value="${el.name}"></option>`));

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="${ICONS[type]}" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${typesListMarkup.join('')}
                    </fieldset>
                  </div>
                </div>    
                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-${id}">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${id}">
                  <datalist id="destination-list-${id}">
                    ${destinationsListMarkup.join('')}
                  </datalist>
                </div>
                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-${id}">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dateTimeFormat(dateStart)}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-${id}">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateTimeFormat(dateStop)}">
                </div>
                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-${id}">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}" pattern="[0-9]{1,}">
                </div>
                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Delete</button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
              <section class="event__details">
                <section class="event__section  event__section--offers">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                  <div class="event__available-offers">
                  ${eventOffersListMarkup.join('')}
                  </div>
                </section>
                ${createDestinationTemplate(allDestinations, destination)}
              </section>
            </form>
          </li>`;
}

export default class EditFormView extends AbstractStatefulView {
  _state = null;
  #offers = null;
  #destinations = null;
  #handleFormSubmit = null;
  #handleCloseClick = null;

  constructor({routePoint, offers, destinations, onFormSubmit, onCloseClick}) {
    super();
    this._setState(EditFormView.parseRoutePointToState(routePoint));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.#addListeners();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#offers, this.#destinations);
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

  reset(routePoint) {
    this.updateElement(EditFormView.parseRoutePointToState(routePoint));
  }

  #addListeners() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeClickHandler);

    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#typeChangeHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offerChangeHandler);

    const myInput = this.element.querySelectorAll('.event__input--time');
    const fp = flatpickr(myInput, {
      enableTime: true,
      'time_24hr': true,
      dateFormat: '  y/m/d H:i',
    });

    fp[0].set('maxDate', this._state.dateStop);
    fp[1].set('minDate', this._state.dateStart);

    fp[0].config.onChange.push((selectedDates) => {
      const dateStart = new Date(selectedDates).toISOString();
      this._setState({dateStart});
      fp[1].set('minDate', this._state.dateStart);
    });
    fp[1].config.onChange.push((selectedDates) => {
      const dateStop = new Date(selectedDates).toISOString();
      this._setState({dateStop});
      fp[0].set('maxDate', this._state.dateStop);
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditFormView.parseStateToRoutePoint(this._state));
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const type = evt.target?.value;
    if (!type) {
      return;
    }
    this.updateElement({
      type,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const name = evt.target?.value;
    const destination = getDestinationByName(this.#destinations, name)?.id;
    if (!destination) {
      return;
    }
    this.updateElement({
      destination
    });
  };

  #offerChangeHandler = (evt) => {
    const offers = Array.from(evt.currentTarget.querySelectorAll('input:checked'), (el) => Number(el.value));
    this._setState({
      offers
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    const price = evt.target?.value || 0;
    this._setState({
      price
    });
  };
}
