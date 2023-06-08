import {render, remove, RenderPosition} from '../framework/render';
import EditFormView from '../view/edit-form-view';
import {UserAction, UpdateType} from '../helpers/const';

export default class CreateFormPresenter {
  #routeListContainer = null;
  #createFormComponent = null;
  #addRoutePointButton = null;
  #handleViewAction = null;

  constructor({routeListContainer, onViewAction}) {
    this.#routeListContainer = routeListContainer;
    this.#handleViewAction = onViewAction;
    this.#addRoutePointButton = document.querySelector('.trip-main__event-add-btn');
  }

  init(routePoint, offers, destinations) {
    this.#createFormComponent = new EditFormView({
      routePoint,
      offers,
      destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleCloseCreateForm
    });
    this.#addRoutePointButton.addEventListener('click', this.#handleOpenCreateForm);
  }

  destroy() {
    this.#handleCloseCreateForm();
  }

  #handleOpenCreateForm = (evt) => {
    evt.preventDefault();
    this.#addRoutePointButton.setAttribute('disabled', '');
    this.#createFormComponent._restoreHandlers();
    render(this.#createFormComponent, this.#routeListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escPressHandler);
    this.#handleViewAction(
      UserAction.SELECT_POINT,
      UpdateType.PATCH
    );
  };

  #handleCloseCreateForm = () => {
    this.#addRoutePointButton.removeAttribute('disabled');
    remove(this.#createFormComponent);
    document.removeEventListener('keydown', this.#escPressHandler);
    this.#handleViewAction(
      UserAction.SELECT_POINT,
      UpdateType.PATCH
    );
  };

  #handleFormSubmit = (routePoint) => {
    this.#handleCloseCreateForm();
    this.#handleViewAction(
      UserAction.ADD_ROUTE_POINT,
      UpdateType.MINOR,
      routePoint
    );
  };

  #escPressHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#handleCloseCreateForm();
    }
  };
}
