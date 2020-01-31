import API from './api.js';
import PageController from './controllers/page.js';
import FilterController from './controllers/filter.js';
import StatisticsController from './controllers/statistics.js';
import ProfileComponent from './components/profile.js';
import MenuComponent from './components/menu.js';
import FilmsModel from './models/movies.js';
import {render, RenderPosition} from './util.js';
import {getWatchedMovies} from './utils/statistics.js';
import {PageMode} from './const.js';

const AUTHORIZATION = `Basic 6Idsiz23kTy9g17`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);


const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();

const pageController = new PageController(mainElement, filmsModel, api);

const menuComponent = new MenuComponent();
const filterController = new FilterController(mainElement, filmsModel, menuComponent);
const statisticsController = new StatisticsController(mainElement, filmsModel);

// вставка данных пользователя в шапку
const renderProfileUser = (allMovies) => {
  const watchedMovies = getWatchedMovies(allMovies);
  const countMovies = watchedMovies.length;

  if (countMovies === 0) {
    return;
  }

  render(headerElement, new ProfileComponent(watchedMovies).getElement(), RenderPosition.BEFOREEND);
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

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
    renderProfileUser(films);
    filterController.render();
    pageController.render();

    statisticsController.render();
  });




