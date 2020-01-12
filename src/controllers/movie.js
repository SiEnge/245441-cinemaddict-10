import FilmComponent from '../components/film.js';
import PopupComponent from '../components/popup.js';
import {render, replace, RenderPosition} from '../util.js';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container.querySelector(`.films-list__container`);

    //
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    // инстансы класс фильма и попапа
    this._filmComponent = null;
    this._popupComponent = null;

    this._mode = Mode.DEFAULT;


    // активация обработчика Escape
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
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
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatchlist: !film.isWatchlist,
      }));
    });

    this._filmComponent.setMarkAsWatchedButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    });

    this._filmComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
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

    this._popupComponent = new PopupComponent(film);
    render(document.querySelector(`body`), this._popupComponent.getElement(), RenderPosition.BEFOREEND);

    document.addEventListener(`keydown`, this._onEscKeyDown);

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

    this._mode = Mode.POPUP;
  }

  // удаляем этот элемент полностью, т.к. все равно каждый раз его отрисовываем
  _closePopup() {
    this._popupComponent.getElement().remove();
    this._popupComponent.removeElement();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
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
      this._popupComponent.getElement().remove();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
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
