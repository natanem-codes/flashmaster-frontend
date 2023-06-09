import axios from "axios"
import { useContext, useEffect, useReducer, useState } from "react"
import { Link, useNavigate, useParams,  } from "react-router-dom"
import Slide from "../components/Slide"
import { flashCardContext } from "../context/FlashCardContext"
import Flashcard from "../components/Flashcard"
import { MdArrowBackIosNew, MdDelete, MdEdit, MdContentCopy, MdStarBorder, MdStar} from "react-icons/md"
import { AuthContext } from "../context/authContext"
import Loader from "../components/Loader"
import {toast} from "react-toastify"


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
    const {state: {user}, addToFavorites} = useContext(AuthContext)
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
        flashcardDispatch({type: "LOADING"})
        const fetchFlashCard = async () => {
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
       toast.success("🎉 You successfully deleted the deck")
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
      toast.success(`🎉 You've successfully Copied ${deck.title} to your profile `)
      dispatch({type: "ADD_FLASHCARD", payload: deck})
      navigate(`/decks/${deck._id}`)
    }




  return (
    <div className="detail__page">
        <Link to={"/decks"} className="link"><MdArrowBackIosNew /> Decks</Link>
       {!state.loading && 
       <header className="page__header">
          <div>
            <h3>{state.title}</h3>
            <div className="deck__author">Created by {state.author.username}</div>
          </div>
          {
            user._id === state.author._id ?
          <>
            <Link to={`/decks/${id}/edit`} className="icon icon__edit"><MdEdit /></Link>
            <button className="icon icon__delete" onClick={handleDelete}><MdDelete /></button>
 
            {
            
            user.favorites.includes(id)
            ?
            <button className="icon" onClick={() => addToFavorites(id)}><MdStar className="icon icon__fav"/></button>
            :
            <button className="icon" onClick={() => addToFavorites(id)}><MdStarBorder className="icon "/></button>
            
            }
          </>
          :
          <p 
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              onClick={() => copyDeck()}
              className={`tooltip ${showInfo ? "show__info" : ""}`}>
                <MdContentCopy style={{cursor: "pointer"}}/>
                <span>add this deck to your profile</span>
          </p>
          }
        </header>}
        <p>{state.description}</p>
         {state.loading && <Loader />}
          {!state.loading &&
            <section className="detail__body">
              {state.flashcards.length ?
              <>
              <Slide flashcards={state.flashcards}/>
              <div className="container flashcards__container">
                  <h3>Flashcards in this deck</h3>
                  <div className="flashcards">
                    {state.flashcards.map(flashcard => <Flashcard key={flashcard._id} {...flashcard} />)}
                  </div>
              </div>
              </>
              :
              <p className="info">No flashcards in this deck { user._id === state.author._id && <Link to={`/decks/${id}/edit`}>Add new</Link>}</p>
          }
            </section>
        }
         
    </div>
  )
}
export default Detail