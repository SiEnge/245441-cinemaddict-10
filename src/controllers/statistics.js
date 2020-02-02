import StatisticsComponent from '../components/statistics.js';
import {StatiscticsPeriod} from '../const.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {getWatchedFilmsByPeriod, getDurationFilm, getTopGenreFilm, getSortCountFilmGenres} from '../utils/statistics.js';
import {getWatchedMovies, getTitleProfile} from '../utils/common.js';

export default class Statistics {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._statisticsComponent = null;

    this._onStatisticsPeriodChange = this._onStatisticsPeriodChange.bind(this);

    this._activePeriod = StatiscticsPeriod.ALLTIME;
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.getFilmsAll();
    const watchedFilms = getWatchedMovies(allFilms);
    const watchedFilmsByPeriod = getWatchedFilmsByPeriod(watchedFilms, this._activePeriod);

    const statisticsData = {
      count: watchedFilmsByPeriod.length,
      duration: getDurationFilm(watchedFilmsByPeriod),
      genre: getTopGenreFilm(watchedFilmsByPeriod),
      userRank: getTitleProfile(watchedFilms.length),
    };

    const ratingGenres = getSortCountFilmGenres(watchedFilmsByPeriod);

    const periods = Object.values(StatiscticsPeriod).map((statiscticsPeriod) => {
      return {
        name: statiscticsPeriod,
        checked: statiscticsPeriod === this._activePeriod,
      };
    });

    const oldComponent = this._statisticsComponent;

    this._statisticsComponent = new StatisticsComponent(statisticsData, ratingGenres, periods);
    this._statisticsComponent.setStatisticsFilterClickHandler(this._onStatisticsPeriodChange);

    if (oldComponent) {
      replace(this._statisticsComponent, oldComponent);
    } else {
      render(container, this._statisticsComponent.getElement(), RenderPosition.BEFOREEND);
      this.hide();
    }
  }

  _onStatisticsPeriodChange(period) {
    this._activePeriod = period;
    this.render();
  }

  hide() {
    this._statisticsComponent.hide();
  }

  show() {
    this.render();
    this._statisticsComponent.show();
  }
}
