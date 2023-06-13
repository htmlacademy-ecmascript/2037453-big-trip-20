import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import {TYPE_ICONS, TYPE_NAMES} from '../helpers/const';
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

function createOfferTemplate({id, title, price}, routePoint, isDisabled) {
  const type = routePoint.type.toLowerCase();
  const isChecked = routePoint.offers.includes(id) ? 'checked' : '';
  return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${id}-${routePoint.id}" type="checkbox" name="event-offer-${type}-${id}" value="${id}" ${isChecked}${isDisabled}>
            <label class="event__offer-label" for="event-offer-${type}-${id}-${routePoint.id}">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>`;
}

function createTypeTemplate({type}, routePoint, isDisabled) {
  const isChecked = routePoint.type === type ? 'checked' : '';
  return `<div class="event__type-item">
            <input id="event-type-${type}-${routePoint.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}${isDisabled}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${routePoint.id}">${TYPE_NAMES[type]}</label>
          </div>`;
}

function createEditFormTemplate(routePoint, allOffers, allDestinations) {
  const {
    id,
    dateStart,
    dateStop,
    type,
    offers,
    destination,
    price,
    isSaving,
    isDeleting,
    isNewPoint
  } = routePoint;

  const isDisabled = routePoint.isDisabled
    ? ' disabled'
    : '';
  const saveButtonText = isSaving
    ? 'Saving...'
    : 'Save';
  let resetButtonText = isDeleting
    ? 'Deleting...'
    : 'Delete';

  if(isNewPoint) {
    resetButtonText = 'Cancel';
  }

  const availableOffers = getOffersByType(allOffers, type);
  const destinationName = getDestinationById(allDestinations, destination)?.name || '';
  const typesListMarkup = allOffers.map((el) => createTypeTemplate(el, {id, type}, isDisabled));
  const eventOffersList = availableOffers.map((el) => createOfferTemplate(el, {id, type, offers}, isDisabled));
  const eventOffersListMarkup = eventOffersList.length ? `<section class="event__section  event__section--offers">
                                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                                  <div class="event__available-offers">
                                    ${eventOffersList.join('')}
                                  </div>
                                </section>` : '';

  const destinationsListMarkup = allDestinations.map((el) => (`<option value="${el.name}"></option>`));
  const rollUpButtonMarkup = isNewPoint ? '' : `<button class="event__rollup-btn" type="button"${isDisabled}><span class="visually-hidden">Open event</span></button>`;

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="${TYPE_ICONS[type]}" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle visually-hidden" id="event-type-toggle-${id}" type="checkbox"${isDisabled}>
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
                  <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${id}"${isDisabled} required>
                  <datalist id="destination-list-${id}">
                    ${destinationsListMarkup.join('')}
                  </datalist>
                </div>
                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-${id}">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dateTimeFormat(dateStart)}"${isDisabled}>
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-${id}">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateTimeFormat(dateStop)}"${isDisabled}>
                </div>
                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-${id}">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}" min="1"${isDisabled} required>
                </div>
                <button class="event__save-btn  btn  btn--blue" type="submit"${isDisabled}>${saveButtonText}</button>
                <button class="event__reset-btn" type="reset"${isDisabled}>${resetButtonText}</button>
                ${rollUpButtonMarkup}
              </header>
              <section class="event__details">                
                 ${eventOffersListMarkup}
                ${createDestinationTemplate(allDestinations, destination)}
              </section>
            </form>
          </li>`;
}

export default class EditFormView extends AbstractStatefulView {
  _state = null;
  #isNewPoint = false;
  #offers = null;
  #destinations = null;
  #handleFormSubmit = null;
  #handleResetClick = null;
  #handleCloseClick = null;

  constructor({routePoint, offers, destinations, onFormSubmit, onCloseClick, onResetClick}) {
    super();
    this._setState(EditFormView.parseRoutePointToState(routePoint));
    if (!routePoint) {
      const now = new Date();
      this._setState({
        dateStart: now,
        dateStop: now,
        type: offers[0].type,
        offers: [],
        destination: null,
        price: null,
        isFavorite: false,
        isNewPoint: true
      });
    }
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleResetClick = onResetClick;
    this.#handleCloseClick = onCloseClick;
    this.#addListeners();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#offers, this.#destinations, this.#isNewPoint);
  }

  static parseRoutePointToState(routePoint) {
    return {
      ...routePoint,
      isNewPoint: false,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToRoutePoint(state) {
    const routePoint = {...state};

    delete routePoint.isNewPoint;
    delete routePoint.isDisabled;
    delete routePoint.isSaving;
    delete routePoint.isDeleting;

    return routePoint;
  }

  _restoreHandlers() {
    this.#addListeners();
  }

  reset(routePoint) {
    this.updateElement(EditFormView.parseRoutePointToState(routePoint));
  }

  #addListeners() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      ?.addEventListener('click', this.#closeClickHandler);
    this.element.querySelector('.event__type-list')
      ?.addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination')
      ?.addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
      ?.addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__reset-btn')
      ?.addEventListener('click', this.#resetClickHandler);
    const myInput = this.element.querySelectorAll('.event__input--time');

    const fp = flatpickr(myInput, {
      enableTime: true,
      'time_24hr': true,
      dateFormat: 'y/m/d H:i',
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

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetClick(EditFormView.parseStateToRoutePoint(this._state));
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
    const offers = Array.from(evt.currentTarget.querySelectorAll('input:checked'), (el) => el.value);
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
