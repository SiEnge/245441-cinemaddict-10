import MovieComponent from '../components/movie.js';
import PopupComponent from '../components/popup.js';
import PopupContainerComponent from '../components/popup-container.js';
import MovieModel from '../models/movie.js';
import LocalCommentModel from '../models/local-comment.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import {ChangeMode, EMPTY_USER_RATING} from '../const.js';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

const bodyElement = document.querySelector(`body`);

export default class MovieController {
  constructor(containerElement, api, onDataChange, onViewChange, onCommentsChange) {
    this._containerElement = containerElement.querySelector(`.films-list__container`);
    this._api = api;

    this._onDataChange = onDataChange;
    this._onCommentsChange = onCommentsChange;
    this._onViewChange = onViewChange;

    this._movieComponent = null;
    this._popupComponent = null;
    this._popupContainerComponent = new PopupContainerComponent();

    this._mode = Mode.DEFAULT;
    this._movie = null;
    this._comments = null;
    this._commentsModel = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCtrlEnterDown = this._onCtrlEnterDown.bind(this);
    this._setAddToWatchlistButtonClickHandler = this._setAddToWatchlistButtonClickHandler.bind(this);
    this._setMarkAsWatchedButtonClickHandler = this._setMarkAsWatchedButtonClickHandler.bind(this);
    this._setFavoriteButtonClickHandler = this._setFavoriteButtonClickHandler.bind(this);

  }

  render(movie) {
    this._movie = movie;
    const oldMovieComponent = this._movieComponent;

    this._movieComponent = new MovieComponent(movie);

    this._movieComponent.setTitleClickHandler(() => {
      this._showPopup();
    });

    this._movieComponent.setPosterClickHandler(() => {
      this._showPopup();
    });

    this._movieComponent.setCommentsClickHandler(() => {
      this._showPopup();
    });

    this._movieComponent.setAddToWatchlistButtonClickHandler(this._setAddToWatchlistButtonClickHandler);
    this._movieComponent.setMarkAsWatchedButtonClickHandler(this._setMarkAsWatchedButtonClickHandler);
    this._movieComponent.setFavoriteButtonClickHandler(this._setFavoriteButtonClickHandler);

    if (oldMovieComponent) {
      replace(this._movieComponent, oldMovieComponent);
      if (this._mode === Mode.POPUP) {
        this._updatePopup(movie);
      }
    } else {
      render(this._containerElement, this._movieComponent.getElement(), RenderPosition.BEFOREEND);
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

  showError(changeMode) {
    this._popupComponent.showError(changeMode);
  }

  _updatePopup(movie) {
    this._api.getComments(movie)
    .then((comments) => {
      this._comments = comments;
      this._popupComponent.setComments(comments);
      this._popupComponent.update();
    });
  }

  _showPopup() {
    const movie = this._movie;
    this._onViewChange();

    render(bodyElement, this._popupContainerComponent.getElement(), RenderPosition.BEFOREEND);

    this._api.getComments(movie)
    .then((comments) => {
      this._comments = comments;
      this._popupComponent = new PopupComponent(movie, comments);

      render(this._popupContainerComponent.getElement(), this._popupComponent.getElement(), RenderPosition.BEFOREEND);

      this._popupComponent.setCloseButtonClickHandler(() => {
        this._closePopup();
      });

      this._popupComponent.setAddToWatchlistButtonClickHandler(this._setAddToWatchlistButtonClickHandler);
      this._popupComponent.setMarkAsWatchedButtonClickHandler(this._setMarkAsWatchedButtonClickHandler);
      this._popupComponent.setFavoriteButtonClickHandler(this._setFavoriteButtonClickHandler);

      this._popupComponent.setRatingButtonClickHandler((userRating) => {
        const newMovie = MovieModel.clone(this._movie);
        newMovie.userRating = userRating;
        this._onDataChange(this, this._movie, newMovie, ChangeMode.RATING);
      });

      this._popupComponent.setUndoRatingButtonClickHandler(() => {
        const newMovie = MovieModel.clone(this._movie);
        newMovie.userRating = EMPTY_USER_RATING;

        this._onDataChange(this, this._movie, newMovie, ChangeMode.DEFAULT);
      });

      this._popupComponent.setDeleteCommentButtonClickHandler((commentId) => {
        const index = this._comments.findIndex((it) => it.id === commentId);

        if (index === -1) {
          return;
        }

        this._onCommentsChange(this, this._movie, this._comments, this._comments[index], null);
      });

      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onCtrlEnterDown);
    });

    this._mode = Mode.POPUP;
  }

  _setAddToWatchlistButtonClickHandler() {
    const newMovie = MovieModel.clone(this._movie);
    newMovie.isWatchlist = !newMovie.isWatchlist;
    this._onDataChange(this, this._movie, newMovie, ChangeMode.DEFAULT);
  }

  _setMarkAsWatchedButtonClickHandler() {
    const newMovie = MovieModel.clone(this._movie);
    newMovie.isWatched = !newMovie.isWatched;
    if (newMovie.isWatched) {
      newMovie.watchingDate = new Date();
    }
    this._onDataChange(this, this._movie, newMovie, ChangeMode.DEFAULT);
  }

  _setFavoriteButtonClickHandler() {
    const newMovie = MovieModel.clone(this._movie);
    newMovie.isFavorite = !newMovie.isFavorite;
    this._onDataChange(this, this._movie, newMovie, ChangeMode.DEFAULT);
  }

  _closePopup() {
    remove(this._popupContainerComponent);

    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onCtrlEnterDown);
    this._mode = Mode.DEFAULT;
  }

  _sendComment(textComment, emotionComment) {
    const newComment = LocalCommentModel.parseComment({comment: textComment, date: new Date(), emotion: emotionComment});
    this._onCommentsChange(this, this._movie, this._comments, null, newComment, ChangeMode.COMMENT);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
    }
  }

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
