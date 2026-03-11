import { motion, AnimatePresence } from 'framer-motion'
import type { OwnedPokemon } from '../../types/pokemon'

interface MyPokemonProps {
    list: OwnedPokemon[]
    onRemove: (pokemon: OwnedPokemon) => void
}

export const MyPokemon = ({ list, onRemove }: MyPokemonProps) => {
    return (
        <div className="my-pokemon-wrapper">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                Collection Storage ({list.length})
            </h2>

            {list.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '1.5rem', border: '1px dashed var(--border-black)' }}>
                    <p style={{ color: 'var(--text-main)', fontWeight: 600 }}>Zero Pokémon detected.</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Your journey begins in the Pokédex.</p>
                </div>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.25rem'
                    }}
                >
                    <AnimatePresence mode="popLayout">
                        {list.map((pokemon, idx) => (
                            <motion.div
                                key={`${pokemon.name}-${idx}`}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                className="glass-card"
                                style={{
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div>
                                    <img
                                        src={pokemon.sprite}
                                        alt={pokemon.name}
                                        style={{ width: 90, height: 90, imageRendering: 'pixelated', background: '#f8fafc', borderRadius: '50%', marginBottom: '1rem' }}
                                    />
                                    <h3 style={{ textTransform: 'capitalize', color: 'var(--text-main)', fontSize: '1.1rem' }}>{pokemon.nick}</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Species: {pokemon.name}</p>

                                    {pokemon.moves && pokemon.moves.length > 0 && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Known Moves</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                                                {pokemon.moves.map(m => (
                                                    <span
                                                        key={m}
                                                        style={{
                                                            fontSize: '0.65rem',
                                                            padding: '0.2rem 0.6rem',
                                                            backgroundColor: '#f1f5f9',
                                                            borderRadius: '4px',
                                                            border: '1px solid var(--border-black)',
                                                            textTransform: 'capitalize',
                                                            color: 'var(--text-main)'
                                                        }}
                                                    >
                                                        {m.replace('-', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => onRemove(pokemon)}
                                    className="details-btn"
                                    style={{
                                        backgroundColor: '#fff1f2',
                                        borderColor: '#f43f5e',
                                        color: '#f43f5e',
                                        padding: '0.6rem 1rem',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.8rem',
                                        width: '100%',
                                        fontWeight: 700,
                                        marginTop: 'auto'
                                    }}
                                >
                                    Release to Wild
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}
