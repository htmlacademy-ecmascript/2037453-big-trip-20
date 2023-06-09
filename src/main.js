import ContentPresenter from './presenter/content-presenter';

const filterContainer = document.querySelector('.trip-controls__filters');
const contentContainer = document.querySelector('.trip-events');
const contentPresenter = new ContentPresenter({filterContainer, contentContainer});
contentPresenter.init();
