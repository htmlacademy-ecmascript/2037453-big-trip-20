import AbstractView from '../framework/view/abstract-view';

function createEventsListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class RoutePointsListView extends AbstractView {

  constructor() {
    super();
  }

  get template() {
    return createEventsListTemplate();
  }
}
