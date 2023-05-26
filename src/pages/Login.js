import { useContext, useState } from "react"
import {Link} from "react-router-dom"

import { AuthContext } from "../context/authContext"

const Login = () => {

    const {state, login} = useContext(AuthContext)

    const [form, setForm] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState("")

    const updateForm = e => {
        const {name, value} = e.target
        setForm(prev => ({...prev, [name]: value}))
    }
    const handleSubmit = e => {
        e.preventDefault()
        if(form.username === "" || form.password === "") {
            setError("Username and password are required.")
            return
        }
        login(form)
        setForm({username: "", password: ""})
    }
  return (
    <div className="container">
        <h2>Login</h2>
        <form className="form login__form" onSubmit={handleSubmit}>
            <div className="form__error">
                {error}
                {state.error.message}
            </div>
            <div className="input__group">
                <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" value={form.username} onChange={e => updateForm(e)} onFocus={() => setError("")}/>
            </div>
            <div className="input__group">
                <label htmlFor="password">Password</label>
            <span className="show__password"></span>
            <input type="password" name="password" id="password" value={form.password} onChange={e => updateForm(e)} onFocus={() => setError("")}/>
            </div>
            <small className="info">You don't have an account? <Link to="/register">Create one</Link></small>
            <button type="submit" className="btn btn__primary">Login</button>
        </form>
    </div>
  )
}
export default Login