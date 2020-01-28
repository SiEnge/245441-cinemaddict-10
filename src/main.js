import API from './api.js';
import PageController from './controllers/page.js';
import FilterController from './controllers/filter.js';
import StatisticsController from './controllers/statistics.js';
import MenuComponent from './components/menu.js';
import FilmsModel from './models/movies.js';
import {PageMode} from './const.js';

const AUTHORIZATION = `Basic kTy9gIdsiz2317=rD666`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

const mainElement = document.querySelector(`.main`);


// debugger;


const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();

const pageController = new PageController(mainElement, filmsModel, api);

const menuComponent = new MenuComponent();
const filterController = new FilterController(mainElement, filmsModel, menuComponent);
const statisticsController = new StatisticsController(mainElement, filmsModel);


menuComponent.setStatisticsClickHandler((mode) => {
  switch (mode) {
    case PageMode.STAT:
      pageController.hide();
      statisticsController.show();
      break;
    case PageMode.MOVIE:
      pageController.show();
      statisticsController.hide();
      break;
  }
});

api.getFilms()
.then((films) => {
  filmsModel.setFilms(films);

  filterController.render();
  pageController.render();
  statisticsController.render();
  statisticsController.hide();
});


// осталось добавить
// + переключение между экранами
// - профиль пользователя (может есть смысл добавить в pageController)
// - количество фильмов в футер
// - скрытие статистики при отрисовке (можно добавить в сам контроллер)


// + в статистику должны приниматься данные по просмотренным фильмам
// + комменты должны храниться не в отдельном модуле, а добавляться к фильмам,
// поэтому нужно добавить в модель метод getCommet(filmId)
// для добавления комментарий к конкретному фильму

// количество фильмов в футере также должны отрисовываться после их полученяи
// при измнении в модели данных за просмотрено - менять статистику
// а также при измнении данных (просмотрено, архив) - менять фильтр
// прописать при парсинге данных  от сервера для каждого поля вариант если ничего ен пришло (напр "")
