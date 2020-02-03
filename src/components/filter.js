import AbstractComponent from './abstract-component.js';
import {activateElement} from '../utils/common.js';
import {FilterType, ACTIVE_NAVIGATION_CLASS} from '../const.js';

const TitleFilter = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
};

const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter;
  const countMarkup = (name === FilterType.ALL) ? TitleFilter[name.toUpperCase()] : `${TitleFilter[name.toUpperCase()]} <span class="main-navigation__item-count">${count}</span>`;

  return (
    `<a href="#${name}" data-filter-type="${name}" class="main-navigation__item ${isChecked ? ACTIVE_NAVIGATION_CLASS : ``}">${countMarkup}</a>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.checked)).join(`\n`);

  return (
    `<nav class="main-navigation">
      ${filtersMarkup}
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const target = evt.target;

      if (target.classList.contains(`main-navigation__item--additional`)) {
        return;
      }

      activateElement(this.getElement(), target, ACTIVE_NAVIGATION_CLASS);

      const filterName = target.dataset.filterType;
      handler(filterName);
    });
  }

  setStatisticsClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__item--additional`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.classList.contains(ACTIVE_NAVIGATION_CLASS)) {
        return;
      }

      handler();
    });
  }
}
