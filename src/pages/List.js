import { useContext, useEffect } from "react"
import { flashCardContext } from "../context/FlashCardContext"
import axios from "axios"
import { Link } from "react-router-dom"
import Deck from "../components/Deck"

const List = () => {   
  const {state, dispatch} = useContext(flashCardContext)

  useEffect(() => {
        const fetchFlashCards = async () => {
          dispatch({type: "LOADING"})
          const {data} = await axios.get("http://localhost:5000/decks")
          console.log(data)
          dispatch({type: "FETCH_DECKS", payload: data})
          }
      fetchFlashCards()
  }, [dispatch])

  return (
    <div className="">
      <h2>All Decks</h2>
      {state.loading && <p className="loading">Loading...</p>}
      {state.error && <p className="error">Error loading decks</p>}
      <div className="decks">
          {state.decks.length ?
          state.decks.map(deck => <Deck key={deck._id} deck={deck}/>)
          :
          <p>No Deck <Link to="/create" style={{color: "blue", textDecoration: "underline"}}>Create New</Link></p>
          
        }
      </div>
    </div>
  )
}
export default List