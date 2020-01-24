// компонент "Меню"
import AbstractComponent from './abstract-component.js';
import {FilterType} from '../const.js';
// import {createElementAll} from '../util.js';

const NameToTitleFilter = {
  'all': `All movies`,
  'watchlist': `Watchlist`,
  'history': `History`,
  'favorites': `Favorites`
};

const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter;
  const countMarkup = (name === FilterType.ALL) ? NameToTitleFilter[name] : `${NameToTitleFilter[name]} <span class="main-navigation__item-count">${count}</span>`;

  return (
    `<a href="#${name}" data-filter-type="${name}" class="main-navigation__item ${isChecked ? `main-navigation__item--active` : ``}">${countMarkup}</a>`
  );
};

const createFilterTemplate = (filters) => {

  // const filtersMarkup = filters
  // .map((it) => createFilterMarkup(it, it.checked))
  // .join(`\n`);

  // debugger;
  // return (
  //   `<div>
  //       ${filtersMarkup}
  //   </div>`
  //   );

  // return filters
  // .map((it) => createFilterMarkup(it, it.checked))
  // .join(`\n`);


  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.checked)).join(`\n`);

  return (
    `<nav class="main-navigation">
      ${filtersMarkup}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
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

      if (evt.target.classList.contains(`main-navigation__item--additional`)) {
        return;
      }

      const filterName = evt.target.dataset.filterType;
      handler(filterName);
    });
  }

  setStatisticsClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__item--additional`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.classList.contains(`main-navigation__item--active`)) {
        return;
      }

      handler();
    });
  }
}


// выделить выбранный филтр/статистику, а с остальных сбросить выделение
