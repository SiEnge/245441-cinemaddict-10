// компонент "Звание пользователя"
import AbstractComponent from './abstract-component.js';

const createPopupContainerTemplate = () => {
  return (
    `<section class="film-details">
    </section>`
  );
};

export default class PopupContainer extends AbstractComponent {
  getTemplate() {
    return createPopupContainerTemplate();
  }
}
