import {createElement} from '../render';

function createEventsListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class EventsListView {
  getElement() {
    return createElement(createEventsListTemplate());
  }
}
