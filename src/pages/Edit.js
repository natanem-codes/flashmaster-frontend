import axios from "axios"
import { useContext, useEffect, useReducer, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { MdArrowBackIosNew, MdDelete, MdOutlineAddCircleOutline, MdKeyboardArrowUp, MdKeyboardArrowDown} from "react-icons/md"
import { AuthContext } from "../context/authContext"


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
    const newTermRef = useRef()
    const {id} = useParams()
    const navigate = useNavigate()
    const {state: {user}} = useContext(AuthContext)
    const [show, setShow] = useState(false)

    const [form, setForm] = useState({
        newTerm: "",
        newDefinition: "",
    })

    const updateForm = e => {
        const {name, value} = e.target
        setForm(prev => ({...prev, [name]: value}))
    }

    const [state, dispatch] = useReducer(reducer, {
        title: "",
        description: "",
        flashcards: []
    })

    useEffect(() => {
        titleRef.current.focus()
        const fetchFlashCard = async () => {
            const { data: {title, description, author} } = await axios(`http://localhost:5000/decks/${id}`)
            const { data:flashcards} = await axios(`http://localhost:5000/flashcards/?deckId=${id}`)
            if(author._id !== user._id) {
                navigate(`/decks/${id}`)
                return
            }
            dispatch({type: "FETCH_DECK", payload: {title, description}})
            dispatch({type: "FETCH_FLASHCARDS", payload: flashcards})
        }

        fetchFlashCard()
    },[id, user._id, navigate])

    useEffect(() => {
        show && newTermRef.current.focus()
    }, [show])


    const removeFlashcard = async (id) => {
        try {
            const {data} = await axios.delete(`http://localhost:5000/flashcards/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            dispatch({type: "DELETE_FLASHCARD", payload: data._id})
        } catch (error) {
            console.log("Error removing flashcard")
        }
    }

    const addFlashcard = async () => {

        if(form.newTerm === "" || form.newDefinition === "") {
            return
        }
        const data = {
            term: form.newTerm,
            definition: form.newDefinition,
            deck: id
        }
        const {data: newFlashcard} = await axios.post(`http://localhost:5000/flashcards`, data, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
        dispatch({type: "UPDATE_FLASHCARDS", payload: newFlashcard})
        setForm({newTerm: "", newDefinition: ""})
    }

    const handleSubmit = async (e) => {
        if(form.newTerm !== "" && form.newDefinition !== "") {
            addFlashcard()
        }
        e.preventDefault()
        await axios.patch(`http://localhost:5000/decks/${id}`, {title:state.title, description: state.description}, {
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
                <div className="">
                    <h4>Flashcards</h4>
                    {
                    state.flashcards?.length ?
                    <div className="container">
                        {state.flashcards.map((flashcard, idx) => {
                            return (
                               <div className="form__flashcard__group" key={flashcard._id}>
                                    <div className="input__group">
                                        <label htmlFor="term">Term</label>
                                        <input type="text" name="term" id="term" 
                                            value={flashcard.term} 
                                            onChange={e =>  dispatch({type: "UPDATE_TERM", payload: {term: e.target.value, pos: idx}})} 
                                            className="input__title"/>
                                    </div>
                                    <div className="input__group">
                                        <label htmlFor="definition">definition</label>
                                        <input type="text" name="definition" id="definition" 
                                            value={flashcard.definition} 
                                            onChange={e =>  dispatch({type: "UPDATE_DEFINITION", payload: {definition: e.target.value, pos: idx}})} 
                                            className="input__title"/>
                                    </div> 
                                    <button type="button" className="icon icon__delete" onClick={() => removeFlashcard(flashcard._id)}><MdDelete /></button>
                               </div>
                            )
                        })}
                    </div>
                    :
                    <p className="info">No flashcards</p>
                }
                </div>
                <div className="">
                     <h4>Add a flashcard  {
                        show ? 
                            <small 
                                className="icon" 
                                onClick={() => setShow(prev => !prev)}>
                                <MdKeyboardArrowUp /> 
                            </small>
                            : 
                            <small
                                className="icon" 
                                onClick={() => setShow(prev => !prev)}>
                                <MdKeyboardArrowDown />
                            </small>
            }</h4>
                {show && <>
                     <div className="form__flashcard__group">
                     <div className="input__group">
                         <label htmlFor="newTerm">New term</label>
                         <input type="text" name="newTerm" id="newTerm" ref={newTermRef}
                        value={form.newTerm}
                        onChange={e => updateForm(e)} 
                        className="input__title"/>
                    </div>
                    <div className="input__group">
                        <label htmlFor="newDefinition">New definition</label>
                        <input type="text" name="newDefinition" id="newDefinition" 
                        value={form.newDefinition}
                        onChange={e => updateForm(e)} 
                        className="input__title"/>
                    </div> 
                    <button type="button" className="icon icon__add" onClick={() => addFlashcard()}><MdOutlineAddCircleOutline /></button>
                </div>
                </>}
                </div>
                <button type="submit" className="btn btn__secondary">Done</button>
            </form>
        </section>
    </div>
  )
}
export default Edit

