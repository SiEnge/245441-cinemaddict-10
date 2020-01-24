// import {getRandomIntegerNumber} from './util.js';

// import {createCommentTemplate} from './components/comment.js';

import {generateFilms} from './mock/film.js';
import {generateProfile} from './mock/profile.js';
// import {generateComments} from './mock/comment.js';
// import {countFilmsFilter} from './mock/menu.js';

import ProfileComponent from './components/profile.js';
import MenuComponent from './components/menu.js';
import StatisticsComponent from './components/statistics.js';
// import PopupContainerComponent from './components/popup-container.js';
import PageController from './controllers/page.js';

import FilterController from './controllers/filter.js';

import FilmsModel from './models/movies.js';

import {render, RenderPosition} from './util.js';
import {PageMode} from './const.js';

const FILM_COUNT = 17;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);

// 1. вставка в шапку "Звание пользователя"
const watchedMovies = generateProfile();
render(headerElement, new ProfileComponent(watchedMovies).getElement(), RenderPosition.BEFOREEND);

// 2. Меню, где кнопка Stat и фильтры для фильмов
const menuComponent = new MenuComponent();

const films = generateFilms(FILM_COUNT);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const pageController = new PageController(mainElement, filmsModel);
const statisticsComponent = new StatisticsComponent();

const filterController = new FilterController(mainElement, filmsModel, menuComponent);

filterController.render();

pageController.render();
render(mainElement, statisticsComponent.getElement(), RenderPosition.BEFOREEND);

statisticsComponent.hide();

// 9. вставка количества фильмов
const footerStatistics = footerElement.querySelector(`.footer__statistics`);
footerStatistics.querySelector(`p`).textContent = `${FILM_COUNT} movies inside`;

// вставка количества фильма - переработать и убрать из main обращение к dom


menuComponent.setStatisticsClickHandler((mode) => {
  switch (mode) {
    case PageMode.STAT:
      pageController.hide();
      statisticsComponent.show();
      break;
    case PageMode.MOVIE:
      pageController.show();
      statisticsComponent.hide();
      break;
  }
});
