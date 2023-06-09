import ContentPresenter from './presenter/content-presenter';
import RoutePointsApiService from './route-points-api-service';
import OffersModel from './models/offers-model';
import DestinationsModel from './models/destinations-model';
import RoutePointsModel from './models/route-points-model';
import {AUTORISATION, END_POINT} from './helpers/const';

const filterContainer = document.querySelector('.trip-controls__filters');
const contentContainer = document.querySelector('.trip-events');

const routePointsApiService = new RoutePointsApiService(END_POINT, AUTORISATION);
const offersModel = new OffersModel(routePointsApiService);
const destinationsModel = new DestinationsModel(routePointsApiService);
const routePointsModel = new RoutePointsModel({
  service: routePointsApiService,
  offersModel,
  destinationsModel
});

const contentPresenter = new ContentPresenter({
  filterContainer,
  contentContainer,
  routePointsModel,
  offersModel,
  destinationsModel
});
contentPresenter.init();
