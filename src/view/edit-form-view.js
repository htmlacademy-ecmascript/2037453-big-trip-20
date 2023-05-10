import AbstractView from '../framework/view/abstract-view';
import {ICONS} from '../helpers/const';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);
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
function createEditFormTemplate(routePoint, offers, destinations) {
  const dateStartText = dayjs(routePoint.dateStart).format('YY/MM/DD HH:mm');
  const dateStopText = dayjs(routePoint.dateStop).format('YY/MM/DD HH:mm');
  const offersList = offers.find((el) => el.type === routePoint.type);
  const eventDestination = destinations.find((el) => el.id === routePoint.destination);
  const eventTotalPrice = offersList.offers.reduce((acc, {price}) => acc + price, 0);
  const typesListMarkup = offers.map((el) => createTypeTemplate({...el, routePoint}));
  const eventOffersListMarkup = offersList.offers.map((el) => createOfferTemplate({...el, routePoint}));
  const eventPhotosListMarkup = eventDestination.photos.map((el) => (`<img class="event__photo" src="${el}" alt="Event photo">`));
  const destinationsListMarkup = destinations.map((el) => (`<option value="${el.name}">${el.name}</option>`));
  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-${routePoint.id}">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="${ICONS[routePoint.type]}" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${routePoint.id}" type="checkbox">
                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${typesListMarkup.join('')}
                    </fieldset>
                  </div>
                </div>
                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-${routePoint.id}">
                    ${routePoint.type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-${routePoint.id}" type="text" name="event-destination" value="${destinations[0].name}" list="destination-list-${routePoint.id}">
                  <datalist id="destination-list-${routePoint.id}">
                    ${destinationsListMarkup.join('')}
                  </datalist>
                </div>
                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-${routePoint.id}">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-${routePoint.id}" type="text" name="event-start-time" value="${dateStartText}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-${routePoint.id}">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-${routePoint.id}" type="text" name="event-end-time" value="${dateStopText}">
                </div>
                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-${routePoint.id}">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-${routePoint.id}" type="text" name="event-price" value="${eventTotalPrice}">
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
                  <h3 class="event__section-title  event__section-title--destination">${eventDestination.name}</h3>
                  <p class="event__destination-description">${eventDestination.description}</p>
                  <div class="event__photos-container">
                    <div class="event__photos-tape">${eventPhotosListMarkup.join('')}</div>
                  </div>                    
                </section>
              </section>
            </form>
          </li>`;
}
export default class EditFormView extends AbstractView {
  #routePoint = null;
  #offers = null;
  #destinations = null;
  constructor({routePoint, offersList, destination}) {
    super();
    this.#routePoint = {...routePoint};
    this.#offers = offersList;
    this.#destinations = destination;
  }

  get template() {
    return createEditFormTemplate(this.#routePoint, this.#offers, this.#destinations);
  }
}
