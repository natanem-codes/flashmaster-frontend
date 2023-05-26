import axios from "axios"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const AddFlashCard = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        term: "",
        definition: ""
    })
    
  const handleChange = e => {
    const {name, value} = e.target
    setForm(prev => ({...prev, [name]: value}))
  }

    const handleSubmit = async e => {
        e.preventDefault()
        const {data} = await axios.post(`http://localhost:5000/flashcards`, {...form, deck:id})
        console.log(data)
        navigate(`/decks/${id}`)

    }
  return (
    <div>
        <form onSubmit={handleSubmit} className="form cards__form">
               <div className="input__group">
                        <label htmlFor="term">Term</label>
                        <input type="text" name="term" id="term" value={form.term} onChange={e => handleChange(e)} className="input__term"/>
                    </div>
                    <div className="input__group">
                        <label htmlFor="definition">Definition</label>
                        <input type="text" name="definition" id="definition" value={form.definition}  onChange={e => handleChange(e)}className="input__definition"/>
                    </div> 
                     <button type="submit" className="btn">Add</button>
        </form>
    </div>
  )
}
export default AddFlashCard