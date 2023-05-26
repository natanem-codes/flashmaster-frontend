import axios from "axios"
import { useContext, useEffect, useReducer, useState } from "react"
import { Link, useNavigate, useParams,  } from "react-router-dom"
import Slide from "../components/Slide"
import { flashCardContext } from "../context/FlashCardContext"
import Flashcard from "../components/Flashcard"
import { MdArrowBackIosNew, MdDelete, MdEdit, MdContentCopy, MdStarBorder, MdStar} from "react-icons/md"
import { AuthContext } from "../context/authContext"


const reducer = (state, action) => {
  switch(action.type) {
    case "LOADING":
      return {
        ...state,
        loading: true,
      }
    case "GET__DECK": 
      return state = {
        ...state,
        loading: false,
        title: action.payload.title,
        description: action.payload.description,
        author: action.payload.author
      }
    case "GET__FLASHCARDS":
      return {
        ...state,
        loading: false,
        flashcards: action.payload
      }
    default: 
      return state
  }
}

const Detail = () => {
    const {dispatch} = useContext(flashCardContext)
    const {state: {user}} = useContext(AuthContext)
    const {id} = useParams()
    const navigate = useNavigate()

    const [showInfo, setShowInfo] = useState(false)
    const [state, flashcardDispatch] = useReducer(reducer, {
        loading: false,
        id: "",
        title: "",
        discription: "",
        author: {},
        flashcards: []
    })

    useEffect(() => {
        const fetchFlashCard = async () => {
            flashcardDispatch({type: "LOADING"})
            // const { data:deck } = await axios(`https://flashmaster-ps3e.onrender.com/decks/${id}`)
            // const { data:deck } = await axios(`http://localhost:5000/decks/${id}`)
            const { data:deck } = await axios(`https://flashmaster-ps3e.onrender.com/decks/${id}`)
            flashcardDispatch({type: "GET__DECK", payload: deck})
            // const { data:flashcards} = await axios(`http://localhost:5000/flashcards/?deckId=${id}`)
            const { data:flashcards} = await axios(`https://flashmaster-ps3e.onrender.com/flashcards/?deckId=${id}`)

            flashcardDispatch({type: "GET__FLASHCARDS", payload: flashcards})
        }
        fetchFlashCard()
    },[id])

    const handleDelete = async () => {
      //  const {data} = await axios.delete(`http://localhost:5000/decks/${id}`, {
       const {data} = await axios.delete(`https://flashmaster-ps3e.onrender.com/decks/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
       })

       dispatch({type: "DELETE__ONE", payload: data._id})

      navigate("/decks")
    }
    
    const copyDeck = async () => {
      // const {data:deck} = await axios.post(`http://localhost:5000/decks/${id}/copy`,{} ,{
      const {data:deck} = await axios.post(`https://flashmaster-ps3e.onrender.com/decks/${id}/copy`,{} ,{
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      )
      dispatch({type: "ADD_FLASHCARD", payload: deck})
      alert("copy successful!")
      navigate(`/decks/${deck._id}`)
    }

    const addToFavorites = async () => {
      // const {data:deck} = await axios.post(`http://localhost:5000/decks/${id}/addToFavorites`,{} ,{
      const {data:deck} = await axios.post(`https://flashmaster-ps3e.onrender.com/decks/${id}/addToFavorites`,{} ,{
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      )
      console.log(deck)
    }


  return (
    <div className="detail__page">
        <Link to={"/decks"} className="link"><MdArrowBackIosNew /> Decks</Link>
        <header className="page__header">
          <div>
            <h3>{state.title}</h3>
            <div className="deck__author">{state.author.username}</div>
          </div>
          {
            user._id === state.author._id ?
          <>
            <Link to={`/decks/${id}/edit`} className="icon icon__edit"><MdEdit /></Link>
            <button className="icon icon__delete" onClick={handleDelete}><MdDelete /></button>
            {
            user.favorites?.includes(id) 
            ?
            <button className="icon" onClick={addToFavorites}><MdStar /></button>
            :
            <button className="icon" onClick={addToFavorites}><MdStarBorder /></button>
            
            }
          </>
          :
          <p 
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              onClick={() => copyDeck()}
              className={`copy ${showInfo ? "show__info" : ""}`}>
                <MdContentCopy style={{cursor: "pointer"}}/>
                <span>add this deck to your profile</span>
          </p>
          }
        </header>
        {
          state.loading && <p>Loading...</p>
        }
          {state.flashcards.length ? 
            <section className="detail__body">
              <Slide flashcards={state.flashcards}/>
              <div className="container flashcards__container">
                  <h3>Flashcards in this deck</h3>
                  <div className="flashcards">
                    {state.flashcards.map(flashcard => <Flashcard key={flashcard._id} {...flashcard} />)}
                  </div>
              </div>
            </section>
          :
            <p className="info">No flashcards in this deck { user._id === state.author._id && <Link to={`/decks/${id}/edit`}>Add new</Link>}</p>
          }
         
    </div>
  )
}
export default Detail