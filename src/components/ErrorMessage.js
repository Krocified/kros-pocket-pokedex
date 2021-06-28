import './Detail.css'

const ErrorMessage = ({message}) => {
    return (
        <div className="pokemonEntry">
            <h3>
                Error Encountered: {message}
            </h3>
        </div>
    )
}

export default ErrorMessage
