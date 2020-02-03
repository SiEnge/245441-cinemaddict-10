import AbstractComponent from './abstract-component.js';

const createMovieListLoadingTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>`
  );
};

export default class MoviesListLoading extends AbstractComponent {
  getTemplate() {
    return createMovieListLoadingTemplate();
  }
}
