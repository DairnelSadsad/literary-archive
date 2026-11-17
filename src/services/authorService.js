
const API_URL = 'https://openlibrary.org'

export async function searchAuthors(query) {
  const params = new URLSearchParams({
    q: query,
    limit: '30',
  })

  const response = await fetch(
    `${API_URL}/search/authors.json?${params}`
  )

  if (!response.ok) {
    throw new Error('Unable to retrieve authors.')
  }

  const data = await response.json()

  const organizationTerms = [
    'society',
    'association',
    'foundation',
    'organization',
    'institute',
    'committee',
    'library',
  ]

  return (data.docs || [])
    .filter((author) => {
      const name = author.name?.toLowerCase() || ''

      return (
        author.type === 'author' &&
        !organizationTerms.some((term) =>
          name.includes(term)
        )
      )
    })
    .sort((a, b) => {
      const search = query.trim().toLowerCase()

      return (
        Number(b.name?.toLowerCase() === search) -
        Number(a.name?.toLowerCase() === search)
      )
    })
    .slice(0, 12)
}

export async function getAuthorDetails(authorKey) {
  const authorId = authorKey.split('/').pop()

  const response = await fetch(
    `${API_URL}/authors/${authorId}.json`
  )

  if (!response.ok) {
    throw new Error('Unable to retrieve author details.')
  }

  return await response.json()
}
