import AbstractComponent from './abstract-component.js';

const createFilmListLoadingTemplate = () => {
  // debugger;
  return (
    `<section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>`
  );
};

export default class FilmsListLoading extends AbstractComponent {
  getTemplate() {
    return createFilmListLoadingTemplate();
  }
}
