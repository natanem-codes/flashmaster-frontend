import axios from "axios";
import { createContext, useEffect, useReducer } from "react";


const initialState =  {
    user: {
        _id: "",
        username: "",
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
        default:
            return state
}
}
export const AuthContext = createContext(initialState)


const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, JSON.parse(localStorage.getItem("userInfo")) || initialState)

    const login = async (formData) => {
        try {
            const {data} = await axios.post("http://localhost:5000/auth/login", formData)
            dispatch({type: "LOGIN", payload: data})
        } catch (error) {
            console.log(error.message)
            dispatch({type: "ERROR", payload: "Unable to login. Please try again."})
        }
    }

    const register = async (formData) => {
        try {
            const {data} = await axios.post(`http://localhost:5000/auth/register`, formData)
            dispatch({type: "LOGIN", payload: data})
        } catch (error) {
            console.log(error.message)
            dispatch({type: "ERROR", payload: "Unable to register. Please try again."})
        }
    }

    const logout = () => {
        dispatch({type: "LOGOUT"})
    }
    return (
        <AuthContext.Provider value={{state, register, login, logout}}>{children}</AuthContext.Provider>
    )
}
export default AuthContextProvider


