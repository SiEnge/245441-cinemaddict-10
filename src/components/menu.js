import AbstractComponent from './abstract-component.js';
import {PageMode, ACTIVE_NAVIGATION_CLASS} from '../const.js';

const createMenuTemplate = () => {
  return (
    `<a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>`
  );
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setStatisticsClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const btnStat = evt.target;

      if (btnStat.classList.contains(ACTIVE_NAVIGATION_CLASS)) {
        handler(PageMode.MOVIE);
        btnStat.classList.remove(ACTIVE_NAVIGATION_CLASS);
      } else {
        handler(PageMode.STAT);
        btnStat.classList.add(ACTIVE_NAVIGATION_CLASS);
      }
    });
  }
}
