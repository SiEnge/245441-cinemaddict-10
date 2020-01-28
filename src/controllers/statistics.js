import StatisticsComponent from '../components/statistics.js';
import {StatiscticsPeriod} from '../const.js';
import {render, replace, RenderPosition, getTitleProfile} from '../util.js';
import {getWatchedFilmsByPeriod, getDurationFilm, getTopGenreFilm, getSortCountFilmGenres} from '../utils/statistics.js';

export default class Statistics {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._statisticsComponent = null;

    this._onStatisticsPeriodChange = this._onStatisticsPeriodChange.bind(this);

    this._activePeriod = StatiscticsPeriod.ALLTIME;
  }

  recoveryListeners() {
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.getFilmsAll();

    const watchedFilms = allFilms.filter((film) => film.isWatched);

    const watchedFilmsByPeriod = getWatchedFilmsByPeriod(watchedFilms, this._activePeriod);
    // debugger;
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
    }
  }

  rerender() {

  }

  _onStatisticsPeriodChange(period) {
    this._activePeriod = period;
    this.render();
  }

  hide() {
    this._statisticsComponent.hide();
  }

  show() {
    this._statisticsComponent.show();
  }
}



// добавить методы
// +показать/скрыть
// +реагирование на кнопки смены периода
// -перерисовка данных при изменении периода
// +подготовить данные в убывании для диаграммы
// +перенести расчеты колчиества и качества фильмов из компонента в контроллер

// !!!проблема - при изменении периода, мы говорим что надо компонент отрисовать заново,
// но тогда у нас и перерисовывается и поля меню
// значит нужен все-таки ререндер
