import FilmComponent from '../components/film.js';
import PopupComponent from '../components/popup.js';
import {render, replace, RenderPosition} from '../util.js';

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container.querySelector(`.films-list__container`);

    //
    this._onDataChange = onDataChange;

    // инстансы класс фильма и попапа
    this._filmComponent = null;
    this._popupComponent = null;

    // активация обработчика Escape
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    // для перерисовки конкретной карточки нужно завести новые переменные
    const oldFilmComponent = this._filmComponent;
    const oldPopupComponent = this._popupComponent;

    this._filmComponent = new FilmComponent(film);
    this._popupComponent = new PopupComponent(film);

    const bodyElement = document.querySelector(`body`);

    this._filmComponent.setClickHandler(() => {
      render(bodyElement, this._popupComponent.getElement(), RenderPosition.BEFOREEND);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });


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


    this._popupComponent.setAddToWatchlistButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatchlist: !film.isWatchlist,
      }));
    });

    this._popupComponent.setMarkAsWatchedButtonClickHandler(() => {
      // debugger;
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    });

    this._popupComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    });


    this._popupComponent.setCloseButtonClickHandler(() => {
      this._popupComponent.getElement().remove();
    });

    // здесь логика отрисовки фильма если он новый или нужно только изменить данные
    if (oldFilmComponent && oldPopupComponent) { // если в этом инстансе уже есть фильм, то заменить новым
      replace(this._filmComponent, oldFilmComponent);
      replace(this._popupComponent, oldPopupComponent);
    } else { // если нет, то просто отрисовать
      render(this._container, this._filmComponent.getElement(), RenderPosition.BEFOREEND);
    }

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

