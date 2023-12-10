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
// open the individual pokemon card
let currentPokemon;
let currentEvolution;
let evolution;


function filterPokemon() {
  continueRunning = false;
  continueRunning = true;
  search = document.getElementById('search').value
  search = search.toLowerCase()
  clearFunction('render-pokedex');
  renderPokedexFilter();
}


function clearFunction() {
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
    threshold: 0.1 // 10% des Elements müssen sichtbar sein
  };
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
  document.getElementById('load').classList.remove('d-none')
  currentIndex += itemsPerLoad;
  if (maxIndex == currentPokedex['pokemon_entries'].length) {
    document.getElementById('load').classList.add('d-none')
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
  //   let colorCategory = ['white', 'yellow', 'pink', 'blue', 'brown', 'green', 'red', 'purple', 'gray', 'black'];
  //   let newColor = ['#FFE9BF', '#FDCF48', '#ffb098', '#76BDFE', '#9A7B62', '#48d09a', '#FF6961', '#CB99C9', '#CFCFC4', '#00002F']
  //   for(i = 0; colorCategory.length; i++){
  //     oldC = colorCategory[]
  //     if(bgColor === )
  //   }
  // }
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


async function openPokemonCard(pokemonId) {
  currentPokemon = await loadPokemon(pokemonId);
  species = await loadSpecies('card');
  await loadEvolution(pokemonId);
  renderPokemonCard();
  renderPokemon(currentPokemon);
  renderAboutSection();
  editBackgroundColorCard();
}


async function loadPokemon(pokemonId) {
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  let response = await fetch(url);
  return await response.json();
}


async function loadSpecies(type) {
  let url;
  if (type == 'card') {
    url = currentPokemon['species']['url'];
  } else {
    url = currentPokemonPokedex['species']['url'];
  }
  let response = await fetch(url);
  return await response.json();
}


async function loadEvolution() {
  let url = species['evolution_chain']['url'];
  let response = await fetch(url);
  evolution = await response.json();
}


function renderPokemonCard() {
  document.getElementById('render-pokemon-card-container').innerHTML =
    renderPokemonCardTemplate();
}


async function renderMoves() {
  let moves = currentPokemon['moves']
  document.getElementById('insert-container').innerHTML = renderMovesTemplate();
  for (let i = 0; i < 20; i++) {//moves.length
    let url = moves[i]['move']['url'];
    let move = await loadMoves(url);
    console.log(move)
    insertMove(move, i);
  }
}


function insertMove(move, i) {
  let name = capitalizeFirstLetter(move['name'])
  let accuracy = minusIfNull(move['accuracy'])
  let power = minusIfNull(move['power'])
  document.getElementById('insert-moves-table').innerHTML += insertMoveTemplate(name, accuracy, power, i);
}


function minusIfNull(item) {
  if (item == null) {
    return '-'
  } else {
    return item
  }
}


async function loadMoves(url) {
  let response = await fetch(url);
  return await response.json();
}


async function openMoveInfo(i) {
  let moves = currentPokemon['moves']
  let url = moves[i]['move']['url'];
  let move = await loadMoves(url);
  console.log(move)
  let moveDescription = move['flavor_text_entries']['4']['flavor_text']
  document.getElementById('insert-move-info').innerHTML = /*html*/`
  <div class='move-info-bg'>
    <div class='move-info'>
    <div class='alert alert-primary d-flex align-items-center' role='alert'>
      <img src='img/info.png' alt='move-info' class='info-image me-3'>
      <div>
        ${moveDescription}
      </div>
    </div>
    </div>
  </div>
  `
}


function closeMoveInfo() {
  document.getElementById('insert-move-info').innerHTML = '';
}


function closePokemonCard() {
  document.getElementById('card-bg').classList.add('d-none');
  document.getElementById('pokedex-card').classList.add('d-none');
}


function showElement(id) {
  document.getElementById(id).classList.remove('d-none');
}


function changeCardSection(id) {
  removeActiveClass();
  addActiveClass(id);
}


function removeActiveClass() {
  for (let i = 0; i < 4; i++) {
    document.getElementById('nav-link-' + i).classList.remove('active');
  }
}


function addActiveClass(id) {
  let navItem = document.getElementById(id);
  navItem.classList.add('active');
}


function renderPokemon(currentPokemon) {
  let img = currentPokemon['sprites']['other']['home']['front_default'];
  document.getElementById('pokemon-image').src = img;
}


function editBackgroundColorCard() {
  let bgColor = species['color']['name'];
  editPokedexCard(bgColor, 'card-header');
  editPokedexCard(bgColor, 'pokedex-card');
}


function changeBgColor(bgColor, id) {
  document.getElementById(id).style = `background-color: ${bgColor}`;

}


function renderAboutSection() {
  document.getElementById('insert-container').innerHTML =
    renderAboutSectionTemplate();
  loadAboutSection();
}


function loadAboutSection() {
  insertHabitat();
  insertName();
  insertType('pokemon-type');
  insertWeight();
  insertAbility();
  insertHeight();
  insertEggGroups();
  insertGender();
  insertGrowthRate();
}


function insertName() {
  let name = currentPokemon['species']['name'];
  name = capitalizeFirstLetter(name);
  document.getElementById('pokemon-name').innerHTML = `${name}`;
}


function insertWeight() {
  let weightInKg = currentPokemon['weight'] / 10;
  let weightInLbs = Math.round(weightInKg * 2.20462 * 10) / 10; //rounded to one decimal
  document.getElementById(
    'weight'
  ).innerHTML = `${weightInLbs} lbs (${weightInKg} kg)`;
}


function insertHeight() {
  let heightInCm = currentPokemon['height'] * 10;
  let heightInLbs = toFeet(heightInCm);
  document.getElementById('height').innerHTML = `${heightInLbs} lbs (${heightInCm} cm)`;
}


function insertType(id) {
  let types = currentPokemon['types'];
  document.getElementById(id).innerHTML = '';
  for (let i = 0; i < types.length; i++) {
    let type = currentPokemon['types'][i]['type']['name'];
    document.getElementById(id).innerHTML += `<span>${type}</span>`;
  }
}


function insertTypeDex(id) {
  let types = currentPokemonPokedex['types'];
  document.getElementById(id).innerHTML = '';
  for (let i = 0; i < types.length; i++) {
    let type = currentPokemonPokedex['types'][i]['type']['name'];
    document.getElementById(id).innerHTML += `<span>${type}</span>`;
  }
}


function insertHabitat() {
  let habitat = species['habitat']['name'];
  document.getElementById('habitat').innerHTML = habitat;
}


function insertAbility() {
  let abilities = currentPokemon['abilities'];
  document.getElementById('ability').innerHTML = '';
  // document.getElementById('ability').innerHTML = /*html*/`
  //   <ul id = 'ability-list'></ul>
  // `;
  for (let i = 0; i < abilities.length; i++) {
    let abilityPokemon = abilities[i]['ability']['name'];
    document.getElementById('ability').innerHTML += `<span>${abilityPokemon}</span>`;
  }
}


function insertEggGroups() {
  let genderRate = species['gender_rate'];
  let genderPropabilityF = (species['gender_rate'] * 100) / 8;
  let genderPropabilityM = 100 - genderPropabilityF;
  let gender = document.getElementById('gender');
  if (genderRate === -1) {
    gender.innerHTML = `<img src='img/genderless.png' alt='genderless'>genderless`;
  } else {
    gender.innerHTML = `<img src='img/masculine.png' alt='masculine'><span>${genderPropabilityM}%</span><img src='img/feminine.png' alt='feminine'><span>${genderPropabilityF}%</span>`;
  }
}


function insertGender() {
  let eggGroups = species['egg_groups'];
  document.getElementById('egg-groups').innerHTML = '';
  for (let i = 0; i < eggGroups.length; i++) {
    const eggGroup = eggGroups[i]['name'];
    document.getElementById(
      'egg-groups'
    ).innerHTML += `<span>${eggGroup}</span>`;
  }
}


function insertGrowthRate() {
  let growthRate = species['growth_rate']['name'];
  document.getElementById('growth-rate').innerHTML = '';
  document.getElementById(
    'growth-rate'
  ).innerHTML += `<span>${growthRate}</span>`;
}


// get the the base stats section
function renderBaseStats() {
  document.getElementById('insert-container').innerHTML = renderBaseStatsTemplate();
  setTimeout(insertBaseStats, 100);
}


function renderBaseStatsTemplate(){
  return /*html*/ `
    <div class="stats-table h-100" >
      <table class="w-100 h-100" >
        <tbody id="base-stat-table">

        </tbody>
      </table>
    </div>
  `
}


function insertBaseStats() {
  let totalAmount = 0;
  let statLabels = ['HP', 'Attack', 'Defense', 'Sp-attack', 'Sp-defense', 'Speed'];
  let stats = currentPokemon['stats'];
  for (let i = 0; i < stats.length; i++) {
    let label = statLabels[i];
    let baseStat = stats[i]['base_stat'];
    let progressId = 'stat-progress-' + (label.toLowerCase())
    totalAmount = totalAmount + baseStat;
    generateBaseStats(baseStat, label, progressId);
  }
  changeTotalStat(totalAmount);
  
  setTimeout(function() {
    progressBarLoad(stats, statLabels, totalAmount);
}, 100)
}


function progressBarLoad(stats, statLabels, totalAmount){
  let totalProgress = (totalAmount / 600) * 100;
  for (let i = 0; i < 6; i++) {
    let baseStat = stats[i]['base_stat'];
    let progressId = 'stat-progress-' + (statLabels[i].toLowerCase())
    changeProgressBar(baseStat, progressId);
  }
  progressBarLoadTotal(totalProgress)
}


function progressBarLoadTotal(totalProgress){
  document.getElementById('stat-progress-total').style = `width: ${totalProgress}%`;
}

function generateBaseStats(baseStat, label, progressId) {
  document.getElementById('base-stat-table').innerHTML += generateBaseStatsTemplate(baseStat, label, progressId);
}


function generateBaseStatsTemplate(baseStat, label, progressId){
  return /*html*/`
    <tr class="d-flex w-100">
      <td class="stat-label">${label}</td>
      <td class="stat-value">${baseStat}</td>
      <td class="flex-grow-1 d-flex align-items-center">
        <div class="progress w-100">
          <div class="progress-bar" style="width: 0%" id="${progressId}"></div>
        </div>
      </td>
    </tr>
  `
}


function changeProgressBar(baseStat, progressId) {
  if (baseStat < 60) {
    addClassList(progressId, 'bg-danger')
  }
  changeProgressBarWidth(baseStat,progressId);
}


function changeProgressBarWidth(baseStat, progressId){
  document.getElementById(progressId).style = `width: ${baseStat}%`;
}


function changeTotalStat(totalAmount) {
  let totalProgress = (totalAmount / 600) * 100;
  document.getElementById('base-stat-table').innerHTML += generateBaseStatsTemplate(totalAmount, 'Total', 'stat-progress-total');
  // document.getElementById('stat-progress-total').style = `width: ${totalProgress}%`;
}


//get the evolution section
function renderEvolution() {
  document.getElementById('insert-container').innerHTML = renderEvolutionTemplate();
  let noEvolution = evolution['chain']['species']['name'];
  let firstEvolution = evolution['chain']['evolves_to']['0']['species']['name'];
  hideEvolution();
  loadPokemonEvolution(firstEvolution, 'first');
  loadPokemonEvolution(noEvolution, 'no');
}


function hideEvolution() {
  evoTwoPath = evolution['chain']['evolves_to']['0']['evolves_to'];
  if (evoTwoPath.length != 0) {
    let secondEvolution =
      evolution['chain']['evolves_to']['0']['evolves_to']['0']['species']['name'];
    loadPokemonEvolution(secondEvolution, 'second');
  } else {
    document.getElementById('second-evolution-container').classList.add('d-none');
  }
}


async function loadPokemonEvolution(pokemonName, evolutionStage) {
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;
  let response = await fetch(url);
  currentEvolution = await response.json();
  insertEvolutionImages(evolutionStage);
}


function insertEvolutionImages(evolutionStage) {
  if (evolutionStage === 'first') {
    insertEvolutionImagesFirstStage();
  } else if (evolutionStage === 'second') {
    insertEvolutionImagesSecondStage();
  } else {
    insertEvolutionImagesNoStage();
  }
}


function insertEvolutionImagesNoStage() {
  let evolutionImageNoStage = currentEvolution['sprites']['other']['home']['front_default'];
  const noEvolutionImage = document.getElementById('no-evolution');
  const loader = document.querySelector('.loader');
  noEvolutionImage.src = evolutionImageNoStage;
  if (noEvolutionImage.complete) {
    // Falls das Bild bereits geladen ist (z.B. aus dem Cache)
    setTimeout(() => {
      loader.classList.add('loader-hidden');
    }, 1000);
  } else {
    // Warten auf das Laden des Bildes
    noEvolutionImage.addEventListener('load', () => {
      loader.classList.add('loader-hidden');
    });
  }
}


function insertEvolutionImagesFirstStage() {
  let evolutionImageFirstStage =
    currentEvolution['sprites']['other']['home']['front_default'];
  document.getElementById('to-first-evolution').src = evolutionImageFirstStage;
  document.getElementById('from-first-evolution').src =
    evolutionImageFirstStage;
}


function insertEvolutionImagesSecondStage() {
  let evolutionImageSecondStage =
    currentEvolution['sprites']['other']['home']['front_default'];
  document.getElementById('to-second-evolution').src =
    evolutionImageSecondStage;
}


// Standard Funktionen
function addClassList(id, myClass){
  document.getElementById(id).classList.add(myClass);
}


function hideElement(element) {
  document.getElementById(element).classList.add('d-none')
}


function showElement(element) {
  document.getElementById(element).classList.remove('d-none')
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function toFeet(n) {
  var realFeet = (n * 0.3937) / 12;
  var feet = Math.floor(realFeet);
  var inches = Math.round(10 * ((realFeet - feet) * 12)) / 10;
  return feet + '&prime;' + inches + '&Prime;';
}