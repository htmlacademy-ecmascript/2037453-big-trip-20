import {render, remove, RenderPosition} from '../framework/render';
import AddButtonView from '../view/add-button-view';
import EditFormView from '../view/edit-form-view';
import {UserAction, UpdateType} from '../helpers/const';

export default class CreateFormPresenter {
  #tripInfoContainer = null;
  #routeListContainer = null;

  #addButtonComponent = null;
  #createFormComponent = null;

  #offers = null;
  #destinations = null;

  #handleViewAction = null;

  constructor({tripInfoContainer, routeListContainer, onViewAction}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#routeListContainer = routeListContainer;
    this.#handleViewAction = onViewAction;
  }

  init(offers, destinations) {
    this.#offers = offers;
    this.#destinations = destinations;
    this.#addButtonComponent = new AddButtonView({onAddClick: this.#handleOpenCreateForm});
    render(this.#addButtonComponent, this.#tripInfoContainer);
  }

  destroy() {
    remove(this.#addButtonComponent);
    this.#handleCloseCreateForm();
  }

  setSaving() {
    this.#createFormComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  #handleOpenCreateForm = () => {
    this.#createFormComponent = new EditFormView({
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleCloseCreateForm
    });
    this.#addButtonComponent.updateElement({
      isDisabled: true
    });
    this.#createFormComponent.updateElement({
      isNewPoint: true
    });
    this.#createFormComponent._restoreHandlers();
    render(this.#createFormComponent, this.#routeListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escPressHandler);
  };

  #handleCloseCreateForm = () => {
    this.#addButtonComponent.updateElement({
      isDisabled: false
    });
    remove(this.#createFormComponent);
    document.removeEventListener('keydown', this.#escPressHandler);
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
