import he from 'he';
import AbstractSmartComponent from './abstract-smart-component.js';
import {formatDate, parseDuration, getRelativeTimeFromNow} from '../utils/common.js';
import {CommentEmotion} from '../const.js';
// import debounce from 'lodash.debounce';

const NameDeleteButton = {
  DELETE: `Delete`,
  DELETING: `Deleting...`,
};

const COUNT_RATING = 9;

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

  // const currentDate = formatDateComment(date);
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

const createPopupTemplate = (film, comments, options = {}) => {
  const {title, originalTitle, poster, description, director, writers, actors, releaseDate,
    duration, country, genres, rating, age} = film;
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
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;

    this._isWatchlist = !!film.isWatchlist;
    this._isWatched = !!film.isWatched;
    this._isFavorite = !!film.isFavorite;
    this._userRating = film.userRating;

    this._clickCloseButtonHandler = null;
    this._clickAddToWatchlistButtonHandler = null;
    this._clickMarkAsWatchedButtonHandler = null;
    this._clickFavoriteButtonHandler = null;
    this._clickRatingButtonHandler = null;
    this._clickUndoRatingButtonHandler = null;
    this._clickDeleteCommentButtonHandler = null;

    this._setAddEmotionBtnClickHandler();

    this._newOptions = null;
    this._setNewOptions();
  }

  getTemplate() {
    return createPopupTemplate(this._film, this._comments, {
      isWatchlist: this._isWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
      userRating: this._userRating,
    });
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this._setNewOptions();
    this.rerender();
  }

  rerender() {
    super.rerender();
  }

  update() {
    this._setOptions();
    this._setNewOptions();
    this.rerender();
  }

  _setNewOptions() {
    this._newOptions = this._getOptions();
  }

  _getOptions() {
    return {
      isWatchlist: this._isWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
      userRating: this._userRating,
    };
  }

  _setOptions() {
    this._isWatchlist = this._newOptions.isWatchlist;
    this._isWatched = this._newOptions.isWatched;
    this._isFavorite = this._newOptions.isFavorite;
    this._userRating = this._newOptions.userRating;
  }

  disabledCommentForm() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = true;
  }

  activatedCommentForm() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = false;
  }

  showErrorCommentForm() {
    const commentForm = this.getElement().querySelector(`.film-details__comment-input`);
    commentForm.style.border = `2px solid red`;
    this.activatedCommentForm();
  }

  showDefaultCommentForm() {
    const commentForm = this.getElement().querySelector(`.film-details__comment-input`);
    commentForm.style.border = ``;
  }

  disabledRatingScoreForm() {
    const userRatingInputs = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    userRatingInputs.forEach((input) => {
      input.disabled = true;
    });
  }

  activatedRatingScoreForm() {
    const userRatingInputs = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    userRatingInputs.forEach((input) => {
      input.disabled = false;
    });
  }

  showErrorRatingScoreForm() {
    const ratingScoreForm = this.getElement().querySelector(`.film-details__user-rating-score`);

    // const userRatingInputs = ratingScoreForm.querySelectorAll(`.film-details__user-rating-input`);
    // userRatingInputs.forEach((input) => {
    //   input.checked = false;
    // });

    ratingScoreForm.style.border = `2px solid red`;
    ratingScoreForm.style.borderRadius = `5px`;
    this.activatedRatingScoreForm();
  }

  showDefaultRatingScoreForm() {
    const ratingScoreForm = this.getElement().querySelector(`.film-details__user-rating-score`);
    ratingScoreForm.style.border = ``;
    ratingScoreForm.style.borderRadius = ``;
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

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._clickCloseButtonHandler = handler;
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this._clickAddToWatchlistButtonHandler = handler;

    this.getElement().querySelector(`.film-details__control-label--watchlist`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();

      this._newOptions.isWatchlist = !this._isWatchlist;

      handler();
    });
  }

  // если не запрашивать новые комменты при добавлении удалении, то
  // сделать по аналогии с флагам
  // в конструкторе попапа добавить комментарии
  // при добавлении

  setMarkAsWatchedButtonClickHandler(handler) {
    this._clickMarkAsWatchedButtonHandler = handler;

    this.getElement().querySelector(`.film-details__control-label--watched`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      // this._isWatched = !this._isWatched;
      // if (!this._isWatched) {
      //   this._userRating = 0;
      // }

      this._newOptions.isWatched = !this._isWatched;
      if (!this._newOptions.isWatched) {
        this._newOptions.userRating = 0;
      }

      handler();
    });
  }

  setFavoriteButtonClickHandler(handler) {
    this._clickFavoriteButtonHandler = handler;

    // .addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));

    this.getElement().querySelector(`.film-details__control-label--favorite`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();

      // this._isFavorite = !this._isFavorite;
      this._newOptions.isWatched = !this._isFavorite;

      handler();
    });
  }

  setRatingButtonClickHandler(handler) {
    this._clickRatingButtonHandler = handler;

    if (!this.getElement().querySelector(`.film-details__user-rating-score`)) {
      return;
    }

    this.getElement().querySelector(`.film-details__user-rating-score`)
    .addEventListener(`click`, (evt) => {
      // evt.preventDefault();
      const target = evt.target;

      if (!target.classList.contains(`film-details__user-rating-input`)) {
        return;
      }
      this.showDefaultRatingScoreForm();

      this._newOptions.userRating = +target.value;

      // this._userRating = +target.value;
      this.disabledRatingScoreForm();

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

      this._newOptions.userRating = 0;

      handler();
    });
  }

  _setNameDeleteButton(button, name) {
    button.textContent = name;
  }

  _disabledDeleteButton(button) {
    button.disabled = true;
  }

  // удалить коммент
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

  setComments(comments) {
    this._comments = comments;
  }

  _setAddEmotionBtnClickHandler() {
    const emotionLabelElements = this.getElement().querySelectorAll(`.film-details__emoji-item`);

    emotionLabelElements.forEach((el) => {
      el.addEventListener(`click`, (evt) => {
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
}
