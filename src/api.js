import Film from './models/movie.js';
import Comment from './models/comment.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

// проверка статус ответа
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

  // +получение списка фильмов
  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Film.parseFilms);
  }

  // +получение списка комментарий для конкретного фильма
  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  // +-обновление фильма (=изменение флагов + оценка пользователя)
  updateFilm(id, data) {
    const newData = data.toRAW();
    const newData2 = JSON.stringify(newData);
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: newData2,
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Film.parseFilm);
  }

  // -создание комментария
  createComment(filmId, data) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then((response) => response.json());
    // .then(Film.parseFilm);
  }

  // +удаление комментария
  deleteComment(commentId) {
    return this._load({url: `comments/${commentId}`, method: Method.DELETE});
  }

  // +загрузочные данные
  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
