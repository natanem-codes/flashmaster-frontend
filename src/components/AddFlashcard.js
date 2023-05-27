import { useContext, useEffect, useRef, useState } from "react"
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdOutlineAddCircleOutline } from "react-icons/md"
import { AuthContext } from "../context/authContext"
import axios from "axios"

const AddFlashcard = ({deckId, dispatch}) => {
    const {state: {user}} = useContext(AuthContext)
     const newTermRef = useRef()

     const [show, setShow] = useState(false)
     const [form, setForm] = useState({
        newTerm: "",
        newDefinition: "",
    })

      useEffect(() => {
        show && newTermRef.current.focus()
    }, [show])

    const updateForm = e => {
        const {name, value} = e.target
        setForm(prev => ({...prev, [name]: value}))
    }
       const addFlashcard = async () => {

        if(form.newTerm === "" || form.newDefinition === "") {
            return
        }

        const data = {
            term: form.newTerm,
            definition: form.newDefinition,
            deck: deckId
        }
        const {data: newFlashcard} = await axios.post(`http://localhost:5000/flashcards`, data, {
        // const {data: newFlashcard} = await axios.post(`https://flashmaster-ps3e.onrender.com/flashcards`, data, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
        dispatch({type: "UPDATE_FLASHCARDS", payload: newFlashcard})
        setForm({newTerm: "", newDefinition: ""})
    }
  return (
        <div className="">
            <h4>
                Add a flashcard  {
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
            }
            </h4>
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
  )
}
export default AddFlashcard