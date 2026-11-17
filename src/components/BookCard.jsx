
function BookCard({ book, onClick }) {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null

  const author = book.author_name?.[0] || 'Unknown Author'
  const year = book.first_publish_year || 'Year unavailable'

  return (
    <article
      className="book-card"
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${book.title}`}
    >
      <div className="book-cover">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            loading="lazy"
          />
        ) : (
          <span>Cover unavailable</span>
        )}
      </div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{author}</p>
        <p className="book-year">{year}</p>
        <p className="book-view-link">View Details →</p>
      </div>
    </article>
  )
}

export default BookCard
