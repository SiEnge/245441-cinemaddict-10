export default class Films {
  constructor() {
    this._films = [];

  }

  // получение списка фильмов
  getFilms() {
    return this._films;
  }

  // сохранение списка фильмов
  setFilms(films) {
    this._films = Array.from(films);
  }

  // обновление ОДНОГО фильма
  updateFilm(id, updatedFilm) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) { // если не найден фильм
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), updatedFilm, this._films.slice(index + 1));

    return true;
  }
}
