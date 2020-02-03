import AbstractComponent from './abstract-component.js';

const createMovieListNoDataTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`
  );
};

export default class MoviesListNoData extends AbstractComponent {
  getTemplate() {
    return createMovieListNoDataTemplate();
  }
}
