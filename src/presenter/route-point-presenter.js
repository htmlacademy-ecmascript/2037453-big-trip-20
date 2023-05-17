import {render, replace, remove} from '../framework/render';
import RoutePointView from '../view/route-point-view';
import EditFormView from '../view/edit-form-view';

export default class RoutePointPresenter {
  #routeListContainer = null;
  #routePointComponent = null;
  #editFormComponent = null;
  #routePoint = null;
  #handleDataChange = null;
  #handleRoutePointSelect = null;

  constructor({routeListContainer, onDataChange, onRoutePointSelect}) {
    this.#routeListContainer = routeListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleRoutePointSelect = onRoutePointSelect;
  }

  init(routePoint, offers, destinations) {
    const prevRoutePointComponent = this.#routePointComponent;
    const prevEditFormComponent = this.#editFormComponent;
    const offersList = offers.find((el) => el.type === routePoint.type);
    this.#routePoint = routePoint;
    this.#routePointComponent = new RoutePointView({
      routePoint,
      offersList,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });
    this.#editFormComponent = new EditFormView({
      routePoint,
      offers,
      destinations,
      onFormSubmit: this.#handleFormSubmit,
      onCloseClick: this.#handlerCloseClick,
    });

    if ((prevRoutePointComponent, prevEditFormComponent) === null) {
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

  unSelect() {
    this.#handlerCloseClick();
  }

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escPressHandler);
    this.#handleRoutePointSelect(this.#routePoint.id);
  }

  #replaceFormToPoint() {
    replace(this.#routePointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escPressHandler);
    this.#handleRoutePointSelect(this.#routePoint.id);
  }

  #escPressHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
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

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#routePoint, isFavorite: !this.#routePoint.isFavorite});
  };
}
