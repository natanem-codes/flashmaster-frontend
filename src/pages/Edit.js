import axios from "axios"
import { useContext, useEffect, useReducer, useRef } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { MdArrowBackIosNew} from "react-icons/md"
import { AuthContext } from "../context/authContext"
import FlashcardList from "../components/FlashcardList"
import AddFlashcard from "../components/AddFlashcard"


const reducer = (state, action) => {
    switch(action.type){
        case "FETCH_DECK":
            return {...state, title: action.payload.title, description: action.payload.description}
        case "FETCH_FLASHCARDS": 
            return {...state, flashcards: action.payload}
        case "UPDATE_FLASHCARDS": 
            return {...state, flashcards: [...state.flashcards, action.payload]}
        case "UPDATE_TITLE":
            return {...state, title: action.payload}
        case "UPDATE_DESCRIPTION":
            return {...state, description: action.payload}
        case "UPDATE_TERM":
            return {...state, flashcards: state.flashcards.map((s, idx)=> idx === action.payload.pos ? {...s, term: action.payload.term} : s)}
        case "UPDATE_DEFINITION":
            return {...state, flashcards: state.flashcards.map((s, idx)=> idx === action.payload.pos ? {...s, definition: action.payload.definition} : s)}
        case "DELETE_FLASHCARD":
            return {...state, flashcards: state.flashcards.filter(s => s._id !== action.payload)}
        default:
            return state
    }
}

const Edit = () => {
    const titleRef = useRef()
    const {id} = useParams()
    const navigate = useNavigate()
    const {state: {user}} = useContext(AuthContext)
   
    const [state, dispatch] = useReducer(reducer, {
        title: "",
        description: "",
        flashcards: []
    })

    useEffect(() => {
        titleRef.current.focus()
        const fetchFlashCard = async () => {
            // const { data: {title, description, author} } = await axios(`http://localhost:5000/decks/${id}`)
            const { data: {title, description, author} } = await axios(`https://flashmaster-ps3e.onrender.com/decks/${id}`)
            // const { data:flashcards} = await axios(`http://localhost:5000/flashcards/?deckId=${id}`)
            const { data:flashcards} = await axios(`https://flashmaster-ps3e.onrender.com/flashcards/?deckId=${id}`)
            if(author._id !== user._id) {
                navigate(`/decks/${id}`)
                return
            }
            dispatch({type: "FETCH_DECK", payload: {title, description}})
            dispatch({type: "FETCH_FLASHCARDS", payload: flashcards})
        }

        fetchFlashCard()
    },[id, user._id, navigate])

  

 

    const handleSubmit = async (e) => {
        e.preventDefault()
        // await axios.patch(`http://localhost:5000/decks/${id}`, {title:state.title, description: state.description}, {
        await axios.patch(`https://flashmaster-ps3e.onrender.com/decks/${id}`, {title:state.title, description: state.description}, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
        
        navigate(`/decks/${id}`)
    }


  return (
    <div className="edit__page">
        <Link to={`/decks/${id}`} className="link"> <MdArrowBackIosNew /> back</Link>
        <header className="page__header">
            <div>
                <h3>{state.title}</h3>
                <p>{state.description}</p>
            </div>
        </header>
        <section className="page__body">
            <form className="form edit__form" onSubmit={handleSubmit}>
                <div className="input__group">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" 
                    value={state.title} 
                    onChange={e => dispatch({type: "UPDATE_TITLE" , payload: e.target.value})} 
                    className="input__title" 
                    ref={titleRef} />
                </div>
                <div className="input__group">
                    <label htmlFor="description">Description</label>
                    <textarea name="description" id="description" cols="30" rows="2" 
                    value={state.description} 
                    onChange={e => dispatch({type: "UPDATE_DESCRIPTION" , payload: e.target.value})} 
                    className="input__description" 
                    placeholder="Add a description...">
                    </textarea>
                </div>
                <FlashcardList flashcards={state.flashcards} id={id} dispatch={dispatch}/>
                <AddFlashcard deckId={id} dispatch={dispatch}/>
                <button type="submit" className="btn btn__secondary">Done</button>
            </form>
        </section>
    </div>
  )
}
export default Edit

