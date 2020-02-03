import Movie from '../models/movie.js';
import Comment from '../models/comment.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  getComments(movie) {
    return this._load({url: `comments/${movie.id}`})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  updateMovie(id, movie) {
    const newData = movie.toRAW();
    const newData2 = JSON.stringify(newData);
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: newData2,
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Movie.parseMovie);
  }

  createComment(movie, localComment) {
    return this._load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(localComment.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then((response) => response.json());
  }

  deleteComment(commentId) {
    return this._load({url: `comments/${commentId}`, method: Method.DELETE});
  }

  sync(movies) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(movies),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
