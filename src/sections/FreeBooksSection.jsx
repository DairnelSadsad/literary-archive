
import { useState } from 'react'
import freeBooks from '../data/freeBooks'

function FreeBooksSection() {
  const [query, setQuery] = useState('')

  const filteredBooks = freeBooks.filter((book) => {
    const searchTerm = query.trim().toLowerCase()

    return (
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.category.toLowerCase().includes(searchTerm)
    )
  })

  function handleSearch(event) {
    event.preventDefault()
  }

  return (
    <section className="section container" id="free-books">
      <div className="section-heading">
        <div>
          <p className="eyebrow">OPEN ACCESS COLLECTION</p>
          <h2>Read Free</h2>
          <p className="section-description">
            Explore selected classic books available through Project Gutenberg.
          </p>
        </div>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by book title, author, or category..."
          aria-label="Search free books"
        />

        <button
          className="primary-button"
          type="submit"
        >
          Search
        </button>
      </form>

      <div className="results-message" aria-live="polite">
        {filteredBooks.length} books found
      </div>

      {filteredBooks.length === 0 ? (
        <div className="empty-message">
          No books found. Try another title, author, or category.
        </div>
      ) : (
        <div className="free-book-grid">
          {filteredBooks.map((book) => (
            <article className="free-book-card" key={book.id}>
              <div className="free-book-cover local-book-cover">
                <span className="local-book-category">
                  {book.category}
                </span>

                <h3>{book.title}</h3>

                <p>{book.author}</p>

                <span className="local-book-year">
                  {book.year}
                </span>
              </div>

              <div className="free-book-info">
                <h3>{book.title}</h3>

                <p className="free-book-author">
                  {book.author}
                </p>

                <p className="free-book-year">
                  {book.category} · {book.year}
                </p>

                <div className="free-book-actions">
                  <a
                    href={`https://www.gutenberg.org/ebooks/${book.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="free-book-link"
                  >
                    View & Read
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="free-books-note">
        Book availability and copyright status may vary by country.
        Please check the book's Project Gutenberg page and applicable
        local copyright laws before accessing or downloading.
      </p>
    </section>
  )
}

export default FreeBooksSection
