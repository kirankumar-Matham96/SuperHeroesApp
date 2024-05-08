const TS = "1715173816644";
const HASH = "a3fe35699f6a43a267cb3ebb2d25b485";
const API_KEY = "48caf58f8fb4a70a2be3cf30df6ab460";
let searchName = "a";

const searchInputEl = document.querySelector(".search-input");
const searchBtnEl = document.querySelector(".search-btn");
const formEl = document.querySelector("form");
const herosSectionEl = document.querySelector(".heroes-section");
const herosSectionRowEl = document.querySelector(".heroes-section > .row");
const heroSectionEl = document.querySelector(".hero-section");
const heroSectionRowEl = document.querySelector(".hero-section > .row");

console.log({
  searchInputEl,
  searchBtnEl,
  formEl,
  herosSectionEl,
  herosSectionRowEl,
  heroSectionEl,
  heroSectionRowEl,
});
/**
 * to get the hero details on search
 */
async function getHero() {
  debugger;
  // hiding heros section
  herosSectionEl.classList.add("hide");
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
    // const response = await fetch(url, options);
    // const data = await response.json();
    heroSectionRowEl.innerHTML = "";
    const heroContainer = document.createElement("div");
    heroContainer.className = "col";
    heroContainer.innerHTML = `
      <div class="card text-bg-dark">
      <img src="https://images1.wionews.com/images/wion/900x1600/2023/4/12/1681294442560_MsMarvel.webp" class="card-img" alt="Ms Marvel" />
      <div
      class="d-flex flex-column justify-content-end align-item-center text-center card-img-overlay movie-card-overlay"
      >
      <h5 class="card-title">Ms Marvel</h5>
      <p class="card-text text-truncate text-wrap">Marvel Overview</p>
      <div class="d-flex justify-content-end">
      <button
      class="btn btn-light d-flex justify-content-center align-items-center rounded-pill w-25 like-btn"
      ><i class="fa-regular fa-heart"></i>
      </button>
      </div>
      </div>
      </div>
      `;

    heroSectionRowEl.appendChild(heroContainer);
  } catch (err) {
    console.log(err);
  }
}

/**
 * to prevent unwanted submission of the form
 */
formEl.addEventListener("submit", (event) => {
  event.preventDefault();
});

/**
 * event listener to get the hero on search
 */
searchBtnEl.addEventListener("click", getHero);
