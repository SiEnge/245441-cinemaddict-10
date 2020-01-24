// // компонент "Меню"
// import AbstractComponent from './abstract-component.js';

// const createMenuTemplate = () => {
//   return (
//     `<a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>`
//   );
// };

// export default class Menu extends AbstractComponent {
//   getTemplate() {
//     return createMenuTemplate();
//   }


//   setStatisticsClickHandler(handler) {
//     this.getElement().addEventListener(`click`, (evt) => {
//       evt.preventDefault();

//       if (evt.target.classList.contains('main-navigation__item--active')) {
//         return;
//       }

//       handler();
//     });
//   }
// }
