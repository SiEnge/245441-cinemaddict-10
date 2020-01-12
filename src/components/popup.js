// компонент "Попап"
// import AbstractComponent from './abstract-component.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import {formatDate} from '../util.js';

const createGenresMarkup = (genres) => {
  return genres
  .map((genre) => {
    return (
      `<span class="film-details__genre">${genre}</span>`
    );
  })
  .join(`\n`);
};

const createRatingFilmMarkup = (title) => {
  return (
    `<div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="./images/posters/the-great-flamarion.jpg" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
              <label class="film-details__user-rating-label" for="rating-1">1</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
              <label class="film-details__user-rating-label" for="rating-2">2</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
              <label class="film-details__user-rating-label" for="rating-3">3</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
              <label class="film-details__user-rating-label" for="rating-4">4</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5">
              <label class="film-details__user-rating-label" for="rating-5">5</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
              <label class="film-details__user-rating-label" for="rating-6">6</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
              <label class="film-details__user-rating-label" for="rating-7">7</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
              <label class="film-details__user-rating-label" for="rating-8">8</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" checked>
              <label class="film-details__user-rating-label" for="rating-9">9</label>

            </div>
          </section>
        </div>
      </section>
    </div>`
  );
};

// компонент "Попап"
const createPopupTemplate = (film, options = {}) => {
  const {title, originalTitle, poster, description, director, writers, actors, releaseDate,
    duration, country, genres, rating, userRating, age} = film;
  const {isWatchlist, isWatched, isFavorite} = options;

  const genresMarkup = createGenresMarkup(Array.from(genres));
  const genreTitle = (genres.size === 1) ? `Genre` : `Genres`;
  const ratingFilmMarkup = (isWatched) ? createRatingFilmMarkup(title) : ``;
  const userRatingMarkup = (userRating) ? `<p class="film-details__user-rating">Your rate ${userRating}</p>` : ``;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

              <p class="film-details__age">${age}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                  ${userRatingMarkup}
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatDate(releaseDate)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genreTitle}</td>
                  <td class="film-details__cell">
                    ${genresMarkup}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchlist ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        ${ratingFilmMarkup}



      </form>
    </section>`
  );
};

export default class Popup extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;

    this._isWatchlist = !!film.isWatchlist;
    this._isWatched = !!film.isWatched;
    this._isFavorite = !!film.isFavorite;
    this._userRating = !!film.userRating;

    this._clickCloseButtonHandler = null;
    this._clickAddToWatchlistButtonHandler = null;
    this._clickMarkAsWatchedButtonHandler = null;
    this._clickFavoriteButtonHandler = null;
    this._clickFavoriteButtonHandler = null;

    // this._subscribeOnEvents();
  }

  getTemplate() {
    return createPopupTemplate(this._film, {
      isWatchlist: this._isWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite
    });
  }

  recoveryListeners() {
    // this._subscribeOnEvents();
    this.setCloseButtonClickHandler(this._clickCloseButtonHandler);

    this.setAddToWatchlistButtonClickHandler(this._clickAddToWatchlistButtonHandler);
    this.setMarkAsWatchedButtonClickHandler(this._clickMarkAsWatchedButtonHandler);
    this.setFavoriteButtonClickHandler(this._clickFavoriteButtonHandler);
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._clickCloseButtonHandler = handler;
  }

  // _subscribeOnEvents() {
  //   // const element = this.getElement();
  //   // если добавить метод remove то можно раскомментировать верхнюю строчку
  //   this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
  //     // debugger;
  //     this.getElement().remove();
  //     this.removeElement();
  //   });
  // }


  // сохраняем в переменные то, что можно нажать на эти элементы
  // здесь сообщаем что есть чекбокс для добавления в вишлист
  setAddToWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
    .addEventListener(`click`, () => {
      this._isWatchlist = !this._isWatchlist;
      handler();
      this.rerender();
    });

    // debugger;
    this._clickAddToWatchlistButtonHandler = handler;
  }

  // в просмотренные
  setMarkAsWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
    .addEventListener(`click`, () => {
      handler();
      this._isWatched = !this._isWatched; // для перерисовки нужно указать новые данные
      this.rerender();
    });

    this._clickMarkAsWatchedButtonHandler = handler;
  }

  // в избранное
  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
    .addEventListener(`click`, () => {
      this._isFavorite = !this._isFavorite;
      handler();
      this.rerender();
    });

    this._clickFavoriteButtonHandler = handler;
  }
}


// если есть клик на кнопке что фильм просмотрен, то появляется блок
// для оценки в котором можно проставить оценку фильму

// выводить оценку пользователя если есть и назначать ее

// убрать обработчик esc
