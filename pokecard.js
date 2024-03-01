
/**
 * opens the on-clicked single view card 
 * @param {integer} pokemonId defines the id from the clicked pokemon in the API
 */
async function openPokemonCard(pokemonId) {
    pokemonNumber = pokemonId;
    currentPokemon = await loadPokemon(pokemonId);
    species = await loadSpecies('card');
    await loadEvolution(pokemonId);
    renderPokemonCardWithArrows()
    renderPokemon(currentPokemon);
    renderAboutSection();
    editBackgroundColorCard();
  }
  

  /**
   * opens the arrows for switching left and right
   */
  function renderPokemonCardWithArrows(){ 
    let dexLength = currentPokedex.pokemon_entries.length;
    if (pokemonNumber === 1) {
      renderPokemonCard('d-none justify-content-end', '', 'justify-content-end');
    }else if (pokemonNumber === dexLength){
      renderPokemonCard('', 'd-none');
    }else{
      renderPokemonCard()
    }
  }


  /**
   * changes card to next or before pokemon when clicked on the arrow
   * @param {integer} value defines the pokemon ID in the Deck 
   */
  function changeCard(value){
    pokemonNumber = pokemonNumber + value;
    openPokemonCard(pokemonNumber);
  }
  

  /**
   * fetches pokemon info from the api and give them back
   * @param {integer} pokemonId defines the id from the clicked pokemon in the API
   * @returns information from pokemon
   */
  async function loadPokemon(pokemonId) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
    let response = await fetch(url);
    return await response.json();
  }
  
  
  /**
   * 
   * @param {*} type 
   * @returns 
   */
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
  
  
  function renderPokemonCard(left, right, end) {
    document.getElementById('render-pokemon-card-container').innerHTML = renderPokemonCardTemplate(left, right, end);
  }
  
  
  async function renderMoves() {
    currentBatchStart = 0;
    let moves = currentPokemon['moves']
    document.getElementById('insert-container').innerHTML = renderMovesTemplate();
    loadMovesBatch(moves, currentBatchStart, movesBatchSize);
    initMovesObserver(moves);
  }
  
  
  async function loadMovesBatch(moves, start, count) {
    loadLength = Math.min(start + count, moves.length)
    for (let i = start; i < loadLength; i++) {
      let url = moves[i]['move']['url'];
      let move = await loadMoves(url);
      insertMove(move, i);
    }
    // maxLength = moves.length;
    let maxi = start + count;
    hideObserverAtMax('load-moves', maxi, moves.length);
  }
  
  
  function initMovesObserver(moves) {
    let options = { threshold: 0.1 };
    deactivateMovesObserver(); // Alten Observer trennen, falls vorhanden
    movesObserver = defineMovesObserver(options, moves);
    movesObserver.observe(document.getElementById('load-moves'));
  }
  
  
  function defineMovesObserver(options, moves) {
    return new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          currentBatchStart += movesBatchSize;
          if (currentBatchStart < moves.length) {
            loadMovesBatch(moves, currentBatchStart, movesBatchSize);
          } else {
            movesObserver.disconnect(); // Keine weiteren Bewegungen zum Laden
          }
        }
      });
    }, options);
  }
  
  
  function deactivateMovesObserver() {
    if (movesObserver) {
      movesObserver.disconnect();
    }
  }
  
  
  function insertMove(move, i) {
    let name = capitalizesecondLetter(move['name'])
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
    let moveDescription = searchForEnglishInfo(move);
    document.getElementById('insert-move-info').innerHTML = openMoveInfoTemplate(moveDescription);
  }
  
  
  function searchForEnglishInfo(move){
    let slicedEntries = move.flavor_text_entries.slice(6);   //die ersten 3 einträge werden übersprungen, da diese meist sehr kurz sind
    let firstEnglishFlavorText = slicedEntries.find(entry => entry.language.name === 'en');
    if (firstEnglishFlavorText) {
        return firstEnglishFlavorText.flavor_text;
    } else {
        return 'no english description available.';
    }
  }
  
  
  function closeMoveInfo() {
    document.getElementById('insert-move-info').innerHTML = '';
  }
  
  
  function closePokemonCard() {
    deactivateMovesObserver();
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
    name = capitalizesecondLetter(name);
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
  
  
  function renderBaseStatsTemplate() {
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
  
    setTimeout(function () {
      progressBarLoad(stats, statLabels, totalAmount);
    }, 100)
  }
  
  
  function progressBarLoad(stats, statLabels, totalAmount) {
    let totalProgress = (totalAmount / 600) * 100;
    for (let i = 0; i < 6; i++) {
      let baseStat = stats[i]['base_stat'];
      let progressId = 'stat-progress-' + (statLabels[i].toLowerCase())
      changeProgressBar(baseStat, progressId);
    }
    progressBarLoadTotal(totalProgress)
  }
  
  
  function progressBarLoadTotal(totalProgress) {
    document.getElementById('stat-progress-total').style = `width: ${totalProgress}%`;
  }
  
  function generateBaseStats(baseStat, label, progressId) {
    document.getElementById('base-stat-table').innerHTML += generateBaseStatsTemplate(baseStat, label, progressId);
  }
  
  
  function generateBaseStatsTemplate(baseStat, label, progressId) {
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
    changeProgressBarWidth(baseStat, progressId);
  }
  
  
  function changeProgressBarWidth(baseStat, progressId) {
    document.getElementById(progressId).style = `width: ${baseStat}%`;
  }
  
  
  function changeTotalStat(totalAmount) {
    document.getElementById('base-stat-table').innerHTML += generateBaseStatsTemplate(totalAmount, 'Total', 'stat-progress-total');
  }
  
  
  //get the evolution section
  function renderEvolution() {
    let secondEvolution;
    let firstEvolution;
    if (evolution['chain']['evolves_to']['0'] !== undefined){
      document.getElementById('insert-container').innerHTML = renderEvolutionTemplate();
      secondEvolution = evolution['chain']['evolves_to']['0']['species']['name']
      firstEvolution = evolution['chain']['species']['name']
      loadPokemonEvolution(secondEvolution, 'second')
      hidethirdEvolution();
      loadPokemonEvolution(firstEvolution, 'first')
    } else{
      insertNoEvolution()
    }
  }
  
  
  function insertNoEvolution(){
    document.getElementById('insert-container').innerHTML = insertNoEvolutionTemplate();
  }
  
  
  function hidethirdEvolution() {
    evoTwoPath = evolution['chain']['evolves_to']['0']['evolves_to']
    if (evoTwoPath.length != 0) {
      let thirdEvolution = evolution['chain']['evolves_to']['0']['evolves_to']['0']['species']['name'];
      loadPokemonEvolution(thirdEvolution, 'third');
    } else {
      document.getElementById('third-evolution-container').classList.add('d-none');
    }
  }
  
  
  async function loadPokemonEvolution(pokemonName, evolutionStage) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;
    let response = await fetch(url);
    currentEvolution = await response.json();
    insertEvolutionImages(evolutionStage);
  }
  
  
  function insertEvolutionImages(evolutionStage) {
    if (evolutionStage === 'second') {
      insertEvolutionImagessecondStage();
    } else if (evolutionStage === 'third') {
      insertEvolutionImagesthirdStage();
    } else {
      insertEvolutionImagesFirstStage();
    }
  }
  
  
  function insertEvolutionImagesFirstStage() {
    let evolutionImageNoStage = currentEvolution['sprites']['other']['home']['front_default'];
    let firstEvolutionImage = document.getElementById('first-evolution');
    
    firstEvolutionImage.src = evolutionImageNoStage;
    if (firstEvolutionImage.complete) {
      // Falls das Bild bereits geladen ist (z.B. aus dem Cache)
      hideLoader(1000)
    } else {
      // Warten auf das Laden des Bildes
      firstEvolutionImage.addEventListener('load', () => {
        hideLoader(500)
      });
    }
  }
  
  
  function hideLoader(time){
    const loader = document.getElementById('loader');
    setTimeout(() => {
      loader.classList.add('loader-hidden');
    }, time);
  }
  
  
  function insertEvolutionImagessecondStage() {
    let evolutionImagesecondStage = currentEvolution['sprites']['other']['home']['front_default'];
    document.getElementById('to-second-evolution').src = evolutionImagesecondStage;
    document.getElementById('from-second-evolution').src = evolutionImagesecondStage;
  }
  
  
  function insertEvolutionImagesthirdStage() {
    let evolutionImagethirdStage = currentEvolution['sprites']['other']['home']['front_default'];
    document.getElementById('to-third-evolution').src = evolutionImagethirdStage;
  }