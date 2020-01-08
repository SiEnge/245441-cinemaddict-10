import MenuComponent from '../components/menu.js';
import SortComponent, {SortType} from '../components/sort.js';
import FilmsContainerComponent from '../components/films-container.js';
import FilmListComponent from '../components/film-list.js';
import NoFilmsListComponent from '../components/film-list-no-data.js';
import FilmListExtraComponent from '../components/film-list-extra.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import {render, RenderPosition} from '../util.js';
import FilmController from './movie.js';


const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

// отрисовка нескольких фильмов. Передаются фильмы и блок в который нужно отрисовать
// т.е. тут ищется films-list__container и туда отрисовываются фильмы
const renderFilms = (filmListElement, films) => {
  films.map((film) => {
    const filmController = new FilmController(filmListElement.querySelector(`.films-list__container`));
    filmController.render(film);
  });
};


export default class PageController {
  constructor(container) {
    this._container = container;

    this._menuComponent = new MenuComponent();
    this._sortComponent = new SortComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();

    this._noFilmsComponent = new NoFilmsListComponent();
    this._filmList = new FilmListComponent();
    this._filmListExtraTopRated = new FilmListExtraComponent(`Top rated`);
    this._filmListExtraMostCommented = new FilmListExtraComponent(`Most commented`);
    this._showMoreButton = new ShowMoreButtonComponent();

  }

  render(films) {
    const container = this._container;

    // 2. вставка в тело "Меню"
    // const filter = countFilmsFilter(films);
    // render(container, this._menuComponent.getElement(), RenderPosition.BEFOREEND);

    // 3. вставка в тело "Сортировка"
    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);

    // const filmsContainer = new FilmsContainerComponent();
    render(container, this._filmsContainerComponent.getElement(), RenderPosition.BEFOREEND);

    if (films.length === 0) {
      render(this._filmsContainerComponent.getElement(), this._noFilmsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    render(this._filmsContainerComponent.getElement(), this._filmList.getElement(), RenderPosition.BEFOREEND);

    let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    let sortedFilms = films;

    // отрисовка нескольких фильмов
    renderFilms(this._filmList.getElement(), sortedFilms.slice(0, showingFilmsCount));

    const extraTopRatedFilms = films.slice()
      .sort((a, b) => b.rating - a.rating)
      .filter((film) => film.rating !== 0)
      .slice(0, 2);

    const extraMostCommentedFilms = films.slice()
      .sort((a, b) => b.comments - a.comments)
      .filter((film) => film.comments !== 0)
      .slice(0, 2);


    render(this._filmsContainerComponent.getElement(), this._filmListExtraTopRated.getElement(), RenderPosition.BEFOREEND);
    renderFilms(this._filmListExtraTopRated.getElement(), extraTopRatedFilms);

    render(this._filmsContainerComponent.getElement(), this._filmListExtraMostCommented.getElement(), RenderPosition.BEFOREEND);
    renderFilms(this._filmListExtraMostCommented.getElement(), extraMostCommentedFilms);

    // что происходит если изменить сортировку
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      // (создается пустой) очищается массив для отсортированного
      sortedFilms = [];

      // в зависимости от выбранной сортировки записываем данные в массив
      switch (sortType) {
        case SortType.DEFAULT:
          sortedFilms = films;
          break;
        case SortType.DATE:
          sortedFilms = films.slice().sort((a, b) => b.releaseDate - a.releaseDate);
          break;
        case SortType.RATING:
          sortedFilms = films.slice().sort((a, b) => b.rating - a.rating);
          break;
      }

      // очистка контейнера для вывода новых фильмов
      this._filmList.getElement().querySelector(`.films-list__container`).innerHTML = ``;

      showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

      // отрисовка отсортированных фильмов
      renderFilms(this._filmList.getElement(), sortedFilms.slice(0, showingFilmsCount));

      // отрисовать кнопку Показать еще, то отрисовать ее
      render(this._filmList.getElement(), this._showMoreButton.getElement(), `beforeend`);
    });

    // отрисовка кнопки Показать еще
    render(this._filmList.getElement(), this._showMoreButton.getElement(), `beforeend`);

    // обработчик клика на кнопке Показать еще
    this._showMoreButton.setClickHandler(() => {
      const prevFilmsCount = showingFilmsCount;
      showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      // отрисовка нескольких фильмов
      renderFilms(this._filmList.getElement(), sortedFilms.slice(prevFilmsCount, showingFilmsCount));

      if (showingFilmsCount >= sortedFilms.length) {
        this._showMoreButton.getElement().remove();
        // this._showMoreButton.removeElement();
      }
    });

  }
}

// перенести в утилиты countFilmsFilter
