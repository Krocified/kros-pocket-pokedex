import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import Detail from './Detail'
import './List.css'
import MyPokemon from './MyPokemon'

const GET_POKEMON_LIST = gql`
    query getPokemonList{
        pokemons(limit: 151, offset: 0){
            results{
                name
            }
        }
    }
`

const PokemonList = ( {pokemons, myPokemons, pokeIndex, addPokemonToList} ) => {
    // console.log(pokemons)
    
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

const List = () => {

    // console.log(localStorage.getItem('myPokemons'))

    const [myPokemons, setmyPokemons] = useState(
        JSON.parse(localStorage.getItem('myPokemons')) || []
    )
    const { loading, error, data } = useQuery(GET_POKEMON_LIST)
    const [nicks, setNicks] = useState(
        JSON.parse(localStorage.getItem('nicks')) || []
    )
    const [index, setIndex] = useState(0)

    useEffect(() => {
        localStorage.setItem('myPokemons', JSON.stringify(myPokemons)) 
        localStorage.setItem('nicks', JSON.stringify(nicks))
    }, [myPokemons, nicks])

    if(loading) return 'Loading...'
    if(error) return `Error Encountered: ${error.message}`

    const addPokemonToList = (pokemonName, sprite) => {
        let nick
        while(1){
            nick = prompt("Give your new friend a nickname!",pokemonName)
            if (nicks.indexOf(nick)!==-1) {
                alert("Please enter a new nickname!")
            } else {
                setNicks([...nicks, nick])
                break
            }
        }

        let newPokemon = {
            name: pokemonName,
            nick: nick,
            sprite: sprite 
        }
        
        // console.log(myPokemons)
        // console.log(nicks)
        setmyPokemons([...myPokemons, newPokemon])
    }

    const removePokemonFromList = (pokemon) => {
        let removed = myPokemons.filter(owned=> owned!==pokemon)
        setmyPokemons(removed)

        let removeNick = nicks.filter((nick)=>(nick!==pokemon.nick))
        // console.log(removeNick)

        setNicks(removeNick)
    }

    const show = () => {
        document.getElementById("pokemon-master-list").style.display = "block"
        document.getElementById("dex-collapse-btn").style.display = "inline"
        document.getElementById("dex-expand-btn").style.display = "none"
        document.getElementById("dex-prev-btn").style.display = "inline"
        document.getElementById("dex-next-btn").style.display = "inline"
    }
    
    const collapse = () => {
        document.getElementById("pokemon-master-list").style.display = "none"
        document.getElementById("dex-collapse-btn").style.display = "none"
        document.getElementById("dex-expand-btn").style.display = "inline"
        document.getElementById("dex-prev-btn").style.display = "none"
        document.getElementById("dex-next-btn").style.display = "none"
    }

    const next = () => {
        if(index===150) return
        setIndex(index+10)
    }

    const prev = () => {
        if(index===0) return
        setIndex(index-10)
    }

    const pokemons = data.pokemons.results

    return (
        <div className="pokemon-list">
            <div className="pokedex">
                <h2>
                    Pokemon List
                </h2>
                <div>
                    <button onClick={show} className="dex-btn" id="dex-expand-btn">Browse Pokedex</button>
                    <button onClick={collapse} className="dex-btn collapse" id="dex-collapse-btn" style={{display:"none"}}>Close Pokedex</button>
                </div>
                <button 
                    onClick={prev} 
                    className="dex-btn" 
                    id="dex-prev-btn" 
                    style={{display:"none"}}
                >
                    Prev
                </button>
                <button 
                    onClick={next} 
                    className="dex-btn" 
                    id="dex-next-btn" 
                    style={{display:"none"}}
                >
                    Next
                </button>
                <div id="pokemon-master-list" style={{display:"none"}}>
                    <PokemonList 
                        pokemons={pokemons} 
                        myPokemons={myPokemons}
                        pokeIndex={index}
                        addPokemonToList={addPokemonToList}
                    />
                </div>
            </div>
            <div className="my-poke-list">
                <MyPokemon 
                    list={myPokemons} 
                    removePokemonFromList={removePokemonFromList}
                />
            </div>
        </div>
    )
}

export default List
