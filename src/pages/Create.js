import {useContext, useEffect, useRef, useState} from "react"
import axios from "axios"
import { flashCardContext } from "../context/FlashCardContext"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext} from "../context/authContext"
import { toast } from "react-toastify"

const Create = () => {
  
  const titleRef = useRef()
  const navigate = useNavigate()

  const {state} = useContext(AuthContext)
  const { dispatch } = useContext(flashCardContext)

  const [form, setForm] = useState({
    title: "", description: ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const {name, value} = e.target
    setForm(prev => ({...prev, [name]: value}))
  }

  useEffect(() => {
    titleRef.current.focus()
  },[])

  const handleSubmit = async e => {
    setLoading(true)
    e.preventDefault()
    // const {data} = await axios.post(`http://localhost:5000/decks`, form, {
    const {data} = await axios.post(`https://flashmaster-ps3e.onrender.com/decks`, form, {
      headers: {
        Authorization: `Bearer ${state.user.token}`
      }
    })
    setLoading(false)
    toast.success("🎉 You successfuly created a deck")
    dispatch({type: "ADD_FLASHCARD", payload: data})
    setForm({title:"", description: ""})
    navigate(`/decks/${data._id}`)
  }

  return (
    <div className="container">
      <Link to="/decks">Back to Decks</Link>
      <h2>Create a Deck</h2>
      <form onSubmit={handleSubmit} className="form create__form">
         <div className="input__group">
            <label htmlFor="title">Title</label>
             <input type="text" name="title" id="title" value={form.title} className="input__title" onChange={e => handleChange(e)} placeholder="Enter a Title..." ref={titleRef}/>
             
           </div>
            <div className="input__group">
                <label htmlFor="description">Description</label>
                <textarea name="description" id="description" cols="30" rows="3" className="input__description" value={form.description} onChange={e => handleChange(e)}placeholder="Add a description..."></textarea>
            </div>
        <button type="submit" className="btn btn__primary">{loading ? "Creating..." : "Create"}</button>
      </form>
    </div>
  )
}
export default Create