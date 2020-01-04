// компонент "Список всех фильмов Экстра""
import {createElement} from '../util.js';

const createFilmListExtraTemplate = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container"></div>
    </section>`
  );
};

// const createExtraFilmsTemplate = (films, title) => {
//   if (films.length === 0) {
//     return ``;
//   }

//   const filmsMarkup = films.map((film) => createFilmCardTemplate(film));
//   return (
//     `<section class="films-list--extra">
//       <h2 class="films-list__title">${title}</h2>
//       <div class="films-list__container">
//         ${filmsMarkup}
//       </div>
//     </section>`
//   );
// };

export default class FilmListExtra {
  constructor(title) {
    this._title = title;
    this._element = null;
  }

  getTemplate() {
    return createFilmListExtraTemplate(this._title);
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

