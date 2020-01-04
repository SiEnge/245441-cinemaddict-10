// компонент "Контейнер для карточек фильма"
import {createElement} from '../util.js';

const createFilmsContainerTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class Films {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsContainerTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

