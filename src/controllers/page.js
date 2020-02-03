import MovieController from './movie.js';
import SortComponent from '../components/sort.js';
import MoviesContainerComponent from '../components/movies-container.js';
import MovieListComponent from '../components/movie-list.js';
import MoviesListNoDataComponent from '../components/movie-list-no-data.js';
import MoviesListLoadingComponent from '../components/movie-list-loading.js';
import MovieListExtraComponent from '../components/movie-list-extra.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {getTopRatedMovies, getMostCommentedMovies, getSortDownReleaseDateMovies} from '../utils/common.js';
import {SortType} from '../const.js';

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

const renderMovies = (movieListElement, movies, api, onDataChange, onViewChange, onCommentsChange) => {
  return movies.map((movie) => {
    const movieController = new MovieController(movieListElement, api, onDataChange, onViewChange, onCommentsChange);
    movieController.render(movie);
    return movieController;
  });
};

export default class PageController {
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;

    this._movies = [];
    this._sortedMovies = [];
    this._showedMovieControllers = [];
    this._showedExtraMovieControllers = [];
    this._showingMoviesCount = SHOWING_FILMS_COUNT_ON_START;

    this._sortComponent = new SortComponent();
    this._moviesContainerComponent = new MoviesContainerComponent();

    this._noMoviesComponent = new MoviesListNoDataComponent();
    this._moviesListLoadingComponent = new MoviesListLoadingComponent();

    this._movieList = new MovieListComponent();
    this._movieListExtraTopRated = new MovieListExtraComponent(`Top rated`);
    this._movieListExtraMostCommented = new MovieListExtraComponent(`Most commented`);
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onCommentsChange = this._onCommentsChange.bind(this);

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    remove(this._moviesListLoadingComponent);

    const container = this._container;
    const movies = this._moviesModel.getMovies();

    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, this._moviesContainerComponent.getElement(), RenderPosition.BEFOREEND);

    if (movies.length === 0) {
      render(this._moviesContainerComponent.getElement(), this._noMoviesComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    render(this._moviesContainerComponent.getElement(), this._movieList.getElement(), RenderPosition.BEFOREEND);

    this._sortedMovies = movies;
    this._renderMovies(this._sortedMovies.slice(0, this._showingMoviesCount));

    this._renderExtra();
    this._renderShowMoreButton();
  }

  renderLoading() {
    const container = this._container;

    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, this._moviesContainerComponent.getElement(), RenderPosition.BEFOREEND);

    render(this._moviesContainerComponent.getElement(), this._moviesListLoadingComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderExtra() {
    remove(this._movieListExtraTopRated);
    remove(this._movieListExtraMostCommented);
    this._showedExtraMovieControllers = [];

    const container = this._moviesContainerComponent.getElement();
    const movies = this._moviesModel.getMovies();

    const extraTopRatedMovies = getTopRatedMovies(movies);
    const extraMostCommentedMovies = getMostCommentedMovies(movies);

    if (extraTopRatedMovies.length > 0) {
      render(container, this._movieListExtraTopRated.getElement(), RenderPosition.BEFOREEND);

      this._renderExtraMovies(this._movieListExtraTopRated, extraTopRatedMovies.slice(0, 2));
    }

    if (extraMostCommentedMovies.length > 0) {
      render(container, this._movieListExtraMostCommented.getElement(), RenderPosition.BEFOREEND);
      this._renderExtraMovies(this._movieListExtraMostCommented, extraMostCommentedMovies.slice(0, 2));
    }
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingMoviesCount >= this._moviesModel.getMovies().length) {
      return;
    }

    render(this._movieList.getElement(), this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _removeMovies() {
    const movieListElement = this._movieList.getElement().querySelector(`.films-list__container`);
    movieListElement.innerHTML = ``;
    this._showedMovieControllers = [];
    this._showingMoviesCount = SHOWING_FILMS_COUNT_ON_START;
  }

  _renderExtraMovies(container, movies) {
    const newExtraMovies = renderMovies(container.getElement(), movies, this._api, this._onDataChange, this._onViewChange, this._onCommentsChange);
    this._showedExtraMovieControllers = this._showedExtraMovieControllers.concat(newExtraMovies);
  }

  _renderMovies(movies) {
    const movieListElement = this._movieList.getElement();

    const newMovies = renderMovies(movieListElement, movies, this._api, this._onDataChange, this._onViewChange, this._onCommentsChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
    this._showingMoviesCount = this._showedMovieControllers.length;
  }

  _onShowMoreButtonClick() {
    const prevMoviesCount = this._showingMoviesCount;
    this._showingMoviesCount = this._showingMoviesCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    this._renderMovies(this._sortedMovies.slice(prevMoviesCount, this._showingMoviesCount));

    if (this._showingMoviesCount >= this._sortedMovies.length) {
      this._showMoreButtonComponent.getElement().remove();
    }
  }

  _onSortTypeChange(sortType) {
    const movies = this._moviesModel.getMovies();
    this._sortedMovies = [];

    switch (sortType) {
      case SortType.DEFAULT:
        this._sortedMovies = movies;
        break;
      case SortType.DATE:
        this._sortedMovies = getSortDownReleaseDateMovies(movies);
        break;
      case SortType.RATING:
        this._sortedMovies = getTopRatedMovies(movies);
        break;
    }

    this._removeMovies();
    this._renderMovies(this._sortedMovies.slice(0, this._showingMoviesCount));

    this._renderShowMoreButton();
  }

  _updateMovies(count) {
    this._removeMovies();
    this._renderMovies(this._moviesModel.getMovies().slice(0, count));
    this._renderShowMoreButton();
  }


  _onDataChange(movieController, oldData, newData, changeMode) {
    this._api.updateMovie(oldData.id, newData)
    .then((movieModel) => {
      const isSuccess = this._moviesModel.updateMovie(oldData.id, movieModel);

      if (isSuccess) {
        movieController.render(movieModel);
        this._updateMovies(this._showingMoviesCount);

        this._renderExtra();
      }
    })
    .catch(() => {
      movieController.resetPopup();
      movieController.showError(changeMode);
    });
  }

  _onCommentsChange(movieController, movie, comments, oldData, newData, changeMode) {
    if (oldData === null) {
      this._api.createComment(movie, newData)
      .then((response) => {
        this._moviesModel.addComments(movie, response.movie);
        movieController.render(movie);
        this._renderExtra();
      })
      .catch(() => {
        movieController.showError(changeMode);
      });
    }

    if (newData === null) {
      this._api.deleteComment(oldData.id)
      .then(() => {
        const isSuccess = this._moviesModel.deleteComment(movie, oldData.id);
        if (isSuccess) {
          movieController.render(movie);
          this._renderExtra();
        }
      })
      .catch(() => {
        movieController.resetPopup();
        movieController.showError(changeMode);
      });
    }
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
    this._showedExtraMovieControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    const movies = this._moviesModel.getMovies();

    this._sortedMovies = movies;

    this._removeMovies();
    this._renderMovies(this._sortedMovies.slice(0, SHOWING_FILMS_COUNT_ON_START));
    this._renderShowMoreButton();
  }

  hide() {
    this._moviesContainerComponent.hide();
    this._sortComponent.hide();
  }

  show() {
    this._moviesContainerComponent.show();
    this._sortComponent.show();
  }
}
