import API from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import PageController from './controllers/page.js';
import FilterController from './controllers/filter.js';
import StatisticsController from './controllers/statistics.js';
import ProfileComponent from './components/profile.js';
import MenuComponent from './components/menu.js';
import MoviesModel from './models/movies.js';
import {render, RenderPosition} from './utils/render.js';
import {getWatchedMovies} from './utils/common.js';
import {PageMode} from './const.js';

const AUTHORIZATION = `Basic 6Idsiz23kTy9g17`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);


window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

const renderProfileUser = (allMovies) => {
  const watchedMovies = getWatchedMovies(allMovies);
  const countMovies = watchedMovies.length;

  if (countMovies === 0) {
    return;
  }

  render(headerElement, new ProfileComponent(watchedMovies).getElement(), RenderPosition.BEFOREEND);
};

const renderCountAllMoviesFooter = (countMovies) => {
  const footerStatistics = footerElement.querySelector(`.footer__statistics`);
  footerStatistics.querySelector(`p`).textContent = `${countMovies} movies inside`;
};

const togglePageMode = (mode) => {
  switch (mode) {
    case PageMode.STAT:
      pageController.hide();
      statisticsController.show();
      break;
    case PageMode.MOVIE:
      pageController.show();
      statisticsController.hide();
      break;
  }
};

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(window.localStorage);
const apiWithProvider = new Provider(api, store);

const moviesModel = new MoviesModel();
const pageController = new PageController(mainElement, moviesModel, apiWithProvider);
const menuComponent = new MenuComponent();
const filterController = new FilterController(mainElement, moviesModel, menuComponent, togglePageMode);
const statisticsController = new StatisticsController(mainElement, moviesModel);

filterController.render();
pageController.renderLoading();

menuComponent.setStatisticsClickHandler(togglePageMode);

renderCountAllMoviesFooter(0);

apiWithProvider.getMovies()
.then((movies) => {
  moviesModel.setMovies(movies);
  renderProfileUser(movies);
  filterController.render();
  pageController.render();
  renderCountAllMoviesFooter(movies.length);

  statisticsController.render();
});


window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
