// import {getRandomIntegerNumber} from './util.js';

// import {createCommentTemplate} from './components/comment.js';

import {generateFilms} from './mock/film.js';
import {generateProfile} from './mock/profile.js';
// import {generateComments} from './mock/comment.js';
// import {countFilmsFilter} from './mock/menu.js';

import ProfileComponent from './components/profile.js';
// import MenuComponent from './components/menu.js';
import StatisticsComponent from './components/statistics.js';
// import PopupContainerComponent from './components/popup-container.js';
import PageController from './controllers/page.js';

import FilterController from './controllers/filter.js';

import FilmsModel from './models/movies.js';

import {render, RenderPosition} from './util.js';
// import {PageMode} from './const.js';

const FILM_COUNT = 17;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);

// 1. вставка в шапку "Звание пользователя"
const watchedMovies = generateProfile();
render(headerElement, new ProfileComponent(watchedMovies).getElement(), RenderPosition.BEFOREEND);

// 2. Меню, где кнопка Stat и фильтры для фильмов
// const menuComponent = new MenuComponent();
// render(mainElement, menuComponent.getElement(), RenderPosition.BEFOREEND);

const films = generateFilms(FILM_COUNT);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const pageController = new PageController(mainElement, filmsModel);
const statisticsComponent = new StatisticsComponent();

// debugger;
const filterController = new FilterController(mainElement, filmsModel, pageController, statisticsComponent);

filterController.render();


// const menuComponent = new MenuComponent();
// render(filterController, menuComponent.getElement(), RenderPosition.BEFOREEND);
pageController.render();

render(mainElement, statisticsComponent.getElement(), RenderPosition.BEFOREEND);

statisticsComponent.hide();

// 9. вставка количества фильмов
const footerStatistics = footerElement.querySelector(`.footer__statistics`);
footerStatistics.querySelector(`p`).textContent = `${FILM_COUNT} movies inside`;

// вставка количества фильма - переработать и убрать из main обращение к dom


// Теперь, когда в main.js есть все необходимые компоненты — и меню,
// статистика, и список фильмов — реализуйте логику переключения при выборе соотвествующего пункта меню.
