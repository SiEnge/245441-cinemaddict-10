import {getRandomArrayItem} from '../util.js';

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

const CommentDay = [
  `2019/12/31 23:59`,
  `today`,
  `tomorrow`,
  `2 days ago`,
  `3 days ago`
];

const CommentEmoji = [
  `smile.png`,
  `sleeping.png`,
  `puke.png`,
  `angry.png`
];


const generateComment = () => {
  return {
    text: getRandomArrayItem(CommentText),
    author: getRandomArrayItem(CommentAuthor),
    day: getRandomArrayItem(CommentDay),
    emoji: getRandomArrayItem(CommentEmoji)
  };
};

const generateComments = (count) => {
  const comments = [];
  for (let i = 0; i < count; i++) {
    comments.push(generateComment());
  }
  return comments;
};


export {generateComment, generateComments};
