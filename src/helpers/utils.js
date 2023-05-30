import dayjs from 'dayjs';

const routeDateFormat = (date) => dayjs(date).format('DD MMM');
const dateFormat = (date) => dayjs(date).format('YYYY-MM-DD');
const timeFormat = (date) => dayjs(date).format('HH:mm');
const dateISOFormat = (date) => dayjs(date).toISOString();
const dateTimeFormat = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');
const durationFormat = (start, stop) => {
  const gap = dayjs(stop).diff(dayjs(start));
  let gapFormat = 'mm[m]';
  if (gap >= 3600000) {
    gapFormat = 'HH[h] mm[m]';
  }
  if (gap >= 86400000) {
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

const getFirstType = (offersList) => Object.values(offersList)[0].type;

export {
  routeDateFormat,
  dateFormat,
  timeFormat,
  dateTimeFormat,
  durationFormat,
  dateISOFormat,
  totalPrice,
  getOffersByType,
  getDestinationById,
  getDestinationByName,
  getFirstType
};
