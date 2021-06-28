import './MyPokemon.css'

const MyPokemon = ({list, removePokemonFromList}) => {

    return (
        <div className="my-pokemons">
            <h2>
                My Pokemons
            </h2>
            {list.length === 0 ? 
                <div>
                    You have no Pokemons, go catch some!
                </div>
                :
                list.map((pokemon, i)=>(
                    <div key={i} className="my-pokemon-entry">
                        <div id={i+"-sprite"}>
                            <img src={pokemon.sprite} alt={pokemon.name}/>
                        </div>
                        <b>    
                            {pokemon.nick}
                        </b>
                        <br/>
                        {pokemon.name}
                        <div>
                            <button className="my-poke-btn" onClick={()=>{removePokemonFromList(pokemon)}}>Release</button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default MyPokemon
