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

  setFilter(filterType) {
    this._activeFilterType = filterType;
    // debugger;
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

  deleteComment(film, oldData) {
    const comments = film.comments;
    const index = comments.findIndex((it) => it.id === oldData.id);

    if (index === -1) {
      return false;
    }

    const updatedComments = [].concat(comments.slice(0, index), comments.slice(index + 1));
    film.comments = updatedComments;

    return this.updateFilm(film.id, film);
  }

  addComment(film, newData) {
    const comments = film.comments;
    newData.id = String(comments.length + 1);

    const updatedComments = [].concat(newData, comments.slice(0));
    film.comments = updatedComments;
    return this.updateFilm(film.id, film);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}

// отправка коммента по комбинации клавиш ctrl + enter
// нужно
// подписаться на событие нажатия именно этих клавиш когда открыт попап
// отправлять новые данные по событию oncommentChange
// создать в модели новый метод - добавить коммент
// если нет текста, то и не отправлять
// отработать клик на смайлик - он должен подставляться и юез него может отправиться сообщение(?)
