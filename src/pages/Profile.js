import { useContext, useState } from "react"
import { AuthContext } from "../context/authContext"
import axios from "axios"
import Deck from "../components/Deck"
import { Link } from "react-router-dom"
import { flashCardContext } from "../context/FlashCardContext"
import {MdDelete} from "react-icons/md"

const Profile =  () => {
    const {state: {user}, logout } = useContext(AuthContext)
    const {state: {decks}} = useContext(flashCardContext)
    const [showInfo, setShowInfo]= useState(false)

    const deleteAccount = async () => {
        // const {data} = await axios.delete(`http://localhost:5000/users/${user._id}`,{
        const {data} = await axios.delete(`https://flashmaster-ps3e.onrender.com/users/${user._id}`,{
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
        if(data.acknowledged) {
            logout()
        }
    }

  return (
    <div className="profile__page">
      { user &&  
      <header className="page__header">
            <div>
                <h3>Welcome, {user.firstName}</h3>
                <p className="username">@{user.username}</p>
            </div>
            <p 
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              onClick={deleteAccount}
              className={`tooltip ${showInfo ? "show__info" : ""}`}>
                <MdDelete style={{cursor: "pointer"}} className="icon"/>
                <span>Delete account</span>
          </p>
        </header>
    }
        <section className="page__body">
            <h2>Your decks</h2>
            <div className="decks">
                { 
                decks.length 
                ? 
                decks.filter(deck => deck.author._id === user._id).map(deck => <Deck key={deck._id} deck={deck}/>) 
                : 
                <p className="info">You have no decks.<Link to="/create">Create decks</Link></p>}
            </div>
        </section>
        <section className="page__body">
            <h2>Your favorites</h2>
            <div className="decks">
                { 
                decks.filter(deck => user.favorites.includes(deck._id)).length
                ?
                decks.filter(deck => user.favorites.includes(deck._id)).map(deck => <Deck key={deck._id} deck={deck}/>) 
                :
                <p>You don't have favorites</p>
                }
            </div>
        </section>
   
    </div>
  )
}
export default Profile