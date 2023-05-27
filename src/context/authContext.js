import axios from "axios";
import { createContext, useReducer } from "react";
import { toast } from "react-toastify";


const initialState =  {
    user: {
        _id: "",
        username: "",
        firstName: "",
        lastName: "",
        favorites: [],
        token: "",
    },
    isLoggedIn: false,
    loading: false,
    error: {
        status: false,
        message: ""
    }
}


const authReducer = (state, action) => {
    let newState = null
    switch(action.type) {
        case "LOADING":
            return {...state, loading: true, error: {status: false, message: ""}}
        case "ERROR":
            return {...state, loading: false, error: {status: true, message: action.payload}}
        case "LOGIN": 
             newState = {...state, isLoggedIn: true, user: action.payload, error: {status: false, message: ""}, loading: false}
            localStorage.setItem("userInfo", JSON.stringify(newState))
            return newState
        case "LOGOUT":
            localStorage.removeItem("userInfo")
            return initialState
        case "ADD_FAVORITES":
            newState = {...state,  user: {...state.user, favorites: action.payload}}
            localStorage.setItem("userInfo", JSON.stringify(newState))
            return newState
        default:
            return state
}
}
export const AuthContext = createContext(initialState)


const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, JSON.parse(localStorage.getItem("userInfo")) || initialState)

    const login = async (formData) => {
        try {
            // const {data} = await axios.post("http://localhost:5000/auth/login", formData)
            const {data} = await axios.post("https://flashmaster-ps3e.onrender.com/auth/login", formData)
            toast.success(`👋 Welcome, ${data.username}`)
            console.log(data)
            dispatch({type: "LOGIN", payload: data})
        } catch (error) {
            console.log(error.message)
            dispatch({type: "ERROR", payload: "Unable to login. Please try again."})
        }
    }

    const register = async (formData) => {
        try {
            // const {data} = await axios.post(`http://localhost:5000/auth/register`, formData)
            const {data} = await axios.post(`https://flashmaster-ps3e.onrender.com/auth/register`, formData)
            toast.success(`👋 Welcome, ${data.username}`)
            dispatch({type: "LOGIN", payload: data})
        } catch (error) {
            console.log(error.message)
            dispatch({type: "ERROR", payload: "Unable to register. Please try again."})
        }
    }

    const logout = () => {
        dispatch({type: "LOGOUT"})
    }
    const addToFavorites = async (id) => {
    //   const {data} = await axios.post(`http://localhost:5000/decks/${id}/addToFavorites`,{} ,{
       const {data} = await axios.post(`https://flashmaster-ps3e.onrender.com/decks/${id}/addToFavorites`,{} ,{
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      }
      )
      dispatch({type: "ADD_FAVORITES", payload: data})
    }
    return (
        <AuthContext.Provider value={{state, register, login, logout, addToFavorites}}>{children}</AuthContext.Provider>
    )
}
export default AuthContextProvider


