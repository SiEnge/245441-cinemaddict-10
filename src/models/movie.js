export default class Film {
  constructor(data) {
    this.id = data.id;
    // debugger;

    this.title = data.film_info.title;
    this.originalTitle = data.film_info.alternative_title;
    this.rating = data.film_info.total_rating.toFixed(1);
    this.poster = data.film_info.poster;
    this.age = data.film_info.age_rating;
    this.director = data.film_info.director;
    this.writers = data.film_info.writers.join(`, `);
    this.actors = data.film_info.actors.join(`, `);
    this.releaseDate = new Date(data.film_info.release.date);
    this.country = data.film_info.release.release_country;
    this.duration = data.film_info.runtime;
    this.genres = new Set(data.film_info.genre);
    this.description = data.film_info.description;

    this.userRating = data.user_details.personal_rating;
    this.isWatchlist = data.user_details.watchlist;
    this.isWatched = data.user_details.already_watched;
    this.watchingDate = data.user_details.watching_date ? new Date(data.user_details.watching_date) : null;
    this.isFavorite = data.user_details.favorite;
    this.comments = data.comments; // ?
    // this.textComments = data.comments; // ?

  }

  // подготовка данных для отравки на сервер
  toRAW() {
    // debugger;
    return {
      'id': this.id,
      'film_info': {
        'title': this.title,
        'alternative_title': this.originalTitle,
        'total_rating': +this.rating,
        'poster': this.poster,
        'age_rating': this.age,
        'director': this.director,
        'writers': this.writers.split(`, `),
        'actors': this.actors.split(`, `),
        'release': {
          'date': this.releaseDate,
          'release_country': this.country,
        },
        'runtime': this.duration,
        'genre': Array.from(this.genres),
        'description': this.description,
      },
      'user_details': {
        'personal_rating': +this.userRating,
        'watchlist': this.isWatchlist,
        'already_watched': this.isWatched,

        'watching_date': this.watchingDate,
        // 'watching_date': this.watchingDate ? this.watchingDate.toISOString() : '',
        'favorite': this.isFavorite,
      },
      'comments': this.comments,
      // 'comments': this.comments,
    };
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
