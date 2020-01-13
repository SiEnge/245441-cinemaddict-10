import MenuComponent from '../components/menu.js';
import SortComponent, {SortType} from '../components/sort.js';
import FilmsContainerComponent from '../components/films-container.js';
import FilmListComponent from '../components/film-list.js';
import NoFilmsListComponent from '../components/film-list-no-data.js';
import FilmListExtraComponent from '../components/film-list-extra.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import {render, RenderPosition} from '../util.js';
import FilmController from './movie.js';


const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

// отрисовка нескольких фильмов. Передаются фильмы и блок в который нужно отрисовать
// т.е. тут ищется films-list__container и туда отрисовываются фильмы

// для отрисовки фильмов проходит методом map по всему массиву фильмов,
// которые планируется отрисовать
// для каждого фильма создаем инстанс класса FilmController
// и потом его отрисовываем своим методом render
// в который входит помимо отрисовки, навешивание обработчиков и логики переключения карточки/попапа

// при создании инстанса передается контейнер куда отрисовать и
// метода onDataChange, который будет срабатывать когда данные изменятся
// а сам этот флаг относится к PageController и его основная функции
// - сохранить новые данные в общем массиве данных Films
// - дать команду на перерисовку карточки
// т.е. карточка меняет свой вид не когда на нее кликнули, а когда сработала вся цепочка внесения изменений
// в общий массив, и если все он, то обновить ее

const renderFilms = (filmListElement, films, onDataChange, onViewChange) => {
  // return films.map((film) => {
  //   const filmController = new FilmController(filmListElement, onDataChange, onViewChange);
  //   filmController.render(film);
  //   return filmController;
  // });

  return films.map((film) => {
    const filmController = new FilmController(filmListElement, onDataChange, onViewChange);
    filmController.render(film);
    return filmController;
  });
};


export default class PageController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._films = [];
    this._sortedFilms = [];
    this._showedFilmControllers = [];

    this._menuComponent = new MenuComponent();
    this._sortComponent = new SortComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();

    this._noFilmsComponent = new NoFilmsListComponent();
    this._filmList = new FilmListComponent();
    this._filmListExtraTopRated = new FilmListExtraComponent(`Top rated`);
    this._filmListExtraMostCommented = new FilmListExtraComponent(`Most commented`);
    this._showMoreButton = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

  }

  render() {
    // this._films = films;
    const container = this._container;

    const films = this._filmsModel.getFilms();

    // 2. вставка в тело "Меню"
    // const filter = countFilmsFilter(films);
    // render(container, this._menuComponent.getElement(), RenderPosition.BEFOREEND);

    // 3. вставка в тело "Сортировка"
    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);

    // const filmsContainer = new FilmsContainerComponent();
    render(container, this._filmsContainerComponent.getElement(), RenderPosition.BEFOREEND);

    if (films.length === 0) {
      render(this._filmsContainerComponent.getElement(), this._noFilmsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    render(this._filmsContainerComponent.getElement(), this._filmList.getElement(), RenderPosition.BEFOREEND);

    let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._sortedFilms = films;

    // отрисовка нескольких фильмов
    let newFilms = renderFilms(this._filmList.getElement(), this._sortedFilms.slice(0, showingFilmsCount), this._onDataChange, this._onViewChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    const extraTopRatedFilms = films.slice()
      .sort((a, b) => b.rating - a.rating)
      .filter((film) => film.rating !== 0)
      .slice(0, 2);

    const extraMostCommentedFilms = films.slice()
      .sort((a, b) => b.comments - a.comments)
      .filter((film) => film.comments !== 0)
      .slice(0, 2);

    if (extraTopRatedFilms.length > 0) {
      render(this._filmsContainerComponent.getElement(), this._filmListExtraTopRated.getElement(), RenderPosition.BEFOREEND);
      const newExtraFilms = renderFilms(this._filmListExtraTopRated.getElement(), extraTopRatedFilms, this._onDataChange, this._onViewChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newExtraFilms);

    }

    if (extraMostCommentedFilms.length > 0) {
      render(this._filmsContainerComponent.getElement(), this._filmListExtraMostCommented.getElement(), RenderPosition.BEFOREEND);
      const newExtraFilms = renderFilms(this._filmListExtraMostCommented.getElement(), extraMostCommentedFilms, this._onDataChange, this._onViewChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newExtraFilms);
    }


    // что происходит если изменить сортировку
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      // (создается пустой) очищается массив для отсортированного
      this._sortedFilms = [];

      // в зависимости от выбранной сортировки записываем данные в массив
      switch (sortType) {
        case SortType.DEFAULT:
          this._sortedFilms = films;
          break;
        case SortType.DATE:
          this._sortedFilms = films.slice().sort((a, b) => b.releaseDate - a.releaseDate);
          break;
        case SortType.RATING:
          this._sortedFilms = films.slice().sort((a, b) => b.rating - a.rating);
          break;
      }

      // очистка контейнера для вывода новых фильмов
      this._filmList.getElement().querySelector(`.films-list__container`).innerHTML = ``;

      showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

      // отрисовка отсортированных фильмов
      newFilms = renderFilms(this._filmList.getElement(), this._sortedFilms.slice(0, showingFilmsCount), this._onDataChange, this._onViewChange);
      this._showedFilmControllers = newFilms;

      // отрисовать кнопку Показать еще, то отрисовать ее
      render(this._filmList.getElement(), this._showMoreButton.getElement(), `beforeend`);
    });

    // отрисовка кнопки Показать еще
    render(this._filmList.getElement(), this._showMoreButton.getElement(), `beforeend`);

    // обработчик клика на кнопке Показать еще
    this._showMoreButton.setClickHandler(() => {
      const prevFilmsCount = showingFilmsCount;
      showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      // отрисовка нескольких фильмов
      newFilms = renderFilms(this._filmList.getElement(), this._sortedFilms.slice(prevFilmsCount, showingFilmsCount), this._onDataChange, this._onViewChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (showingFilmsCount >= this._sortedFilms.length) {
        this._showMoreButton.getElement().remove();
        // this._showMoreButton.removeElement();
      }
    });

  }

  // паттерн Наблюдатель, если изменяются данные, то должна происходит перерисовка карточки
  // - пользователь кликает на кнопки Добавить в избранное
  // - событие этого клика вызывает метод _onDataChange, в который передаем
  //  - инстанс filmController (если он есть, то значит в нем сохранен фильм и это нужно для определения что делать при перерисовке)
  //  - старые данные по кликнутому
  //  - новые данные по кликнутому
  // - в этом метода ищется индекс фильма с которым произошли изменения
  // - исправляем общий массив с фильмами
  // - изменяем общую карточку
  // _onDataChange(filmController, oldData, newData) {
  _onDataChange(filmController, oldData, newData) {
    // const films = this._filmsModel.getFilms();
    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);

    if (isSuccess) {
      filmController.render(newData);
    }

  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }
}

// перенести в утилиты countFilmsFilter

// не забыть про экстрафильмы - чтобы и их попапы закрывались
