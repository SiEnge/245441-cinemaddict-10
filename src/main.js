import {getRandomIntegerNumber} from './util.js';
import {createProfileTemplate} from './components/profile.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sort.js';
import {createFilmsContainerTemplate, createExtraFilmsTemplate} from './components/film-container.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createPopupTemplate} from './components/popup.js';
import {createCommentTemplate} from './components/comment.js';
import {generateFilms} from './mock/film-card.js';
import {generateProfile} from './mock/profile.js';
import {generateComments} from './mock/comment.js';
import {countFilmsFilter} from './mock/menu.js';

const FILM_COUNT = 17;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

const COMMENT_COUNT = getRandomIntegerNumber(0, 10);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);

// функция вставки компонента на страницу
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// 1. вставка в шапку "Звание пользователя"
const profile = generateProfile();
render(headerElement, createProfileTemplate(profile), `beforeend`);

const films = generateFilms(FILM_COUNT);
const filter = countFilmsFilter(films);

// 2. вставка в тело "Меню"
render(mainElement, createMenuTemplate(filter), `beforeend`);

// 3. вставка в тело "Сортировка"
render(mainElement, createSortTemplate(), `beforeend`);

// 4. вставка в тело "Контейнер для карточек фильма"
render(mainElement, createFilmsContainerTemplate(), `beforeend`);

// 5. вставка "Карточки фильма"
const filmContainerElement = mainElement.querySelector(`.films-list__container`);

let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

films.slice(0, showingFilmsCount).forEach((film) => render(filmContainerElement, createFilmCardTemplate(film), `beforeend`));

const filmsElement = mainElement.querySelector(`.films`);

const extraTopRatedFilms = films.slice()
  .sort((a, b) => b.rating - a.rating)
  .filter((film) => film.rating !== 0)
  .slice(0, 2);

const extraMostCommentedFilms = films.slice()
  .sort((a, b) => b.comments - a.comments)
  .filter((film) => film.comments !== 0)
  .slice(0, 2);

render(filmsElement, createExtraFilmsTemplate(extraTopRatedFilms, `Top rated`), `beforeend`);
render(filmsElement, createExtraFilmsTemplate(extraMostCommentedFilms, `Most commented`), `beforeend`);

// 6. вставка "Кнопки Показать еще"
const filmElement = mainElement.querySelector(`.films-list`);
render(filmElement, createShowMoreButtonTemplate(), `beforeend`);

const loadShowMoreButton = filmElement.querySelector(`.films-list__show-more`);
// вешаем обработчики на кнопку
// обработка клика на кнопке загрузить еще
loadShowMoreButton.addEventListener(`click`, () => {
  // записать в константу сколько было показано задач (=8)
  const prevFilmsCount = showingFilmsCount;
  // вычислить последний индекс карточки для показа (=16), чтобы применить в slice
  showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  // исходный массив с задачами скопировать (=slice) в количестве с 8 по 16
  films.slice(prevFilmsCount, showingFilmsCount)
    .forEach((film) => render(filmContainerElement, createFilmCardTemplate(film), `beforeend`));

  // если показыны все задачи - то удалить кнопку
  if (showingFilmsCount >= films.length) {
    loadShowMoreButton.remove();
  }
});
// 7. вставка в тело "Попап"

// render(footerElement, createPopupTemplate(films[0]), `afterend`);

// 8. вставка Комментарий
// const comments = generateComments(COMMENT_COUNT);
// const popupElement = document.querySelector(`.film-details`);
// render(popupElement.querySelector(`.form-details__top-container`), createCommentTemplate(comments), `afterend`);

// 9. вставка количества фильмов
const footerStatistics = footerElement.querySelector(`.footer__statistics`);
footerStatistics.querySelector(`p`).textContent = `${FILM_COUNT} movies inside`
