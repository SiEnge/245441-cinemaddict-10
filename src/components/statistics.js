// компонент "Статистика"
import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


// для вывода диаграммы нужен массив с жанрами и массив с их количествами
// т.е. берем данные и анализируем их
// - сначала получаем массив всех возможных фильмов
// - потом ищем сколько раз они встречаются в данных

// на статистике нужно определить и запомнить клики на клавиши
// наверно в main нужно определить действия по этим кликам и сюда переносить период за который нужно выводить данны


const renderStaticticsChart = (statisticsCtx, films) => {

  let set = new Set();

  films.forEach((film) => {
    const genres = Array.from(film.genres);
    genres.forEach((genre) => set.add(genre));
  });

  const genresFilm = Array.from(set);

  const filmCount = genresFilm.map((genre) => {
    return films.filter((film) => {
      const genres = Array.from(film.genres);
      return genres.includes(genre);
    }).length;
  });


  Chart.defaults.global.defaultFontSize = 20;
  Chart.defaults.global.defaultFontColor = `white`;

  return new Chart(statisticsCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genresFilm,
      datasets: [{
        label: `Population`,
        data: filmCount,
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

const createStatisticsTemplate = (statistic) => {
  // const {count, duration, genre} = statistic;
  const count = 0;
  const duration = 125;
  const genre = "musical";

  const hour = Math.floor(duration / 60);
  const minute = duration % 60;
  const hourDuration = `${hour} <span class="statistic__item-description">h</span>`;
  const miniteDuration = `${minute} <span class="statistic__item-description">m</span>`;

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
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

export default class Statistics extends AbstractSmartComponent {
  constructor(films, period, statisticsData) {
    super();

    this._films = films;
    this._period = period;

    this._statisticsChart = null;
    // this._statisctics = null;
    // this._statiscticsData = {10, 125, `Musical`};
    this._statiscticsData = statisticsData;

    this._renderCharts();
    // this._countingStatistic();
  }


  getTemplate() {
    return createStatisticsTemplate(this._statiscticsData);
  }

  recoveryListeners() {}

  rerender(films, period) {
    this._films = films;
    this.period = period;

    super.rerender();

    this._renderCharts();
  }

  // _countingStatistic() {
  //   const films = this._film;
  //   const count = 10;
  //   const duration = 125;
  //   const genre = `Musical`;

  //   this._statiscticsData = {count, duration, genre};
  // }

  _renderCharts() {
    const element = this.getElement();

    const statisticsCtx = element.querySelector(`.statistic__chart`);

    // this._resetCharts();

    this._statisticsChart = renderStaticticsChart(statisticsCtx, this._films.getFilms(), this.period);
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
