// компонент "Статистика"
import AbstractComponent from './abstract-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {ONE_HOUR_IN_MINUTE} from '../const.js';

const NameToTitlePeriod = {
  'all-time': `All time`,
  'today': `Today`,
  'week': `Week`,
  'month': `Month`,
  'year': `Year`,
};

const renderStaticticsChart = (statisticsCtx, ratingGenres) => {
  const genres = ratingGenres.map((it) => it.genre);
  const count = ratingGenres.map((it) => it.count);

  Chart.defaults.global.defaultFontSize = 20;
  Chart.defaults.global.defaultFontColor = `white`;

  return new Chart(statisticsCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        label: `Population`,
        data: count,
        backgroundColor: `rgba(255, 232, 0, 1)`,
        barThickness: 30,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 18
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            padding: 100
          },
          gridLines: {
            display: false,
          }
        }],
        xAxes: [{
          ticks: {
            fontStyle: `bold`,
            fontColor: `#000000`,
            beginAtZero: true,
            display: true,
          },
          gridLines: {
            display: false,
          }
        }]
      },
      legend: {
        display: false
      },
    }
  });
};

const createFilterStatisticsMarkup = (period, isChecked) => {
  const {name} = period;

  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${name}" value="${name}" ${(isChecked) ? `checked` : ``}>
      <label for="statistic-${name}" class="statistic__filters-label">${NameToTitlePeriod[name]}</label>`
  );
};

const createUserRankMarkup = (userRank) => {
  if (userRank === ``) {
    return ``;
  }

  return (
    `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>`
  );
};

const createStatisticsTemplate = (statistic, periods) => {
  const {count, duration, genre, userRank} = statistic;

  const hour = (duration >= ONE_HOUR_IN_MINUTE) ? Math.floor(duration / ONE_HOUR_IN_MINUTE) : ``;
  const minute = duration % ONE_HOUR_IN_MINUTE;

  const hourDuration = (hour) ? `${hour} <span class="statistic__item-description">h</span>` : ``;
  const miniteDuration = `${minute} <span class="statistic__item-description">m</span>`;

  const filterStatisticsMarkup = periods.map((it) => createFilterStatisticsMarkup(it, it.checked)).join(`\n`);
  const userRankMarkup = createUserRankMarkup(userRank);

  return (
    `<section class="statistic">
        ${userRankMarkup}

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${filterStatisticsMarkup}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${count} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hourDuration} ${miniteDuration}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${genre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistics extends AbstractComponent {
  constructor(data, ratingGenres, periods) {
    super();
    this._data = data;
    this._ratingGenres = ratingGenres;
    this._periods = periods;

    this._statisticsChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(this._data, this._periods);
  }

  _renderCharts() {
    this._resetCharts();

    if (this._ratingGenres.length === 0) {
      return;
    }

    const element = this.getElement();
    const statisticsCtx = element.querySelector(`.statistic__chart`);

    this._statisticsChart = renderStaticticsChart(statisticsCtx, this._ratingGenres);
  }

  _resetCharts() {
    if (this._statisticsChart) {
      this._statisticsChart.destroy();
      this._statisticsChart = null;
    }
  }

  setStatisticsFilterClickHandler(handler) {
    this.getElement().querySelector(`.statistic__filters`)
    .addEventListener(`click`, (evt) => {

      const target = evt.target;
      if (!target.classList.contains(`statistic__filters-input`)) {
        return;
      }

      handler(target.value);
    });
  }
}
