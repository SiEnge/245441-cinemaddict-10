import nanoid from "nanoid";
import Movie from "../models/movie.js";
import Comment from "../models/comment.js";
// import LocalComment from "../models/local-comment.js";

export default class Provider {
  constructor(api, store, storeComments) {
    this._api = api;
    this._store = store;
    this._storeComments = storeComments;
    this._isSynchronized = true;
  }

  getFilms() {
    if (this._isOnLine()) {

      return this._api.getFilms()
      .then((movies) => {
        movies.forEach((movie) => this._store.setItem(movie.id, movie.toRAW()));
        return movies;
      });
    }

    const storeMovies = Object.values(this._store.getAll());
    this._isSynchronized = false;

    return Promise.resolve(Movie.parseFilms(storeMovies));
  }

  getComments(movie) {
    if (this._isOnLine()) {
      return this._api.getComments(movie)
      .then((comments) => {
        comments.forEach((comment) => this._storeComments.setItem(comment.id, comment.toRAW()));
        return comments;
      });
    }

    this._isSynchronized = false;
    const comments = [];

    movie.comments.forEach((commentId) => {
      const comment = this._storeComments.getItem(commentId);
      if (comment) {
        comments.push(comment);
      }
    });

    return Promise.resolve(Comment.parseComments(comments));
  }

  updateFilm(id, movie) {
    if (this._isOnLine()) {
      return this._api.updateFilm(id, movie)
      .then((newMovie) => {
        this._store.setItem(newMovie.id, newMovie.toRAW());
        return newMovie;
      });
    }

    const fakeUpdatedMovie = Movie.parseFilm(Object.assign({}, movie.toRAW(), {id}));

    this._isSynchronized = false;
    this._store.setItem(id, Object.assign({}, fakeUpdatedMovie.toRAW(), {offline: true}));
    return Promise.resolve(fakeUpdatedMovie);
  }

  createComment(movie, localComment) {
    if (this._isOnLine()) {
      return this._api.createComment(movie, localComment)
      .then((response) => {
        this._store.setItem(response.movie.id, response.movie);
        response.comments.forEach((comment) => this._storeComments.setItem(comment.id, comment));

        return response;
      });
    }

    const fakeNewCommentId = nanoid();
    this._storeComments.setItem(fakeNewCommentId, Object.assign({}, localComment.toRAW(), {offline: true}));

    movie.comments.push(fakeNewCommentId);

    const comments = [];
    movie.comments.forEach((commentId) => {
      const comment = this._storeComments.getItem(commentId);
      if (comment) {
        comments.push(comment);
      }
    });

    this._isSynchronized = false;

    return Promise.resolve({movie, comments});
  }

  deleteComment(commentId) {
    if (this._isOnLine()) {
      return this._api.deleteComment(commentId)
      .then(() => {
        this._storeComments.removeItem(commentId);
      });
    }

    this._isSynchronized = false;
    this._storeComments.removeItem(commentId);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storeMovies = Object.values(this._store.getAll());

      return this._api.sync(storeMovies)
      .then((response) => {
        storeMovies.filter((movie) => movie.offline).forEach((movie) => {
          this._store.removeItem(movie.id);
        });

        const updatedMovies = response.updated;

        updatedMovies.forEach((movie) => {
          this._store.setItem(movie.id, movie);
        });

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
