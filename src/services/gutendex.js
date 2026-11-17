
const API_URL = 'https://gutendex.com/books/'

export async function searchFreeBooks(query = '') {
  const searchTerm = query.trim() || 'fiction'

  const params = new URLSearchParams({
    search: searchTerm,
    page: '1',
  })

  const controller = new AbortController()

  const timeoutId = setTimeout(() => {
    controller.abort()
  }, 30000)

  try {
    const response = await fetch(`${API_URL}?${params}`, {
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error('The book service is temporarily unavailable.')
    }

    const data = await response.json()

    return data.results || []
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The request took too long. Please try again.')
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}
