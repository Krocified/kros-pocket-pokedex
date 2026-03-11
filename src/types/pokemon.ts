export interface Pokemon {
    name: string
    url?: string
}

export interface PokemonDetail {
    id: number
    name: string
    sprites: {
        front_default: string
    }
    types: {
        type: {
            name: string
        }
    }[],
    moves: {
        move: {
            name: string
        }
    }[]
}

export interface OwnedPokemon {
    name: string
    nick: string
    sprite: string
    moves: string[]
}
