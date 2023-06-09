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
  'Everything': (routePoints) => routePoints,
  'Future': (routePoints) => routePoints.filter(({dateStart}) => new Date(dateStart) > now),
  'Present': (routePoints) => routePoints.filter(({
    dateStart,
    dateStop
  }) => new Date(dateStart) <= now && new Date(dateStop) >= now),
  'Past': (routePoints) => routePoints.filter(({dateStop}) => new Date(dateStop) < now),
};
export const SORTS = {
  'Day': (routePoints) => routePoints.sort((prev, next) => dayjs(prev.dateStart).diff(dayjs(next.dateStart))),
  'Event': false,
  'Time': (routePoints) => routePoints.sort((prev, next) => {
    const prevDuration = dayjs(prev.dateStop).diff(dayjs(prev.dateStart));
    const nextDuration = dayjs(next.dateStop).diff(dayjs(next.dateStart));
    return prevDuration - nextDuration;
  }),
  'Price': (routePoints, offers) => routePoints.sort((prev, next) => {
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
  'Offers': false
};
export const UserAction = {
  ADD_ROUTE_POINT: 'ADD_ROUTE_POINT',
  UPDATE_ROUTE_POINT: 'UPDATE_ROUTE_POINT',
  DELETE_ROUTE_POINT: 'DELETE_ROUTE_POINT',
  SORT_ROUTE_POINTS: 'SORT_ROUTE_POINTS',
  FILTER_ROUTE_POINTS: 'FILTER_ROUTE_POINTS',
  SELECT_POINT: 'SELECT_POINT',
};
export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};
export const CURRENT_URL = window.location.href;

export const AUTORISATION = 'Basic 30816ecde53fcc40f0b93eb00148afe2';

export const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';
