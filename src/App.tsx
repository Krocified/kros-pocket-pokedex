import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PokemonList } from './components/pokemon/PokemonList'
import { MyPokemon } from './components/pokemon/MyPokemon'
import { PokeballIcon } from './components/ui/Icons'
import type { OwnedPokemon } from './types/pokemon'

function App() {
    const [view, setView] = useState<'pokedex' | 'collection'>('pokedex')
    const [isFixedLayout, setIsFixedLayout] = useState(false)
    const [myPokemons, setMyPokemons] = useState<OwnedPokemon[]>(() => {
        return JSON.parse(localStorage.getItem('myPokemons') || '[]')
    })

    useEffect(() => {
        localStorage.setItem('myPokemons', JSON.stringify(myPokemons))
    }, [myPokemons])

    const handleCatch = (name: string, sprite: string, moves: string[]) => {
        const nick = prompt(`Give your new friend ${name} a nickname!`, name)
        if (nick === null) return

        const newPokemon: OwnedPokemon = { name, nick, sprite, moves }
        setMyPokemons(prev => [...prev, newPokemon])
    }

    const handleRemove = (pokemon: OwnedPokemon) => {
        if (confirm(`Are you sure you want to release ${pokemon.nick}?`)) {
            setMyPokemons(prev => prev.filter(p => p !== pokemon))
        }
    }

    return (
        <div className={`app-container ${isFixedLayout ? 'no-scroll' : ''}`}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                    <PokeballIcon size={40} color="#1e293b" />
                    <h1 style={{ fontSize: '1.75rem', color: '#1e293b' }}>
                        Green Bird's Pokédex
                    </h1>
                </motion.div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <input
                            type="checkbox"
                            checked={isFixedLayout}
                            onChange={e => setIsFixedLayout(e.target.checked)}
                        />
                        Compact Mode
                    </label>

                    <nav className="nav-container">
                        <button
                            onClick={() => setView('pokedex')}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.6rem',
                                backgroundColor: view === 'pokedex' ? 'var(--bg-pokedex)' : 'transparent',
                                color: view === 'pokedex' ? 'var(--text-main)' : 'var(--text-muted)',
                                fontWeight: view === 'pokedex' ? 600 : 400
                            }}
                        >
                            Pokédex
                        </button>
                        <button
                            onClick={() => setView('collection')}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.6rem',
                                backgroundColor: view === 'collection' ? 'var(--bg-pokedex)' : 'transparent',
                                color: view === 'collection' ? 'var(--text-main)' : 'var(--text-muted)',
                                fontWeight: view === 'collection' ? 600 : 400
                            }}
                        >
                            My Collection ({myPokemons.length})
                        </button>
                    </nav>
                </div>
            </header>

            <main className={isFixedLayout ? 'scroll-container' : ''}>
                <AnimatePresence mode="wait">
                    {view === 'pokedex' ? (
                        <motion.div
                            key="pokedex"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <PokemonList myPokemons={myPokemons} onCatch={handleCatch} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="collection"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MyPokemon list={myPokemons} onRemove={handleRemove} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {!isFixedLayout && (
                <footer style={{ marginTop: '5rem', padding: '2rem 0', borderTop: '1px solid var(--border-black)', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        &#169; Krocified | 2021-2026. Data from PokéAPI.
                    </p>
                </footer>
            )}
        </div>
    )
}

export default App
