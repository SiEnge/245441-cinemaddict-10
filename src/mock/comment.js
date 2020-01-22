import {getRandomArrayItem, getRandomIntegerNumber} from '../util.js';

const CommentText = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`
];

const CommentAuthor = [
  `Tim Macoveev`,
  `John Doe`
];

// const CommentDay = [
//   `2019/12/31 23:59`,
//   `today`,
//   `tomorrow`,
//   `2 days ago`,
//   `3 days ago`
// ];

const CommentEmoji = [
  `smile.png`,
  `sleeping.png`,
  `puke.png`,
  `angry.png`
];

const getRandomDate = () => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - getRandomIntegerNumber(0, 30));

  return targetDate;
};


const generateComment = (id) => {
  return {
    id: String(id),
    text: getRandomArrayItem(CommentText),
    author: getRandomArrayItem(CommentAuthor),
    date: getRandomDate(),
    emoji: getRandomArrayItem(CommentEmoji)
  };
};

export const generateComments = (count) => {
  const comments = [];
  for (let i = 0; i < count; i++) {
    comments.push(generateComment(i + 1));
  }
  return comments;
};


