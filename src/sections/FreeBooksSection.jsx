
import { useEffect, useMemo, useState } from 'react'
import freeBooks from '../data/freeBooks'
import {
  getAcademicTextbooks,
  getAcademicSubjects,
} from '../services/openTextbookService'

function FreeBooksSection() {
  const [activeCollection, setActiveCollection] = useState('classics')
  const [query, setQuery] = useState('')

  const [academicBooks, setAcademicBooks] = useState([])
  const [academicSubjects, setAcademicSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('all')

  const [isLoading, setIsLoading] = useState(false)
  const [academicError, setAcademicError] = useState('')

  // Load academic textbooks and subjects when the component mounts.
  useEffect(() => {
    let isMounted = true

    async function loadAcademicResources() {
      setIsLoading(true)
      setAcademicError('')

      try {
        const [books, subjects] = await Promise.all([
          getAcademicTextbooks('', 1),
          getAcademicSubjects(),
        ])

        if (isMounted) {
          setAcademicBooks(books)
          setAcademicSubjects(subjects)
        }
      } catch (error) {
        if (isMounted) {
          setAcademicError(
            'Unable to load academic textbooks. Please try again later.'
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAcademicResources()

    return () => {
      isMounted = false
    }
  }, [])

  // Filter classic books.
  const filteredBooks = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()

    return freeBooks.filter((book) => (
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.category.toLowerCase().includes(searchTerm)
    ))
  }, [query])

  // Filter academic textbooks.
  const filteredAcademicBooks = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()

    return academicBooks.filter((book) => {
      const subjects = book.subjects || []

      const matchesSearch =
        !searchTerm ||
        book.title?.toLowerCase().includes(searchTerm) ||
        book.description?.toLowerCase().includes(searchTerm) ||
        subjects.some((subject) =>
          subject.name?.toLowerCase().includes(searchTerm)
        )

      const matchesSubject =
        selectedSubject === 'all' ||
        subjects.some(
          (subject) => String(subject.id) === selectedSubject
        )

      return matchesSearch && matchesSubject
    })
  }, [academicBooks, query, selectedSubject])

  function handleSearch(event) {
    event.preventDefault()
  }

  function getContributors(book) {
    if (!book.contributors?.length) {
      return 'Author information unavailable'
    }

    return book.contributors
      .map((contributor) => {
        const firstName = contributor.first_name || ''
        const lastName = contributor.last_name || ''

        return `${firstName} ${lastName}`.trim()
      })
      .filter(Boolean)
      .join(', ') || 'Author information unavailable'
  }

  function getReadingFormat(book) {
    const formats = book.formats || []

    return (
      formats.find((format) => format.type?.toLowerCase() === 'online' && format.url) ||
      formats.find((format) => format.url)
    )
  }

  return (
    <section className="section container" id="free-books">
      <div className="section-heading">
        <div>
          <p className="eyebrow">OPEN ACCESS COLLECTION</p>
          <h2>Read Free</h2>
          <p className="section-description">
            Discover classic literature and academic textbooks
            available through open-access resources.
          </p>
        </div>
      </div>

      {/* Collection tabs */}
      <div className="free-book-tabs">
        <button
          type="button"
          className={`free-book-tab ${
            activeCollection === 'classics' ? 'active' : ''
          }`}
          onClick={() => {
            setActiveCollection('classics')
            setQuery('')
          }}
        >
          Classic Books
        </button>

        <button
          type="button"
          className={`free-book-tab ${
            activeCollection === 'academic' ? 'active' : ''
          }`}
          onClick={() => {
            setActiveCollection('academic')
            setQuery('')
          }}
        >
          Academic Textbooks
        </button>
      </div>

      {/* Search */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            activeCollection === 'classics'
              ? 'Search by book title, author, or category...'
              : 'Search by textbook title or subject...'
          }
          aria-label="Search books"
        />

        <button className="primary-button" type="submit">
          Search
        </button>
      </form>

      {/* Classic Books */}
      {activeCollection === 'classics' && (
        <>
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
            Classic books are selected from Project Gutenberg.
            Availability and copyright status may vary by country.
            Please check the book's page and applicable local copyright
            laws before accessing or downloading.
          </p>
        </>
      )}

      {/* Academic Textbooks */}
      {activeCollection === 'academic' && (
        <>
          <div className="academic-book-controls">
            <select
              value={selectedSubject}
              onChange={(event) => setSelectedSubject(event.target.value)}
              aria-label="Filter textbooks by subject"
            >
              <option value="all">All Subjects</option>

              {academicSubjects.map((subject) => (
                <option key={subject.id} value={String(subject.id)}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="academic-book-status" aria-live="polite">
              Loading academic textbooks...
            </div>
          ) : academicError ? (
            <div className="academic-book-status academic-book-error">
              <p>{academicError}</p>

              <button
                type="button"
                className="free-book-link"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          ) : (
            <>
              <div className="results-message" aria-live="polite">
                {filteredAcademicBooks.length} textbooks found
              </div>

              {filteredAcademicBooks.length === 0 ? (
                <div className="empty-message">
                  No textbooks found. Try another search or subject.
                </div>
              ) : (
                <div className="free-book-grid">
                  {filteredAcademicBooks.map((book) => {
                    const readingFormat = getReadingFormat(book)

                    const subjectNames = (book.subjects || [])
                      .map((subject) => subject.name)
                      .filter(Boolean)
                      .join(', ')

                    return (
                      <article
                        className="free-book-card"
                        key={book.id}
                      >
                        <div className="academic-book-cover">
                          <span className="academic-book-label">
                            OPEN TEXTBOOK
                          </span>

                          <h3>{book.title}</h3>

                          <p>{getContributors(book)}</p>
                        </div>

                        <div className="free-book-info">
                          <h3>{book.title}</h3>

                          <p className="free-book-author">
                            {getContributors(book)}
                          </p>

                          <p className="free-book-year">
                            {subjectNames || 'Academic Textbook'}
                          </p>

                          {book.copyright_year && (
                            <p className="free-book-year">
                              Published: {book.copyright_year}
                            </p>
                          )}

                          <div className="free-book-actions">
                            {readingFormat ? (
                              <a
                                href={readingFormat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="free-book-link"
                              >
                                {readingFormat.type?.toLowerCase() === 'online'
                                  ? 'Read Online'
                                  : `View ${readingFormat.type || 'Book'}`}
                              </a>
                            ) : (
                              <span className="no-format-message">
                                No reading link available
                              </span>
                            )}
                          </div>

                          <p className="academic-book-source">
                            Source: Open Textbook Library
                          </p>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </>
          )}

          <p className="free-books-note">
            Academic textbooks are listed through the Open Textbook
            Library. Access formats and licensing may vary by book.
            Please check each textbook's license and source page.
          </p>
        </>
      )}
    </section>
  )
}

export default FreeBooksSection
