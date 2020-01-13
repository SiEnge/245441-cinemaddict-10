// import {getRandomIntegerNumber} from './util.js';

// import {createCommentTemplate} from './components/comment.js';

import {generateFilms} from './mock/film.js';
import {generateProfile} from './mock/profile.js';
// import {generateComments} from './mock/comment.js';
// import {countFilmsFilter} from './mock/menu.js';

import ProfileComponent from './components/profile.js';
import PageController from './controllers/page.js';

import FilmsModel from './models/movies.js';

import {render, RenderPosition} from './util.js';

const FILM_COUNT = 17;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);

// 1. вставка в шапку "Звание пользователя"
const watchedMovies = generateProfile();
render(headerElement, new ProfileComponent(watchedMovies).getElement(), RenderPosition.BEFOREEND);

const films = generateFilms(FILM_COUNT);

const filmsModel = new FilmsModel();
// debugger;
filmsModel.setFilms(films);

const pageController = new PageController(mainElement, filmsModel);
pageController.render();

// 8. вставка Комментарий
// const comments = generateComments(COMMENT_COUNT);
// const popupElement = document.querySelector(`.film-details`);
// render2(popupElement.querySelector(`.form-details__top-container`), createCommentTemplate(comments), `afterend`);

// 9. вставка количества фильмов
const footerStatistics = footerElement.querySelector(`.footer__statistics`);
footerStatistics.querySelector(`p`).textContent = `${FILM_COUNT} movies inside`;

// вставка количества фильма - переработать и убрать из main обращение к dom
