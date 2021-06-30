import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import AppLoading from './AppLoading'
import './List.css'
import MyPokemon from './MyPokemon'
import PokemonList from './PokemonList'

const GET_POKEMON_LIST = gql`
    query getPokemonList($limit: Int, $offset: Int){
        pokemons(limit: $limit, offset: $offset){
            results{
                name
            }
        }
    }
`
const List = ({gen, setGen}) => {

    const [myPokemons, setmyPokemons] = useState(
        JSON.parse(localStorage.getItem('myPokemons')) || []
    )

    const [gqlVariables, setGqlVariables] = useState({
        "limit": 151,
        "offset": 0,
    })

    const { loading, error, data } = useQuery(GET_POKEMON_LIST, {
        variables: gqlVariables
    })

    const [nicks, setNicks] = useState(
        JSON.parse(localStorage.getItem('nicks')) || []
    )
    const [index, setIndex] = useState(0)
    const regions = ["","Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar"]
    
    useEffect(() => {
        localStorage.setItem('myPokemons', JSON.stringify(myPokemons)) 
        localStorage.setItem('nicks', JSON.stringify(nicks))
    }, [myPokemons, nicks])
    
    if(loading) return <AppLoading />
    if(error) return `Error Encountered: ${error.message}`
    
    const pokemons = data.pokemons.results

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

    const showKanto = () => {
        setGqlVariables({
            "limit": 151,
            "offset": 0,
        })
        setGen(1)
        setIndex(0)
        collapse()
    }

    const showSinnoh = () => {
        setGqlVariables({
            "limit": 107,
            "offset": 386,
        })
        setGen(4)
        setIndex(0)
        collapse()
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
        switch (gen) {
            case 1:
                if(index===150) {
                    setIndex(0)
                    return
                }
                setIndex(index+10)
                break;
            case 4:
                if(index===100) {
                    setIndex(0)
                    return
                }
                setIndex(index+10)
                break;
            default:
                break;
        }
        
    }

    const prev = () => {
        switch (gen) {
            case 1:
                if(index===0) {
                    setIndex(150)
                    return
                }
                setIndex(index-10)
                break;
            case 4:
                if(index===0) {
                    setIndex(100)
                    return
                }
                setIndex(index-10)
                break;
            default:
                break;
        }
    }

    const showMyPokemons = () => {
        document.getElementById("pokedex").style.display="none"
        document.getElementById("my-pokemon-view").style.display="block"
        document.getElementById("pokedex-view-btn").style.display="inline"
        document.getElementById("my-pokemon-view-btn").style.display="none"
        document.getElementById("region-btn-wrapper").style.display="none"
    }
    
    const showPokedex = () => {
        document.getElementById("pokedex").style.display="block"
        document.getElementById("my-pokemon-view").style.display="none"
        document.getElementById("pokedex-view-btn").style.display="none"
        document.getElementById("my-pokemon-view-btn").style.display="inline"
        document.getElementById("region-btn-wrapper").style.display="block"
    }

    return (
        <div className="pokemon-list">
            <div className="pokedex-btn-wrapper">
                <button onClick={showMyPokemons} className="dex-btn" id="my-pokemon-view-btn">My Pokémons</button>
                <button onClick={showPokedex} className="dex-btn" id="pokedex-view-btn" style={{display:"none"}}>Pokédex</button>
                <div id="region-btn-wrapper">
                    <button onClick={showKanto} className="dex-btn" id="dex-kanto-btn">Browse Kanto Pokédex</button>
                    <button onClick={showSinnoh} className="dex-btn" id="dex-sinnoh-btn">Browse Sinnoh Pokédex</button>
                </div>
            </div>
            <div className="pokedex" id="pokedex">
                <h2>
                    {regions[gen]} Pokémon List
                </h2>
                <div>
                    <button onClick={show} className="dex-btn" id="dex-expand-btn">Open Pokédex</button>
                    <button onClick={collapse} className="dex-btn collapse" id="dex-collapse-btn" style={{display:"none"}}>Close Pokédex</button>
                </div>
                <button 
                    onClick={prev} 
                    className="dex-btn scroll-btn" 
                    id="dex-prev-btn" 
                    style={{display:"none"}}
                >
                    Prev
                </button>
                <button 
                    onClick={next} 
                    className="dex-btn scroll-btn" 
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
            <div className="my-poke-list" id="my-pokemon-view" style={{display:"none"}}>
                <MyPokemon 
                    list={myPokemons} 
                    removePokemonFromList={removePokemonFromList}
                />
            </div>
        </div>
    )
}

export default List
