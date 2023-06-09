import {render, replace, remove} from '../framework/render';
import RoutePointView from '../view/route-point-view';
import EditFormView from '../view/edit-form-view';
import {getOffersByType} from '../helpers/utils';
import {UserAction, UpdateType, Mode} from '../helpers/const';

export default class RoutePointPresenter {
  #routeListContainer = null;

  #routePointComponent = null;
  #editFormComponent = null;

  #routePoint = null;

  #handleViewAction = null;

  #mode = Mode.DEFAULT;

  constructor({routeListContainer, onViewAction}) {
    this.#routeListContainer = routeListContainer;
    this.#handleViewAction = onViewAction;
  }

  init(routePoint, offers, destinations) {
    const prevRoutePointComponent = this.#routePointComponent;
    const prevEditFormComponent = this.#editFormComponent;
    const offersList = getOffersByType(offers, routePoint.type);
    this.#routePoint = routePoint;
    this.#editFormComponent = new EditFormView({
      routePoint,
      offers,
      destinations,
      onFormSubmit: this.#handleFormSubmit,
      onResetClick: this.#handleDeleteClick,
      onCloseClick: this.#handlerCloseClick,
    });
    this.#routePointComponent = new RoutePointView({
      routePoint,
      offersList,
      destinations,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });
    if (prevRoutePointComponent === null) {
      render(this.#routePointComponent, this.#routeListContainer);
      return;
    }
    if (this.#routeListContainer.contains(prevRoutePointComponent.element)) {
      replace(this.#routePointComponent, prevRoutePointComponent);
    }
    if (this.#routeListContainer.contains(prevEditFormComponent.element)) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }
    remove(prevRoutePointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#routePointComponent);
    remove(this.#editFormComponent);
  }

  reset() {
    this.#replaceFormToPoint();
  }

  setSaving() {
    if (this.#mode === Mode.EDIT) {
      this.#editFormComponent.updateElement({
        isSaving: true,
      });
    }

    this.#editFormComponent.updateElement({
      isDisabled: true,
    });
  }

  setDeleting() {
    this.#editFormComponent.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    if (this.#mode === Mode.DEFAULT) {
      this.#routePointComponent.shake(resetFormState);
      return;
    }

    this.#editFormComponent.shake(resetFormState);
  }

  #replacePointToForm() {
    this.#mode = Mode.EDIT;
    replace(this.#editFormComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escPressHandler);
    this.#handleViewAction(
      UserAction.SELECT_POINT,
      UpdateType.PATCH,
      this.#routePoint
    );
  }

  #replaceFormToPoint() {
    this.#mode = Mode.DEFAULT;
    this.#editFormComponent.reset(this.#routePoint);
    replace(this.#routePointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escPressHandler);
    this.#handleViewAction(
      UserAction.SELECT_POINT,
      UpdateType.PATCH,
      this.#routePoint
    );
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handlerCloseClick = () => {
    this.#replaceFormToPoint();
  };

  #escPressHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleFavoriteClick = () => {
    this.#handleViewAction(
      UserAction.UPDATE_ROUTE_POINT,
      UpdateType.PATCH,
      {...this.#routePoint, isFavorite: !this.#routePoint.isFavorite}
    );
  };

  #handleFormSubmit = (routePoint) => {
    this.#handleViewAction(
      UserAction.UPDATE_ROUTE_POINT,
      UpdateType.MINOR,
      routePoint
    );
  };

  #handleDeleteClick = (routePoint) => {
    this.#handleViewAction(
      UserAction.DELETE_ROUTE_POINT,
      UpdateType.MINOR,
      routePoint
    );
  };
}
