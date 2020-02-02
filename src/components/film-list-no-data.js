// компонент "Нет данных для отображения"
import AbstractComponent from './abstract-component.js';

const createFilmListNoDataTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`
  );
};

export default class FilmsListNoData extends AbstractComponent {
  getTemplate() {
    return createFilmListNoDataTemplate();
  }
}
