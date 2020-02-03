import debounce from 'lodash/debounce';
import AbstractComponent from './abstract-component.js';
import {formatDateYear, parseDuration} from '../utils/common.js';
import {DEBOUNCE_TIMEOUT} from '../const.js';

const MAX_COUNT_LETTER = 140;

const createBooleanItemMarkup = (isBoolean) => {
  return (isBoolean) ? `film-card__controls-item--active` : ``;
};

const createMovieCardTemplate = (movie) => {
  const {title, poster, description, releaseDate, duration, genres, rating, comments, isWatchlist, isWatched, isFavorite} = movie;

  const durationText = parseDuration(duration);
  const watchlist = createBooleanItemMarkup(isWatchlist);
  const watched = createBooleanItemMarkup(isWatched);
  const favorite = createBooleanItemMarkup(isFavorite);
  const genre = Array.from(genres);

  const descriptionText = (description.length >= MAX_COUNT_LETTER) ? `${description.slice(0, MAX_COUNT_LETTER - 1)}&hellip;` : description;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formatDateYear(releaseDate)}</span>
        <span class="film-card__duration">${durationText}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${descriptionText}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watched}" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favorite}" type="button">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class Movie extends AbstractComponent {
  constructor(movie) {
    super();

    this._movie = movie;
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  setTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`)
    .addEventListener(`click`, handler);
  }

  setPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`)
    .addEventListener(`click`, handler);
  }

  setCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`)
    .addEventListener(`click`, handler);
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  setMarkAsWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
    .addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
    .addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }
}
