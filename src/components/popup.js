import he from 'he';
import debounce from 'lodash/debounce';
import AbstractSmartComponent from './abstract-smart-component.js';
import {formatDate, parseDuration, getRelativeTimeFromNow} from '../utils/common.js';
import {CommentEmotion, ChangeMode, DEBOUNCE_TIMEOUT, SHAKE_ANIMATION_TIMEOUT, MILLISECONDS_IN_ONE_MINUTE, EMPTY_USER_RATING, COUNT_RATING} from '../const.js';

const ERROR_BORDER_STYLE = `2px solid red`;
const ERROR_BORDER_RADIUS_STYLE = `5px`;

const NameDeleteButton = {
  DELETE: `Delete`,
  DELETING: `Deleting...`,
};

const createGenresMarkup = (genres) => {
  return genres
  .map((genre) => {
    return (
      `<span class="film-details__genre">${genre}</span>`
    );
  })
  .join(`\n`);
};

const createRatingScoreMarkup = (userRating) => {
  let markups = [];

  for (let i = 0; i < COUNT_RATING; i++) {
    const rating = i + 1;
    const isChecked = !!(userRating === rating);

    const ratingScoreMarkup = `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${rating}" id="rating-${rating}" ${(isChecked) ? `checked` : ``}>
    <label class="film-details__user-rating-label" for="rating-${rating}">${rating}</label>`;

    markups.push(ratingScoreMarkup);
  }

  return markups.join(`\n`);
};

const createUserRatingControlsMarkup = (title, poster, userRating) => {
  const ratingScoreMarkup = createRatingScoreMarkup(userRating);

  return (
    `<div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${ratingScoreMarkup}
            </div>
          </section>
        </div>
      </section>
    </div>`
  );
};

const createCommentMarkup = (comment) => {
  const {id, emotion, text, author, date} = comment;
  const currentText = he.encode(text);
  const currentDate = getRelativeTimeFromNow(date);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${currentText}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${currentDate}</span>
          <button class="film-details__comment-delete" data-comment-id="${id}">${NameDeleteButton.DELETE}</button>
        </p>
      </div>
    </li>`
  );
};

const createCommentsMarkup = (comments, deleteButtonText) => {
  return comments
  .map((it) => createCommentMarkup(it, deleteButtonText))
  .join(`\n`);
};

const createEmotionMarkup = () => {
  return Object.values(CommentEmotion)
  .map((commentEmotion) => {
    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${commentEmotion}" value="${commentEmotion}">
        <label class="film-details__emoji-label" for="emoji-${commentEmotion}">
        <img src="./images/emoji/${commentEmotion}.png" width="30" height="30" alt="emoji">
      </label>`
    );
  })
  .join(`\n`);
};

const createPopupTemplate = (movie, comments, options = {}) => {
  const {title, originalTitle, poster, description, director, writers, actors, releaseDate,
    duration, country, genres, rating, age} = movie;
  const {isWatchlist, isWatched, isFavorite, userRating} = options;

  const durationText = parseDuration(duration);

  const genresMarkup = createGenresMarkup(Array.from(genres));
  const genreTitle = (genres.size === 1) ? `Genre` : `Genres`;
  const userRatingMarkup = (userRating) ? `<p class="film-details__user-rating">Your rate ${userRating}</p>` : ``;

  const userRatingControlsMarkup = (isWatched) ? createUserRatingControlsMarkup(title, poster, userRating) : ``;

  const commentsCount = comments.length;
  const commentsMarkup = (comments.length > 0) ? createCommentsMarkup(comments) : ``;
  const emotionMarkup = createEmotionMarkup();

  return (
    `<form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${age}+</p>
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
                <td class="film-details__cell">${durationText}</td>
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

      ${userRatingControlsMarkup}

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsMarkup}
          </ul>

          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label" data-emotion=""></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              ${emotionMarkup}

            </div>
          </div>
        </section>
      </div>
    </form>`
  );
};

export default class Popup extends AbstractSmartComponent {
  constructor(movie, comments) {
    super();
    this._movie = movie;
    this._comments = comments;

    this._isWatchlist = !!movie.isWatchlist;
    this._isWatched = !!movie.isWatched;
    this._isFavorite = !!movie.isFavorite;
    this._userRating = movie.userRating;
    this._newOptions = null;

    this._clickCloseButtonHandler = null;
    this._clickAddToWatchlistButtonHandler = null;
    this._clickMarkAsWatchedButtonHandler = null;
    this._clickFavoriteButtonHandler = null;
    this._clickRatingButtonHandler = null;
    this._clickUndoRatingButtonHandler = null;
    this._clickDeleteCommentButtonHandler = null;

    this._addToWatchlistButtonClickHandler = this._addToWatchlistButtonClickHandler.bind(this);
    this._markAsWatchedButtonClickHandler = this._markAsWatchedButtonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);

    this._setAddEmotionBtnClickHandler();
    this._setNewOptions();
  }

  getTemplate() {
    return createPopupTemplate(this._movie, this._comments, {
      isWatchlist: this._isWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
      userRating: this._userRating,
    });
  }

  setComments(comments) {
    this._comments = comments;
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._clickCloseButtonHandler);
    this.setAddToWatchlistButtonClickHandler(this._clickAddToWatchlistButtonHandler);
    this.setMarkAsWatchedButtonClickHandler(this._clickMarkAsWatchedButtonHandler);
    this.setFavoriteButtonClickHandler(this._clickFavoriteButtonHandler);
    this.setRatingButtonClickHandler(this._clickRatingButtonHandler);
    this.setUndoRatingButtonClickHandler(this._clickUndoRatingButtonHandler);
    this.setDeleteCommentButtonClickHandler(this._clickDeleteCommentButtonHandler);
    this._setAddEmotionBtnClickHandler();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this._setNewOptions();
    this.rerender();
  }

  update() {
    this._setOptions();
    this._setNewOptions();
    this.rerender();
  }

  showError(changeMode) {
    switch (changeMode) {
      case ChangeMode.RATING:
        this._showErrorRatingScoreForm();
        break;
      case ChangeMode.COMMENT:
        this._showErrorCommentForm();
        break;
    }
  }

  disabledCommentForm() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = true;
  }

  showDefaultCommentForm() {
    const commentForm = this.getElement().querySelector(`.film-details__comment-input`);
    commentForm.style.border = ``;
  }

  _setOptions() {
    this._isWatchlist = this._newOptions.isWatchlist;
    this._isWatched = this._newOptions.isWatched;
    this._isFavorite = this._newOptions.isFavorite;
    this._userRating = this._newOptions.userRating;
  }

  _getOptions() {
    return {
      isWatchlist: this._isWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
      userRating: this._userRating,
    };
  }

  _setNewOptions() {
    this._newOptions = this._getOptions();
  }

  _showErrorCommentForm() {
    const commentForm = this.getElement().querySelector(`.film-details__comment-input`);
    commentForm.style.border = ERROR_BORDER_STYLE;
    this._shake(commentForm);
    this._activatedCommentForm();
  }

  _activatedCommentForm() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = false;
  }

  _showErrorRatingScoreForm() {
    const ratingScoreForm = this.getElement().querySelector(`.film-details__user-rating-score`);

    ratingScoreForm.style.border = ERROR_BORDER_STYLE;
    ratingScoreForm.style.borderRadius = ERROR_BORDER_RADIUS_STYLE;
    this._shake(ratingScoreForm);
    this._activatedRatingScoreForm();
  }

  _showDefaultRatingScoreForm() {
    const ratingScoreForm = this.getElement().querySelector(`.film-details__user-rating-score`);
    ratingScoreForm.style.border = ``;
    ratingScoreForm.style.borderRadius = ``;
  }

  _disabledRatingScoreForm() {
    const userRatingInputs = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    userRatingInputs.forEach((input) => {
      input.disabled = true;
    });
  }

  _activatedRatingScoreForm() {
    const userRatingInputs = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    userRatingInputs.forEach((input) => {
      input.disabled = false;
    });
  }

  _addToWatchlistButtonClickHandler(evt) {
    evt.preventDefault();

    this._newOptions.isWatchlist = !this._isWatchlist;
    this._clickAddToWatchlistButtonHandler();
  }

  _setNameDeleteButton(button, name) {
    button.textContent = name;
  }

  _disabledDeleteButton(button) {
    button.disabled = true;
  }

  _markAsWatchedButtonClickHandler(evt) {
    evt.preventDefault();

    this._newOptions.isWatched = !this._isWatched;
    if (!this._newOptions.isWatched) {
      this._newOptions.userRating = EMPTY_USER_RATING;
    }

    this._clickMarkAsWatchedButtonHandler();
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();

    this._newOptions.isWatched = !this._isFavorite;
    this._clickFavoriteButtonHandler();
  }

  _setAddEmotionBtnClickHandler() {
    const emotionLabelElements = this.getElement().querySelectorAll(`.film-details__emoji-item`);

    emotionLabelElements.forEach((element) => {
      element.addEventListener(`click`, (evt) => {
        const emotionItem = evt.currentTarget;

        this._setNewCommentEmotion(emotionItem.value);
      });
    });
  }

  _setNewCommentEmotion(emotion) {
    const addEmotionElement = this.getElement().querySelector(`.film-details__add-emoji-label`);
    addEmotionElement.innerHTML = ``;

    const emotionMarkup = `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji">`;
    addEmotionElement.insertAdjacentHTML(`beforeend`, emotionMarkup);
    addEmotionElement.dataset.emotion = emotion;
  }

  _shake(element) {
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_IN_ONE_MINUTE}s`;

    setTimeout(() => {
      element.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._clickCloseButtonHandler = handler;
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this._clickAddToWatchlistButtonHandler = handler;

    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, debounce(this._addToWatchlistButtonClickHandler, DEBOUNCE_TIMEOUT));
  }

  setMarkAsWatchedButtonClickHandler(handler) {
    this._clickMarkAsWatchedButtonHandler = handler;

    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, debounce(this._markAsWatchedButtonClickHandler, DEBOUNCE_TIMEOUT));
  }

  setFavoriteButtonClickHandler(handler) {
    this._clickFavoriteButtonHandler = handler;

    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, debounce(this._favoriteButtonClickHandler, DEBOUNCE_TIMEOUT));
  }

  setRatingButtonClickHandler(handler) {
    this._clickRatingButtonHandler = handler;

    if (!this.getElement().querySelector(`.film-details__user-rating-score`)) {
      return;
    }

    this.getElement().querySelector(`.film-details__user-rating-score`)
    .addEventListener(`click`, (evt) => {
      const target = evt.target;

      if (!target.classList.contains(`film-details__user-rating-input`)) {
        return;
      }
      this._showDefaultRatingScoreForm();

      this._newOptions.userRating = +target.value;

      this._disabledRatingScoreForm();

      handler(this._newOptions.userRating);
    });
  }

  setUndoRatingButtonClickHandler(handler) {
    this._clickUndoRatingButtonHandler = handler;

    if (!this.getElement().querySelector(`.film-details__watched-reset`)) {
      return;
    }

    this.getElement().querySelector(`.film-details__watched-reset`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();

      this._newOptions.userRating = EMPTY_USER_RATING;

      handler();
    });
  }

  setDeleteCommentButtonClickHandler(handler) {
    this._clickDeleteCommentButtonHandler = handler;

    this.getElement().querySelector(`.film-details__comments-list`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const target = evt.target;

      if (!target.classList.contains(`film-details__comment-delete`)) {
        return;
      }

      this._disabledDeleteButton(target);
      this._setNameDeleteButton(target, NameDeleteButton.DELETING);

      handler(target.dataset.commentId);
    });
  }
}
