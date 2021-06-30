const MoveList = ({pokemonMoves}) => {
    return (
        <div>
            <h3>
                Move List
            </h3>
            {pokemonMoves.map((move)=>(
                <div key={move.move.name}>{move.move.name}</div>
            ))}
        </div>
    )
}

export default MoveList
