import Movie from "../models/movie.js";
import Comment from "../models/comment.js";
import LocalComment from "../models/local-comment.js";
import {createId} from '../utils/common.js';

const getSyncedMovies =
  (items) => items.filter(({success}) => success).map(({payload}) => payload.movie);


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getFilms() {
    if (this._isOnLine()) {

      return this._api.getFilms()
      .then((movies) => {
        movies.forEach((movie) => this._store.setItem(movie.id, movie.toRAW()));
          return movies;
        }
      );
    }


    const storeMovies = Object.values(this._store.getAll());
    // хдесь неправильно будет работать, т.к. хранить нужно не только список фильмов
    // но и список комментарий
    this._isSynchronized = false;

    return Promise.resolve(Movie.parseFilms(storeMovies));
    // return Promise.resolve(Movie.parseFilms([]));
  }

  getComments(filmId) {
    if (this._isOnLine()) {
      // return this._api.getComments(filmId);

      return this._api.getComments(filmId)
      .then((comments) => {
        comments.forEach((comment) => this._store.setItem(comment.id, comment.toRAW()));
        return comments;
      });
    }


    const storeComments = Object.values(this._store.getAll());
    this._isSynchronized = false;
    return Promise.resolve(Comment.parseComments(storeComments));
  }

  updateFilm(id, data) {
    if (this._isOnLine()) {
      // return this._api.updateFilm(id, data);

      return this._api.updateFilm(id, data)
      .then((newMovie) => {
        this._store.setItem(newMovie.id, newMovie.toRAW());
        return newMovie;
      });
    }


    const fakeUpdatedMovie = Movie.parseFilm(Object.assign({}, data.toRAW(), {id}));

    this._isSynchronized = false;
    this._store.setItem(id, Object.assign({}, fakeUpdatedMovie.toRAW(), {offline: true}));
    return Promise.resolve(fakeUpdatedMovie);

    // return Promise.resolve(data);
  }

  createComment(filmId, data) {
    if (this._isOnLine()) {
      // return this._api.createComment(filmId, data);

      return this._api.createComment(filmId, data)
      .then((newComment) => {
        this._store.setItem(newComment.id, newComment.toRAW());
        return newComment;
      });
    }

    const fakeNewCommentId = createId();
    const fakeNewComment = LocalComment.parseComment(Object.assign({}, data.toRAW(), filmId, {id: fakeNewCommentId}));

    this._isSynchronized = false;

    this._store.setItem(fakeNewComment.id, Object.assign({}, fakeNewComment.toRAW(), {offline: true}));
    return Promise.resolve(fakeNewComment);
  }

  deleteComment(commentId) {
    if (this._isOnLine()) {
      // return this._api.deleteComment(commentId);

      return this._api.deleteComment(commentId)
      .then(() => {
        this._store.removeItem(commentId);
      });
    }

    this._isSynchronized = false;
    this._store.removeItem(commentId);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storeMovies = Object.values(this._store.getAll());

      return this._api.sync(storeMovies)
      .then((response) => {
        // Удаляем из хранилища задачи, что были созданы
        // или изменены в оффлайне. Они нам больше не нужны
        storeMovies.filter((movie) => movie.offline).forEach((movie) => {
          this._store.removeItem(movie.id);
        });


        // Забираем из ответа синхронизированные задачи
        const createdMovies = getSyncedMovies(response.created);
        const updatedMovies = getSyncedMovies(response.updated);

        // Добавляем синхронизированные задачи в хранилище.
        // Хранилище должно быть актуальным в любой момент,
        // вдруг сеть пропадёт
        [...createdMovies, ...updatedMovies].forEach((movie) => {
          this._store.setItem(movie.id, movie);
        });

        // Помечаем, что всё синхронизировано
        this._isSynchronized = true;

        return Promise.resolve();
      });
    }
    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }

}


// в sync удалит и комменатрии
