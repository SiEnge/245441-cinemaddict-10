// компонент "Нет данных для отображения"
import AbstractComponent from './abstract-component.js';

const createFilmListNoFilmsTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`
  );
};

export default class NoFilms extends AbstractComponent {
  getTemplate() {
    return createFilmListNoFilmsTemplate();
  }
}
