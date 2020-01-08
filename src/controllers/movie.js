import FilmComponent from '../components/film.js';
import PopupComponent from '../components/popup.js';
import {render, RenderPosition} from '../util.js';

export default class MovieController {
  constructor(container) {
    this._container = container;

    // инстансы класс фильма и попапа
    this._filmComponent = null;
    this._popupComponent = null;

    // активация обработчика Escape
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    this._filmComponent = new FilmComponent(film);
    this._popupComponent = new PopupComponent(film);

    const bodyElement = document.querySelector(`body`);

    this._filmComponent.setClickHandler(() => {

      render(bodyElement, this._popupComponent.getElement(), RenderPosition.BEFOREEND);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._popupComponent.setCloseButtonClickHandler(() => {
      this._popupComponent.getElement().remove();
    });

    render(this._container, this._filmComponent.getElement(), RenderPosition.BEFOREEND);
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
