import AbstractView from '../framework/view/abstract-view';
import {getOffersByType, totalPrice, tripInfoDateFormat} from '../helpers/utils';
import {MAX_DESTINATION_CHAIN_LENGTH} from '../helpers/const';

function createTripInfoTemplate(date, price, title) {
  return ` <section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${title.join('&nbsp;&mdash;&nbsp;')}</h1>

              <p class="trip-info__dates">${date}</p>
            </div>

          <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
            </p>
          </section>`;
}

export default class TripInfoView extends AbstractView {
  #date = null;
  #price = null;
  #title = null;

  constructor(routePoints, offers, destinations) {
    super();

    this.#title = routePoints.map(({destination}) => destinations.find(({id}) => id === destination).name);
    const count = this.#title.length;
    if (count > MAX_DESTINATION_CHAIN_LENGTH) {
      this.#title = [this.#title[0], '...', this.#title[count - 1]];
    }

    const dateStart = routePoints[0].dateStart;
    const dateStop = routePoints[count - 1].dateStop;
    this.#date = tripInfoDateFormat(dateStart, dateStop);

    const routePointsPrices = routePoints.map((routePoint) => {
      const type = routePoint.type;
      // @todo Переделать, на фиг, эту страшную функцию.
      const selfOffers = getOffersByType(offers, type)
        .filter((selfOffer) => routePoint.offers.some((activeOffer) => activeOffer === selfOffer.id));
      return {
        price: totalPrice(selfOffers, routePoint.price)
      };
    });

    this.#price = totalPrice(routePointsPrices);
  }

  get template() {
    return createTripInfoTemplate(this.#date, this.#price, this.#title);
  }
}
