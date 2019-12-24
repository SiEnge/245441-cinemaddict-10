import {createFilmCardTemplate} from '../components/film-card.js';

// компонент "Контейнер для карточек фильма"
const createFilmsContainerTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        <div class="films-list__container"></div>
      </section>
    </section>`
  );
};

const createExtraFilmsTemplate = (films, title) => {
  if (films.length === 0) {
    return ``;
  }

  const filmsMarkup = films.map((film) => createFilmCardTemplate(film));
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container">
        ${filmsMarkup}
      </div>
    </section>`
  );
};

export {createFilmsContainerTemplate, createExtraFilmsTemplate};
