import API from './api.js';
import PageController from './controllers/page.js';
import FilterController from './controllers/filter.js';
import StatisticsController from './controllers/statistics.js';
import MenuComponent from './components/menu.js';
import FilmsModel from './models/movies.js';
// import CommentsModel from './models/comments.js';
import {PageMode} from './const.js';

const AUTHORIZATION = `Basic 6Idsiz23kTy9g17`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

const mainElement = document.querySelector(`.main`);


const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();
// const commentsModel = new CommentsModel();

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
  });


// api.getFilms()
// .then((films) => {
//   filmsModel.setFilms(films);
//   return films.map((film) => api.getComments(film.id)
//     .then((comments) => filmsModel.setComments(film.id, comments)));
// })
// .then(() => {
//   filterController.render();
//   pageController.render();

//   statisticsController.render();
// });


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
// определится для статистики perioad или filter


// как бы я обычно поступила при таком запросе
// запрос всех фильмов (=получаем id фильмов)
// затем в цикле(?) по каждому фильму запросила бы комменты
// далее нужно соединить фильм и ее комменты
// разобраться с форматом даты Просмотрено
// теряется ссылка на Stat при обновлении данных
// при обновлении попапа теряются комментарии - возможно нужно их писать в разных моделях
// что показывать если нет фильмов удовлетворяющих фильтру
// комментарии загружаьт когда открывается попап?
// вынестив отдельные функции получение extra фильмов
// после добавления/удаления коммента должно изменять их количество в карточке
// обновление страницы и попапа после удаление комментария
// нужно ли оставлять .then(Film.parseFilm); в api.createComment ?
