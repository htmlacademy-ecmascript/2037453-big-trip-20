import {render, replace} from '../framework/render';
import RoutePointView from '../view/route-point-view';
import EditFormView from '../view/edit-form-view';

export default class RoutePointPresenter {
  #routeListContainer = null;
  #routePointComponent = null;
  #editFormComponent = null;
  #routePoint = null;

  constructor({routeListContainer}) {
    this.#routeListContainer = routeListContainer;
  }

  init(routePoint, offersList, offers, destinations) {
    this.#routePoint = routePoint;
    this.#routePointComponent = new RoutePointView({
      routePoint,
      offersList,
      onEditClick: this.#handleEditClick
    });
    this.#editFormComponent = new EditFormView({
      routePoint,
      offers,
      destinations,
      onEditClick: this.#handleFormSubmit,
      onCloseClick: this.#handlerCloseClick,
    });

    render(this.#routePointComponent, this.#routeListContainer);
  }

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escPressHandler);
  }

  #replaceFormToPoint() {
    replace(this.#routePointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escPressHandler);
  }

  #escPressHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escPressHandler);
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };

  #handlerCloseClick = () => {
    this.#replaceFormToPoint();
  };
}
