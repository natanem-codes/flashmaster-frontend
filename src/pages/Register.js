import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/authContext"

const initialState = {
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
    }

const Register = () => {
      const {register} = useContext(AuthContext)

    const [form, setForm] = useState(initialState)
    const [error, setError] = useState("")

     const updateForm = e => {
        const {name, value} = e.target
        setForm(prev => ({...prev, [name]: value}))
    }
    const handleSubmit = e => {
        e.preventDefault()
        if(form.username === "" || form.password === "" || form.confirmPassword === "" || form.firstName === "" || form.lastName === "") {
            setError("All fields are required.")
            return
        }
        if(form.password !== form.confirmPassword) {
            setError("Passwords don't match")
            return
        }
        register(form)
        setForm(initialState)
    }

  return (
        <div className="container">
            <h2>Register</h2>
        <form className="form register__form" onSubmit={handleSubmit}>
            <div className="form__error">
                {error && <p className="error">{error.message}</p>}
            </div>
            <div className="input__group">
                <label htmlFor="firstName">First name</label>
                <input type="text" name="firstName" id="firstName" value={form.firstName} onChange={e => updateForm(e)} onFocus={() => setError("")}/>
            </div>
            <div className="input__group">
                <label htmlFor="lastName">Last name</label>
                <input type="text" name="lastName" id="lastName" value={form.lastName} onChange={e => updateForm(e)} onFocus={() => setError("")}/>
            </div>
            <div className="input__group">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" value={form.username} onChange={e => updateForm(e)} onFocus={() => setError("")}/>
            </div>
            <div className="input__group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" value={form.password} onChange={e => updateForm(e)} onFocus={() => setError("")}/>
            </div>
            <div className="input__group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input type="password" name="confirmPassword" id="confirmPassword" value={form.confirmPassword} onChange={e => updateForm(e)} onFocus={() => setError("")}/>
            </div>
            <small className="info">Already have an account? <Link to="/login">Login</Link></small>
            <button type="submit" className="btn btn__primary">Register</button>
        </form>
    </div>
  )
}
export default Register
