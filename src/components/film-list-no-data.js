// компонент "Нет данных для отображения"
import {createElement} from '../util.js';

const createFilmListNoFilmsTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`
  );
};


export default class NoFilms {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmListNoFilmsTemplate();
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

// export {createFilmListNoDataTemplate};
