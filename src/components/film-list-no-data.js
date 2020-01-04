// компонент "Нет данных для отображения"
const createFilmListNoDataTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`
  );
};

export {createFilmListNoDataTemplate};
