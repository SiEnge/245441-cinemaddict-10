import {getRandomIntegerNumber, getRandomArrayItem} from '../util.js';

const YEAR_MIN = 1950;
const YEAR_MAX = 2019;
const COUNT_COMMENTS_MIN = 0;
const COUNT_COMMENTS_MAX = 666;
const RATING_MIN = 1;
const RATING_MAX = 9;
const ONE_HOUR_IN_MINUTE = 60;
const TEN_MINUTES = 10;
const DURATION_MIN = 20;
const DURATION_MAX = 150;

// названия фильмов
const FilmTitles = [
  `The Fifth Element`,
  `Red`,
  `Red 2`,
  `National Treasure`,
  `National Treasure: Book of Secrets`,
  `Angels & Demons`,
  `The Da Vinci Code`,
  `Inferno`,
  `Forrest Gump`,
  `Cast Away`,
  `The Thirteenth Floor`,
  `The Jacket`,
  `The Great Gatsby`,
  `The Curious Case of Benjamin Button`,
  `Fight Club`
];

// постеры
const FilmPosters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

// жанры
const FilmGenres = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Mystery`,
  `Film-Noir`
];

// возрастная категория
const FilmAges = [
  `0+`,
  `6+`,
  `12+`,
  `16+`,
  `18+`
];

// описание к фильму
const FilmDescription = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Cras aliquet varius magna, non porta ligula feugiat eget.
  Fusce tristique felis at fermentum pharetra.
  Aliquam id orci ut lectus varius viverra.
  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
  Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
  Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
  Sed sed nisi sed augue convallis suscipit in sed felis.
  Aliquam erat volutpat.
  Nunc fermentum tortor ac porta dapibus.
  In rutrum ac purus sit amet tempus.
`;

const generateRandomDescription = (description) => {
  let descriptions = description.split(`.`);

  let text = new Set();
  for (let i = 0; i < 3; i++) {
    text.add(descriptions[getRandomIntegerNumber(0, descriptions.length)]);
  }
  return Array.from(text).join(`.`);
};

const getRandomDuration = () => {
  const duration = getRandomIntegerNumber(DURATION_MIN, DURATION_MAX);
  if (duration > ONE_HOUR_IN_MINUTE) {
    const hour = Math.round(duration / ONE_HOUR_IN_MINUTE);
    const minute = (duration % ONE_HOUR_IN_MINUTE < TEN_MINUTES) ? `0${duration % ONE_HOUR_IN_MINUTE}` : duration % ONE_HOUR_IN_MINUTE;
    return `${hour}h ${minute}m`;
  } else {
    return `${duration}m`;
  }
};

const getRandomRating = () => {
  return (getRandomIntegerNumber(RATING_MIN * 10, RATING_MAX * 10) / 10).toFixed(1);
};

const getRandomUserRating = () => {
  return Math.random() > 0.5 ? null : getRandomIntegerNumber(RATING_MIN, RATING_MAX);
  // return getRandomIntegerNumber(RATING_MIN, RATING_MAX);
};

const generateRandomGenre = (genres) => {
  const countGenres = getRandomIntegerNumber(1, 3);
  return genres
    .filter(() => Math.random() > 0.5)
    .slice(0, countGenres);
};

const getRandomReleaseDate = () => {
  const targetDate = new Date();
  const year = getRandomIntegerNumber(YEAR_MIN, YEAR_MAX);
  const month = getRandomIntegerNumber(1, 12);
  const date = getRandomIntegerNumber(1, 31);

  targetDate.setFullYear(year, month, date);
  return targetDate;
};


// генерация данных для одного фильма
const generateFilm = () => {
  return {
    id: String(new Date() + Math.random()),
    title: getRandomArrayItem(FilmTitles),
    originalTitle: `The Great Flamarion`,
    poster: getRandomArrayItem(FilmPosters),
    description: generateRandomDescription(FilmDescription),
    director: `Anthony Mann`,
    writers: `Anne Wigton, Heinz Herald, Richard Weil`,
    actors: `Erich von Stroheim, Mary Beth Hughes, Dan Duryea`,
    releaseDate: getRandomReleaseDate(),
    duration: getRandomDuration(),
    country: `USA`,
    genres: new Set(generateRandomGenre(FilmGenres)),
    rating: getRandomRating(),
    userRating: getRandomUserRating(),
    age: getRandomArrayItem(FilmAges),

    // comments: 0,
    comments: getRandomIntegerNumber(COUNT_COMMENTS_MIN, COUNT_COMMENTS_MAX),

    isWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
  };
};

const generateFilms = (count) => {
  const films = [];
  for (let i = 0; i < count; i++) {
    films.push(generateFilm());
  }
  return films;
};

export {generateFilm, generateFilms};
