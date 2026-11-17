const STORAGE_KEY = 'literary-archive-followed-authors'

export function getFollowedAuthors() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function followAuthor(author) {
  const authors = getFollowedAuthors()

  const alreadyFollowed = authors.some(
    (item) => item.key === author.key
  )

  if (alreadyFollowed) return false

  const updatedAuthors = [
    ...authors,
    {
      key: author.key,
      name: author.name,
      birth_date: author.birth_date || '',
      top_work: author.top_work || '',
      work_count: author.work_count || 0,
    },
  ]

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedAuthors)
  )

  return true
}

export function unfollowAuthor(authorKey) {
  const authors = getFollowedAuthors()

  const updatedAuthors = authors.filter(
    (author) => author.key !== authorKey
  )

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedAuthors)
  )

  return updatedAuthors
}