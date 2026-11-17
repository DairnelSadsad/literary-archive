
import { useEffect, useState } from 'react'
import {
  getLibrary,
  updateBookStatus,
  removeBookFromLibrary,
} from '../services/libraryStorage'

const filters = [
  'All Books',
  'Want to Read',
  'Currently Reading',
  'Completed',
]

function LibrarySection() {
  const [books, setBooks] = useState(() => getLibrary())
  const [activeFilter, setActiveFilter] = useState('All Books')

  useEffect(() => {
    function refreshLibrary() {
      setBooks(getLibrary())
    }

    window.addEventListener('literary-library-updated', refreshLibrary)

    return () => {
      window.removeEventListener('literary-library-updated', refreshLibrary)
    }
  }, [])

  const totalBooks = books.length
  const currentlyReading = books.filter(
    (book) => book.status === 'Currently Reading'
  ).length
  const completed = books.filter(
    (book) => book.status === 'Completed'
  ).length

  const filteredBooks =
    activeFilter === 'All Books'
      ? books
      : books.filter((book) => book.status === activeFilter)

  return (
    <section className="library-section" id="library">
      <div className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
            <h2>My Library</h2>
            <p className="section-description">
              Keep academic and recreational books organized in one place.
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{totalBooks}</span>
            <span className="stat-label">Total Books</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">{currentlyReading}</span>
            <span className="stat-label">Currently Reading</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">{completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="library-tabs">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`tab-button ${
                activeFilter === filter ? 'active' : ''
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredBooks.length === 0 ? (
          <div className="empty-message">
            {books.length === 0
              ? 'Your library is empty. Discover books and add them to your collection.'
              : 'No books found in this category.'}
          </div>
        ) : (
          <div className="book-grid">
            {filteredBooks.map((book) => (
              <article className="book-card saved-book-card" key={book.key}>
                <div className="book-cover">
                  {book.cover_i ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                      alt={`Cover of ${book.title}`}
                      loading="lazy"
                    />
                  ) : (
                    <span>Cover unavailable</span>
                  )}
                </div>

                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <p className="book-year">{book.year}</p>

                  <label className="status-label">
                    Reading Status
                    <select
                      className="status-select"
                      value={book.status}
                      onChange={(event) =>
                        updateBookStatus(book.key, event.target.value)
                      }
                    >
                      <option>Want to Read</option>
                      <option>Currently Reading</option>
                      <option>Completed</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    className="remove-book-button"
                    onClick={() => {
                      if (window.confirm(`Remove "${book.title}" from your library?`)) {
                        removeBookFromLibrary(book.key)
                      }
                    }}
                  >
                    Remove from Library
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default LibrarySection
