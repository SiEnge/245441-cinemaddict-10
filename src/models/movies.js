import {getMoviesByFilter} from '../utils/filter.js';
import {FilterType} from '../const.js';

export default class Movies {
  constructor() {
    this._movies = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getMovies() {
    return getMoviesByFilter(this._movies, this._activeFilterType);
  }

  getMoviesAll() {
    return this._movies;
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
  }

  setComments(movieId, comments) {
    this._movies[movieId].textComments = comments;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updateMovie(id, updatedMovie) {
    const index = this._movies.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), updatedMovie, this._movies.slice(index + 1));
    this._dataChangeHandlers.forEach((handler) => handler());

    return true;
  }

  deleteComment(movie, commentId) {
    const comments = movie.comments;
    const index = comments.findIndex((it) => it === commentId);

    if (index === -1) {
      return false;
    }

    const updatedComments = [].concat(comments.slice(0, index), comments.slice(index + 1));
    movie.comments = updatedComments;

    return true;
  }

  addComments(movie, newData) {
    movie.comments = newData.comments;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
