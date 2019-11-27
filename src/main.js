import {createProfileTemplate} from './components/profile.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sort.js';
import {createFilmContainerTemplate} from './components/film-container.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createPopupTemplate} from './components/popup.js';

const FILM_COUNT = 5;
const FILM_EXTRA_COUNT = 2;
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);

// функция вставки компонента на страницу
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// 1. вставка в шапку "Звание пользователя"
render(headerElement, createProfileTemplate(), `beforeend`);

// 2. вставка в тело "Меню"
render(mainElement, createMenuTemplate(), `beforeend`);

// 3. вставка в тело "Сортировка"
render(mainElement, createSortTemplate(), `beforeend`);

// 4. вставка в тело "Контейнер для карточек фильма"
render(mainElement, createFilmContainerTemplate(), `beforeend`);


// 5. вставка "Карточки фильма"
const filmContainerElement = mainElement.querySelector(`.films-list__container`);
for (let i = 0; i < FILM_COUNT; i++) {
  render(filmContainerElement, createFilmCardTemplate(), `beforeend`);
}

const filmExtraElements = mainElement.querySelectorAll(`.films-list--extra`);

for (const filmExtra of filmExtraElements) {
  for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
    render(filmExtra.querySelector(`.films-list__container`), createFilmCardTemplate(), `beforeend`);
  }
}

// 6. вставка "Кнопки Показать еще"
const filmElement = mainElement.querySelector(`.films-list`);
render(filmElement, createShowMoreButtonTemplate(), `beforeend`);

// 7. вставка в тело "Попап"
render(footerElement, createPopupTemplate(), `afterend`);
