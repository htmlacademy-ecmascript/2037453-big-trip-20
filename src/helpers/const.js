import dayjs from 'dayjs';
import {totalPrice} from './utils';

const now = new Date();
export const ICONS = {
  'Taxi': 'img/icons/taxi.png',
  'Bus': 'img/icons/bus.png',
  'Train': 'img/icons/train.png',
  'Ship': 'img/icons/ship.png',
  'Drive': 'img/icons/drive.png',
  'Flight': 'img/icons/flight.png',
  'Check-In': 'img/icons/check-in.png',
  'Sightseeing': 'img/icons/sightseeing.png',
  'Restaurant': 'img/icons/restaurant.png'
};

export const STUBS = {
  Everything: 'Click New Event to create your first point',
  Future: 'There are no past events now',
  Present: 'There are no present events now',
  Past: 'There are no future events now',
};

export const FILTERS = {
  Everything: (point) => point,
  Future: (point) => point.filter(({dateStart}) => new Date(dateStart) > now),
  Present: (point) => point.filter(({dateStart, dateStop}) => new Date(dateStart) <= now && new Date(dateStop) >= now),
  Past: (point) => point.filter(({dateStop}) => new Date(dateStop) < now),
};

export const SORTS = {
  Day: ({routePoints}) => routePoints,
  Event: false,
  Time: ({routePoints}) => routePoints.sort((prev, next) => {
    const _getMilliseconds = (date) => dayjs(date).valueOf();
    const prevTime = _getMilliseconds(prev.dateStart);
    const nextTime = _getMilliseconds(next.dateStart);
    return prevTime - nextTime;
  }),
  Price: ({routePoints, offers}) => routePoints.sort((prev, next) => {
    const _getOffers = (allOffers, routePoint) => {
      const filteredOffers = allOffers.find((offer) => offer.type === routePoint.type).offers;
      return filteredOffers.filter(({id}) => routePoint.offers.includes(id));
    };
    const prevOffers = _getOffers(offers, prev).filter(({id}) => prev.offers.includes(id));
    const nextOffers = _getOffers(offers, next).filter(({id}) => next.offers.includes(id));
    const prevPrice = totalPrice(prevOffers, prev.price);
    const nextPrice = totalPrice(nextOffers, next.price);
    return prevPrice - nextPrice;
  }),
  Offers: false
};

export const CURRENT_URL = window.location.href;
