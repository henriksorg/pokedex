let currentPokemon;
// let species;
let ability;
let eggGroup;
let abc;

async function loadPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon/1/";
  let response = await fetch(url);
  currentPokemon = await response.json();
  renderPokemon(currentPokemon);
  console.log(currentPokemon);
  await loadSpecies();
  await loadAbility();
  await loadEggGroup();
}


async function loadSpecies() {
  let url = currentPokemon["species"]["url"];
  let response = await fetch(url);
  species = await response.json();
  console.log(species);
  editBackgroundColor();
}


async function loadAbility(){
  let url = 'https://pokeapi.co/api/v2/ability/1';
  let response = await fetch(url);
  ability = await response.json();
  console.log(ability);
}


async function loadEggGroup(){
  // let url = species['egg_groups']['0']['url'];
  let url = 'https://pokeapi.co/api/v2/generation/5/';
  let response = await fetch(url);
  eggGroup = await response.json();
  console.log(eggGroup);
  // renderPokemonCard();
  insertBaseStats();
}


function changeCardSection(id){
  removeActiveClass();
  addActiveClass(id);
}


function removeActiveClass(navItem, id){
  for (let i = 0; i < 4; i++) {
    document.getElementById('nav-link-' + i).classList.remove('active');
  }
}


function addActiveClass(id){
  let navItem = document.getElementById(id);
  navItem.classList.add('active');
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


// function renderPokemonCard(){
//   // loadAboutSection();
//   insertHabitat();
//   insertName();
//   insertType();
//   insertWeight();
//   insertAbility();
//   insertHeight();
//   insertEggGroups();
//   insertGender();
//   insertGrowthRate();
// }


function loadAboutSection(){
  document.getElementById('insert-container').innerHTML = /*html*/`
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
  `
}


function insertName(){
  let name = currentPokemon['species']['name'];
  name = capitalizeFirstLetter(name);
  document.getElementById('pokemon-name').innerHTML = `${name}`;
}


function insertWeight(){
  let weightInKg = currentPokemon['weight'] / 10
  let weightInLbs = Math.round(weightInKg * 2.20462 * 10) / 10;   //rounded to one decimal
  document.getElementById('weight').innerHTML = `${weightInLbs} lbs (${weightInKg} kg)`;
}


function insertHeight(){
  let heightInCm = currentPokemon['height'] * 10;
  let heightInLbs = toFeet(heightInCm);
  document.getElementById('height').innerHTML = `${heightInLbs} lbs (${heightInCm} cm)`;
}


function insertType(){
  let types = currentPokemon['types'];
  document.getElementById('pokemon-type').innerHTML = '';
  for (let i = 0; i < types.length; i++) {
    let type = currentPokemon['types'][i]['type']['name'];
    document.getElementById('pokemon-type').innerHTML += `<span>${type}</span>`;
  }
  
  
}


function insertHabitat(){
  let habitat = species['habitat']['name'];
  document.getElementById('habitat').innerHTML = habitat;
}


function insertAbility(){
  let abilities = currentPokemon['abilities'];
  document.getElementById('ability').innerHTML = '';
  for(let i=0; i < abilities.length; i++){
    // let abilityPokemon = abilities['i']['ability']['name'];
    document.getElementById('ability').innerHTML += `<span>${abilities[i]['ability']['name']}</span>`;
  }
  // let abilityPokemon = currentPokemon['abilities']['i']['ability']['name'];
  // let hidden = currentPokemon['abilities']['i']['is_hidden'];
  // document.getElementById('ability').innerHTML = abilityPokemon;
}


function insertEggGroups(){
  let genderRate = species['gender_rate'];
  let genderPropabilityF = species['gender_rate'] * 100 / 8;
  let genderPropabilityM = 100 - genderPropabilityF;
  let gender = document.getElementById('gender');
  if (genderRate === -1){
    gender.innerHTML = '<img src="img/genderless" alt="genderless">genderless';
  }else{
    gender.innerHTML = `<img src="img/masculine.png" alt="masculine"><span>${genderPropabilityM}%</span><img src="img/feminine.png" alt="feminine"><span>${genderPropabilityF}%</span>`
  }
}


function insertGender(){
  let eggGroups = species['egg_groups']
  document.getElementById('egg-groups').innerHTML = ''
  for (let i  = 0; i < eggGroups.length; i++) {
    const eggGroup = eggGroups[i]['name'];
    document.getElementById('egg-groups').innerHTML += `<span>${eggGroup}</span>`
  }
}


function insertGrowthRate(){
  let growthRate = species['growth_rate']['name']
  document.getElementById('growth-rate').innerHTML = ''
  document.getElementById('growth-rate').innerHTML += `<span>${growthRate}</span>`
}





// get the elements from the base stats section
function insertBaseStats(){
  let statTypes = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed',];
  let stats = currentPokemon['stats']
  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    const statType = statTypes[i];
    const baseStat = stats[i]['base_stat'];
    document.getElementById('stat-value-' + statType).innerHTML = baseStat;
  }

}



















function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function toFeet(n) {
  var realFeet = ((n*0.393700) / 12);
  var feet = Math.floor(realFeet);
  var inches = Math.round(10*((realFeet - feet) * 12)) / 10;
  return feet + "&prime;" + inches + '&Prime;';
}