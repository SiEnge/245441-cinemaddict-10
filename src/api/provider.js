import nanoid from "nanoid";
import Movie from "../models/movie.js";
import Comment from "../models/comment.js";

const NameStore = {
  MOVIES: `cinemaddict-movies-localstorage`,
  COMMENTS: `cinemaddict-comments-localstorage`,
};

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
        movies.forEach((movie) => this._store.setItem(NameStore.MOVIES, movie.id, movie.toRAW()));
        return movies;
      });
    }

    const storeMovies = Object.values(this._store.getAll(NameStore.MOVIES));
    this._isSynchronized = false;

    return Promise.resolve(Movie.parseFilms(storeMovies));
  }

  getComments(movie) {
    if (this._isOnLine()) {
      return this._api.getComments(movie)
      .then((comments) => {
        comments.forEach((comment) => this._store.setItem(NameStore.COMMENTS, comment.id, comment.toRAW()));
        return comments;
      });
    }

    this._isSynchronized = false;
    const comments = [];

    movie.comments.forEach((commentId) => {
      const comment = this._store.getItem(NameStore.COMMENTS, commentId);
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
        this._store.setItem(NameStore.MOVIES, newMovie.id, newMovie.toRAW());
        return newMovie;
      });
    }

    const fakeUpdatedMovie = Movie.parseFilm(Object.assign({}, movie.toRAW(), {id}));

    this._isSynchronized = false;
    this._store.setItem(NameStore.MOVIES, id, Object.assign({}, fakeUpdatedMovie.toRAW(), {offline: true}));
    return Promise.resolve(fakeUpdatedMovie);
  }

  createComment(movie, localComment) {
    if (this._isOnLine()) {
      return this._api.createComment(movie, localComment)
      .then((response) => {
        this._store.setItem(NameStore.MOVIES, response.movie.id, response.movie);
        response.comments.forEach((comment) => this._store.setItem(NameStore.COMMENTS, comment.id, comment));

        return response;
      });
    }

    const fakeNewCommentId = nanoid();
    this._store.setItem(NameStore.COMMENTS, fakeNewCommentId, Object.assign({}, localComment.toRAW(), {offline: true}));

    movie.comments.push(fakeNewCommentId);

    const comments = [];
    movie.comments.forEach((commentId) => {
      const comment = this._store.getItem(NameStore.COMMENTS, commentId);
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
        this._store.removeItem(NameStore.COMMENTS, commentId);
      });
    }

    this._isSynchronized = false;
    this._store.removeItem(NameStore.COMMENTS, commentId);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storeMovies = Object.values(this._store.getAll(NameStore.MOVIES));

      return this._api.sync(storeMovies)
      .then((response) => {
        storeMovies.filter((movie) => movie.offline).forEach((movie) => {
          this._store.removeItem(NameStore.MOVIES, movie.id);
        });

        const updatedMovies = response.updated;

        updatedMovies.forEach((movie) => {
          this._store.setItem(NameStore.MOVIES, movie.id, movie);
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
