import FlashcardItem from "./FlashcardItem"

const FlashcardList = ({flashcards, id, dispatch}) => {
  return (
        <div className="">
            <h4>Flashcards</h4>
                { flashcards?.length ?
                <div className="container">
                    {flashcards.map((flashcard, idx) => <FlashcardItem key={idx} flashcard={flashcard} idx={idx} id={id} dispatch={dispatch}/> )}
                </div> :
                <p className="info">No flashcards</p>
                }
        </div>
  )
}
export default FlashcardList