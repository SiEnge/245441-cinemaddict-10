import SortComponent from '../components/sort.js';
import {SortType} from '../const.js';
import FilmsContainerComponent from '../components/films-container.js';
import FilmListComponent from '../components/film-list.js';
import FilmsListNoDataComponent from '../components/film-list-no-data.js';
import FilmsListLoadingComponent from '../components/film-list-loading.js';

import FilmListExtraComponent from '../components/film-list-extra.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {getTopRatedMovies, getMostCommentedMovies, getSortDownReleaseDateMovies} from '../utils/common.js';
import FilmController from './movie.js';

// const PageMode = {
//   LOADING: `loading`,
//   MOVIES: `movies`,
// };

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

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
    this._showedExtraFilmControllers = [];
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    this._sortComponent = new SortComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();

    this._noFilmsComponent = new FilmsListNoDataComponent();
    this._filmsListLoadingComponent = new FilmsListLoadingComponent();

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
    remove(this._filmsListLoadingComponent);

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

    this._renderExtra();
    this._renderShowMoreButton();
  }

  renderLoading() {
    const container = this._container;

    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, this._filmsContainerComponent.getElement(), RenderPosition.BEFOREEND);

    render(this._filmsContainerComponent.getElement(), this._filmsListLoadingComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderExtra() {
    remove(this._filmListExtraTopRated);
    remove(this._filmListExtraMostCommented);
    this._showedExtraFilmControllers = [];

    const container = this._filmsContainerComponent.getElement();
    const films = this._filmsModel.getFilms();

    const extraTopRatedFilms = getTopRatedMovies(films);
    const extraMostCommentedFilms = getMostCommentedMovies(films);

    if (extraTopRatedFilms.length > 0) {
      render(container, this._filmListExtraTopRated.getElement(), RenderPosition.BEFOREEND);

      this._renderExtraFilms(this._filmListExtraTopRated, extraTopRatedFilms.slice(0, 2));
    }

    if (extraMostCommentedFilms.length > 0) {
      render(container, this._filmListExtraMostCommented.getElement(), RenderPosition.BEFOREEND);
      this._renderExtraFilms(this._filmListExtraMostCommented, extraMostCommentedFilms.slice(0, 2));
    }
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    render(this._filmList.getElement(), this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _removeFilms() {
    const filmListElement = this._filmList.getElement().querySelector(`.films-list__container`);
    filmListElement.innerHTML = ``;
    this._showedFilmControllers = [];
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
  }

  _renderExtraFilms(container, films) {
    const newExtraFilms = renderFilms(container.getElement(), films, this._api, this._onDataChange, this._onViewChange, this._onCommentsChange);
    this._showedExtraFilmControllers = this._showedExtraFilmControllers.concat(newExtraFilms);
  }

  _renderFilms(films) {
    const filmListElement = this._filmList.getElement();

    const newFilms = renderFilms(filmListElement, films, this._api, this._onDataChange, this._onViewChange, this._onCommentsChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);
    this._showingFilmsCount = this._showedFilmControllers.length;
  }

  _onShowMoreButtonClick() {
    const prevFilmsCount = this._showingFilmsCount;
    this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    this._renderFilms(this._sortedFilms.slice(prevFilmsCount, this._showingFilmsCount));

    if (this._showingFilmsCount >= this._sortedFilms.length) {
      this._showMoreButtonComponent.getElement().remove();
    }
  }

  _onSortTypeChange(sortType) {
    const films = this._filmsModel.getFilms();
    this._sortedFilms = [];

    switch (sortType) {
      case SortType.DEFAULT:
        this._sortedFilms = films;
        break;
      case SortType.DATE:
        this._sortedFilms = getSortDownReleaseDateMovies(films);
        break;
      case SortType.RATING:
        this._sortedFilms = getTopRatedMovies(films);
        break;
    }

    this._removeFilms();
    this._renderFilms(this._sortedFilms.slice(0, this._showingFilmsCount));

    this._renderShowMoreButton();
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButton();
  }


  _onDataChange(filmController, oldData, newData, mode) {
    this._api.updateFilm(oldData.id, newData)
    .then((filmModel) => {
      const isSuccess = this._filmsModel.updateFilm(oldData.id, filmModel);

      if (isSuccess) {
        filmController.render(filmModel);
        this._updateFilms(this._showingFilmsCount);

        this._renderExtra();
      }
    })
    .catch(() => {
      filmController.resetPopup();

      if (mode && mode === `setRating`) {
        filmController.showErrorRatingScoreForm();
      }
    });
  }

  _onCommentsChange(filmController, film, comments, oldData, newData) {
    if (oldData === null) {
      this._api.createComment(film, newData)
      .then((response) => {
        this._filmsModel.addComments(film, response.movie);
        filmController.render(film);
        this._renderExtra();
      })
      .catch(() => {
        filmController.showErrorCommentForm();
      });
    }

    if (newData === null) {
      this._api.deleteComment(oldData.id)
      .then(() => {
        const isSuccess = this._filmsModel.deleteComment(film, oldData.id);
        if (isSuccess) {
          filmController.render(film);
          this._renderExtra();
        }
      })
      .catch(() => {
        filmController.resetPopup();
        // filmController.showErrorCommentForm();
      });
    }
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
    this._showedExtraFilmControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    const films = this._filmsModel.getFilms();

    this._sortedFilms = films;

    this._removeFilms();
    this._renderFilms(this._sortedFilms.slice(0, SHOWING_FILMS_COUNT_ON_START));
    this._renderShowMoreButton();
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
