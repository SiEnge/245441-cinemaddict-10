import FilterComponent from '../components/filter.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {getMoviesByFilter} from '../utils/filter.js';
import {FilterType} from '../const.js';

export default class Filter {
  constructor(container, moviesModel, menuComponent) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;
    this._menuComponent = menuComponent;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
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
      render(container, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
      render(this._filterComponent.getElement(), this._menuComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
