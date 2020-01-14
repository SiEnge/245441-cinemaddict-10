import moment from 'moment';
import {FilterType} from './const.js';


export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDateYear = (date) => {
  return moment(date).format(`YYYY`);
};
// 30 March 1945

// экспорт констант места вставки
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

// разобраться?? не работает
export const getRandomIntegerNumber = (min, max) => {
  // return min + Math.floor(max * Math.random());
  return min + Math.floor((max - min) * Math.random());
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

// создание dom элемента (отказ от вставки чисто разметки в верстку)
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

// вставка элемент в контейнер (отказ от insertAjast)
export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

// функция замены компонентов
export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

// функция для удаления элемента
export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

// фильтры (перенести в отдельный утиль)


const getWatchlistFilms = (films) => {
  return films.filter((film) => film.isWatchlist);
};

const getHistoryFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

const getFavoritesFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};


// получить список отфильтрованных фильмов
export const getFilmsByFilter = (films, filterType) => {
  let filteredFilms;
  // debugger;
  switch (filterType) {
    case FilterType.ALL:
      filteredFilms = films;
      break;
    case FilterType.WATCHLIST:
      filteredFilms = getWatchlistFilms(films);
      break;
    case FilterType.HISTORY:
      filteredFilms = getHistoryFilms(films);
      break;
    case FilterType.FAVORITES:
      filteredFilms = getFavoritesFilms(films);
      break;
  }
  return filteredFilms;
};
