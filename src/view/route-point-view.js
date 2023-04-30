import {createElement} from '../render';
import {ICONS} from '../utils/icons';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

function createRoutePointTemplate(event) {
  const eventDateText = dayjs(event.dateStart).format('D MMM');
  const dateTimeStart = dayjs(event.dateStart).format('YYYY-MM-DD');
  const dateStartText = dayjs(event.dateStart).format('HH:mm');
  const dateTimeStop = dayjs(event.dateStop).format('YYYY-MM-DD');
  const dateStopText = dayjs(event.dateStop).format('HH:mm');
  const durationText = dayjs.duration(dayjs(event.dateStop) - dayjs(event.dateStart), 'millisecond').humanize();
  const offersList = event.offers.map(({title, price}) => (`<li class="event__offer">
<span class="event__offer-title">${title}</span>
&plus;&euro;&nbsp;
<span class="event__offer-price">${price}</span>
</li>`));
  const eventTotalPrice = event.offers.reduce((acc, {price}) => acc + price, 0);

  return `<li class="trip-events__item">
            <div class="event">
                <time class="event__date" datetime="${dateTimeStart}">${eventDateText}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="${ICONS[event.type]}" alt="Event type icon">
                </div>
                <h3 class="event__title">${event.type}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateTimeStart}">${dateStartText}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTimeStop}">${dateStopText}</time>
                  </p>
                  <p class="event__duration">${durationText}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${eventTotalPrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">${offersList.join('')}</ul>
                <button class="event__favorite-btn${event.isFavorite ? ' event__favorite-btn--active' : ''}" type="button">
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

export default class RoutePointView {
  #data = null;

  constructor({event, offersList}) {
    const eventOffers = offersList.offers.filter((el) => event.offers.includes(el.id));
    this.#data = {...event, offers: eventOffers};
  }

  getTemplate() {
    return createRoutePointTemplate(this.#data);
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
