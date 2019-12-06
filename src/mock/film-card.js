const YEAR_MIN = 1950;
const YEAR_MAX = 2019;
const COUNT_COMMENTS_MIN = 0;
const COUNT_COMMENTS_MAX = 666;

// названия фильмов
const FilmTitles = [
  'Пятый элемент',
  'РЭД',
  'РЭД 2',
  'Сокровища нации',
  'Сокровища нации. Книга тайн',
  'Ангелы и демоны',
  'Код да Винчи',
  'Инферно',
  'Форрест Гамп',
  'Изгой',
  'Тринадцатый этаж',
  'Пиджак',
  'Великий Гэтсби',
  'Загадочная история Бенджамина Баттона',
  'Бойцовский клуб'
];

// постеры

const FilmPosters = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg'
];

const FilmGenres = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Cartoon',
  'Mystery'
];

// описание к фильму

const Description = `
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

const FilmDescriptions = Description.split(`. `);

// получение рандомного индекса массива
const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

// получение рандомного числа от min до max
const getRandomIntegerNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// генерация данных для одного фильма
const generateFilm = () => {
  return {
    // название фильма
    title: getRandomArrayItem(FilmTitles),

    // постер для фильма
    poster: getRandomArrayItem(FilmPosters),

    // описание фильма
    description: '',

    // год
    year: getRandomIntegerNumber(YEAR_MIN, YEAR_MAX),

    // длительность (вид 1h 59m)
    duration: '',

    // жанр
    genre: getRandomArrayItem(FilmGenres),

    // оценка (вид 9.3)
    rating: '',

    // комментарии (вид 18 comments)
    comments: getRandomIntegerNumber(COUNT_COMMENTS_MIN, COUNT_COMMENTS_MAX),

    // флаг в списке просмотра
    isAddToWatchlist: Math.random() > 0.5,

    // флаг просмотрен
    isWatched: Math.random() > 0.5,

    // флаг избранное
    isFavorite: Math.random() > 0.5,
  };
};
