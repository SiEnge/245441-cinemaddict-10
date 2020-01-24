import FilterComponent from '../components/filter.js';
import {FilterType, PageMode} from '../const.js';
import {render, replace, RenderPosition} from '../util.js';
import {getFilmsByFilter} from '../util.js';

export default class Filter {
  constructor(container, filmsModel, pageController, statisticsComponent) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);

    this._onFilterChange = this._onFilterChange.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);
    this._onPageToggle = this._onPageToggle.bind(this);

    this._pageMode = PageMode.MOVIE;
    this._pageController = pageController;
    this._statisticsComponent = statisticsComponent;
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.getFilmsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmsByFilter(allFilms, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);
    this._filterComponent.setStatisticsClickHandler(this._onPageToggle);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent.getElement(), RenderPosition.AFTERBEGIN);
    }
  }

  _onFilterChange(filterType) {
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }

  _onPageToggle() {
    switch (this._pageMode) {
      case PageMode.MOVIE:
        this._pageMode = PageMode.STAT;
        this._pageController.hide();
        this._statisticsComponent.show();
        break;
      case PageMode.STAT:
        this._pageMode = PageMode.MOVIE;
        this._pageController.show();
        this._statisticsComponent.hide();
        break;
    }
  }
}
