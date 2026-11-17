
const API_URL = 'https://openlibrary.org/search.json'

export async function searchBooks(query = 'fiction') {
  const params = new URLSearchParams({
    q: query,
    limit: '12',
    fields: 'key,title,author_name,first_publish_year,cover_i,subject',
  })

  const response = await fetch(`${API_URL}?${params}`)

  if (!response.ok) {
    throw new Error('Unable to retrieve books. Please try again.')
  }

  const data = await response.json()

  return data.docs || []
}


export async function getBookDetails(workId) {
  const response = await fetch(
    `https://openlibrary.org/works/${workId}.json`
  )

  if (!response.ok) {
    throw new Error('Unable to retrieve book details.')
  }

  return await response.json()
}
