// компонент "Меню"

export const createMenuTemplate = (filter) => {
  const {countWatchlist, countHistory, countFavorites} = filter;

  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${countWatchlist}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${countHistory}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${countFavorites}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`
  );
};
