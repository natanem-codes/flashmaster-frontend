import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div>
      <h1>Welcome to the FC</h1>
      <p>create flashcard to remember what you're studying effectively.</p>
       <p className="info">
         check out this <Link to="/decks">flashcards</Link>
       </p>
    </div>
  )
}
export default Home