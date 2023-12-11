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
// variablen für das Öffnen der Pokemon-Karte
let currentPokemon;
let currentEvolution;
let evolution;
//variablen für den Moves-Sektions-Observer
let movesObserver;
let movesBatchSize = 10;
let currentBatchStart = 0;


function filterPokemon() {
  continueRunning = false;
  continueRunning = true;
  search = document.getElementById('search').value
  search = search.toLowerCase()
  clearFunction('render-pokedex');
  renderPokedexFilter();
}


function clearFunction(id) {
  document.getElementById(id).innerHTML = '';
}


async function init() {
  let url = `https://pokeapi.co/api/v2/pokedex/2`;
  let response = await fetch(url);
  currentPokedex = await response.json();
  createObserver();
}


function createObserver() {
  let observer;
  let options = {
    threshold: 0  // 10% des Elements müssen sichtbar sein;
  }
  observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(document.getElementById('load'));
}


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


function hideObserverAtMax(element, index, maxLength) {
  if (index >= maxLength) {
    hideElement(element);
  }
}


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
    resetLoadItems()
    await renderPokedex();
  }
}


function resetLoadItems() {
  currentIndex = 0;
  maxIndex = 0;
}


async function renderPokedexCard(i, pokemon) {
  let pokemonId = i + 1;
  currentPokemonPokedex = await loadPokemon(pokemonId);
  speciesPokedex = await loadSpecies('pokedex');
  createPokedexCard(i, pokemon, pokemonId);
}


function createPokedexCard(i, pokemon, pokemonId) {
  let bgColor = speciesPokedex['color']['name'];
  insertPokedex(pokemonId, i, pokemon);
  let pokeBg = 'overview-card-' + i
  editPokedexCard(bgColor, pokeBg);
  insertTypeDex('type-in-pokedex-' + i);
  let img = currentPokemonPokedex['sprites']['other']['home']['front_default'];
  document.getElementById('overview-card-image-' + i).src = img;
}


function insertPokedex(pokemonId, i, pokemon) {
  document.getElementById('render-pokedex').innerHTML += renderPokedexTemplate(pokemonId, i, pokemon);
}


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


// Standard Funktionen
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