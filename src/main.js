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
import FilmListComponent from './components/film-list.js';
import NoFilmsListComponent from './components/film-list-no-data.js';
import FilmListExtraComponent from './components/film-list-extra.js';
import FilmComponent from './components/film.js';
import PopupComponent from './components/popup.js';
import ShowMoreButtonComponent from './components/show-more-button.js';

import {render, RenderPosition} from './util.js';

const FILM_COUNT = 17;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

// функция переключение с карточки и обратно
const renderFilm = (film, place) => {

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      filmPopupComponent.getElement().remove();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  // создание новых компонент карточки и формы редактирования
  const filmComponent = new FilmComponent(film);
  const filmPopupComponent = new PopupComponent(film);

  filmComponent.setClickHandler(() => {
    render(bodyElement, filmPopupComponent.getElement(), RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmPopupComponent.setCloseButtonClickHandler(() => {
    filmPopupComponent.getElement().remove();
  });

  // отрисовать карточку задачи
  render(place, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

const bodyElement = document.querySelector(`body`);
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

// если есть фильм (а пока они всегда есть), то отрисовать контейнер для фильмов и сами фильмы в него
if (films.length === 0) {
  render(filmsContainer.getElement(), new NoFilmsListComponent().getElement(), RenderPosition.BEFOREEND);
} else {
  const filmList = new FilmListComponent();
  render(filmsContainer.getElement(), filmList.getElement(), RenderPosition.BEFOREEND);

  // 5. вставка "Карточки фильма"
  let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
  const filmContainerElement = filmList.getElement().querySelector(`.films-list__container`);

  films.slice(0, showingFilmsCount)
  .forEach((film) => {
    renderFilm(film, filmContainerElement);
  });

  // переписать на функции
  const extraTopRatedFilms = films.slice()
    .sort((a, b) => b.rating - a.rating)
    .filter((film) => film.rating !== 0)
    .slice(0, 2);

  const extraMostCommentedFilms = films.slice()
    .sort((a, b) => b.comments - a.comments)
    .filter((film) => film.comments !== 0)
    .slice(0, 2);


  // тут нужно делать проверку на наличие фильмов в массиве, если есть то отрисовывать

  const filmListExtraTopRated = new FilmListExtraComponent(`Top rated`);
  render(filmsContainer.getElement(), filmListExtraTopRated.getElement(), RenderPosition.BEFOREEND);
  extraTopRatedFilms.forEach((film) => {
    renderFilm(film, filmListExtraTopRated.getElement().querySelector(`.films-list__container`));
  });

  const filmListExtraMostCommented = new FilmListExtraComponent(`Most commented`);
  render(filmsContainer.getElement(), filmListExtraMostCommented.getElement(), RenderPosition.BEFOREEND);
  extraMostCommentedFilms.forEach((film) => {
    renderFilm(film, filmListExtraMostCommented.getElement().querySelector(`.films-list__container`));
  });


  // 6. вставка "Кнопки Показать еще"
  const showMoreButton = new ShowMoreButtonComponent();
  render(filmList.getElement(), showMoreButton.getElement(), `beforeend`);

  // вешаем обработчики на кнопку
  // обработка клика на кнопке загрузить еще
  showMoreButton.setClickHandler(() => {
    // записать в константу сколько было показано задач (=8)
    const prevFilmsCount = showingFilmsCount;
    // вычислить последний индекс карточки для показа (=16), чтобы применить в slice
    showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    // исходный массив с задачами скопировать (=slice) в количестве с 8 по 16
    films.slice(prevFilmsCount, showingFilmsCount)
    .forEach((film) => {
      renderFilm(film, filmContainerElement);
    });

    // если показыны все задачи - то удалить кнопку
    if (showingFilmsCount >= films.length) {
      showMoreButton.getElement().remove();
      showMoreButton.removeElement();
    }
  });

}

// 8. вставка Комментарий
// const comments = generateComments(COMMENT_COUNT);
// const popupElement = document.querySelector(`.film-details`);
// render2(popupElement.querySelector(`.form-details__top-container`), createCommentTemplate(comments), `afterend`);

// 9. вставка количества фильмов
const footerStatistics = footerElement.querySelector(`.footer__statistics`);
footerStatistics.querySelector(`p`).textContent = `${FILM_COUNT} movies inside`;
