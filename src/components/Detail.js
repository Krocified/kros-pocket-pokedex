import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import './Detail.css'
import Type from './Type'

const GET_POKEMON_DETAILS = gql`
    query getPokemonDetails($name: String!){
        pokemon(name: $name) {
            id
            name
            sprites {
                front_default
            }
            moves  {
                move {
                    name
                }
            }
            types {
                type {
                    name
                }
            }
        }
    }
`

const collapseDetails = (name) => {
    document.getElementById(name+"-sprite").style.display = "none"
    document.getElementById(name+"-sprite").style.display = "none"
    document.getElementById(name+"-type").style.display = "none"
    document.getElementById(name+"-collapse").style.display = "none"
    document.getElementById(name+"-catch-btn").style.display = "none"
    document.getElementById(name+"-moves").style.display = "none"
    document.getElementById(name+"-movelist-btn").style.display = "none"
    document.getElementById(name+"-movelist-collapse-btn").style.display = "none"
    document.getElementById(name+"-details-btn").style.display = "inline"
}

const showDetails = (name) => {
    document.getElementById(name+"-sprite").style.display = "block"
    document.getElementById(name+"-type").style.display = "block"
    document.getElementById(name+"-collapse").style.display = "block"
    document.getElementById(name+"-catch-btn").style.display = "inline"
    document.getElementById(name+"-movelist-btn").style.display = "inline"
    document.getElementById(name+"-details-btn").style.display = "none"
}

const collapseMoveList = (name) => {
    document.getElementById(name+"-moves").style.display = "none"
    document.getElementById(name+"-movelist-btn").style.display = "inline"
    document.getElementById(name+"-movelist-collapse-btn").style.display = "none"
}

const showMoveList = (name) => {
    document.getElementById(name+"-moves").style.display = "block"
    document.getElementById(name+"-movelist-btn").style.display = "none"
    document.getElementById(name+"-movelist-collapse-btn").style.display = "inline"
}

const Detail = ({name, myPokemons, entryId, addPokemonToList}) => {

    const [pokemonSprite, setpokemonSprite] = useState("")
    const [pokemonType, setpokemonType] = useState([])
    const [pokemonMoves, setpokemonMoves] = useState([])

    const gqlVariables = {
        name: name
    }
    
    const countOwned = () => {
        if(myPokemons.length>0){
            let count = myPokemons.filter(owned=>owned.name===name).length
            return count
        }
        else return 0
    }

    const { loading, error, data } = useQuery(GET_POKEMON_DETAILS,{
        variables: gqlVariables,
    })

    if(loading) return 'Loading...'
    if(error) return `Error Encountered: ${error.message}`
    const details = data

    return (
        <div className="pokemonEntry">
            <div id={name+"-id"} className="details-id">
                #{entryId+1}
            </div>
            <div className="details-box">
                <div id={name+"-sprite"} className="details-sprite" style={{display:"none"}}>
                    <img src={pokemonSprite} alt={name}/>
                </div>
                <h3>
                    {name}
                </h3>
                <div>
                    Owned: {countOwned()}
                </div>
                <div id={name+"-type"} className="details-type" style={{display:"none"}}>
                    <Type pokemonType={pokemonType}/>
                </div>
                <div id={name+"-collapse"} style={{display:"none"}}>
                    <button onClick={()=>{
                        collapseDetails(name)
                    }}
                        className="details-btn collapse"
                    >
                        Close Details
                    </button>
                </div>
                <div className="details-btn-wrapper">    
                    <button id={name+"-details-btn"} className="details-btn" onClick={()=>{
                        // console.log(details.pokemon)
                        setpokemonType(details.pokemon.types)
                        setpokemonMoves(details.pokemon.moves)
                        setpokemonSprite(details.pokemon.sprites.front_default)
                        showDetails(name)
                    }}>Details</button>
                    <button id={name+"-catch-btn"} className="details-btn" style={{display:"none"}} onClick={()=>{
                        let chance = Math.floor(Math.random()*100)+1
                        if (chance>50) {
                            console.log("You caught "+name+"! "+chance) 
                            addPokemonToList(name, pokemonSprite)
                        } else {
                            console.log("Ah damn, it was so close! "+chance) 
                        }
                    }}>Catch</button>
                </div>
                
                
                <button id={name+"-movelist-btn"} className="details-btn" style={{display:"none"}} onClick={()=>{
                    showMoveList(name)
                }}>
                    Move List
                </button>
                <button id={name+"-movelist-collapse-btn"} className="details-btn collapse" style={{display:"none"}} onClick={()=>{
                    collapseMoveList(name)
                }}>
                    Close Move List
                </button>
                <div id={name+"-moves"} className="details-moves" style={{display:"none"}}>
                    <b>
                        Move List:
                    </b>
                    {pokemonMoves.map((move)=>(
                        <div key={move.move.name}>{move.move.name}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Detail
