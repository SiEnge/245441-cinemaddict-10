// компонент "Карточка фильма"
export const createFilmCardTemplate = (film) => {

  const {title, poster, description, year, duration, genre, rating, comments} = film;

  // // флаг в списке просмотра
  // isAddToWatchlist: Math.random() > 0.5,

  // // флаг просмотрен
  // isWatched: Math.random() > 0.5,

  // // флаг избранное
  // isFavorite: Math.random() > 0.5,

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${comments} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};


