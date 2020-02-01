export default class Comment {
  constructor(data) {
    this.id = data.id;
    this.author = data.author;
    this.text = data.comment;
    this.date = data.date ? new Date(data.date) : null;
    this.emotion = data.emotion;
  }

  // подготовка данных для отравки на сервер
  toRAW() {
    return {

    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }


  static clone(data) {
    return new Comment(data.toRAW());
  }
}
