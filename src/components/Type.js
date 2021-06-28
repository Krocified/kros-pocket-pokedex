import './Type.css'

const Type = ({pokemonType}) => {
    return (
        <div className="type-wrapper">
            <b>Type</b>
                {pokemonType.map((type)=>(
                    <div className="type" key={type.type.name}>
                        <img src={"./img/types/"+type.type.name+".gif"} alt="type.type.name"/>
                    </div>
                ))}
        </div>
    )
}

export default Type
