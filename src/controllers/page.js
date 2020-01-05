import FilmListComponent from '../components/film-list.js';
import NoFilmsListComponent from '../components/film-list-no-data.js';
import FilmListExtraComponent from '../components/film-list-extra.js';
import FilmComponent from '../components/film.js';
import PopupComponent from '../components/popup.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import {render, RenderPosition} from '../util.js';

const bodyElement = document.querySelector(`body`);


const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

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


export default class PageController {
  constructor(container) {
    this._container = container;

    this._noFilmsComponent = new NoFilmsListComponent();
    this._filmList = new FilmListComponent();
    this._filmListExtraTopRated = new FilmListExtraComponent(`Top rated`);
    this._filmListExtraMostCommented = new FilmListExtraComponent(`Most commented`);
    this._showMoreButton = new ShowMoreButtonComponent();
  }

  render(films) {
    const container = this._container.getElement();
    // если есть фильм (а пока они всегда есть), то отрисовать контейнер для фильмов и сами фильмы в него
    if (films.length === 0) {
      render(container, this._noFilmsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    // const filmList = new FilmListComponent();
    render(container, this._filmList.getElement(), RenderPosition.BEFOREEND);

    // 5. вставка "Карточки фильма"
    let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    const filmContainerElement = this._filmList.getElement().querySelector(`.films-list__container`);

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
    render(container, this._filmListExtraTopRated.getElement(), RenderPosition.BEFOREEND);
    extraTopRatedFilms.forEach((film) => {
      renderFilm(film, this._filmListExtraTopRated.getElement().querySelector(`.films-list__container`));
    });

    render(container, this._filmListExtraMostCommented.getElement(), RenderPosition.BEFOREEND);
    extraMostCommentedFilms.forEach((film) => {
      renderFilm(film, this._filmListExtraMostCommented.getElement().querySelector(`.films-list__container`));
    });


    // 6. вставка "Кнопки Показать еще"
    // const showMoreButton = new ShowMoreButtonComponent();
    render(this._filmList.getElement(), this._showMoreButton.getElement(), `beforeend`);

    // вешаем обработчики на кнопку
    // обработка клика на кнопке загрузить еще
    this._showMoreButton.setClickHandler(() => {
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
        this._showMoreButton.getElement().remove();
        this._showMoreButton.removeElement();
      }
    });
  }
}
