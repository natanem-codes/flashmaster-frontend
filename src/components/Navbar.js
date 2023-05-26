import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/authContext"
import { MdArrowDropDown, MdArrowDropUp, MdLogout, MdPerson2, MdSlideshow } from "react-icons/md"

const Navbar = () => {

  const {state, logout} = useContext(AuthContext)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleWindowClick = e => {
      show && !e.target.classList.contains("dropdown") && setShow(false)
    }

    window.addEventListener("click", handleWindowClick)
    return () => {
      window.removeEventListener("click", handleWindowClick)
    }
  })

  return (
    <nav>
        <div className="logo">
          <Link to="/"><MdSlideshow />FlashMaster</Link>
        </div>
        <ul>
            {state.isLoggedIn ?
            <>
            <li><Link to="/decks">Flashcards</Link></li>
            <li><Link to="/create">Create</Link></li>
            <li onClick={() => setShow(prev => !prev)} className="dropdown">
              {state.user.username} 
            {show ? <MdArrowDropUp  className="icon"/> :
            <MdArrowDropDown  className="icon"/>}
              {show && 
              <ul className={`dropdown__menu `}>
                <li>
                  <MdPerson2 />
                  <Link to="/profile" className="profile">Profile</Link>
                  </li>
                <li>
                  <MdLogout />
                  <button onClick={() => logout()}>Logout</button>
                  </li>
              </ul>
              }
            </li>
            </>
            : 
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
            }
        </ul>
    </nav>
  )
}
export default Navbar