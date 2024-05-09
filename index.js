const TS = "1715173816644";
const HASH = "a3fe35699f6a43a267cb3ebb2d25b485";
const API_KEY = "48caf58f8fb4a70a2be3cf30df6ab460";
let searchName = "a";
let favouriteHerosList =
  JSON.parse(localStorage.getItem("favouriteHeros")) || [];

const homeBtn = document.querySelector(".home");
const favouriteBtn = document.querySelector(".favourite");
const homeSectionEl = document.querySelector(".home-section");
const favouritesSectionEl = document.querySelector(
  ".favourite-heros-container"
);
const favouritesSectionRowEl = document.querySelector(
  ".favourite-heros-container > .row"
);
const searchInputEl = document.querySelector(".search-input");
const searchBtnEl = document.querySelector(".search-btn");
const formEl = document.querySelector("form");
const herosSectionEl = document.querySelector(".heroes-section");
const herosSectionRowEl = document.querySelector(".heroes-section > .row");
const heroSectionEl = document.querySelector(".hero-section");
const heroSectionRowEl = document.querySelector(".hero-section > .row");

/**
 * to add the heros to favourites
 * @param {liked hero data} hero
 */
function addToFavourite(hero) {
  const heroExists =
    favouriteHerosList &&
    favouriteHerosList.find((item) => item.id === hero.id);
  if (!heroExists) {
    favouriteHerosList.push(hero);
    localStorage.setItem("favouriteHeros", JSON.stringify(favouriteHerosList));
  }
}

/**
 * to add the heros to favourites
 * @param {dis-liked hero data} hero
 */
function removeFromFavourite(hero) {
  favouriteHerosList = favouriteHerosList.filter((item) => item.id !== hero.id);
  localStorage.setItem("favouriteHeros", JSON.stringify(favouriteHerosList));
  renderFavouriteHeros();
}

/**
 *
 * @returns random number between 97 and 122 (to get random chars from a to z)
 */
function getRandomChar() {
  const offset = Math.floor(Math.random() * (20 - 1 + 1) + 1);
  const char = Math.floor(Math.random() * (122 - 97 + 1) + 97);
  return { offset, char };
}

/**
 * to get the heros on initial load
 */
async function getHeros() {
  // on every load or search, random heros will load
  const { offset, char } = getRandomChar();
  searchName = String.fromCharCode(char);
  // hiding hero section
  herosSectionEl.classList.remove("hide");
  if (!heroSectionEl.classList.contains("hide")) {
    heroSectionEl.classList.add("hide");
  }
  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${TS}&apikey=${API_KEY}&hash=${HASH}&nameStartsWith=${searchName}&offset=${offset}`;
  try {
    const options = {
      headers: {
        accept: "application/json",
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    const results = data.data.results;

    herosSectionRowEl.innerHTML = "";
    results &&
      results.forEach((hero) => {
        const heroContainer = document.createElement("div");
        heroContainer.className = "col";
        heroContainer.innerHTML = `
      <div class="card text-bg-dark">
      <img src="${hero.thumbnail.path}.${
          hero.thumbnail.extension
        }" class="card-img" alt="${hero.title}" />
      <div
      class="d-flex flex-column justify-content-end align-item-center text-center card-img-overlay hero-card-overlay"
      >
      <h5 class="card-title">${hero.name}</h5>
      <p class="card-text text-truncate text-wrap">${hero.description}</p>
      <div class="d-flex justify-content-end">
      <button
      class="btn btn-light d-flex justify-content-center align-items-center rounded-pill w-25 like-btn"
      >
      ${
        favouriteHerosList.find((item) => item.id === hero.id)
          ? '<i class="fa-solid fa-heart text-danger"></i>'
          : '<i class="fa-regular fa-heart"></i>'
      }
      </button>
      </div>
      </div>
      </div>
      `;

        // event listener to like button
        const likeBtn = heroContainer.querySelector("button");
        likeBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
          likeBtn.classList.add("text-danger");
          addToFavourite(hero);
        });

        heroContainer.addEventListener("click", () => {
          // setting the hero data in the local storage
          localStorage.setItem("heroData", JSON.stringify(hero));
          // to open the Hero Details page in the new tab
          window.open("heroPage.html?_blank");
        });

        // appending to parent
        herosSectionRowEl.appendChild(heroContainer);
      });
  } catch (err) {
    console.log(err);
  }
}

/**
 * to get the hero details on search
 */
async function getHero() {
  // hiding heros section
  if (!herosSectionEl.classList.contains("hide")) {
    herosSectionEl.classList.add("hide");
  }
  heroSectionEl.classList.remove("hide");
  // removing all the spaces and replacing ASCII values to use in the url
  searchName = searchInputEl.value.trim().replaceAll(" ", "%20");
  const url = `https://gateway.marvel.com:443/v1/public/characters?name=${searchName}&ts=${TS}&apikey=${API_KEY}&hash=${HASH}`;
  try {
    const options = {
      headers: {
        accept: "application/json",
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    const heroData = data.data.results && data.data.results[0];
    console.log({ heroData });
    heroSectionRowEl.innerHTML = "";
    const heroContainer = document.createElement("div");
    heroContainer.className = "col";
    if (heroData) {
      heroContainer.innerHTML = `
        <div class="card text-bg-dark">
        <img src="${heroData.thumbnail.path}.${
        heroData.thumbnail.extension
      }" class="card-img" alt="${heroData.name}" />
        <div
        class="d-flex flex-column justify-content-end align-item-center text-center card-img-overlay hero-card-overlay"
        >
        <h5 class="card-title">${heroData.name}</h5>
        <p class="card-text text-wrap">${heroData.description}</p>
        <div class="d-flex justify-content-end">
        <button
        class="btn btn-light d-flex justify-content-center align-items-center rounded-pill like-btn"
        >
        ${
          favouriteHerosList.find((item) => item.id === heroData.id)
            ? '<i class="fa-solid fa-heart text-danger"></i>'
            : '<i class="fa-regular fa-heart"></i>'
        }
        </button>
        </div>
        </div>
        </div>
        `;

      // event listener to like button
      const likeBtn = heroContainer.querySelector("button");
      likeBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        likeBtn.classList.add("text-danger");
        addToFavourite(heroData);
      });

      heroContainer.addEventListener("click", () => {
        // setting the hero data in the local storage
        localStorage.setItem("heroData", JSON.stringify(heroData));
        // to open the Hero Details page in the new tab
        window.open("heroPage.html?_blank");
      });
    } else {
      heroContainer.innerHTML = `<h2 class="text-light">Hero not found!</h2>`;
    }
    heroSectionRowEl.appendChild(heroContainer);
  } catch (err) {
    console.log(err);
  }
}

async function getHeroDetails(characterId) {
  console.log("characterId: ", characterId);
  // GET /v1/public/characters/{characterId}/comics
  const comicsUrl = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?ts=${TS}&apikey=${API_KEY}&hash=${HASH}`;
  const eventsUrl = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/events?ts=${TS}&apikey=${API_KEY}&hash=${HASH}`;
  const seriesUrl = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/series?ts=${TS}&apikey=${API_KEY}&hash=${HASH}`;
  const storiesUrl = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/stories?ts=${TS}&apikey=${API_KEY}&hash=${HASH}`;

  const comicsResponse = await fetch(comicsUrl);
  const comicsData = await comicsResponse.json();
  // console.log("comics data of the hero:", comicsData.data.results);

  const eventsResponse = await fetch(eventsUrl);
  const eventsData = await eventsResponse.json();
  // console.log("events data of the hero:", eventsData.data.results);

  const seriesResponse = await fetch(seriesUrl);
  const seriesData = await seriesResponse.json();
  // console.log("series data of the hero:", seriesData.data.results);

  const storiesResponse = await fetch(storiesUrl);
  const storiesData = await storiesResponse.json();
  // console.log("stories data of the hero:", storiesData.data.results);
  const [comics, events, series, stories] = [
    comicsData.data.results,
    eventsData.data.results,
    seriesData.data.results,
    storiesData.data.results,
  ];
  return { comics, events, series, stories };
}

function renderFavouriteHeros() {
  favouritesSectionRowEl.innerHTML = "";
  favouriteHerosList &&
    favouriteHerosList.forEach((hero) => {
      const heroContainer = document.createElement("div");
      heroContainer.className = "col";
      heroContainer.innerHTML = `
      <div class="card text-bg-dark">
      <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" class="card-img" alt="${hero.title}" />
      <div
      class="d-flex flex-column justify-content-end align-item-center text-center card-img-overlay hero-card-overlay"
      >
      <h5 class="card-title">${hero.name}</h5>
      <p class="card-text text-truncate text-wrap">${hero.description}</p>
      <div class="d-flex justify-content-end">
      <button
      class="btn btn-light d-flex justify-content-center align-items-center rounded-pill w-25 dislike-btn"
      >
      <i class="fa-solid fa-heart-crack"></i>
      </button>
      </div>
      </div>
      </div>
      `;

      // event listener to like button
      const likeBtn = heroContainer.querySelector(".dislike-btn");
      likeBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        // likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        // likeBtn.classList.add("text-danger");
        removeFromFavourite(hero);
      });

      heroContainer.addEventListener("click", () => {
        // setting the hero data in the local storage
        localStorage.setItem("heroData", JSON.stringify(hero));
        // to open the Hero Details page in the new tab
        window.open("heroPage.html?_blank");
      });

      // appending to parent
      favouritesSectionRowEl.appendChild(heroContainer);
    });
}

/**
 * to prevent unwanted submission of the form
 */
homeBtn &&
  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
  });

/**
 * event listener to get the hero on search
 */
homeBtn &&
  searchBtnEl.addEventListener("click", () => {
    const inputValue = searchInputEl.value.trim();
    inputValue !== "" ? getHero() : getHeros();
  });

/**
 * to render home view
 */
homeBtn &&
  homeBtn.addEventListener("click", () => {
    homeBtn.classList.add("active");
    favouriteBtn.classList.remove("active");
    if (!favouritesSectionEl.classList.contains("hide")) {
      favouritesSectionEl.classList.add("hide");
    }
    homeSectionEl.classList.remove("hide");
  });

/**
 * to render favourite heros view
 */
homeBtn &&
  favouriteBtn.addEventListener("click", () => {
    homeBtn.classList.remove("active");
    favouriteBtn.classList.add("active");
    if (!homeSectionEl.classList.contains("hide")) {
      homeSectionEl.classList.add("hide");
    }
    favouritesSectionEl.classList.remove("hide");
    renderFavouriteHeros();
  });

/**
 * initial load
 */
homeBtn && getHeros();
