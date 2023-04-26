import SortPresenter from './presenter/sort-presenter';
import EventsListPresenter from './presenter/events-list-presenter';

const container = document.querySelector('.trip-events');
const sortPresenter = new SortPresenter({container});
sortPresenter.init();
const eventsListPresenter = new EventsListPresenter({container});
eventsListPresenter.init();

