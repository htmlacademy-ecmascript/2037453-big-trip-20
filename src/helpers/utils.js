import dayjs from 'dayjs';
import {TIME_GAP} from './const';

const routeDateFormat = (date) => dayjs(date).format('DD MMM');
const dateFormat = (date) => dayjs(date).format('YYYY-MM-DD');
const timeFormat = (date) => dayjs(date).format('HH:mm');
const dateISOFormat = (date) => dayjs(date).toISOString();
const dateTimeFormat = (date) => dayjs(date).format('YY/MM/DD HH:mm');
const tripInfoDateFormat = (start, stop) => {
  if (dayjs(start).format('MMM') === dayjs(stop).format('MMM')) {
    if (dayjs(start).format('DD') === dayjs(stop).format('DD')) {
      return dayjs(stop).format('DD MMM');
    } else {
      return `${dayjs(start).format('DD')} — ${dayjs(stop).format('DD MMM')}`;
    }
  }
  return `${dayjs(start).format('DD MMM')} — ${dayjs(stop).format('DD MMM')}`;
};
const durationFormat = (start, stop) => {
  const gap = dayjs(stop).diff(dayjs(start));
  let gapFormat = 'mm[m]';
  if (gap >= TIME_GAP.HOUR) {
    gapFormat = 'HH[h] mm[m]';
  }
  if (gap >= TIME_GAP.DAY) {
    gapFormat = 'DD[d] HH[h] mm[m]';
  }
  return dayjs(gap).format(gapFormat);
};
const totalPrice = (offers = [], base = 0) => offers.reduce((acc, {price}) => +acc + price, base);
const getOffersByType = (offersList = [], offerType = '') => {
  const {offers} = offersList.find((offer) => offer.type === offerType);
  return offers;
};
const getDestinationById = (destinationsList = [], destinationId = 0) => destinationsList.find((destination) => destination.id === destinationId);
const getDestinationByName = (destinationsList = [], destinationName = '') => destinationsList.find((destination) => destination.name === destinationName);
export {
  routeDateFormat,
  dateFormat,
  timeFormat,
  dateTimeFormat,
  tripInfoDateFormat,
  durationFormat,
  dateISOFormat,
  totalPrice,
  getOffersByType,
  getDestinationById,
  getDestinationByName
};
