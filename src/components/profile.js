// компонент "Звание пользователя"

const getTitleProfile = (countFilm) => {
  let titleProfile;
  if (countFilm === 0) {
    titleProfile = false;
  }
  if (countFilm > 0 && countFilm <= 10) {
    titleProfile = `Novice`;
  }
  if (countFilm > 10 && countFilm <= 20) {
    titleProfile = `Fan`;
  }
  if (countFilm > 20) {
    titleProfile = `Movie Buff`;
  }
  return titleProfile;

};


export const createProfileTemplate = (profile) => {
  const titleProfile = getTitleProfile(profile);

  if (!titleProfile) {
    return ``;
  }

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${titleProfile}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};
