import config from "./constant";

const backgroundByMonth = [
  config.background.tet,
  config.background.tet,
  config.background.womenDay,
  config.background.summer,
  config.background.summer,
  config.background.summer,
  config.background.summer,
  config.background.autumn,
  config.background.autumn,
  config.background.autumn,
  config.background.winter,
  config.background.christmas,
];

export function setBackgroundByMonth() {
  const month = new Date().getMonth();
  const imgSource = `assets/images/${backgroundByMonth[month]}.jpg`;
  const mainContainer = document.getElementById("app-container");
  mainContainer.style.backgroundImage = `url(${imgSource})`;
}
