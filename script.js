let currentPokedex;



function loadMoreUser(elements){
  const newValues = []

  for (let i = 0; i < elements; i++){
    newValues.push(currentPokedex["pokemon_entries"][i]["pokemon_species"]["name"])
  }
  return newValues;
}


async function init() {
  // openPokemonCard();
  let url = `https://pokeapi.co/api/v2/pokedex/2`;
  let response = await fetch(url);
  currentPokedex = await response.json();
  // console.log(currentPokedex);
  renderPokedex(currentPokedex);
}

async function renderPokedex(currentPokedex) {
  for (let i = 0; i < currentPokedex["pokemon_entries"].length; i++) {
    let pokemonId = i + 1;
    await loadPokemon(pokemonId);
    await loadSpecies();
    const pokemon =
      currentPokedex["pokemon_entries"][i]["pokemon_species"]["name"];
    let img = currentPokemon["sprites"]["other"]["home"]["front_default"];
    let bgColor = species["color"]["name"];
    insertPokedex(pokemonId, i, pokemon);
    changeBgColor(bgColor, "overview-card-" + i);
    let pokeBg = "overview-card-" + i
    editPokedexCard(bgColor, pokeBg);
    insertType("type-in-pokedex-" + i);
    document.getElementById("overview-card-image-" + i).src = img;
  }
}

function insertPokedex(pokemonId, i, pokemon) {
  document.getElementById("render-pokedex").innerHTML += renderPokedexTemplate(
    pokemonId, i, pokemon
  );
}

function editPokedexCard(bgColor, pokeBg) {
  // let PokeId = "name-" + i;
  if (bgColor == "white") {
    // changeFontColor(PokeId, "black");
    editBgColor(pokeBg, "rgb(255, 233, 191)");
  } else if (bgColor == "yellow") {
    // changeFontColor(PokeId, "black");
    editBgColor(pokeBg, "#FFFAA0"); //#FDCF48
  } else if (bgColor == "pink") {
    // changeFontColor(PokeId, "black");
    editBgColor(pokeBg, "#ffb098");
  } else if (bgColor == "blue") {
    editBgColor(pokeBg, "76BDFE"); //darkblue   #6a93b0
  } else if (bgColor == "brown") {
    editBgColor(pokeBg, "#836953"); //#663325
  } else if (bgColor == "green") {
    editBgColor(pokeBg, "#48D0B0"); //#6B8E23
  } else if (bgColor == "red") {
    editBgColor(pokeBg, "#ff6961"); 
  } else if (bgColor == "purple") {
    editBgColor(pokeBg, "#cb99c9"); 
  } else if (bgColor == "gray") {
    editBgColor(pokeBg, "#cfcfc4"); 
  }
}

function changeFontColor(PokeId, color) {
  document.getElementById(PokeId).style = `color: ${color}`;
}

function editBgColor(pokeBg, bg) {
  document.getElementById(pokeBg).style = `background-color: ${bg}`;
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

// open the individual pokemon card
let currentPokemon;
let currentEvolution;
let evolution;
let abc;

async function openPokemonCard(pokemonId) {
  await loadPokemon(pokemonId);
  await loadSpecies();
  console.log(currentPokemon);
  console.log(species);
  await loadEvolution(pokemonId);
  // await loadMove(pokemonName);
  // document.getElementById("card-bg").classList.remove("d-none");
  // document.getElementById("pokedex-card").classList.remove("d-none");
  renderPokemonCard();
  // showElement("card-bg");
  // showElement("pokedex-card");
  renderPokemon(currentPokemon);
  renderAboutSection();
  editBackgroundColorCard();
  console.log(currentPokemon);
  console.log(species);
  console.log(ability);


  
}

async function loadPokemon(pokemonId) {
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  let response = await fetch(url);
  currentPokemon = await response.json();
  pokemonName = currentPokemon["species"]["name"];
}

async function loadSpecies() {
  let url = currentPokemon["species"]["url"];
  let response = await fetch(url);
  species = await response.json();
}

async function loadMove() {
  let url = "https://pokeapi.co/api/v2/move/3/";
  let response = await fetch(url);
  ability = await response.json();
}

async function loadEvolution() {
  let url = species["evolution_chain"]["url"];
  let response = await fetch(url);
  evolution = await response.json();
  console.log(evolution);
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
            <a class="nav-item nav-link" id="nav-link-3" onclick="changeCardSection('nav-link-3')">Moves</a>
          </div>
        </div>
      </nav>
      <div id="insert-container" class="flex-grow-1 p-3">
      </div>
    </div>
  </div>
</div>
`;
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
  document.getElementById(
    "height"
  ).innerHTML = `${heightInLbs} lbs (${heightInCm} cm)`;
}

function insertType(id) {
  let types = currentPokemon["types"];
  document.getElementById(id).innerHTML = "";
  for (let i = 0; i < types.length; i++) {
    let type = currentPokemon["types"][i]["type"]["name"];
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
  for (let i = 0; i < abilities.length; i++) {
    // let abilityPokemon = abilities['i']['ability']['name'];
    document.getElementById(
      "ability"
    ).innerHTML += `<span>${abilities[i]["ability"]["name"]}</span>`;
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
  document.getElementById("insert-container").innerHTML =
    renderBaseStatsTemplate();
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

// get the evolution section

function renderEvolution() {
  document.getElementById("insert-container").innerHTML =
    renderEvolutionTemplate();
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
      evolution["chain"]["evolves_to"]["0"]["evolves_to"]["0"]["species"][
        "name"
      ];
    loadPokemonEvolution(secondEvolution, "second");
  } else {
    document
      .getElementById("second-evolution-container")
      .classList.add("d-none");
  }
}

function renderEvolutionTemplate() {
  return /*html*/ `
  <div class="evolution-container w-100 h-100">
    <div class="d-flex justify-content-between align-items-center px-4">
      <img src="" alt="<div></div>" id="no-evolution" class='evolution-images'>
      <img src="img/arrow.png" alt="to" class="evolution-arrow" >
      <img src="" alt="evolution 1" id="to-first-evolution" class='evolution-images'>
    </div>
    <div class="d-flex justify-content-between align-items-center px-4" id="second-evolution-container">
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
  let evolutionImageNoStage =
    currentEvolution["sprites"]["other"]["home"]["front_default"];
  document.getElementById("no-evolution").src = evolutionImageNoStage;
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toFeet(n) {
  var realFeet = (n * 0.3937) / 12;
  var feet = Math.floor(realFeet);
  var inches = Math.round(10 * ((realFeet - feet) * 12)) / 10;
  return feet + "&prime;" + inches + "&Prime;";
}

