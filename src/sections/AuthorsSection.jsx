
import { useEffect, useState } from 'react'
import {
  searchAuthors,
  getAuthorDetails,
} from '../services/authorService'
import {
  getFollowedAuthors,
  followAuthor,
  unfollowAuthor,
} from '../services/authorStorage'
import {
  checkFollowedAuthorUpdates,
  getAuthorNotifications,
} from '../services/authorUpdates'

function AuthorsSection() {
  const [query, setQuery] = useState('')
  const [authors, setAuthors] = useState([])

  const [followedAuthors, setFollowedAuthors] = useState(
    () => getFollowedAuthors()
  )

  const [notifications, setNotifications] = useState(
    () => getAuthorNotifications()
  )

  const [updateMessage, setUpdateMessage] = useState(
    'Checking followed authors...'
  )

  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [authorDetails, setAuthorDetails] = useState(null)

  const [loading, setLoading] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const [error, setError] = useState('')
  const [detailsError, setDetailsError] = useState('')

  // Check followed authors when the section first loads.
  useEffect(() => {
    let cancelled = false

    async function checkUpdates() {
      if (followedAuthors.length === 0) {
        setUpdateMessage(
          'Follow an author to start receiving updates.'
        )
        return
      }

      try {
        const result = await checkFollowedAuthorUpdates(
          followedAuthors
        )

        if (cancelled) return

        setNotifications(result.notifications)

        setUpdateMessage(
          result.skipped
            ? 'Your authors were already checked within the last 24 hours.'
            : 'Author update check completed.'
        )
      } catch {
        if (!cancelled) {
          setUpdateMessage(
            'Unable to check author updates. Please try again later.'
          )
        }
      }
    }

    checkUpdates()

    return () => {
      cancelled = true
    }
  }, [])

  // Search authors.
  async function handleSearch(event) {
    event.preventDefault()

    if (!query.trim()) {
      setError('Please enter an author name.')
      setAuthors([])
      return
    }

    setLoading(true)
    setError('')
    setAuthors([])

    try {
      const results = await searchAuthors(query.trim())
      setAuthors(results)
    } catch {
      setError(
        'Unable to load authors. Please check your connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Follow an author.
  function handleFollow(author) {
    const wasAdded = followAuthor(author)

    if (wasAdded) {
      setFollowedAuthors(getFollowedAuthors())
    }
  }

  // Unfollow an author.
  function handleUnfollow(authorKey) {
    const updatedAuthors = unfollowAuthor(authorKey)
    setFollowedAuthors(updatedAuthors)
  }

  // Load author details.
  async function handleViewDetails(author) {
    setSelectedAuthor(author)
    setAuthorDetails(null)
    setDetailsError('')
    setDetailsLoading(true)

    try {
      const details = await getAuthorDetails(author.key)
      setAuthorDetails(details)
    } catch {
      setDetailsError(
        'Unable to load author details. Please try again.'
      )
    } finally {
      setDetailsLoading(false)
    }
  }

  function closeDetails() {
    setSelectedAuthor(null)
    setAuthorDetails(null)
    setDetailsError('')
  }

  function isFollowed(authorKey) {
    return followedAuthors.some(
      (author) => author.key === authorKey
    )
  }

  const biography =
    typeof authorDetails?.bio === 'string'
      ? authorDetails.bio
      : authorDetails?.bio?.value || 'No biography is available.'

  return (
    <section className="authors-section" id="authors">
      <div className="container section">

        {/* Discover Authors */}
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              THE MINDS BEHIND THE STORIES
            </p>
            <h2>Discover Authors</h2>
            <p className="section-description">
              Explore writers, learn about their work, and follow your favorites.
            </p>
          </div>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for an author..."
            aria-label="Search authors"
          />

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="empty-message" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="empty-message">
            Searching for authors...
          </div>
        )}

        {!loading && authors.length > 0 && (
          <>
            <div className="results-message" aria-live="polite">
              {authors.length} authors found
            </div>

            <div className="author-grid">
              {authors.map((author) => (
                <article className="author-card" key={author.key}>
                  <div className="author-initial">
                    {author.name?.charAt(0) || '?'}
                  </div>

                  <div className="author-info">
                    <h3>{author.name}</h3>

                    <p>
                      {author.birth_date
                        ? `Born: ${author.birth_date}`
                        : 'Birth date unavailable'}
                    </p>

                    <p>
                      {author.work_count || 0} recorded works
                    </p>

                    {author.top_work && (
                      <p className="author-top-work">
                        Notable work: {author.top_work}
                      </p>
                    )}

                    <button
                      type="button"
                      className="author-details-button"
                      onClick={() => handleViewDetails(author)}
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      className="author-follow-button"
                      onClick={() => handleFollow(author)}
                      disabled={isFollowed(author.key)}
                    >
                      {isFollowed(author.key)
                        ? 'Following'
                        : 'Follow Author'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {!loading && !error && authors.length === 0 && (
          <div className="empty-message">
            Search for an author to explore their information and works.
          </div>
        )}

        {/* Author Updates and Notifications */}
        <div className="author-updates-panel">
          <div className="author-updates-heading">
            <div>
              <p className="eyebrow">STAY UPDATED</p>
              <h2>Author Updates</h2>
              <p className="section-description">
                Discover newly recorded works from authors you follow.
              </p>
            </div>

            <span className="notification-count">
              {notifications.length}
            </span>
          </div>

          <p className="update-status" aria-live="polite">
            {updateMessage}
          </p>

          {notifications.length === 0 ? (
            <div className="empty-message">
              No new author updates yet. We'll let you know when new works are discovered.
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <article
                  className="notification-card"
                  key={notification.id}
                >
                  <div className="notification-icon">✦</div>

                  <div className="notification-content">
                    <h3>{notification.title}</h3>

                    <p>
                      A newly recorded work by{' '}
                      <strong>{notification.authorName}</strong>.
                    </p>

                    <small>
                      Discovered on{' '}
                      {new Date(notification.date).toLocaleDateString()}
                    </small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Followed Authors */}
        <div className="followed-authors">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR FAVORITE WRITERS</p>
              <h2>Followed Authors</h2>
              <p className="section-description">
                Keep track of the authors whose works interest you.
              </p>
            </div>
          </div>

          {followedAuthors.length === 0 ? (
            <div className="empty-message">
              You haven't followed any authors yet.
            </div>
          ) : (
            <div className="author-grid">
              {followedAuthors.map((author) => (
                <article
                  className="author-card followed-author-card"
                  key={author.key}
                >
                  <div className="author-initial">
                    {author.name?.charAt(0) || '?'}
                  </div>

                  <div className="author-info">
                    <h3>{author.name}</h3>

                    <p>
                      {author.birth_date || 'Birth date unavailable'}
                    </p>

                    <button
                      type="button"
                      className="author-details-button"
                      onClick={() => handleViewDetails(author)}
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      className="author-unfollow-button"
                      onClick={() => handleUnfollow(author.key)}
                    >
                      Unfollow
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Author Details Modal */}
      {selectedAuthor && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div
            className="book-details-modal author-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="author-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={closeDetails}
              aria-label="Close author details"
            >
              ×
            </button>

            {detailsLoading ? (
              <p>Loading author information...</p>
            ) : detailsError ? (
              <p role="alert">{detailsError}</p>
            ) : authorDetails ? (
              <div className="details-information">
                <p className="eyebrow">AUTHOR INFORMATION</p>

                <h2 id="author-details-title">
                  {authorDetails.name || selectedAuthor.name}
                </h2>

                {authorDetails.personal_name && (
                  <p>
                    <strong>Full name:</strong>{' '}
                    {authorDetails.personal_name}
                  </p>
                )}

                <p>
                  <strong>Birth date:</strong>{' '}
                  {authorDetails.birth_date || 'Unavailable'}
                </p>

                {authorDetails.death_date && (
                  <p>
                    <strong>Death date:</strong>{' '}
                    {authorDetails.death_date}
                  </p>
                )}

                <h3>Biography</h3>
                <p>{biography}</p>

                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    if (isFollowed(selectedAuthor.key)) {
                      handleUnfollow(selectedAuthor.key)
                    } else {
                      handleFollow(selectedAuthor)
                    }
                  }}
                >
                  {isFollowed(selectedAuthor.key)
                    ? 'Unfollow Author'
                    : 'Follow Author'}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  )
}

export default AuthorsSection
