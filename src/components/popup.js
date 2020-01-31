// компонент "Попап"
import AbstractSmartComponent from './abstract-smart-component.js';
import {formatDate, formatDateComment, parseDuration} from '../util.js';
import {CommentEmotion} from '../const.js';

const createGenresMarkup = (genres) => {
  return genres
  .map((genre) => {
    return (
      `<span class="film-details__genre">${genre}</span>`
    );
  })
  .join(`\n`);
};

const createCommentMarkup = (comment) => {
  const {id, emotion, text, author, date} = comment;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formatDateComment(date)}</span>
          <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createCommentsMarkup = (comments) => {
  return comments
  .map((it) => createCommentMarkup(it))
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

// компонент "Попап"
const createPopupTemplate = (film, comments, options = {}) => {
  const {title, originalTitle, poster, description, director, writers, actors, releaseDate,
    duration, country, genres, rating, age} = film;
  const {isWatchlist, isWatched, isFavorite, userRating} = options;

  const durationText = parseDuration(duration);

  const genresMarkup = createGenresMarkup(Array.from(genres));
  const genreTitle = (genres.size === 1) ? `Genre` : `Genres`;
  const userRatingMarkup = (userRating) ? `<p class="film-details__user-rating">Your rate ${userRating}</p>` : ``;

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

      ${isWatched ?
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
      : ``}

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
    this._clickDeleteCommentButtonHandler = null;

    this._setAddEmotionBtnClickHandler();
  }

  getTemplate() {
    return createPopupTemplate(this._film, this._comments, {
      isWatchlist: this._isWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
      userRating: this._userRating
    });
  }

  // _subscribeOnEvents() {
  //   this.setCloseButtonClickHandler(this._clickCloseButtonHandler);
  //   debugger;
  //   this.setAddToWatchlistButtonClickHandler(this._clickAddToWatchlistButtonHandler);
  //   this.setMarkAsWatchedButtonClickHandler(this._clickMarkAsWatchedButtonHandler);
  //   this.setFavoriteButtonClickHandler(this._clickFavoriteButtonHandler);
  //   this.setDeleteCommentButtonClickHandler(this._clickDeleteCommentButtonHandler);
  //   this._setAddEmotionBtnClickHandler();
  // }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._clickCloseButtonHandler);
    this.setAddToWatchlistButtonClickHandler(this._clickAddToWatchlistButtonHandler);
    this.setMarkAsWatchedButtonClickHandler(this._clickMarkAsWatchedButtonHandler);
    this.setFavoriteButtonClickHandler(this._clickFavoriteButtonHandler);
    this.setRatingButtonClickHandler(this._clickRatingButtonHandler);
    this.setDeleteCommentButtonClickHandler(this._clickDeleteCommentButtonHandler);
    this._setAddEmotionBtnClickHandler();
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._clickCloseButtonHandler = handler;
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
    .addEventListener(`click`, () => {
      handler();
      this._isWatchlist = !this._isWatchlist;
      this.rerender();
    });

    this._clickAddToWatchlistButtonHandler = handler;
  }

  setMarkAsWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
    .addEventListener(`click`, () => {
      handler();
      this._isWatched = !this._isWatched;
      this.rerender();
    });

    this._clickMarkAsWatchedButtonHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
    .addEventListener(`click`, () => {
      this._isFavorite = !this._isFavorite;
      handler();
      this.rerender();
    });

    this._clickFavoriteButtonHandler = handler;
  }

  setRatingButtonClickHandler(handler) {
    if (!this.getElement().querySelector(`.film-details__user-rating-score`)) {
      return;
    }

    this.getElement().querySelector(`.film-details__user-rating-score`)
    .addEventListener(`click`, (evt) => {
      const target = evt.target;

      if (!target.classList.contains(`film-details__user-rating-input`)) {
        return;
      }

      this._userRating = target.value;

      handler(this._userRating);
      this.rerender();
    });

    this._clickRatingButtonHandler = handler;
  }

  // удалить коммент
  setDeleteCommentButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const target = evt.target;

      if (!target.classList.contains(`film-details__comment-delete`)) {
        return;
      }

      handler(target.dataset.commentId);

      // this.rerender();
    });

    this._clickDeleteCommentButtonHandler = handler;
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


// если есть клик на кнопке что фильм просмотрен, то появляется блок
// для оценки в котором можно проставить оценку фильму

// выводить оценку пользователя если есть и назначать ее

// убрать обработчик esc


// при открытии страницы с оценкой userRating выделять ту оценку которая есть
// не добавлять обработчик если фильм не просмотрен
