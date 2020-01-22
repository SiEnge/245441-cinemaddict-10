// компонент "Сортировка"
import AbstractComponent from './abstract-component.js';

// варианты сортировки для подстановки в разметку и для отлавливания
export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

const activeSortType = (wrap, currentSortType) => {
  const activeSort = wrap.querySelector(`.sort__button--active`);
  activeSort.classList.remove(`sort__button--active`);
  currentSortType.classList.add(`sort__button--active`);
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    // установка сортировки по умолчанию
    // если бы нужно было сохранить сортировку, то при создании объекта переносилась переменная с нужной сортировкой
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  // определение выбранной пользователем сортировки
  setSortTypeChangeHandler(handler) {
    // событие клик на блоке сортировке
    this.getElement().addEventListener(`click`, (evt) => {
      // т.к. сортировка выполнена ссылкой, то нужно предотвращать поведение по умолчанию
      evt.preventDefault();

      const target = evt.target;

      // если клик не по ссылке, то выход
      if (target.tagName !== `A`) {
        return;
      }

      const sortType = target.dataset.sortType;

      // если такая сортировка уже выбрана, то выход
      // текущая сортировка current устанавливается при создании объекта Sort и равна сортировке по умолчанию
      if (this._currentSortType === sortType) {
        return;
      }

      // запись новой сортировки в current
      this._currentSortType = sortType;
      // подсветить текущую сортировку - sort__button--active
      activeSortType(this.getElement(), target);

      // выхов обработчика с новой сортировкой
      handler(this._currentSortType);
    });
  }
}
