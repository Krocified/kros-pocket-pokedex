import { gql, useQuery } from '@apollo/client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PokemonCard } from './PokemonCard'
import type { Pokemon, OwnedPokemon } from '../../types/pokemon'

const GET_POKEMON_LIST = gql`
  query getPokemonList($limit: Int, $offset: Int){
    pokemons(limit: $limit, offset: $offset){
      results{
        name
      }
    }
  }
`

const REGIONS = [
    { name: 'Kanto', limit: 151, offset: 0 },
    { name: 'Johto', limit: 100, offset: 151 },
    { name: 'Hoenn', limit: 135, offset: 251 },
    { name: 'Sinnoh', limit: 107, offset: 386 },
    { name: 'Unova', limit: 156, offset: 493 },
    { name: 'Kalos', limit: 72, offset: 649 }
]

interface PokemonListProps {
    myPokemons: OwnedPokemon[]
    onCatch: (name: string, sprite: string, moves: string[]) => void
}

export const PokemonList = ({ myPokemons, onCatch }: PokemonListProps) => {
    const [activeRegion, setActiveRegion] = useState(0)
    const [page, setPage] = useState(0)
    const [jumpId, setJumpId] = useState('')
    const itemsPerPage = 12

    const { loading, error, data } = useQuery<{ pokemons: { results: Pokemon[] } }>(GET_POKEMON_LIST, {
        variables: {
            limit: REGIONS[activeRegion].limit,
            offset: REGIONS[activeRegion].offset
        }
    })

    const paginatedPokemons = useMemo(() => {
        return data?.pokemons.results.slice(page * itemsPerPage, (page + 1) * itemsPerPage) || []
    }, [data, page, itemsPerPage])

    const totalPages = Math.ceil((data?.pokemons.results.length || 0) / itemsPerPage)

    const handleJumpToId = () => {
        const id = parseInt(jumpId)
        if (isNaN(id) || id < 1 || id > 721) {
            alert("Please enter a valid Pokédex number (1-721)")
            return
        }

        // Find region
        let foundRegionIdx = 0
        let relativeId = id
        for (let i = 0; i < REGIONS.length; i++) {
            if (id > REGIONS[i].offset && id <= REGIONS[i].offset + REGIONS[i].limit) {
                foundRegionIdx = i
                relativeId = id - REGIONS[i].offset
                break
            }
        }

        const targetPage = Math.floor((relativeId - 1) / itemsPerPage)
        setActiveRegion(foundRegionIdx)
        setPage(targetPage)
        setJumpId('')
    }

    return (
        <div className="pokemon-list-wrapper">
            <div className="search-bar-container flex-between">
                <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {REGIONS.map((region, idx) => (
                        <button
                            key={region.name}
                            onClick={() => { setActiveRegion(idx); setPage(0); }}
                            className={`region-btn ${activeRegion === idx ? 'active' : ''}`}
                            style={{
                                padding: '0.4rem 0.8rem',
                                borderRadius: '0.5rem',
                                backgroundColor: activeRegion === idx ? 'var(--primary)' : 'white',
                                fontSize: '0.8rem'
                            }}
                        >
                            {region.name}
                        </button>
                    ))}
                </nav>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Jump to ID:</span>
                    <input
                        type="number"
                        className="jump-input"
                        placeholder="1-721"
                        value={jumpId}
                        onChange={e => setJumpId(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleJumpToId()}
                    />
                    <button
                        onClick={handleJumpToId}
                        className="details-btn"
                        style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}
                    >
                        Go
                    </button>
                </div>
            </div>

            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{REGIONS[activeRegion].name} Region</h2>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                        className="pagination-btn"
                    >
                        ← Prev
                    </button>
                    <span style={{ fontSize: '0.875rem', minWidth: '4rem', textAlign: 'center', color: 'var(--text-main)' }}>Page {page + 1} of {totalPages}</span>
                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                        className="pagination-btn"
                    >
                        Next →
                    </button>
                </div>
            </div>

            <div className="grid-list" style={{ minHeight: '500px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '10rem' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            style={{ display: 'inline-block' }}
                        >
                            ◌
                        </motion.div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading {REGIONS[activeRegion].name} Pokédex...</p>
                    </div>
                ) : error ? (
                    <p>Error loading Pokédex.</p>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeRegion}-${page}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                gap: '1.25rem'
                            }}
                        >
                            {paginatedPokemons.map((pokemon, idx) => (
                                <PokemonCard
                                    key={pokemon.name}
                                    name={pokemon.name}
                                    index={REGIONS[activeRegion].offset + page * itemsPerPage + idx}
                                    myPokemons={myPokemons}
                                    onCatch={onCatch}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}
