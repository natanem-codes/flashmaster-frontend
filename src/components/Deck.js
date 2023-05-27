import { Link } from "react-router-dom"

const Deck = ({deck}) => {
  return (
    <Link to={`/decks/${deck._id}`} className="card deck">
        <div >
            <h4 className="deck__title">{deck.title}</h4>
            <p className="flashcards__count">{deck.flashcardsCount} {deck.flashcardsCount === 1 ? "flashcard" : "flashcards"}</p>
        </div>
        <p className="deck__author">by {deck.author.username}</p>
    </Link>
  )
}
export default Deck