import {render, remove, RenderPosition} from '../framework/render';
import AddButtonView from '../view/add-button-view';
import EditFormView from '../view/edit-form-view';
import {UserAction, UpdateType} from '../helpers/const';

export default class CreateFormPresenter {
  #tripInfoContainer = null;
  #routeListContainer = null;
  #addButtonComponent = null;
  #createFormComponent = null;
  #handleViewAction = null;

  constructor({tripInfoContainer, routeListContainer, onViewAction}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#routeListContainer = routeListContainer;
    this.#handleViewAction = onViewAction;
  }

  init(routePoint, offers, destinations) {
    this.#addButtonComponent = new AddButtonView();
    render(this.#addButtonComponent, this.#tripInfoContainer);
    this.#addButtonComponent.element.addEventListener('click', this.#handleOpenCreateForm);
    this.#createFormComponent = new EditFormView({
      routePoint,
      offers,
      destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleCloseCreateForm
    });
  }

  destroy() {
    remove(this.#addButtonComponent);
    this.#handleCloseCreateForm();
  }

  #handleOpenCreateForm = (evt) => {
    evt.preventDefault();
    this.#addButtonComponent.element.setAttribute('disabled', '');
    this.#createFormComponent._restoreHandlers();
    render(this.#createFormComponent, this.#routeListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escPressHandler);
    this.#handleViewAction(
      UserAction.SELECT_POINT,
      UpdateType.PATCH
    );
  };

  #handleCloseCreateForm = () => {
    this.#addButtonComponent.element.removeAttribute('disabled');
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
      UpdateType.MAJOR,
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
