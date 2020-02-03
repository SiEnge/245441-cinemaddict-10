import FilterComponent from '../components/filter.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {getMoviesByFilter} from '../utils/filter.js';
import {FilterType, PageMode} from '../const.js';

export default class Filter {
  constructor(containerElement, moviesModel, menuComponent, togglePageMode) {
    this._containerElement = containerElement;
    this._moviesModel = moviesModel;
    this._togglePageMode = togglePageMode;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;
    this._menuComponent = menuComponent;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const containerElement = this._containerElement;
    const allMovies = this._moviesModel.getMoviesAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getMoviesByFilter(allMovies, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
      render(this._filterComponent.getElement(), this._menuComponent.getElement(), RenderPosition.BEFOREEND);
    } else {
      render(containerElement, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
      render(this._filterComponent.getElement(), this._menuComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this._togglePageMode(PageMode.MOVIE);
  }

  _onDataChange() {
    this.render();
  }
}
