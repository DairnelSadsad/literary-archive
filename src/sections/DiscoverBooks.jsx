
import { useEffect, useState } from 'react'
import { searchBooks } from '../services/openLibrary'
import BookCard from '../components/BookCard'
import BookDetails from '../components/BookDetails'

const categories = [
  { id: 'all', label: 'All Books', keywords: 'fiction' },
  {
    id: 'academic',
    label: 'Academic & Textbooks',
    keywords: 'textbooks education science mathematics computer science',
  },
  {
    id: 'fiction',
    label: 'Fiction & Literature',
    keywords: 'fiction literature novels',
  },
  {
    id: 'general',
    label: 'General Reading',
    keywords: 'books general reading',
  },
]

function DiscoverBooks() {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)

  async function loadBooks(searchTerm = '', category = 'all') {
    setLoading(true)
    setError('')

    const selectedCategory = categories.find(
      (item) => item.id === category
    )

    const categoryKeywords = selectedCategory?.keywords || 'fiction'

    const finalQuery =
      category === 'all'
        ? searchTerm.trim() || 'fiction'
        : searchTerm.trim()
          ? `${searchTerm.trim()} ${categoryKeywords}`
          : categoryKeywords

    try {
      const results = await searchBooks(finalQuery)
      setBooks(results)
    } catch {
      setBooks([])
      setError(
        'Unable to load books. Please check your connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBooks('', 'all')
  }, [])

  function handleSearch(event) {
    event.preventDefault()

    if (!query.trim() && activeCategory === 'all') {
      setError('Please enter a book title, author, or subject.')
      return
    }

    loadBooks(query.trim(), activeCategory)
  }

  function handleCategoryChange(category) {
    setActiveCategory(category)
    loadBooks(query.trim(), category)
  }

  return (
    <section className="section container" id="discover">
      <div className="section-heading">
        <div>
          <p className="eyebrow">EXPLORE THE COLLECTION</p>
          <h2>Discover Books</h2>
          <p className="section-description">
            Find academic resources and your next favorite read.
          </p>
        </div>
      </div>

      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`category-button ${
              activeCategory === category.id ? 'active' : ''
            }`}
            onClick={() => handleCategoryChange(category.id)}
            disabled={loading}
          >
            {category.label}
          </button>
        ))}
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by book title, author, or subject..."
          aria-label="Search books"
        />

        <button
          className="primary-button"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="results-message" aria-live="polite">
        {loading && 'Loading books...'}
        {!loading && !error && `${books.length} books found`}
      </div>

      {loading ? (
        <div className="empty-message">
          Please wait while we retrieve books.
        </div>
      ) : error ? (
        <div className="empty-message" role="alert">
          {error}
          <button
            className="primary-button"
            type="button"
            onClick={() =>
              loadBooks(query.trim(), activeCategory)
            }
          >
            Try Again
          </button>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-message">
          No books found. Try another search.
        </div>
      ) : (
        <>
          <div className="book-grid">
            {books.map((book) => (
              <BookCard
                key={book.key}
                book={book}
                onClick={() => setSelectedBook(book)}
              />
            ))}
          </div>

          {selectedBook && (
            <BookDetails
              book={selectedBook}
              onClose={() => setSelectedBook(null)}
            />
          )}
        </>
      )}
    </section>
  )
}

export default DiscoverBooks
