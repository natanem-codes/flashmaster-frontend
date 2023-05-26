import { createContext, useReducer } from "react";

export const flashCardContext =  createContext()

const initialState = {
    loading: false,
    decks: [],
    error: false
}

const reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_DECKS":
            return {
                loading: false,
                erorr: false,
                decks: action.payload
            }
        case "ADD_FLASHCARD": 
            return {
                loading: false,
                erorr: false,
                decks: [...state.decks, action.payload]
            }
        case "DELETE__ONE": {
            return {
                loading: false,
                erorr: false,
                decks: state.decks.filter(f => f._id !== action.payload)
            }
        }
        case "LOADING":
            return {
                ...state,
                error: false,
                loading: true
            }
        case "ERROR": 
            return  {
                ...state,
                loading: false,
                error: true
            }
        default:
            return state
    }
}


const FlashCardContext = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <flashCardContext.Provider value={{dispatch, state}}>{children}</flashCardContext.Provider>
  )
}
export default FlashCardContext

