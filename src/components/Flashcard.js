const Flashcard = ({term, definition}) => {
  return (
    <article className="card flashcard">
        <div className="term">{term}</div>
        <div className="definition">{definition}</div>
    </article>
  )
}
export default Flashcard