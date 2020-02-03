export default class LocalComment {
  constructor(data) {
    this.date = new Date(data.date);
    this.comment = data.comment || ``;
    this.emotion = data.emotion || ``;
  }

  toRAW() {
    return {
      "comment": this.comment,
      "date": this.date.toISOString(),
      "emotion": this.emotion
    };
  }

  static parseComment(data) {
    return new LocalComment(data);
  }
}
