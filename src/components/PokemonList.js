import Detail from "./Detail"

const PokemonList = ( {pokemons, myPokemons, pokeIndex, addPokemonToList} ) => {

    const listItems = Array.from(pokemons).slice(pokeIndex,pokeIndex+10).map((pokemon, i) => {
        return (
            <li key={pokemon.name}>
                <Detail 
                    name={pokemon.name} 
                    myPokemons={myPokemons}
                    entryId={pokeIndex+i}
                    addPokemonToList={addPokemonToList}
                />
            </li>
    )})
    return (
        <ul>
            {listItems}
        </ul>
    )
}

export default PokemonList