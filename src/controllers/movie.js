import FilmComponent from '../components/film.js';
import PopupComponent from '../components/popup.js';
import PopupContainerComponent from '../components/popup-container.js';
import FilmModel from '../models/movie.js';
import LocalCommentModel from '../models/local-comment.js';
import {render, replace, RenderPosition} from '../utils/render.js';
// import {CommentEmotion} from '../const.js';
const SHAKE_ANIMATION_TIMEOUT = 600;

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};


export default class MovieController {
  constructor(container, api, onDataChange, onViewChange, onCommentsChange) {
    this._container = container.querySelector(`.films-list__container`);
    this._api = api;

    this._onDataChange = onDataChange;
    this._onCommentsChange = onCommentsChange;
    this._onViewChange = onViewChange;

    this._filmComponent = null;
    this._popupComponent = null;
    this._popupContainerComponent = new PopupContainerComponent();

    this._mode = Mode.DEFAULT;
    this._film = null;
    this._comments = null;
    this._commentsModel = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCtrlEnterDown = this._onCtrlEnterDown.bind(this);
  }

  render(film) {
    this._film = film;
    const oldFilmComponent = this._filmComponent;

    this._filmComponent = new FilmComponent(film);

    this._filmComponent.setTitleClickHandler(() => {
      this._showPopup();
    });

    this._filmComponent.setPosterClickHandler(() => {
      this._showPopup();
    });

    this._filmComponent.setCommentsClickHandler(() => {
      this._showPopup();
    });

    this._filmComponent.setAddToWatchlistButtonClickHandler(() => {
      const newFilm = FilmModel.clone(film);
      newFilm.isWatchlist = !newFilm.isWatchlist;
      this._onDataChange(this, film, newFilm);
    });

    this._filmComponent.setMarkAsWatchedButtonClickHandler(() => {
      const newFilm = FilmModel.clone(film);
      newFilm.isWatched = !newFilm.isWatched;
      if (newFilm.isWatched) {
        newFilm.watchingDate = new Date();
      }
      this._onDataChange(this, film, newFilm);
    });

    this._filmComponent.setFavoriteButtonClickHandler(() => {
      const newFilm = FilmModel.clone(film);
      newFilm.isFavorite = !newFilm.isFavorite;
      this._onDataChange(this, film, newFilm);
    });

    if (oldFilmComponent) {
      replace(this._filmComponent, oldFilmComponent);
      if (this._mode === Mode.POPUP) {
        this._updatePopup(film);
      }
    } else {
      render(this._container, this._filmComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  resetPopup() {
    this._popupComponent.reset();
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  showErrorCommentForm() {
    const commentForm = this._popupComponent.getElement().querySelector(`.film-details__comment-input`);
    this._popupComponent.showErrorCommentForm();
    this.shake(commentForm);
  }

  showErrorRatingScoreForm() {
    const ratingScoreForm = this._popupComponent.getElement().querySelector(`.film-details__user-rating-score`);
    this._popupComponent.showErrorRatingScoreForm();
    this.shake(ratingScoreForm);
  }


  shake(element) {
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      element.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _updatePopup(film) {
    this._api.getComments(film)
    .then((comments) => {
      this._comments = comments;
      this._popupComponent.setComments(comments);
      this._popupComponent.update();
    });

  }

  _showPopup() {
    const film = this._film;
    this._onViewChange();

    render(document.querySelector(`body`), this._popupContainerComponent.getElement(), RenderPosition.BEFOREEND);

    this._api.getComments(film)
    .then((comments) => {
      this._comments = comments;
      this._popupComponent = new PopupComponent(film, comments);

      render(this._popupContainerComponent.getElement(), this._popupComponent.getElement(), RenderPosition.BEFOREEND);

      this._popupComponent.setCloseButtonClickHandler(() => {
        this._closePopup();
      });

      this._popupComponent.setAddToWatchlistButtonClickHandler(() => {
        const newFilm = FilmModel.clone(this._film);
        newFilm.isWatchlist = !newFilm.isWatchlist;
        this._onDataChange(this, this._film, newFilm);
      });

      this._popupComponent.setMarkAsWatchedButtonClickHandler(() => {
        const newFilm = FilmModel.clone(this._film);
        newFilm.isWatched = !newFilm.isWatched;
        if (!newFilm.isWatched) {
          newFilm.userRating = 0;
        } else {
          newFilm.watchingDate = new Date();
        }
        this._onDataChange(this, this._film, newFilm);
      });

      this._popupComponent.setFavoriteButtonClickHandler(() => {
        const newFilm = FilmModel.clone(this._film);
        newFilm.isFavorite = !newFilm.isFavorite;
        this._onDataChange(this, this._film, newFilm);
      });

      this._popupComponent.setRatingButtonClickHandler((userRating) => {
        const newFilm = FilmModel.clone(this._film);
        newFilm.userRating = userRating;
        this._onDataChange(this, this._film, newFilm, `setRating`);
      });

      this._popupComponent.setUndoRatingButtonClickHandler(() => {
        const newFilm = FilmModel.clone(this._film);
        newFilm.userRating = 0;

        this._onDataChange(this, this._film, newFilm);
      });

      this._popupComponent.setDeleteCommentButtonClickHandler((commentId) => {
        const index = this._comments.findIndex((it) => it.id === commentId);

        if (index === -1) {
          return;
        }

        this._onCommentsChange(this, this._film, this._comments, this._comments[index], null);
      });

      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onCtrlEnterDown);
    });

    this._mode = Mode.POPUP;
  }

  _closePopup() {
    this._popupContainerComponent.getElement().remove();
    this._popupContainerComponent.removeElement();

    // this._popupComponent.getElement().remove();
    // this._popupComponent.removeElement();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onCtrlEnterDown);
    this._mode = Mode.DEFAULT;
  }

  _sendComment(textComment, emotionComment) {
    // const comment = {comment: textComment, date: new Date(), emotion: emotionComment};

    const newComment = LocalCommentModel.parseComment({comment: textComment, date: new Date(), emotion: emotionComment});
    this._onCommentsChange(this, this._film, this._comments, null, newComment);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
    }
  }

  // отправка сообщения
  _onCtrlEnterDown(evt) {
    const isEnterKey = evt.key === `Enter`;

    if ((evt.ctrlKey || evt.metaKey) && isEnterKey) {
      const inputElement = this._popupComponent.getElement().querySelector(`.film-details__comment-input`);
      const emotionElement = this._popupComponent.getElement().querySelector(`.film-details__add-emoji-label`);

      if (inputElement.value === `` || emotionElement.dataset.emotion === ``) {
        return;
      }

      this._popupComponent.showDefaultCommentForm();
      this._popupComponent.disabledCommentForm();

      this._sendComment(inputElement.value, emotionElement.dataset.emotion);
    }
  }
}
