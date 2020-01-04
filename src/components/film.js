// компонент "Карточка фильма"
import {createElement} from '../util.js';

const createBooleanItemMarkup = (isBoolean) => {
  if (isBoolean) {
    return `film-card__controls-item--active`;
  }
  return ``;
};

const createFilmCardTemplate = (film) => {
  const {title, poster, description, releaseDate, duration, genres, rating, comments, isWatchlist, isWatched, isFavorite} = film;

  const watchlist = createBooleanItemMarkup(isWatchlist);
  const watched = createBooleanItemMarkup(isWatched);
  const favorite = createBooleanItemMarkup(isFavorite);
  const genre = Array.from(genres);

  const descriptionText = (description.length >= 140) ? `${description.slice(0, 139)}&hellip;` : description;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${descriptionText}</p>
      <a class="film-card__comments">${comments} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watched}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favorite}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class Film {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
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
