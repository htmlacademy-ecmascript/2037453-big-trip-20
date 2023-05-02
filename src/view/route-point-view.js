import {createElement} from '../render';
import {ICONS} from '../utils/icons';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);
function convertDuration(start, stop) {
  const gap = dayjs.duration(dayjs(stop) - dayjs(start), 'millisecond');
  let gapText = [];

  if(+gap.format('Y')) {
    gapText = [...gapText, gap.format('YY[y]')];
  }
  if(+gap.format('M')) {
    gapText = [...gapText, gap.format('MM[m]')];
  }
  if(+gap.format('D')) {
    gapText = [...gapText, gap.format('DD[d]')];
  }
  if(+gap.format('H')) {
    gapText = [...gapText, gap.format('HH[h]')];
  }
  if(+gap.format('m')) {
    gapText = [...gapText, gap.format('mm[m]')];
  }

  return gapText.join(' ');
}
function createOfferTemplate({title, price}) {
  return `<li class="event__offer">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </li>`;
}
function createRoutePointTemplate(routePoint) {
  const routePointDateText = dayjs(routePoint.dateStart).format('DD MMM');
  const dateTimeStart = dayjs(routePoint.dateStart).format('YYYY-MM-DD');
  const dateStartText = dayjs(routePoint.dateStart).format('HH:mm');
  const dateTimeStop = dayjs(routePoint.dateStop).format('YYYY-MM-DD');
  const dateStopText = dayjs(routePoint.dateStop).format('HH:mm');
  const durationText = convertDuration(routePoint.dateStart, routePoint.dateStop);
  const offersListMarkup = routePoint.offers.map((el) => createOfferTemplate(el));
  const routePointTotalPrice = routePoint.offers.reduce((acc, {price}) => acc + price, 0);
  return `<li class="trip-events__item">
            <div class="event">
                <time class="event__date" datetime="${dateTimeStart}">${routePointDateText}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="${ICONS[routePoint.type]}" alt="Event type icon">
                </div>
                <h3 class="event__title">${routePoint.type}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateTimeStart}T${dateStartText}">${dateStartText}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTimeStop}T${dateStopText}">${dateStopText}</time>
                  </p>
                  <p class="event__duration">${durationText}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${routePointTotalPrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">${offersListMarkup.join('')}</ul>
                <button class="event__favorite-btn${routePoint.isFavorite ? ' event__favorite-btn--active' : ''}" type="button">
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
  constructor({routePoint, offersList}) {
    const routePointOffers = offersList.offers.filter((el) => routePoint.offers.includes(el.id));
    this.#data = {...routePoint, offers: routePointOffers};
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
