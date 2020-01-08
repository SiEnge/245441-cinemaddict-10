// экспорт констант места вставки
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

// разобраться?? не работает
export const getRandomIntegerNumber = (min, max) => {
  // return min + Math.floor(max * Math.random());
  return min + Math.floor((max - min) * Math.random());
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

// создание dom элемента (отказ от вставки чисто разметки в верстку)
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

// вставка элемент в контейнер (отказ от insertAjast)
export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
