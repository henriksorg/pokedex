let currentPokemon;

async function loadPokemon(){
    let url = ' https://pokeapi.co/api/v2/pokemon/ditto';
    let response = await fetch(url);
    let currentPokemon = response.json();
    console.log(currentPokemon);
    // renderPokemon();
}


