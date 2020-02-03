import AbstractComponent from './abstract-component.js';

const createMoviesContainerTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class MoviesContainer extends AbstractComponent {
  getTemplate() {
    return createMoviesContainerTemplate();
  }
}
