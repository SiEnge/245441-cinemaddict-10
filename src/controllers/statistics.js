import StatisticsComponent from '../components/statistics.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {getWatchedMoviesByPeriod, getDurationMovie, getTopGenreMovie, getSortCountMovieGenres} from '../utils/statistics.js';
import {getWatchedMovies, getTitleProfile} from '../utils/common.js';
import {StatiscticsPeriod} from '../const.js';

export default class Statistics {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._statisticsComponent = null;

    this._onStatisticsPeriodChange = this._onStatisticsPeriodChange.bind(this);

    this._activePeriod = StatiscticsPeriod.ALLTIME;
  }

  render() {
    const container = this._container;
    const allMovies = this._moviesModel.getMoviesAll();
    const watchedMovies = getWatchedMovies(allMovies);
    const watchedMoviesByPeriod = getWatchedMoviesByPeriod(watchedMovies, this._activePeriod);

    const statisticsData = {
      count: watchedMoviesByPeriod.length,
      duration: getDurationMovie(watchedMoviesByPeriod),
      genre: getTopGenreMovie(watchedMoviesByPeriod),
      userRank: getTitleProfile(watchedMovies.length),
    };

    const ratingGenres = getSortCountMovieGenres(watchedMoviesByPeriod);

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
