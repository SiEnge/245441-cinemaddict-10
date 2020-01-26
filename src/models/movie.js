export default class Film {
  constructor(data) {
    this.id = data.id;
    this.title = data.film_info.title;
    this.originalTitle = data.film_info.alternative_title;
    this.rating = data.film_info.total_rating.toFixed(1);
    this.poster = data.film_info.poster;
    this.age = data.film_info.age_rating;
    this.director = data.film_info.director;
    this.writers = data.film_info.writers.join(`, `);
    this.actors = data.film_info.actors.join(`, `);
    this.releaseDate = data.film_info.release.date;
    this.country = data.film_info.release.release_country;
    this.duration = data.film_info.runtime;
    this.genres = new Set(data.film_info.genre); //?
    this.description = data.film_info.description;

    this.userRating = data.user_details.personal_rating;
    this.isWatchlist = data.user_details.watchlist;
    this.isWatched = data.user_details.already_watched;
    this.watchindDate = data.user_details.watching_date; //?
    this.isFavorite = data.user_details.favorite;

    this.comments = data.comments; //?

    // this.comments = (Math.random() > 0.5) ? generateComments(getRandomIntegerNumber(COUNT_COMMENTS_MIN, COUNT_COMMENTS_MAX))  = [];

  }
    // this.rating = num.toFixed(1)data.film_info.total_rating;

  // подготовка данных для отравки на сервер
  toRAW() {
    // return {
    //   'id': this.id,
    //   'description': this.description,
    //   'due_date': this.dueDate ? this.dueDate.toISOString() : null,
    //   'tags': Array.from(this.tags),
    //   'repeating_days': this.repeatingDays,
    //   'color': this.color,
    //   'is_favorite': this.isFavorite,
    //   'is_archived': this.isArchive,
    // };
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }

  static clone(data) {
    return new Film(data.toRAW());
  }
}
