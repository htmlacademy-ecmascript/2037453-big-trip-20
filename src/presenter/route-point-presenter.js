import {render, replace, remove} from '../framework/render';
import RoutePointView from '../view/route-point-view';
import EditFormView from '../view/edit-form-view';
import {getOffersByType} from '../helpers/utils';
import {UserAction, UpdateType} from '../helpers/const';
export default class RoutePointPresenter {
  #routeListContainer = null;
  #routePointComponent = null;
  #editFormComponent = null;
  #routePoint = null;
  #handleViewAction = null;
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
      onDeleteClick: this.#handleDeleteClick,
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

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escPressHandler);
    this.#handleViewAction(
      UserAction.SELECT_POINT,
      UpdateType.PATCH,
      this.#routePoint
    );
  }

  #replaceFormToPoint() {
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
    this.#replaceFormToPoint();
  };

  #handleDeleteClick = (routePoint) => {
    this.#handleViewAction(
      UserAction.DELETE_ROUTE_POINT,
      UpdateType.MINOR,
      routePoint
    );
  };
}
