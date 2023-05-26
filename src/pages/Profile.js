import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/authContext"
import axios from "axios"
import Deck from "../components/Deck"
import { Link } from "react-router-dom"

const Profile =  () => {
    const {state} = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [decks, setDecks] = useState([])

    useEffect(() => {
        const getProfile = async () => {
            console.log("profile.......")
            // const {data:user} = await axios.get("http://localhost:5000/users/me", {
            const {data:user} = await axios.get("https://flashmaster-ps3e.onrender.com/users/me", {
                headers: {
                    Authorization: `Bearer ${state.user.token}`
                }
            })

            console.log(user)
            setUser(user)
        }
        const getDecks = async () => {
                // const {data:decks} = await axios.get("http://localhost:5000/decks/my-decks",{
                const {data:decks} = await axios.get("https://flashmaster-ps3e.onrender.com/decks/my-decks",{
                headers: {
                    Authorization: `Bearer ${state.user.token}`
                }
            })
            console.log(decks)
            setDecks(decks)
        }

        getProfile()
        getDecks()
    }, [state.user.token])
  return (
    <div className="profile__page">
      { user &&  
      <header className="page__header">
            <div>
                <h3>Welcome, {user.firstName}</h3>
                <p className="username">@{user.username}</p>
            </div>
        </header>
    }
        <section className="page__body">
            <h2>Your flashcard decks</h2>
            <div className="decks">
                { 
                decks.length 
                ? 
                decks.map(deck => <Deck key={deck._id} deck={deck}/>) 
                : 
                <p className="info">You have no decks.<Link to="/create">Create decks</Link></p>}
            </div>
        </section>
    </div>
  )
}
export default Profile