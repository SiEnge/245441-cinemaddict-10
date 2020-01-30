// import FilterComponent from '../components/filter.js';
import SortComponent, {SortType} from '../components/sort.js';
import FilmsContainerComponent from '../components/films-container.js';
import FilmListComponent from '../components/film-list.js';
import NoFilmsListComponent from '../components/film-list-no-data.js';
import FilmListExtraComponent from '../components/film-list-extra.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import {render, remove, RenderPosition} from '../util.js';
import FilmController from './movie.js';
// import {countFilmsFilter} from '../mock/menu.js';


const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

// отрисовка нескольких фильмов. Передаются фильмы и блок в который нужно отрисовать
// т.е. тут ищется films-list__container и туда отрисовываются фильмы

// для отрисовки фильмов проходит методом map по всему массиву фильмов,
// которые планируется отрисовать
// для каждого фильма создаем инстанс класса FilmController
// и потом его отрисовываем своим методом render
// в который входит помимо отрисовки, навешивание обработчиков и логики переключения карточки/попапа

// при создании инстанса передается контейнер куда отрисовать и
// метода onDataChange, который будет срабатывать когда данные изменятся
// а сам этот флаг относится к PageController и его основная функции
// - сохранить новые данные в общем массиве данных Films
// - дать команду на перерисовку карточки
// т.е. карточка меняет свой вид не когда на нее кликнули, а когда сработала вся цепочка внесения изменений
// в общий массив, и если все он, то обновить ее

const renderFilms = (filmListElement, films, api, onDataChange, onViewChange, onCommentsChange) => {
  return films.map((film) => {
    const filmController = new FilmController(filmListElement, api, onDataChange, onViewChange, onCommentsChange);
    filmController.render(film);
    // debugger;
    return filmController;
  });
};


export default class PageController {
  constructor(container, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    // this._commentsModel = commentsModel;
    this._api = api;

    this._films = [];
    // this._comments = [];
    this._sortedFilms = [];
    this._showedFilmControllers = [];
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    this._sortComponent = new SortComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();

    this._noFilmsComponent = new NoFilmsListComponent();
    this._filmList = new FilmListComponent();
    this._filmListExtraTopRated = new FilmListExtraComponent(`Top rated`);
    this._filmListExtraMostCommented = new FilmListExtraComponent(`Most commented`);
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onCommentsChange = this._onCommentsChange.bind(this);

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container;
    const films = this._filmsModel.getFilms();
    // const comments = this._commentsModel.getComments();

    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, this._filmsContainerComponent.getElement(), RenderPosition.BEFOREEND);

    if (films.length === 0) {
      render(this._filmsContainerComponent.getElement(), this._noFilmsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    render(this._filmsContainerComponent.getElement(), this._filmList.getElement(), RenderPosition.BEFOREEND);

    this._sortedFilms = films;
    this._renderFilms(this._sortedFilms.slice(0, this._showingFilmsCount));

    this._renderExtraFilms(films);
    this._renderShowMoreButton();
  }


  // отрисовка блока с экстраФИльмами
  _renderExtraFilms(films) {
    const container = this._filmsContainerComponent.getElement();
    // const comments = this._commentsModel.getComments();

    const extraTopRatedFilms = films.slice()
      .sort((a, b) => b.rating - a.rating)
      .filter((film) => film.rating !== 0)
      .slice(0, 2);

    const extraMostCommentedFilms = films.slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .filter((film) => film.comments !== 0)
      .slice(0, 2);

    if (extraTopRatedFilms.length > 0) {
      render(container, this._filmListExtraTopRated.getElement(), RenderPosition.BEFOREEND);
      renderFilms(this._filmListExtraTopRated.getElement(), extraTopRatedFilms, this._api, this._onDataChange, this._onViewChange);
    }

    if (extraMostCommentedFilms.length > 0) {
      render(container, this._filmListExtraMostCommented.getElement(), RenderPosition.BEFOREEND);
      renderFilms(this._filmListExtraMostCommented.getElement(), extraMostCommentedFilms, this._api, this._onDataChange, this._onViewChange);
    }
  }

  // здесь логика отрисовки кнпоки загрузить еще
  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    render(this._filmList.getElement(), this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  // удаление всех фильмов
  _removeFilms() {
    const filmListElement = this._filmList.getElement().querySelector(`.films-list__container`);
    filmListElement.innerHTML = ``;
    this._showedFilmControllers = [];
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
  }

  // отрисовка фильмов
  _renderFilms(films) {
    const filmListElement = this._filmList.getElement();
    // const comments = this.

    const newFilms = renderFilms(filmListElement, films, this._api, this._onDataChange, this._onViewChange, this._onCommentsChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);
    this._showingFilmsCount = this._showedFilmControllers.length;
  }

  // а здесь логика клика на кнопку
  _onShowMoreButtonClick() {
    // const comments = this._commentsModel.getComments();

    const prevFilmsCount = this._showingFilmsCount;
    this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    // отрисовка нескольких фильмов
    this._renderFilms(this._sortedFilms.slice(prevFilmsCount, this._showingFilmsCount));

    if (this._showingFilmsCount >= this._sortedFilms.length) {
      this._showMoreButtonComponent.getElement().remove();
    }
  }

  _onSortTypeChange(sortType) {
    // const comments = this._commentsModel.getComments();

    const films = this._filmsModel.getFilms();
    this._sortedFilms = [];

    // в зависимости от выбранной сортировки записываем данные в массив
    switch (sortType) {
      case SortType.DEFAULT:
        this._sortedFilms = films;
        break;
      case SortType.DATE:
        this._sortedFilms = films.slice().sort((a, b) => b.releaseDate - a.releaseDate);
        break;
      case SortType.RATING:
        this._sortedFilms = films.slice().sort((a, b) => b.rating - a.rating);
        break;
    }

    this._removeFilms(); // очистка страницы от всех карточек
    this._renderFilms(this._sortedFilms.slice(0, this._showingFilmsCount)); // отрисовка

    this._renderShowMoreButton();
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButton();
  }


  _onDataChange(filmController, oldData, newData) {
    this._api.updateFilm(oldData.id, newData)
    .then((filmModel) => {
      const isSuccess = this._filmsModel.updateFilm(oldData.id, filmModel);

      if (isSuccess) {
        filmController.render(filmModel);
        this._updateFilms(this._showingFilmsCount);
      }
    });
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    const films = this._filmsModel.getFilms();
    // const comments = this._commentsModel.getComments();

    this._sortedFilms = films;

    this._removeFilms();
    this._renderFilms(this._sortedFilms.slice(0, SHOWING_FILMS_COUNT_ON_START));
    this._renderShowMoreButton();
  }

  // _onCommentsChange(filmController, popupController, film, oldData, newData) {
  _onCommentsChange(filmController, film, oldData, newData) {
    // let isSuccess = false;

    // добавление комментария
    if (oldData === null) {
      this._api.createComment(film.id, newData)
      .then((response) => {
        this._filmsModel.addComments(film, response.movie);
        filmController.render(film);
        // debugger;

        // const isSuccess = this._filmsModel.updateFilm(oldData.id, filmModel);

        // if (isSuccess) {
        //     filmController.render(filmModel);
        //     this._updateFilms(this._showingFilmsCount);
        //   }
      });
      // isSuccess = this._filmsModel.addComment(film, newData);
    }

    // удаление комментария
    if (newData === null) {
      this._api.deleteComment(oldData.id)
        .then(() => {
          const isSuccess = this._filmsModel.deleteComment(film, oldData.id);
          if (isSuccess) {
            filmController.render(film);
          }
          // обновление попапа

        });

      // isSuccess = this._filmsModel.deleteComment(film, oldData);
    }

    // debugger;
    //
    // if (isSuccess) {
    //   filmController.render(film);
    // }
  }

  hide() {
    this._filmsContainerComponent.hide();
    this._sortComponent.hide();
  }

  show() {
    this._filmsContainerComponent.show();
    this._sortComponent.show();
  }
}


// не забыть про экстрафильмы - чтобы и их попапы закрывались - нужно добавить в отдельный массив для проверки что их попапы тоже нужно закрыть

// Аналогично допишите в PageController методы, которые умееют скрывать и показывать его.
// Для этого будет достаточно добавлять и удалять с корневого элемента класс visually-hidden соотвественно.
