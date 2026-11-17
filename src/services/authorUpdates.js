
const API_URL = 'https://openlibrary.org'

const WORKS_KEY = 'literary-archive-author-known-works'
const NOTIFICATIONS_KEY = 'literary-archive-author-notifications'
const LAST_CHECK_KEY = 'literary-archive-author-last-check'

const ONE_DAY = 24 * 60 * 60 * 1000

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export function getAuthorNotifications() {
  return readStorage(NOTIFICATIONS_KEY, [])
}

export async function checkFollowedAuthorUpdates(authors) {
  const lastCheck = Number(localStorage.getItem(LAST_CHECK_KEY) || 0)

  if (Date.now() - lastCheck < ONE_DAY) {
    return {
      skipped: true,
      notifications: getAuthorNotifications(),
    }
  }

  if (!authors.length) {
    localStorage.setItem(LAST_CHECK_KEY, String(Date.now()))

    return {
      skipped: false,
      notifications: getAuthorNotifications(),
    }
  }

  const knownWorks = readStorage(WORKS_KEY, {})
  const notifications = getAuthorNotifications()

  let successfulChecks = 0

  for (let i = 0; i < authors.length; i++) {
    const author = authors[i]
    const authorId = author.key.split('/').pop()

    try {
      const response = await fetch(
        `${API_URL}/authors/${authorId}/works.json?limit=50`
      )

      if (!response.ok) {
        continue
      }

      const data = await response.json()
      const entries = data.entries || []

      successfulChecks++

      const currentWorkIds = entries
        .map((work) => work.key)
        .filter(Boolean)

      const previousWorkIds = knownWorks[author.key]

      // First check: save a baseline without generating notifications.
      if (!Array.isArray(previousWorkIds)) {
        knownWorks[author.key] = currentWorkIds
        continue
      }

      const newWorks = entries.filter(
        (work) => !previousWorkIds.includes(work.key)
      )

      newWorks.forEach((work) => {
        const notificationId = `${author.key}-${work.key}`

        const alreadyNotified = notifications.some(
          (item) => item.id === notificationId
        )

        if (!alreadyNotified) {
          notifications.unshift({
            id: notificationId,
            authorKey: author.key,
            authorName: author.name,
            title: work.title || 'Untitled work',
            date: new Date().toISOString(),
          })
        }
      })

      knownWorks[author.key] = [
        ...new Set([...previousWorkIds, ...currentWorkIds]),
      ]
    } catch (error) {
      console.error(
        `Unable to check works for ${author.name}:`,
        error
      )
    }

    // Respect Open Library's request limits.
    if (i < authors.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1100))
    }
  }

  localStorage.setItem(WORKS_KEY, JSON.stringify(knownWorks))

  const updatedNotifications = notifications.slice(0, 50)

  localStorage.setItem(
    NOTIFICATIONS_KEY,
    JSON.stringify(updatedNotifications)
  )

  if (successfulChecks === authors.length) {
    localStorage.setItem(LAST_CHECK_KEY, String(Date.now()))
  }

  return {
    skipped: false,
    notifications: updatedNotifications,
  }
}
