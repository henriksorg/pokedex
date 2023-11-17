let currentPokemon;
let species;
let ability;

async function loadPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon/ditto";
  let response = await fetch(url);
  currentPokemon = await response.json();
  renderPokemon(currentPokemon);
  console.log(currentPokemon);
  loadSpecies();
  loadAbility();
}


async function loadSpecies() {
  let url = currentPokemon["species"]["url"];
  let response = await fetch(url);
  species = await response.json();
  console.log(species);
  editBackgroundColor();
}


async function loadAbility(){
  let url = 'https://pokeapi.co/api/v2/ability/132';
  let response = await fetch(url);
  ability = await response.json();
  console.log(ability);
  editBackgroundColor();
  renderPokemonCard();
}


function renderPokemon(currentPokemon) {
  let img = currentPokemon["sprites"]["other"]["home"]["front_default"]
  document.getElementById("pokemon-image").src = img;
}


function editBackgroundColor() {
  let bgColor = species["color"]["name"];
  changeBgColor(bgColor, 'card-header');
  changeBgColor(bgColor, 'pokedex-card');
}


function changeBgColor(bgColor, id){
  document.getElementById(id).style = `background-color: ${bgColor}`;
}


function renderPokemonCard(){
  insertHabitat();
  insertName();
  insertType();
  insertWeight();
  insertAbility();
}


function insertName(){
  let name = currentPokemon['species']['name'];
  name = capitalizeFirstLetter(name);
  document.getElementById('pokemon-name').innerHTML = `${name}`;
}


function insertWeight(){
  let weightInLbs = currentPokemon['weight'];
  let weightInKg = Math.round(weightInLbs * 0.45359237 * 10) / 10; //rounded to one decimal
  document.getElementById('weight').innerHTML = `${currentPokemon['weight']} lbs (${weightInKg}kg)`;
}


function insertType(){
  let type = currentPokemon['types']['0']['type']['name'];
  document.getElementById('pokemon-type').innerHTML = type;
}


function insertHabitat(){
  debugger
  let habitat = species['habitat']['name'];
  document.getElementById('habitat').innerHTML = habitat;
}


function insertAbility(){
  let abilityLocal = ability['name'];
  document.getElementById('ability').innerHTML = abilityLocal;
}




function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}