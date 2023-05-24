import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {ICONS} from '../helpers/const';
import {dateTimeFormat} from '../helpers/utils';

function createOfferTemplate({id, title, price, routePoint}) {
  const value = title.toLowerCase();
  const isChecked = routePoint.offers.includes(id) ? 'checked' : '';
  return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${value}-${routePoint.id}" type="checkbox" name="event-offer-${value}" ${isChecked}>
            <label class="event__offer-label" for="event-offer-${value}-${routePoint.id}">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>`;
}

function createTypeTemplate({type, routePoint}) {
  const isChecked = routePoint.type === type ? 'checked' : '';
  const value = type.toLowerCase();
  return `<div class="event__type-item">
            <input id="event-type-${value}-${routePoint.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${value}" ${isChecked}>
            <label class="event__type-label  event__type-label--${value}" for="event-type-${value}-${routePoint.id}">${type}</label>
          </div>`;
}

function createEditFormTemplate(routePoint, allOffers, allDestinations) {
  const {id, dateStart, dateStop, type, destination} = routePoint;
  const {offers} = allOffers.find((el) => el.type === type);
  const {name, description, photos} = allDestinations.find((el) => el.id === destination);
  const eventTotalPrice = offers.reduce((acc, {price}) => acc + price, 0);
  const typesListMarkup = allOffers.map((el) => createTypeTemplate({...el, routePoint}));
  const eventOffersListMarkup = offers.map((el) => createOfferTemplate({...el, routePoint}));
  const eventPhotosListMarkup = photos.map((el) => (`<img class="event__photo" src="${el}" alt="Event photo">`));
  const destinationsListMarkup = allDestinations.map((el) => (`<option value="${el.name}">${el.name}</option>`));
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
                  <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${allDestinations[0].name}" list="destination-list-${id}">
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
                  <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${eventTotalPrice}">
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
                <section class="event__section  event__section--destination">
                  <h3 class="event__section-title  event__section-title--destination">${name}</h3>
                  <p class="event__destination-description">${description}</p>
                  <div class="event__photos-container">
                    <div class="event__photos-tape">${eventPhotosListMarkup.join('')}</div>
                  </div>                    
                </section>
              </section>
            </form>
          </li>`;
}

export default class EditFormView extends AbstractStatefulView {
  #routePoint = null;
  #offers = null;
  #destinations = null;
  #handleFormSubmit = null;
  #handleCloseClick = null;

  constructor({routePoint, offers, destinations, onFormSubmit, onCloseClick}) {
    super();
    this.#routePoint = {...routePoint};
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeClickHandler);
  }

  get template() {
    return createEditFormTemplate(this.#routePoint, this.#offers, this.#destinations);
  }

  _restoreHandlers() {
    super._restoreHandlers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#routePoint);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };
}
