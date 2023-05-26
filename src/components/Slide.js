import { useState } from "react"
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"
import { MdArrowCircleLeft, MdArrowCircleRight } from "react-icons/md"
const Slide = ({flashcards}) => {
  const [count, setCount] = useState(0)
  const [show , setShow] = useState(false)

  const inc = () => {
    if(count < flashcards.length - 1)
      setCount(count => count + 1)
  }
  const dec = () => {
    if(count > 0) setCount(count => count - 1)
  }
  return (
   <div>
     <div id="" className="slide__cards">
     {
      flashcards.map((flashcard, idx) => {
        return <div key={flashcard._id} className={`slide__card ${count === idx ? "active" : ""} ${show && count === idx? "show-answer" : ""}`} onClick={() => setShow(prev => !prev)}>
          <div className="inner-card">
            <div className="inner-card-front">
              <p>
               {flashcard.term}
              </p>
            </div>
            <div className="inner-card-back">
              <p>
                {flashcard.definition}
              </p>
            </div>
          </div>
      </div>
      })
     }
    </div>
     <div className="navigation">
      <p><MdArrowCircleLeft className="icon" onClick={() => dec()}/></p>
      <p><MdArrowCircleRight className="icon" onClick={() => inc()}/></p>
     </div>
   </div>
  )
}
export default Slide

  // <div className="slide__container">
  //     <div className="slide__cards">
  //      {flashcards.map((flashcard, idx) => <div 
  //      key={flashcard._id} 
  //      className={`slide__card ${idx === count ? "slide__card__active" : ""} ${show ? "show__answer" : ""}`} onClick={() => setShow(prev => !prev)}>
  //         <div className="inner__card">
  //           <div className="inner__card__front">
  //             <p>{flashcard.term}</p>
  //           </div>
  //           <div className="inner__card__back">
  //             <p>{flashcard.definition}</p>
  //           </div>
  //         </div>
  //       </div>)}
  //     </div>
  //     <div className="navigation">
  //       <button className="nav__btn" id="prev" onClick={dec} >
  //           <AiOutlineArrowLeft className="icon"/>
  //       </button>
  //       <button className="nav__btn" id="next" onClick={inc} >
  //           <AiOutlineArrowRight className="icon"/>
  //       </button>
  //     </div>
  //   </div>

