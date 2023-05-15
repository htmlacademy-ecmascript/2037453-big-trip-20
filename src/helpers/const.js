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

export const CURRENT_URL = window.location.href;
