let search = '';
let currentPokedex;
let itemsPerLoad = 40; // Anzahl der Elemente, die pro Ladung gerendert werden sollen
let currentIndex = 0
let maxIndex;
let currentPokemonPokedex
let currentMoves;
let moveNames = [];
let moveUrls = [];

function filterPokemon(){
  search = document.getElementById('search').value
  search = search.toLowerCase()
  renderPokedexFilter();
}

async function init() {
  let url = `https://pokeapi.co/api/v2/pokedex/2`;
  let response = await fetch(url);
  currentPokedex = await response.json();
  // console.log(currentPokedex);
  // Observer initialisieren
  createObserver();
}

function createObserver() {
  let observer;
  let options = {
    // root: null, // bezieht sich auf den Viewport
    // rootMargin: '0px',
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
  // document.getElementById("render-pokedex").innerHTML = ''
  maxIndex = Math.min(currentIndex + itemsPerLoad, currentPokedex["pokemon_entries"].length);
  for (let i = currentIndex; i < maxIndex; i++) {     //currentPokedex["pokemon_entries"].length
    let pokemon = currentPokedex["pokemon_entries"][i]["pokemon_species"]["name"];
      await renderPokedexCard(i, pokemon);
  }
  document.getElementById('load').classList.remove('d-none')
  currentIndex += itemsPerLoad; // Update currentIndex um itemsPerLoad
  // currentIndex = maxIndex; // Aktualisieren des Index des letzten geladenen Pokémon
  // maxIndex = maxIndex + 40;
}


async function renderPokedexFilter() {
  document.getElementById('load').classList.add('d-none')
  document.getElementById("render-pokedex").innerHTML = '';
  if (search){
    for (let i = 0; i < currentPokedex["pokemon_entries"].length; i++) {     //currentPokedex["pokemon_entries"].length
      let pokemon = currentPokedex["pokemon_entries"][i]["pokemon_species"]["name"];
        if(pokemon.toLowerCase().includes(search)){
          // console.log(search)
          await renderPokedexCard(i, pokemon);
        }
      } 
  }else{
      currentIndex = 0;
      maxIndex = 0;
      await renderPokedex();
    } 
}


async function renderPokedexCard(i, pokemon){
  let pokemonId = i + 1;
  currentPokemonPokedex = await loadPokemon(pokemonId);
  speciesPokedex = await loadSpecies('pokedex');
  createPokedexCard(i, pokemon, pokemonId);
}

function createPokedexCard(i, pokemon, pokemonId){
  let bgColor = speciesPokedex["color"]["name"];
  insertPokedex(pokemonId, i, pokemon);
  // changeBgColor(bgColor, "overview-card-" + i);
  let pokeBg = "overview-card-" + i
  editPokedexCard(bgColor, pokeBg);
  insertTypeDex("type-in-pokedex-" + i);
  let img = currentPokemonPokedex["sprites"]["other"]["home"]["front_default"];
  document.getElementById("overview-card-image-" + i).src = img;
}


function insertPokedex(pokemonId, i, pokemon) {
  document.getElementById("render-pokedex").innerHTML += renderPokedexTemplate(pokemonId, i, pokemon);
}

function renderPokedexTemplate(pokemonId, i, pokemon) {
  return /*html*/ `
  <div onclick="openPokemonCard(${pokemonId})" class="pokedex-cards" id="overview-card-${i}">
    <div class="overview-pokeball-container">
      <img src="img/pokebal_filled2.png" class="overview-pokeball">
    </div>
    <div class="d-flex flex-column justify-content-start align-items-start">
      <span id="name-${i}" class="overview-card-name">
        ${pokemon}
      </span>
      <div id="type-in-pokedex-${i}" class="pokemon-type-pokedex d-flex flex-column"></div>
      <img src="" alt="pokemon" id="overview-card-image-${i}" class="overview-card-image">      
    </div>
  </div>
`;
}

function editPokedexCard(bgColor, pokeBg) {
  if (bgColor == "white") {
    // changeFontColor(PokeId, "black");
    editBgColor(pokeBg, "rgb(255, 233, 191)");
  } else if (bgColor == "yellow") {
    // changeFontColor(PokeId, "black");
    editBgColor(pokeBg, "#FDCF48"); //  #FFFAA0
  } else if (bgColor == "pink") {
    // changeFontColor(PokeId, "black");
    editBgColor(pokeBg, "#ffb098");
  } else if (bgColor == "blue") {
    editBgColor(pokeBg, "#76BDFE"); //darkblue   #6a93b0
  } else if (bgColor == "brown") {
    editBgColor(pokeBg, "rgb(154, 123, 98)"); //#663325
  } else if (bgColor == "green") {
    editBgColor(pokeBg, "#48d09a"); //#6B8E23
  } else if (bgColor == "red") {
    editBgColor(pokeBg, "#ff6961");
  } else if (bgColor == "purple") {
    editBgColor(pokeBg, "#cb99c9");
  } else if (bgColor == "gray") {
    editBgColor(pokeBg, "#cfcfc4");
  } else if (bgColor == "black") {
    editBgColor(pokeBg, "#00002F");
  }
}

function changeFontColor(PokeId, color) {
  document.getElementById(PokeId).style = `color: ${color}`;
}

function editBgColor(pokeBg, bg) {
  document.getElementById(pokeBg).style = `background-color: ${bg}`;
}



// open the individual pokemon card
let currentPokemon;
let currentEvolution;
let evolution;
let abc;

async function openPokemonCard(pokemonId) {
  currentPokemon = await loadPokemon(pokemonId);
  species = await loadSpecies('card');
  console.log(currentPokemon);
  // console.log(species);
  await loadEvolution(pokemonId);
  // await loadMove();
  // document.getElementById("card-bg").classList.remove("d-none");
  // document.getElementById("pokedex-card").classList.remove("d-none");
  renderPokemonCard();
  // showElement("card-bg");
  // showElement("pokedex-card");
  renderPokemon(currentPokemon);
  renderAboutSection();
  editBackgroundColorCard();
  // console.log(ability);
}

async function loadPokemon(pokemonId) {
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  let response = await fetch(url);
  return await response.json();
  // pokemonName = currentPokemon["species"]["name"];

}

async function loadSpecies(type) {
  let url;
  if (type == 'card'){
    url = currentPokemon["species"]["url"];
  }else{
    url = currentPokemonPokedex["species"]["url"];
  }
  let response = await fetch(url);
  return await response.json();
}

async function loadEvolution() {
  let url = species["evolution_chain"]["url"];
  let response = await fetch(url);
  evolution = await response.json();
  // console.log(evolution);
}

function renderPokemonCard() {
  document.getElementById("render-pokemon-card-container").innerHTML =
    renderPokemonCardTemplate();
}

function renderPokemonCardTemplate() {
  return /*html*/ `
<div id="card-bg" class="">
  <div id="pokedex-card" class="">
    <div id="card-header">
    <div class="card-pokeball-container">
      <img src="img/pokebal_filled2.png" class="card-pokeball">
    </div>
      <img src="img/white-arrow-left.png" alt="leave" class="leave-arrow" onclick="closePokemonCard()">
      <div class="d-flex w-100 justify-content-between align-items-end px-3">
        <span id="pokemon-name">Bulbasaur</span>
        <span id="pokemon-number">#001</span>
      </div>
      <div id="pokemon-type">Grass</div>
      <div class="w-100 d-flex justify-content-center img-container"><img id="pokemon-image" src="" alt="pokemon">
      </div>
    </div>
    <div id="card-description">
      <nav class="navbar navbar-expand navbar-light">
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <a class="nav-item nav-link active" id="nav-link-0"
              onclick="changeCardSection('nav-link-0'), renderAboutSection()" >About</a>
            <a class="nav-item nav-link" id="nav-link-1" onclick="changeCardSection('nav-link-1'), renderBaseStats()"
              >Base
              Stats</a>
            <a class="nav-item nav-link" id="nav-link-2" onclick="changeCardSection('nav-link-2'), renderEvolution()"
              >Evolution</a>
            <a class="nav-item nav-link" id="nav-link-3" onclick="changeCardSection('nav-link-3'), renderMoves()">Moves</a>
          </div>
        </div>
      </nav>
      <div id="insert-container" class="flex-grow-1 p-3 position-relative">
      </div>
    </div>
  </div>
</div>
`;
}

// async function openMoves(){
//   getMovesUrls();
//   await loadMoves();
//   renderMoves();
// }

async function renderMoves() {
  let moves = currentPokemon['moves']
  document.getElementById('insert-container').innerHTML = renderMovesTemplate();
  for (let i = 0; i < 20; i++) {//moves.length
    let url = moves[i]['move']['url'];
    let move = await loadMoves(url);
    console.log(move)
    insertMove(move);
  }
}


function renderMovesTemplate(){
  let name = currentPokemon["species"]["name"];
  return /*html*/`
    <h3>Moves, that ${name} can learn</h3>
    <table class="w-100">
      <tbody id="insert-moves-table" class="w-100">
        <tr>
          <th>Name</th>
          <th>Power</th>
          <th>Accuracy</th>
        </tr>
      </tbody>
    </table>
  `
}
//test

function insertMove(move){
  let name = move['name']
  let accuracy = move['accuracy']
  let power = move['power']
  document.getElementById('insert-moves-table').innerHTML += insertMoveTemplate(name, accuracy, power);
}

function insertMoveTemplate(name, accuracy, power){
  return /*html*/`
    <tr>
      <td>${name}</td>
      <td>${power}</td>
      <td>${accuracy}</td>
    </tr>
  `
}

async function loadMoves(url){
  // for (let i = 0; i < 10; i++) {
    let response = await fetch(url);
    return await response.json();
    // }
}

function closePokemonCard() {
  document.getElementById("card-bg").classList.add("d-none");
  document.getElementById("pokedex-card").classList.add("d-none");
}

function showElement(id) {
  document.getElementById(id).classList.remove("d-none");
}

function changeCardSection(id) {
  removeActiveClass();
  addActiveClass(id);
}

function removeActiveClass() {
  for (let i = 0; i < 4; i++) {
    document.getElementById("nav-link-" + i).classList.remove("active");
  }
}

function addActiveClass(id) {
  let navItem = document.getElementById(id);
  navItem.classList.add("active");
}

function renderPokemon(currentPokemon) {
  let img = currentPokemon["sprites"]["other"]["home"]["front_default"];
  document.getElementById("pokemon-image").src = img;
}

function editBackgroundColorCard() {
  let bgColor = species["color"]["name"];
  // changeBgColor(bgColor, "card-header");
  // changeBgColor(bgColor, "pokedex-card");

  editPokedexCard(bgColor, "card-header");
  editPokedexCard(bgColor, "pokedex-card");
}

function changeBgColor(bgColor, id) {
  document.getElementById(id).style = `background-color: ${bgColor}`;

}

function renderAboutSection() {
  document.getElementById("insert-container").innerHTML =
    renderAboutSectionTemplate();
  loadAboutSection();
}

function renderAboutSectionTemplate() {
  return /*html*/ `
    <table class="about-table">
          <tr>
            <td>Habitat</td>
            <td id="habitat">Seed</td>
          </tr>
          <tr>
            <td>Height</td>
            <td id="height">70cm</td>
          </tr>
          <tr>
            <td>Weight</td>
            <td id="weight">6.9 kg</td>
          </tr>
          <tr>
            <td>Abilities</td>
            <td id="ability">Overgrow</td>
          </tr>
          <th>Breeding</th>
          <tr>
            <td>Gender</td>
            <td id="gender">
              <span id="gender-m">87.5%</span><span id="gender-w">12.5%</span>
            </td>
          </tr>
          <tr>
            <td>egg-groups</td>
            <td id="egg-groups">Monster</td>
          </tr>
          <tr>
            <td>growth-rate</td>
            <td id="growth-rate">medium</td>
          </tr>
        </table>
  `;
}

function loadAboutSection() {
  insertHabitat();
  insertName();
  insertType("pokemon-type");
  insertWeight();
  insertAbility();
  insertHeight();
  insertEggGroups();
  insertGender();
  insertGrowthRate();
}

function insertName() {
  let name = currentPokemon["species"]["name"];
  name = capitalizeFirstLetter(name);
  document.getElementById("pokemon-name").innerHTML = `${name}`;
}

function insertWeight() {
  let weightInKg = currentPokemon["weight"] / 10;
  let weightInLbs = Math.round(weightInKg * 2.20462 * 10) / 10; //rounded to one decimal
  document.getElementById(
    "weight"
  ).innerHTML = `${weightInLbs} lbs (${weightInKg} kg)`;
}

function insertHeight() {
  let heightInCm = currentPokemon["height"] * 10;
  let heightInLbs = toFeet(heightInCm);
  document.getElementById("height").innerHTML = `${heightInLbs} lbs (${heightInCm} cm)`;
}

function insertType(id) {
  let types = currentPokemon["types"];
  document.getElementById(id).innerHTML = "";
  for (let i = 0; i < types.length; i++) {
    let type = currentPokemon["types"][i]["type"]["name"];
    document.getElementById(id).innerHTML += `<span>${type}</span>`;
  }
}

function insertTypeDex(id) {
  let types = currentPokemonPokedex["types"];
  document.getElementById(id).innerHTML = "";
  for (let i = 0; i < types.length; i++) {
    let type = currentPokemonPokedex["types"][i]["type"]["name"];
    document.getElementById(id).innerHTML += `<span>${type}</span>`;
  }
}

function insertHabitat() {
  let habitat = species["habitat"]["name"];
  document.getElementById("habitat").innerHTML = habitat;
}

function insertAbility() {
  let abilities = currentPokemon["abilities"];
  document.getElementById("ability").innerHTML = "";
  // document.getElementById("ability").innerHTML = /*html*/`
  //   <ul id = "ability-list"></ul>
  // `;
  for (let i = 0; i < abilities.length; i++) {
    // let abilityPokemon = abilities['i']['ability']['name'];
    document.getElementById("ability").innerHTML += `<span>${abilities[i]["ability"]["name"]}</span>`;
  }
  // let abilityPokemon = currentPokemon['abilities']['i']['ability']['name'];
  // let hidden = currentPokemon['abilities']['i']['is_hidden'];
  // document.getElementById('ability').innerHTML = abilityPokemon;
}

function insertEggGroups() {
  let genderRate = species["gender_rate"];
  let genderPropabilityF = (species["gender_rate"] * 100) / 8;
  let genderPropabilityM = 100 - genderPropabilityF;
  let gender = document.getElementById("gender");
  if (genderRate === -1) {
    gender.innerHTML =
      '<img src="img/genderless.png" alt="genderless">genderless';
  } else {
    gender.innerHTML = `<img src="img/masculine.png" alt="masculine"><span>${genderPropabilityM}%</span><img src="img/feminine.png" alt="feminine"><span>${genderPropabilityF}%</span>`;
  }
}

function insertGender() {
  let eggGroups = species["egg_groups"];
  document.getElementById("egg-groups").innerHTML = "";
  for (let i = 0; i < eggGroups.length; i++) {
    const eggGroup = eggGroups[i]["name"];
    document.getElementById(
      "egg-groups"
    ).innerHTML += `<span>${eggGroup}</span>`;
  }
}

function insertGrowthRate() {
  let growthRate = species["growth_rate"]["name"];
  document.getElementById("growth-rate").innerHTML = "";
  document.getElementById(
    "growth-rate"
  ).innerHTML += `<span>${growthRate}</span>`;
}

// get the the base stats section
function renderBaseStats() {
  document.getElementById("insert-container").innerHTML = renderBaseStatsTemplate();
  insertBaseStats();
}

function renderBaseStatsTemplate() {
  return /*html*/ `
  <div class="stats-table h-100">
    <table class="w-100 h-100">
      <tr class="d-flex w-100">
        <td class="stat-label" id="stat-label-hp">HP</td>
        <td class="stat-value" id="stat-value-hp">1</td>
        <td class="flex-grow-1 d-flex align-items-center">
          <div class="progress w-100">
            <div class="progress-bar" style="width: 1% " id="stat-progress-hp"></div>
          </div>
        </td>
      </tr>
      <tr class="d-flex w-100">
        <td class="stat-label" id="stat-label-attack">Attack</td>
        <td class="stat-value" id="stat-value-attack">1</td>
        <td class="flex-grow-1 d-flex align-items-center">
          <div class="progress w-100">
            <div class="progress-bar" style="width: 1%" id="stat-progress-attack"></div>
          </div>
        </td>
      </tr>
      <tr class="d-flex w-100">
         <td class="stat-label" id="stat-label-defense">Defense</td>
        <td class="stat-value" id="stat-value-defense">1</td>
         <td class="flex-grow-1 d-flex align-items-center">
           <div class="progress w-100">
             <div class="progress-bar" style="width: 1%" id="stat-progress-defense"></div>
           </div>
         </td>
      </tr>
      <tr class="d-flex w-100">
        <td class="stat-label" id="stat-label-special-attack">Sp-Attack</td>
        <td class="stat-value" id="stat-value-special-attack">1</td>
        <td class="flex-grow-1 d-flex align-items-center">
          <div class="progress w-100">
            <div class="progress-bar" style="width: 1%" id="stat-progress-special-attack"></div>
          </div>
        </td>
      </tr>
      <tr class="d-flex w-100">
        <td class="stat-label" id="stat-label-special-defense">Sp-Defense</td>
        <td class="stat-value" id="stat-value-special-defense">1</td>
        <td class="flex-grow-1 d-flex align-items-center">
          <div class="progress w-100">
            <div class="progress-bar" style="width: 1%" id="stat-progress-special-defense"></div>
          </div>
        </td>
      </tr>
      <tr class="d-flex w-100">
        <td class="stat-label" id="stat-label-speed">Speed</td>
        <td class="stat-value" id="stat-value-speed">1</td>
        <td class="flex-grow-1 d-flex align-items-center">
          <div class="progress w-100">
            <div class="progress-bar" style="width: 1%" id="stat-progress-speed"></div>
          </div>
        </td>
      </tr>
      <tr class="d-flex w-100">
        <td class="stat-label" id="stat-label-total">Total</td>
         <td class="stat-value" id="stat-value-total">1</td>
         <td class="flex-grow-1 d-flex align-items-center">
           <div class="progress w-100">
             <div class="progress-bar" style="width: 1%" id="stat-progress-total"></div>
          </div>
         </td>
      </tr>
    </table>
  </div>
    `;
}

function insertBaseStats() {
  let totalAmount = 0;
  let statTypes = [
    "hp",
    "attack",
    "defense",
    "special-attack",
    "special-defense",
    "speed",
  ];
  let stats = currentPokemon["stats"];
  for (let i = 0; i < stats.length; i++) {
    const statType = "stat-value-" + statTypes[i];
    const baseStat = stats[i]["base_stat"];
    const progress = "stat-progress-" + statTypes[i];
    generateBaseStats(statType, baseStat);
    changeProgressColor(baseStat, progress);
    totalAmount = totalAmount + baseStat;
  }
  changeTotalStat(totalAmount);
}

function generateBaseStats(statType, baseStat) {
  document.getElementById(statType).innerHTML = baseStat;
}

function changeProgressColor(baseStat, progress) {
  if (baseStat < 60) {
    document.getElementById(progress).classList.add("bg-danger");
  }
  document.getElementById(progress).style = `width: ${baseStat}%`;
}

function changeTotalStat(totalAmount) {
  let totalProgress = (totalAmount / 600) * 100;
  document.getElementById("stat-value-total").innerHTML = totalAmount;
  document.getElementById(
    "stat-progress-total"
  ).style = `width: ${totalProgress}%`;
}

//get the evolution section

function renderEvolution() {
  document.getElementById("insert-container").innerHTML = renderEvolutionTemplate();
  let noEvolution = evolution["chain"]["species"]["name"];
  let firstEvolution = evolution["chain"]["evolves_to"]["0"]["species"]["name"];
  hideEvolution();
  loadPokemonEvolution(firstEvolution, "first");
  loadPokemonEvolution(noEvolution, "no");
}



function hideEvolution() {
  evoTwoPath = evolution["chain"]["evolves_to"]["0"]["evolves_to"];
  if (evoTwoPath.length != 0) {
    let secondEvolution =
      evolution["chain"]["evolves_to"]["0"]["evolves_to"]["0"]["species"]["name"];
    loadPokemonEvolution(secondEvolution, "second");
  } else {
    document.getElementById("second-evolution-container").classList.add("d-none");
  }
}


function renderEvolutionTemplate() {
  return /*html*/ `
  <div class="loader"></div>
  <div class="evolution-container w-100 h-100 position-relative">
    <div class="d-flex justify-content-between align-items-center ">
      <img src="" alt="<div></div>" id="no-evolution" class='evolution-images'>
      <img src="img/arrow.png" alt="to" class="evolution-arrow" >
      <img src="" alt="evolution 1" id="to-first-evolution" class='evolution-images'>
    </div>
    <div class="d-flex justify-content-between align-items-center" id="second-evolution-container">
      <img src="" alt="evolution 1" id="from-first-evolution" class='evolution-images'>
      <img src="img/arrow.png" alt="to" class="evolution-arrow">
      <img src="" alt="evolution 2" id="to-second-evolution" class='evolution-images'>
    </div>
    </div>
  </div>
  `;
}

async function loadPokemonEvolution(pokemonName, evolutionStage) {
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;
  let response = await fetch(url);
  currentEvolution = await response.json();
  insertEvolutionImages(evolutionStage);
}

function insertEvolutionImages(evolutionStage) {
  if (evolutionStage === "first") {
    insertEvolutionImagesFirstStage();
  } else if (evolutionStage === "second") {
    insertEvolutionImagesSecondStage();
  } else {
    insertEvolutionImagesNoStage();
  }
}

function insertEvolutionImagesNoStage() {
  let evolutionImageNoStage = currentEvolution["sprites"]["other"]["home"]["front_default"];
  const noEvolutionImage = document.getElementById("no-evolution");
  const loader = document.querySelector(".loader");

  noEvolutionImage.src = evolutionImageNoStage;

  if (noEvolutionImage.complete) {
    // Falls das Bild bereits geladen ist (z.B. aus dem Cache)
    setTimeout(() => {
      loader.classList.add("loader-hidden");
    }, 1000);
  } else {
    // Warten auf das Laden des Bildes
    noEvolutionImage.addEventListener("load", () => {
      loader.classList.add("loader-hidden");
    });
  }
}

function insertEvolutionImagesFirstStage() {
  let evolutionImageFirstStage =
    currentEvolution["sprites"]["other"]["home"]["front_default"];
  document.getElementById("to-first-evolution").src = evolutionImageFirstStage;
  document.getElementById("from-first-evolution").src =
    evolutionImageFirstStage;
}

function insertEvolutionImagesSecondStage() {
  let evolutionImageSecondStage =
    currentEvolution["sprites"]["other"]["home"]["front_default"];
  document.getElementById("to-second-evolution").src =
    evolutionImageSecondStage;
}








// // Funktion zum Rendern des HTML-Templates
// function renderEvolutionTemplate() {
//   return /*html*/ `
//     <div class="loader"></div>
//     <div class="evolution-container w-100 h-100 position-relative">
//       <div class="d-flex justify-content-between align-items-center px-4">
//         <img src="" alt="No Evolution" id="no-evolution" class='evolution-images'>
//         <img src="img/arrow.png" alt="to" class="evolution-arrow">
//         <img src="" alt="Evolution 1" id="to-first-evolution" class='evolution-images'>
//       </div>
//       <div class="d-flex justify-content-between align-items-center px-4" id="second-evolution-container">
//         <img src="" alt="Evolution 1" id="from-first-evolution" class='evolution-images'>
//         <img src="img/arrow.png" alt="to" class="evolution-arrow">
//         <img src="" alt="Evolution 2" id="to-second-evolution" class='evolution-images'>
//       </div>
//     </div>
//   </div>
//   `;
// }

// // Funktion zum Laden der Evolutionsdaten und Bilder
// async function loadPokemonEvolution(pokemonName, evolutionStage) {
//   let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;
//   let response = await fetch(url);
//   currentEvolution = await response.json();
//   await insertEvolutionImages(evolutionStage);
// }

// // Funktionen zum Einfügen der Bilder je nach Evolutionsstufe
// function insertEvolutionImages(evolutionStage) {
//   if (evolutionStage === "first") {
//     return insertEvolutionImagesFirstStage();
//   } else if (evolutionStage === "second") {
//     return insertEvolutionImagesSecondStage();
//   } else {
//     return insertEvolutionImagesNoStage();
//   }
// }

// function insertEvolutionImagesNoStage() {
//   let evolutionImageNoStage = currentEvolution["sprites"]["other"]["home"]["front_default"];
//   let imgElement = document.getElementById("no-evolution");
//   imgElement.src = evolutionImageNoStage;

//   return new Promise((resolve, reject) => {
//     imgElement.onload = () => resolve();
//     imgElement.onerror = () => reject('Bild konnte nicht geladen werden');
//   });
// }

// function insertEvolutionImagesFirstStage() {
//   let evolutionImageFirstStage = currentEvolution["sprites"]["other"]["home"]["front_default"];
//   let imgElement1 = document.getElementById("to-first-evolution");
//   let imgElement2 = document.getElementById("from-first-evolution");
//   imgElement1.src = evolutionImageFirstStage;
//   imgElement2.src = evolutionImageFirstStage;

//   return Promise.all([
//     new Promise((resolve, reject) => {
//       imgElement1.onload = () => resolve();
//       imgElement1.onerror = () => reject('Bild 1 konnte nicht geladen werden');
//     }),
//     new Promise((resolve, reject) => {
//       imgElement2.onload = () => resolve();
//       imgElement2.onerror = () => reject('Bild 2 konnte nicht geladen werden');
//     })
//   ]);
// }

// function insertEvolutionImagesSecondStage() {
//   let evolutionImageSecondStage = currentEvolution["sprites"]["other"]["home"]["front_default"];
//   let imgElement = document.getElementById("to-second-evolution");
//   imgElement.src = evolutionImageSecondStage;

//   return new Promise((resolve, reject) => {
//     imgElement.onload = () => resolve();
//     imgElement.onerror = () => reject('Bild konnte nicht geladen werden');
//   });
// }

// // Funktion zum Verbergen der zweiten Evolutionsstufe, falls nicht vorhanden
// function hideEvolution() {
//   evoTwoPath = evolution["chain"]["evolves_to"]["0"]["evolves_to"];
//   if (evoTwoPath.length != 0) {
//     let secondEvolution = evolution["chain"]["evolves_to"]["0"]["evolves_to"]["0"]["species"]["name"];
//     return loadPokemonEvolution(secondEvolution, "second");
//   } else {
//     document.getElementById("second-evolution-container").classList.add("d-none");
//     return Promise.resolve(); // Sofort auflösen, wenn kein zweites Bild geladen wird
//   }
// }

// // Hauptfunktion zur Steuerung des Renderings und Ladens
// async function renderEvolution() {
//   document.getElementById("insert-container").innerHTML = renderEvolutionTemplate();

//   let noEvolution = evolution["chain"]["species"]["name"];
//   let firstEvolution = evolution["chain"]["evolves_to"]["0"]["species"]["name"];

//   try {
//     await Promise.all([
//       loadPokemonEvolution(firstEvolution, "first"),
//       loadPokemonEvolution(noEvolution, "no"),
//       hideEvolution()
//     ]);
//     document.querySelector(".loader").classList.add("loader-hidden");
//   } catch (error) {
//     console.error('Fehler beim Laden der Bilder:', error);
//   }
// }

























function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toFeet(n) {
  var realFeet = (n * 0.3937) / 12;
  var feet = Math.floor(realFeet);
  var inches = Math.round(10 * ((realFeet - feet) * 12)) / 10;
  return feet + "&prime;" + inches + "&Prime;";
}

