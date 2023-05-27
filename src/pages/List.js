import { useContext, useEffect } from "react"
import { flashCardContext } from "../context/FlashCardContext"
import axios from "axios"
import { Link } from "react-router-dom"
import Deck from "../components/Deck"
import Loader from "../components/Loader"

const List = () => {   
  const {state, dispatch} = useContext(flashCardContext)

  useEffect(() => {
        dispatch({type: "LOADING"})
        const fetchFlashCards = async () => {
          // const {data} = await axios.get("http://localhost:5000/decks")
          const {data} = await axios.get("https://flashmaster-ps3e.onrender.com/decks")
          // console.log(data)
          dispatch({type: "FETCH_DECKS", payload: data})
          }
      fetchFlashCards()
  }, [dispatch])

  return (
    <div className="">
      <h2>All Decks</h2>
      {state.loading && <Loader loading={state.loading}/>}
      {!state.loading && state.error && <p className="error">Error loading decks</p>}
      {!state.loading && <div className="decks">
          {state.decks.length ?
          state.decks.map(deck => <Deck key={deck._id} deck={deck}/>)
          :
          <p>No Deck <Link to="/create" style={{color: "blue", textDecoration: "underline"}}>Create New</Link></p>
          
        }
      </div>}
    </div>
  )
}
export default List