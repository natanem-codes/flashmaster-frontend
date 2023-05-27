import { useContext, useState } from "react"
import axios from "axios"
import { AuthContext } from "../context/authContext"
import { MdDelete } from "react-icons/md"

const FlashcardItem = ({flashcard, idx, id, dispatch}) => {
    const {state: {user}} = useContext(AuthContext)
    const [termChanged, setTermChanged] = useState(false)
    const [definitionChanged, setDefinitionChanged] = useState(false)
    const removeFlashcard = async (id) => {
        try {
            const {data} = await axios.delete(`http://localhost:5000/flashcards/${id}`, {
            // const {data} = await axios.delete(`https://flashmaster-ps3e.onrender.com/flashcards/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            dispatch({type: "DELETE_FLASHCARD", payload: data._id})
        } catch (error) {
            console.log("Error removing flashcard")
        }
    }
    const updateFlashcard = async (id) => {
        if(!termChanged && !definitionChanged) return
        console.log("updating", flashcard)
        try {
            const {data} = await axios.patch(`http://localhost:5000/flashcards/${id}`, 
            // const {data} = await axios.patch(`https://flashmaster-ps3e.onrender.com/flashcards/${id}`, 
            {
                term: flashcard.term,
                definition: flashcard.definition
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
           console.log(data)
        } catch (error) {
            console.log("Error removing flashcard")
        }
    }

  return (
        <div className="form__flashcard__group" key={flashcard._id}>
            <div className="input__group">
                <label htmlFor="term">Term</label>
                <input type="text" name="term" id="term" 
                    value={flashcard.term} 
                    onChange={e =>  {
                        dispatch({type: "UPDATE_TERM", payload: {term: e.target.value, pos: idx}})
                        setTermChanged(true)
                    }} 
                    onBlur={e => updateFlashcard(flashcard._id)}
                    className="input__title"/>
            </div>
            <div className="input__group">
                <label htmlFor="definition">definition</label>
                <input type="text" name="definition" id="definition" 
                    value={flashcard.definition} 
                    onChange={e =>  {
                        dispatch({type: "UPDATE_DEFINITION", payload: {definition: e.target.value, pos: idx}})
                        setDefinitionChanged(true)
                    }} 
                    onBlur={e => updateFlashcard(flashcard._id)}
                    className="input__title"/>
            </div> 
            <button type="button" className="icon icon__delete" onClick={() => removeFlashcard(flashcard._id)}><MdDelete /></button>
        </div>
  )
}
export default FlashcardItem