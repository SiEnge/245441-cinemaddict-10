// компонент "Контейнер для карточек фильма"
import AbstractComponent from './abstract-component.js';

const createFilmsContainerTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class Films extends AbstractComponent {
  getTemplate() {
    return createFilmsContainerTemplate();
  }
}
