// компонент "Звание пользователя"
import {createElement} from '../util.js';

const getTitleProfile = (countFilm) => {
  let titleProfile;
  if (countFilm === 0) {
    titleProfile = false;
  }
  if (countFilm > 0 && countFilm <= 10) {
    titleProfile = `Novice`;
  }
  if (countFilm > 10 && countFilm <= 20) {
    titleProfile = `Fan`;
  }
  if (countFilm > 20) {
    titleProfile = `Movie Buff`;
  }
  return titleProfile;
};


const createProfileTemplate = (watchedMovies) => {
  const titleProfile = getTitleProfile(watchedMovies);

  if (!titleProfile) {
    return ``;
  }

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${titleProfile}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile {
  constructor(watchedMovies) {
    this._watchedMovies = watchedMovies;
    this._element = null;
  }

  getTemplate() {
    return createProfileTemplate(this._watchedMovies);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
