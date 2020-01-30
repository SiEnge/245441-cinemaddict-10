import {getFilmsByFilter} from '../util.js';
import {FilterType} from '../const.js';

export default class Films {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getFilmsAll() {
    return this._films;
  }

  setFilms(films) {
    this._films = Array.from(films);
  }

  setComments(filmId, comments) {
    this._films[filmId].textComments = comments;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updateFilm(id, updatedFilm) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), updatedFilm, this._films.slice(index + 1));
    this._dataChangeHandlers.forEach((handler) => handler());

    return true;
  }

  deleteComment(film, commentId) {
    const comments = film.comments;
    const index = comments.findIndex((it) => it === commentId);

    if (index === -1) {
      return false;
    }

    const updatedComments = [].concat(comments.slice(0, index), comments.slice(index + 1));
    film.comments = updatedComments;

    return this.updateFilm(film.id, film);
  }

  addComments(film, newData) {
    film.comments = newData.comments;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
