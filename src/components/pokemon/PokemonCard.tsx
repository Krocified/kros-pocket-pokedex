import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PokeballIcon } from '../ui/Icons'
import type { PokemonDetail, OwnedPokemon } from '../../types/pokemon'

const GET_POKEMON_DETAILS = gql`
  query getPokemonDetails($name: String!){
    pokemon(name: $name) {
      id
      name
      sprites {
        front_default
      }
      types {
        type {
          name
        }
      }
      moves {
        move {
          name
        }
      }
    }
  }
`

const CATCH_MESSAGES = [
    "Ah, you almost caught it!",
    "Shoot! It was so close!",
    "The Pokémon broke free!",
    "You nearly had it!",
    "Oh no! You missed!",
    "Try again!",
    "You almost had it there!"
]

interface PokemonCardProps {
    name: string
    myPokemons: OwnedPokemon[]
    index: number
    onCatch: (name: string, sprite: string, moves: string[]) => void
}

export const PokemonCard = ({ name, myPokemons, index, onCatch }: PokemonCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [showMoves, setShowMoves] = useState(false)
    const [catchStatus, setCatchStatus] = useState<'idle' | 'catching' | 'success' | 'fail'>('idle')
    const [statusMessage, setStatusMessage] = useState('')

    const { loading, error, data } = useQuery<{ pokemon: PokemonDetail }>(GET_POKEMON_DETAILS, {
        variables: { name },
        skip: !isExpanded
    })

    // Check if ALREADY caught in this instance OR in general list
    const isCaught = catchStatus === 'success' || myPokemons.some(p => p.name === name)
    const ownedCount = myPokemons.filter(p => p.name === name).length

    const handleCatch = () => {
        if (!data?.pokemon || isCaught) return

        setCatchStatus('catching')
        setTimeout(() => {
            const chance = Math.floor(Math.random() * 100) + 1
            if (chance > 50) {
                setCatchStatus('success')
                const moves = data.pokemon.moves.slice(0, 4).map(m => m.move.name)
                onCatch(name, data.pokemon.sprites.front_default, moves)
            } else {
                setCatchStatus('fail')
                setStatusMessage(CATCH_MESSAGES[Math.floor(Math.random() * CATCH_MESSAGES.length)])
                setTimeout(() => setCatchStatus('idle'), 2000)
            }
        }, 1000)
    }

    return (
        <motion.div
            layout
            className="glass-card"
            style={{
                marginBottom: '1rem',
                overflow: 'hidden',
                border: '3px solid #222'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <span style={{ color: '#ee1515', fontWeight: 800, fontSize: '0.875rem' }}>#{index + 1}</span>
                    <h3 style={{ fontSize: '1.25rem', textTransform: 'capitalize', marginTop: '0.25rem', color: '#1a1a1a' }}>{name}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#666' }}>Owned: {ownedCount}</p>
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="details-btn"
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: isExpanded ? '#2a75bb' : '#f0f0f0',
                        color: isExpanded ? 'white' : '#333',
                        fontSize: '0.875rem'
                    }}
                >
                    {isExpanded ? 'Close' : 'Details'}
                </button>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ marginTop: '1.5rem', borderTop: '2px solid #eee', paddingTop: '1.5rem' }}
                    >
                        {loading ? (
                            <p style={{ textAlign: 'center', color: '#999' }}>Loading...</p>
                        ) : error ? (
                            <p style={{ color: '#ef4444' }}>Error: {error.message}</p>
                        ) : data && (
                            <div className="details-content">
                                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <motion.img
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        src={data.pokemon.sprites.front_default}
                                        alt={name}
                                        style={{ width: 100, height: 100, imageRendering: 'pixelated', background: '#f8f8f8', borderRadius: '50%', border: '2px solid #ddd' }}
                                    />

                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {data.pokemon.types.map(t => (
                                                    <span
                                                        key={t.type.name}
                                                        style={{
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '4px',
                                                            fontSize: '0.7rem',
                                                            backgroundColor: '#eee',
                                                            border: '1px solid #ccc',
                                                            textTransform: 'uppercase',
                                                            fontWeight: 700,
                                                            color: '#666'
                                                        }}
                                                    >
                                                        {t.type.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={handleCatch}
                                                disabled={catchStatus === 'catching' || isCaught}
                                                className="details-btn"
                                                style={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    background: isCaught ? '#10b981' : catchStatus === 'fail' ? '#ef4444' : '#ee1515',
                                                    color: 'white',
                                                    padding: '0.75rem',
                                                    borderRadius: '0.5rem',
                                                    border: '2px solid #222',
                                                    cursor: isCaught ? 'default' : 'pointer'
                                                }}
                                            >
                                                {catchStatus === 'catching' ? 'Catching...' : isCaught ? 'Caught!' : 'Catch!'}
                                                <PokeballIcon
                                                    size={20}
                                                    className={catchStatus === 'catching' ? 'animate-spin' : ''}
                                                />
                                            </button>

                                            <button
                                                onClick={() => setShowMoves(!showMoves)}
                                                className="details-btn"
                                                style={{
                                                    padding: '0.75rem',
                                                    borderRadius: '0.5rem',
                                                    backgroundColor: '#f8f8f8',
                                                    border: '2px solid #222'
                                                }}
                                            >
                                                Moves
                                            </button>
                                        </div>

                                        {catchStatus === 'fail' && (
                                            <motion.p
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem', textAlign: 'center', fontWeight: 600 }}
                                            >
                                                {statusMessage}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {showMoves && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ marginTop: '1.5rem', overflow: 'hidden' }}
                                        >
                                            <p style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>BASE MOVES</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                                                {data.pokemon.moves.slice(0, 4).map(m => (
                                                    <div
                                                        key={m.move.name}
                                                        style={{
                                                            padding: '0.5rem',
                                                            backgroundColor: '#f0f0f0',
                                                            borderRadius: '0.25rem',
                                                            fontSize: '0.75rem',
                                                            textAlign: 'center',
                                                            textTransform: 'capitalize',
                                                            border: '1px solid #ddd',
                                                            color: '#555'
                                                        }}
                                                    >
                                                        {m.move.name.replace('-', ' ')}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
