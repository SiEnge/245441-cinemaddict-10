import FilmComponent from '../components/film.js';
import PopupComponent from '../components/popup.js';
import PopupContainerComponent from '../components/popup-container.js';
import {render, replace, RenderPosition} from '../util.js';
import FilmModel from '../models/movie.js';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, onCommentsChange) {
    this._container = container.querySelector(`.films-list__container`);

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


    // активация обработчика Escape
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCtrlEnterDown = this._onCtrlEnterDown.bind(this);

  }

  render(film) {
    this._film = film;
    // для перерисовки конкретной карточки нужно завести новые переменные
    const oldFilmComponent = this._filmComponent;
    // const oldPopupComponent = this._popupComponent;

    this._filmComponent = new FilmComponent(film);
    // this._popupComponent = new PopupComponent(film);


    // обработчики на карточке фильма
    // клик по карточке в определенной области (переделать на клики по каждой области)
    // => открывает попап


    this._filmComponent.setTitleClickHandler(() => {
      this._showPopup(film);
    });

    this._filmComponent.setPosterClickHandler(() => {
      this._showPopup(film);
      // document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmComponent.setCommentsClickHandler(() => {
      this._showPopup(film);
      // document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    // клик по кнопке добавить в вишлист
    // => вызывает метод, который описан в контроллере уровнем выше, ктр
    // при этом обновляет данные в модели
    this._filmComponent.setAddToWatchlistButtonClickHandler(() => {
      const newFilm = FilmModel.clone(film);
      newFilm.isWatchlist = !newFilm.isWatchlist;
      this._onDataChange(this, film, newFilm);

      // this._onDataChange(this, film, Object.assign({}, film, {
      //   isWatchlist: !film.isWatchlist,
      // }));
    });

    this._filmComponent.setMarkAsWatchedButtonClickHandler(() => {
      const newFilm = FilmModel.clone(film);
      newFilm.isWatched = !newFilm.isWatched;

      this._onDataChange(this, film, newFilm);
      // this._onDataChange(this, film, Object.assign({}, film, {
      //   isWatched: !film.isWatched,
      // }));
    });

    this._filmComponent.setFavoriteButtonClickHandler(() => {
      const newFilm = FilmModel.clone(film);
      newFilm.isFavorite = !newFilm.isFavorite;

      this._onDataChange(this, film, newFilm);

      // this._onDataChange(this, film, Object.assign({}, film, {
      //   isFavorite: !film.isFavorite,
      // }));
    });

    // здесь логика отрисовки фильма если он новый или нужно только изменить данные
    if (oldFilmComponent) { // если в этом инстансе уже есть фильм, то заменить новым
      // debugger;
      replace(this._filmComponent, oldFilmComponent);
      // replace(this._popupComponent, oldPopupComponent);
    } else { // если нет, то просто отрисовать
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

    render(document.querySelector(`body`), this._popupContainerComponent.getElement(), RenderPosition.BEFOREEND);


    this._popupComponent = new PopupComponent(film);
    render(this._popupContainerComponent.getElement(), this._popupComponent.getElement(), RenderPosition.BEFOREEND);
    // render(document.querySelector(`body`), this._popupComponent.getElement(), RenderPosition.BEFOREEND);

    document.addEventListener(`keydown`, this._onEscKeyDown);
    document.addEventListener(`keydown`, this._onCtrlEnterDown);

    // обработчики на попапе фильма
    this._popupComponent.setCloseButtonClickHandler(() => {
      // debugger;
      this._closePopup();
    });

    this._popupComponent.setAddToWatchlistButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatchlist: !film.isWatchlist,
      }));
    });

    this._popupComponent.setMarkAsWatchedButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    });

    this._popupComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    });

    this._popupComponent.setDeleteCommentButtonClickHandler((commentId) => {
      const index = film.comments.findIndex((it) => it.id === commentId);
      this._onCommentsChange(this, film, film.comments[index], null);
    });

    // this._popupComponent.setAddCommentButtonClickHandler((comment) => {
    //   // debugger;
    //   // const index = film.comments.findIndex((it) => it.id === commentId);
    //   this._onCommentsChange(this, film, null, comment);
    // });

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
      const input = this._popupComponent.getElement().querySelector(`.film-details__comment-input`);

      this._onCommentsChange(this, this._film, null, {
        text: input.value,
        date: new Date(),
        emoji: `angry.png`
      });

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
