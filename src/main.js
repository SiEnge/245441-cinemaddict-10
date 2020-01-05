// import {getRandomIntegerNumber} from './util.js';

// import {createCommentTemplate} from './components/comment.js';

import {generateFilms} from './mock/film.js';
import {generateProfile} from './mock/profile.js';
// import {generateComments} from './mock/comment.js';
import {countFilmsFilter} from './mock/menu.js';

import ProfileComponent from './components/profile.js';
import MenuComponent from './components/menu.js';
import SortComponent from './components/sort.js';
import FilmsContainerComponent from './components/films-container.js';

import ContainerController from './controllers/page.js';


import {render, RenderPosition} from './util.js';

const FILM_COUNT = 17;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);

// 1. вставка в шапку "Звание пользователя"
const watchedMovies = generateProfile();
render(headerElement, new ProfileComponent(watchedMovies).getElement(), RenderPosition.BEFOREEND);

const films = generateFilms(FILM_COUNT);
const filter = countFilmsFilter(films);

// 2. вставка в тело "Меню"
render(mainElement, new MenuComponent(filter).getElement(), RenderPosition.BEFOREEND);

// 3. вставка в тело "Сортировка"
render(mainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

// 4. вставка в тело "Контейнер для карточек фильма"

// все фильмы
const filmsContainer = new FilmsContainerComponent();
render(mainElement, filmsContainer.getElement(), RenderPosition.BEFOREEND);


const containerController = new ContainerController(filmsContainer);
containerController.render(films);

// 8. вставка Комментарий
// const comments = generateComments(COMMENT_COUNT);
// const popupElement = document.querySelector(`.film-details`);
// render2(popupElement.querySelector(`.form-details__top-container`), createCommentTemplate(comments), `afterend`);

// 9. вставка количества фильмов
const footerStatistics = footerElement.querySelector(`.footer__statistics`);
footerStatistics.querySelector(`p`).textContent = `${FILM_COUNT} movies inside`;
