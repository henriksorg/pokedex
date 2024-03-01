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


function renderPokemonCardTemplate(left, right, end) {
  return /*html*/ `
  <div id="card-bg" class="card-bg">
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
        <div id="insert-container" class="flex-grow-1 p-3 position-relative d-flex flex-column justify-content-between">
        </div>
      </div>
    </div>
    <div class="arrow-container ${end}" id="arrow-container">
      <div class="arrow-border arrow-border-left ${left}" id="arrow-left" onclick = "changeCard(-1)"><i class="arrow left"></i></div>
      <div class="arrow-border arrow-border-right ${right}" id="arrow-right" onclick = "changeCard(1)"><i class="arrow right"></i></div>  
    </div>
  </div>
  
  `;
}


function renderMovesTemplate() {
  return /*html*/`
    <div class="moves-table-container">
      <table  class="w-100 table table-striped table-hover">
        <tbody id="insert-moves-table" class="w-100">
          <tr class="sticky-top">
            <th>Name</th>
            <th>Power</th>
            <th>Accuracy</th>
          </tr>
        </tbody>
      </table>
      <div id="load-moves" class="load-more"></div>
    </div>
    <span class="mt-4">* click on move for more info</span>
    `
}


function insertMoveTemplate(name, accuracy, power, i) {
  return /*html*/`
      <tr onclick ="openMoveInfo(${i})">
        <td>${name}</td>
        <td>${power}</td>
        <td>${accuracy}</td>
      </tr>
    `
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
            <th></th>
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


function renderEvolutionTemplate() {
  return /*html*/ `
    <div class="loader" id="loader"></div>
    <div class="evolution-container w-100 h-100 position-relative">
      <div class="d-flex justify-content-between align-items-center" id="second-evolution-container">
        <img src="" alt="<div></div>" id="first-evolution" class='evolution-images'>
        <img src="img/arrow.png" alt="to" class="evolution-arrow" >
        <img src="" alt="evolution 1" id="to-second-evolution" class='evolution-images'>
      </div>
      <div class="d-flex justify-content-between align-items-center" id="third-evolution-container">
        <img src="" alt="evolution 1" id="from-second-evolution" class='evolution-images'>
        <img src="img/arrow.png" alt="to" class="evolution-arrow">
        <img src="" alt="evolution 2" id="to-third-evolution" class='evolution-images'>
      </div>
      </div>
    </div>
    `;
}


function insertNoEvolutionTemplate(){
  return /*html*/`
    <div class="no-evolution-text">
      <h4 class="text-align-center mb-4">This Pokemon has no evolution!</h4>
      <p>
        Around 14% of Pokémon, primarily Legendary and Mythical ones, 
        cannot evolve nor are they evolutions of other Pokémon. </p>
    </div>
  `
}


function openMoveInfoTemplate(moveDescription){
  return /*html*/`
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