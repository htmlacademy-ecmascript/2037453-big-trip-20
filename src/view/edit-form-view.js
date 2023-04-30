import {createElement} from '../render';
import {ICONS} from '../utils/icons';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);


function createEditFormTemplate(event, offers, destinations) {
  const dateStartText = dayjs(event.dateStart).format('YY/MM/DD HH:mm');
  const dateStopText = dayjs(event.dateStop).format('YY/MM/DD HH:mm');
  const offersList = offers.find((el) => el.type === event.type);
  const eventOffersList = offersList.offers.map(({id, title, price}) => {
    const value = title.toLowerCase();
    const isChecked = event.offers.includes(id) ? 'checked' : '';
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${value}-1" type="checkbox"
             name="event-offer-${value}" ${isChecked}>
        <label class="event__offer-label" for="event-offer-${value}-1">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
    </div>`;
  });
  const eventDestination = destinations.find((el) => el.id === event.destination);
  const eventPhotosList = eventDestination.photos.map((el) => (`<img class="event__photo" src="${el}" alt="Event photo">`));
  const eventTotalPrice = offersList.offers.reduce((acc, {price}) => acc + price, 0);
  const typesList = offers.map((el) => {
    const isChecked = event.type === el.type ? 'checked' : '';
    const value = el.type.toLowerCase();
    return `<div class="event__type-item">
<input id="event-type-${value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${value}" ${isChecked}>
<label class="event__type-label  event__type-label--${value}" for="event-type-${value}-1">${el.type}</label>
</div>`;
  });
  const destinationsList = destinations.map((el) => (`<option value="${el.name}">${el.name}</option>`));

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="${ICONS[event.type]}" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${typesList.join('')}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${event.type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations[0].name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${destinationsList.join('')}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStartText}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateStopText}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${eventTotalPrice}">
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
                    ${eventOffersList.join('')}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">${eventDestination.name}</h3>
                    <p class="event__destination-description">${eventDestination.description}</p>
                    <div class="event__photos-container">
                      <div class="event__photos-tape">${eventPhotosList.join('')}</div>
                    </div>                    
                  </section>
                </section>
              </form>
            </li>`;
}

export default class EditFormView {
  #data = null;
  #offers = null;
  #destinations = null;

  constructor({event, offersList, destination}) {
    this.#data = {...event};
    this.#offers = offersList;
    this.#destinations = destination;
  }

  getTemplate() {
    return createEditFormTemplate(this.#data, this.#offers, this.#destinations);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
