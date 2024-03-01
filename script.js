let search = '';
let currentPokedex;
let itemsPerLoad = 30; // Anzahl der Elemente, die pro Ladung gerendert werden sollen
let currentIndex = 0
let maxIndex;
let currentPokemonPokedex
let currentMoves;
let moveNames = [];
let moveUrls = [];
let continueRunning = true;
let continueRunningFilter = false;
let observer;
let pokemonNumber = 1;
// variablen für das Öffnen der Pokemon-Karte
let currentPokemon;
let currentEvolution;
let evolution;
//variablen für den Moves-Sektions-Observer
let movesObserver;
let movesBatchSize = 10;
let currentBatchStart = 0;
let isLoading = false;


/**
 * function for filtering the pokemon by letter in input
 * @returns break funtion if loading
 */
async function filterPokemon() {
  if (isLoading) return;
  isLoading = true;
  continueRunning = false;
  continueRunningFilter = false;
  currentIndex = 0;
  search = document.getElementById('search').value
  search = search.toLowerCase();
  await deactivateMovesObserver();
  clearFunction('render-pokedex');
  await renderPokedexFilter();
  setTimeout(() => {
    isLoading = false;
  }, 100);
}


/**
 * init function at start of loading. Calls every important function of the page.
 */
async function init() {
  let url = `https://pokeapi.co/api/v2/pokedex/2`;
  let response = await fetch(url);
  currentPokedex = await response.json();
  createObserver();
  openLoadingBall();
  setLoadingInterval();
  addEventListeners();
}


/**
 * need the debounce for fast tipping (only one impuls not all)
 * @param {funtion} func defines the function to call (here only used for filter function)
 * @param {integer} wait defines the ms to wait 
 * @returns 
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}


/**
 * adds all important eventlisteners
 */
function addEventListeners(){
  let input = document.getElementById('search');
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter" && input.value) {
      filterPokemon();
    }
  });
  input.addEventListener("input", function() {
    debouncedFilterPokemon();
  });

  let debouncedFilterPokemon = debounce(filterPokemon, 300)
}


/**
 * loading screen until the first 11 cards are loaded
 */
function setLoadingInterval(){
  let loadingInterval = setInterval(() => {
    if(document.getElementById('overview-card-10')){
      document.getElementById('loading-bg').classList.add('d-none');
      clearInterval(loadingInterval);
    }
  }, 500);
}


/**
 * open loading screen
 */
function openLoadingBall(){
  document.getElementById('render-pokemon-card-container').innerHTML = /*html*/`
    <div class="loading-bg" id="loading-bg">
      <img src="img/pokeball (1).png" alt="loading screen" class="loading-pokeball">
    </div>
  `
}


/**
 * defines the Observer for lazy loading 
 */
function createObserver() {
  let options = {
    threshold: 0 
  }
  observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(document.getElementById('load'));
}


/**
 * handles the intersection 
 * --> if a entry is triggered close the observer
 * --> if the next all cards are loaded activate the observer again  
 * @param {array} entries defines the observer-entry array  
 * @param {array} observer array with infos of the observer
 */
function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target); // Deaktivieren, während das Laden läuft
      renderPokedex().then(() => {
        observer.observe(entry.target); // Wieder aktivieren, wenn das Laden abgeschlossen ist
      });
    }
  });
}


/**
 * renders the overview section 
 */
async function renderPokedex() {
  maxIndex = Math.min(currentIndex + itemsPerLoad, currentPokedex['pokemon_entries'].length);
  for (let i = currentIndex; i < maxIndex; i++) {
    if (!continueRunning) {
      break;
    }
    let pokemon = currentPokedex['pokemon_entries'][i]['pokemon_species']['name'];
    await renderPokedexCard(i, pokemon);
  }
  showElement('load');
  currentIndex += itemsPerLoad;
  maxLength = currentPokedex['pokemon_entries'].length
  hideObserverAtMax('load', maxIndex, maxLength);
}


/**
 * hide the observer if all pokemons are loaded
 * @param {element} element defines the container at the bottom of the page
 * @param {integer} index defines the index of the element that is loading  
 * @param {*} maxLength defines the max length of the pokemon-array
 */
function hideObserverAtMax(element, index, maxLength) {
  if (index >= maxLength) {
    hideElement(element);
  }
}


/**
 * renders the overview with the search input as filter
 */
async function renderPokedexFilter() {
  document.getElementById('load').classList.add('d-none')
  if (search) {
    for (let i = 0; i < currentPokedex['pokemon_entries'].length; i++) {     //currentPokedex['pokemon_entries'].length
      let pokemon = currentPokedex['pokemon_entries'][i]['pokemon_species']['name'];
      if (pokemon.toLowerCase().includes(search)) {
        await renderPokedexCard(i, pokemon);
      }
    }
  } else {
    continueRunningFilter = false;
    continueRunning = true;
    resetLoadItems()
    await renderPokedex();
  }
}

/**
 * reset the info of the observer
 */
function resetLoadItems() {
  currentIndex = 0;
  maxIndex = 0;
}


/**
 * 
 * @param {integer} i defines the number of the pokemon in the array 
 * @param {string} pokemon is the name of the pokemon
 */
async function renderPokedexCard(i, pokemon) {
  let pokemonId = i + 1;
  currentPokemonPokedex = await loadPokemon(pokemonId);
  speciesPokedex = await loadSpecies('pokedex');
  createPokedexCard(i, pokemon, pokemonId);
}


/**
 * creates the overview-card
 * @param {*} i defines the number of the pokemon in the array 
 * @param {*} pokemon defines the name of the pokemon
 * @param {*} pokemonId defines the id from the pokemon in the API
 */
function createPokedexCard(i, pokemon, pokemonId) {
  let bgColor = speciesPokedex['color']['name'];
  let pokeBg = 'overview-card-' + i
  let img = currentPokemonPokedex['sprites']['other']['home']['front_default'];
  insertPokedex(pokemonId, i, pokemon);
  editPokedexCard(bgColor, pokeBg);
  insertTypeDex('type-in-pokedex-' + i);
  document.getElementById('overview-card-image-' + i).src = img;
}


/**
 * 
 * @param {*} pokemonId defines the id from the pokemon in the API
 * @param {*} i defines the number of the pokemon in the array 
 * @param {*} pokemon defines the name of the pokemon
 */
function insertPokedex(pokemonId, i, pokemon) {
  document.getElementById('render-pokedex').innerHTML += renderPokedexTemplate(pokemonId, i, pokemon);
}


/**
 * gets the color from the poke API and changes it to the own defined color
 * @param {string} bgColor defines the color of the poke API
 * @param {*} pokeBg is the own defined color
 */
function editPokedexCard(bgColor, pokeBg) {
  if (bgColor == 'white') {
    editBgColor(pokeBg, '#FFE9BF');
  } else if (bgColor == 'yellow') {
    editBgColor(pokeBg, '#FDCF48');
  } else if (bgColor == 'pink') {
    editBgColor(pokeBg, '#ffb098');
  } else if (bgColor == 'blue') {
    editBgColor(pokeBg, '#76BDFE');
  } else if (bgColor == 'brown') {
    editBgColor(pokeBg, '#9A7B62');
  } else if (bgColor == 'green') {
    editBgColor(pokeBg, '#48D09A');
  } else if (bgColor == 'red') {
    editBgColor(pokeBg, '#FF6961');
  } else if (bgColor == 'purple') {
    editBgColor(pokeBg, '#CB99C9');
  } else if (bgColor == 'gray') {
    editBgColor(pokeBg, '#CFCFC4');
  } else if (bgColor == 'black') {
    editBgColor(pokeBg, '#00002F');
  }
}


function changeFontColor(PokeId, color) {
  document.getElementById(PokeId).style = `color: ${color}`;
}


function editBgColor(pokeBg, bg) {
  document.getElementById(pokeBg).style = `background-color: ${bg}`;
}


// standard functions
function clearFunction(id) {
  document.getElementById(id).innerHTML = '';
}


function addClassList(id, myClass) {
  document.getElementById(id).classList.add(myClass);
}


function hideElement(element) {
  document.getElementById(element).classList.add('d-none')
}


function showElement(element) {
  document.getElementById(element).classList.remove('d-none')
}


function capitalizesecondLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function capitalizesecondLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function toFeet(n) {
  var realFeet = (n * 0.3937) / 12;
  var feet = Math.floor(realFeet);
  var inches = Math.round(10 * ((realFeet - feet) * 12)) / 10;
  return feet + '&prime;' + inches + '&Prime;';
}