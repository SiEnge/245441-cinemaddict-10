import FilmComponent from '../components/film.js';
import PopupComponent from '../components/popup.js';
import PopupContainerComponent from '../components/popup-container.js';
import {render, replace, RenderPosition} from '../util.js';
import FilmModel from '../models/movie.js';
// import CommentsModel from '../models/comments.js';
import LocalCommentModel from '../models/local-comment.js';
// import {CommentEmotion} from '../const.js';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};


export default class MovieController {
  constructor(container, api, onDataChange, onViewChange, onCommentsChange) {
    this._container = container.querySelector(`.films-list__container`);
    this._api = api;

    // присвоение обработчиков pageController контроллеру фильма
    this._onDataChange = onDataChange; // при изменении  данных
    this._onViewChange = onViewChange; // вернуть карточки фильмов в состояние по умолчанию
    this._onCommentsChange = onCommentsChange; // вернуть карточки фильмов в состояние по умолчанию

    // инстансы класс фильма и попапа
    // это вьюхи, т.е. отображение карточки фильма и попапа
    this._filmComponent = null;
    this._popupComponent = null;
    this._popupContainerComponent = new PopupContainerComponent();

    // режим контроллера, т.е. по умолчанию показывать карточку фильма
    this._mode = Mode.DEFAULT;
    this._film = null;
    this._comments = null;


    // активация обработчика Escape
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCtrlEnterDown = this._onCtrlEnterDown.bind(this);

  }

  render(film) {
    this._film = film;
    const oldFilmComponent = this._filmComponent;

    this._filmComponent = new FilmComponent(film);

    this._filmComponent.setTitleClickHandler(() => {
      this._showPopup(film);
    });

    this._filmComponent.setPosterClickHandler(() => {
      this._showPopup(film);
    });

    this._filmComponent.setCommentsClickHandler(() => {
      this._showPopup(film);
    });

    this._filmComponent.setAddToWatchlistButtonClickHandler(() => {
      const newFilm = FilmModel.clone(film);
      newFilm.isWatchlist = !newFilm.isWatchlist;
      this._onDataChange(this, film, newFilm);
    });

    this._filmComponent.setMarkAsWatchedButtonClickHandler(() => {
      const newFilm = FilmModel.clone(film);
      newFilm.isWatched = !newFilm.isWatched;
      this._onDataChange(this, film, newFilm);
    });

    this._filmComponent.setFavoriteButtonClickHandler(() => {
      const newFilm = FilmModel.clone(film);
      newFilm.isFavorite = !newFilm.isFavorite;
      this._onDataChange(this, film, newFilm);
    });

    if (oldFilmComponent) {
      replace(this._filmComponent, oldFilmComponent);
    } else {
      render(this._container, this._filmComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    // debugger;
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  // какждый раз при открытии попапа мы его отрисовываем
  _showPopup(film) {
    this._onViewChange();

    // при открытии попапа загружать список комментарий
    // т.е. создать попап, повесить обработчики

    render(document.querySelector(`body`), this._popupContainerComponent.getElement(), RenderPosition.BEFOREEND);

    // запрос списка комментарий и потом уже отрисовывать попап
    // хорошо бы его перевестив контроллер, типа PopupController
    this._api.getComments(film.id)
    .then((comments) => {
      this._comments = comments;
      // нужно ли это?
      // const commentsModel = new CommentsModel();
      // commentsModel.setComments(comments);

      // const comments = commentsModel.getComments();

      this._popupComponent = new PopupComponent(film, comments);

      // отрисовка и навешивание обработчиков на попап
      render(this._popupContainerComponent.getElement(), this._popupComponent.getElement(), RenderPosition.BEFOREEND);

      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onCtrlEnterDown);

      // обработчики на попапе фильма
      this._popupComponent.setCloseButtonClickHandler(() => {
        this._closePopup();
      });

      this._popupComponent.setAddToWatchlistButtonClickHandler(() => {
        const newFilm = FilmModel.clone(film);
        newFilm.isWatchlist = !newFilm.isWatchlist;
        this._onDataChange(this, film, newFilm);
      });

      this._popupComponent.setMarkAsWatchedButtonClickHandler(() => {
        const newFilm = FilmModel.clone(film);
        newFilm.isWatched = !newFilm.isWatched;
        this._onDataChange(this, film, newFilm);
      });

      this._popupComponent.setFavoriteButtonClickHandler(() => {
        const newFilm = FilmModel.clone(film);
        newFilm.isFavorite = !newFilm.isFavorite;
        this._onDataChange(this, film, newFilm);
      });

      this._popupComponent.setRatingButtonClickHandler((userRating) => {
        const newFilm = FilmModel.clone(film);
        newFilm.userRating = userRating;
        this._onDataChange(this, film, newFilm);
      });

      this._popupComponent.setDeleteCommentButtonClickHandler((commentId) => {
        const index = this._comments.findIndex((it) => it.id === commentId);
        this._onCommentsChange(this, film, this._comments[index], null);
      });
    });

    this._mode = Mode.POPUP;
  }

  // удаляем этот элемент полностью, т.к. все равно каждый раз его отрисовываем
  _closePopup() {
    this._popupContainerComponent.getElement().remove();
    this._popupContainerComponent.removeElement();

    // this._popupComponent.getElement().remove();
    // this._popupComponent.removeElement();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onCtrlEnterDown);
    this._mode = Mode.DEFAULT;

  }

  // метод для обработки клика на Escape
  // данная фунцкия раньше просто лежала в функции отрисовки фильма
  // а теперь перенесена в метод класса MovieController
  // и теперь при назначении этого обработчика нужно использовать this._
  // и в конструкторе сразу его назначать, т.е.
  // он сразу инициализируется когда создается фильм
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

      if (inputElement.value === ``) {
        return;
      }

      const emotionElement = this._popupComponent.getElement().querySelector(`.film-details__add-emoji-label`);

      const comment = {
        text: inputElement.value,
        date: new Date(),
        emotion: emotionElement.dataset.emotion,
      };

      // debugger;

      const newComment = LocalCommentModel.parseComment(comment);
      this._onCommentsChange(this, this._film, null, newComment);


      this._popupComponent.rerender();
    }
  }

}

// в учебном проекте есть методы replace и rerender
// они похожи но выполняют разные задачи
// replace
// чтобы переключиться на форму редактирования удаляем из верстки карточку и на ее место
// ставим форму редактирования. данные используются те же
// при replace берутся их разметка и заменяется одно на другое

// rerender
// нужно для перерисовки элемента одного элемента
// т.е. есть старая разметка со старыми данными и есть новая разметки с новыми данными
// старую разметку удаляем из компонента с помощью removeElement (удаляет только разметку)
// ! но это еще не удаление из верстки
// сохраняем в переменную новую разметку с новыми данными (а новая разметка создается
//   на момент получения ссылки на этот элемент getElement(если элемент пустой то сделать новую разметку))
// и меняем разметку старую на новую


// при открытии попапа запрашивать все комментарии для конкретно этого фильма
// потом
// - или добавить его в данные фильма или создать новый данные типа комментарии
// и тогда при обновлении именно данных фильмов - комментарии сохраняются (по крайней мере должны)

// при отправке комментария при клике на e,oji подставлять в соответствующее окно
// и не отправлять, пока эмоция не выбрана (всплываюищий текст - выберите эмоцию)
