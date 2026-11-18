
const API_BASE = 'https://open.umn.edu/opentextbooks'

export async function getAcademicTextbooks(query = '', page = 1) {
  const params = new URLSearchParams({
    language: 'eng',
    page: String(page),
  })

  if (query.trim()) {
    params.set('q', query.trim())
  }

  const response = await fetch(
    `${API_BASE}/textbooks.json?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error('Unable to load academic textbooks.')
  }

  const result = await response.json()

  // The API returns textbook records under its data property.
  const records = Array.isArray(result.data)
    ? result.data
    : result.data
      ? [result.data]
      : []

  return records
}

export async function getAcademicSubjects() {
  const response = await fetch(`${API_BASE}/subjects.json`)

  if (!response.ok) {
    throw new Error('Unable to load textbook subjects.')
  }

  const result = await response.json()

  return Array.isArray(result.data) ? result.data : []
}
