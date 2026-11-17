
import { useEffect, useState } from 'react'
import { getBookDetails } from '../services/openLibrary'
import { addBookToLibrary } from '../services/libraryStorage'

function BookDetails({ book, onClose }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    async function loadDetails() {
      setLoading(true)
      setError('')
      setDetails(null)

      try {
        const workId = book.key.split('/').pop()
        const result = await getBookDetails(workId)
        setDetails(result)
      } catch {
        setError('Unable to load book details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadDetails()
  }, [book])

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : null

  const description =
    typeof details?.description === 'string'
      ? details.description
      : details?.description?.value || 'No description available.'

  function handleAddToLibrary() {
    const wasAdded = addBookToLibrary(book)

    setSaveMessage(
      wasAdded
        ? 'Book successfully added to your library!'
        : 'This book is already in your library.'
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="book-details-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-details-title"
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close book details"
        >
          ×
        </button>

        {loading ? (
          <p>Loading book details...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : (
          <div className="book-details-content">
            {coverUrl && (
              <img
                src={coverUrl}
                alt={`Cover of ${book.title}`}
                className="details-cover"
              />
            )}

            <div className="details-information">
              <p className="eyebrow">BOOK INFORMATION</p>

              <h2 id="book-details-title">{book.title}</h2>

              <p>
                <strong>Author:</strong>{' '}
                {book.author_name?.join(', ') || 'Unknown Author'}
              </p>

              <p>
                <strong>Published:</strong>{' '}
                {book.first_publish_year || 'Year unavailable'}
              </p>

              <h3>About this book</h3>
              <p>{description}</p>

              {details?.subjects?.length > 0 && (
                <>
                  <h3>Subjects</h3>
                  <p>{details.subjects.slice(0, 8).join(', ')}</p>
                </>
              )}

              <button
                className="primary-button"
                type="button"
                onClick={handleAddToLibrary}
              >
                Add to My Library
              </button>

              {saveMessage && (
                <p role="status">{saveMessage}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookDetails
