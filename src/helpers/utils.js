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
const totalPrice = (offers) => offers.reduce((acc, {price}) => acc + price, 0);

export {routeDateFormat, dateFormat, timeFormat, dateTimeFormat, durationFormat, dateISOFormat, totalPrice};
