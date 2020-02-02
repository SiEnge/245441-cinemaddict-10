import API from './api/index.js';
import Store from './api/store.js';
import StoreComments from './api/store-comments.js';
import Provider from './api/provider.js';
import PageController from './controllers/page.js';
import FilterController from './controllers/filter.js';
import StatisticsController from './controllers/statistics.js';
import ProfileComponent from './components/profile.js';
import MenuComponent from './components/menu.js';
import FilmsModel from './models/movies.js';
import {render, RenderPosition} from './utils/render.js';
import {getWatchedMovies} from './utils/common.js';
import {PageMode} from './const.js';


const AUTHORIZATION = `Basic 6Idsiz23kTy9g17`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;


window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
    });
});

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

debugger;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(window.localStorage);
// const storeComments = new StoreComments(STORE_COMMENTS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();

const pageController = new PageController(mainElement, filmsModel, apiWithProvider);

const menuComponent = new MenuComponent();
const filterController = new FilterController(mainElement, filmsModel, menuComponent);
const statisticsController = new StatisticsController(mainElement, filmsModel);

filterController.render();
pageController.renderLoading();


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

menuComponent.setStatisticsClickHandler((mode) => {
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
});


renderCountAllMoviesFooter(0);

apiWithProvider.getFilms()
.then((films) => {
  filmsModel.setFilms(films);
  renderProfileUser(films);
  filterController.render();
  pageController.render();
  renderCountAllMoviesFooter(films.length);

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
