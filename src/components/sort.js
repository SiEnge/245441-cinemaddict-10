// компонент "Сортировка"
import AbstractComponent from './abstract-component.js';

import {SortType, ACTIVE_SORT_CLASS} from '../const.js';
import {activateElement} from '../utils/common.js';

const createSortingMarkup = (sorting, isChecked) => {
  const {name} = sorting;

  return (
    `<li><a href="#" data-sort-type="${name}" class="sort__button ${isChecked ? ACTIVE_SORT_CLASS : ``}">Sort by ${name}</a></li>`
  );
};

const createSortTemplate = (activeSortType) => {
  const sorting = Object.values(SortType).map((sortType) => {
    return {
      name: sortType,
      checked: sortType === activeSortType,
    };
  });

  const sortingMarkup = sorting.map((it) => createSortingMarkup(it, it.checked)).join(`\n`);

  return (
    `<ul class="sort">
      ${sortingMarkup}
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._activeSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate(this._activeSortType);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const target = evt.target;

      if (target.tagName !== `A`) {
        return;
      }

      const sortType = target.dataset.sortType;

      if (this._activeSortType === sortType) {
        return;
      }

      this._activeSortType = sortType;

      activateElement(this.getElement(), target, ACTIVE_SORT_CLASS);

      handler(this._activeSortType);
    });
  }
}
