export default class LocalComment {
  constructor(data) {
    this.date = data.date;
    this.text = data.text;
    this.emotion = data.emotion;
  }

  // подготовка данных для отравки на сервер
  toRAW() {
    return {
      "comment": this.text,
      "date": this.date.toISOString(),
      "emotion": this.emotion
    };
  }

  static parseComment(data) {
    return new LocalComment(data);
  }

  // static parseComments(data) {
  //   return data.map(Comment.parseComment);
  // }


  // static clone(data) {
  //   return new Comment(data.toRAW());
  // }
}


// что должно происходить при удалении/добавлении комментария

// при удлаении должна перерисоваться карточка фильма и попапа
// и при успешнм выполнении запроса
// для перерисовки карточки фильма нужно вызвать метод replace(update)
// и на основе обновленной модели фильмов
// т.е модель нужно обновить = удалить ненужный коммент
// т.е. удалить id удаленного комментария
// а при переисовке попапа обновить комментарии
// т.е. если это перерисовка,т.е. не нужно заново запрашивать комментарии
// и использовать текущие данные по комментарию
// из них удалить удаленный и перерисовать попап

// добавление комментария
// при успешном добавлении приходит ответ от сервера с полным комплектом данным по фильму
// точнее ответ содержит в себе данные по фильму как filmModel и данные по комментариям как commentsModel
// следовательно нужно обновить данные в модели на новые и вывести заново данные на страницу
// - в карточке должен изменить счетчик
// - в попапе должен добавиться новый коммент

// нужно сделать сортировку выводимых комментарий

// рейтинг
// при клике на рейтинг отправляется запрос onDataChange с новым рейтингом
// если пользователь отменяет флаг что он просмотрен - рейтинг должен обнуляться
