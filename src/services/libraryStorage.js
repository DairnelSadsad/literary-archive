
const STORAGE_KEY = 'literary-archive-library'

function notifyLibraryUpdate() {
  window.dispatchEvent(new Event('literary-library-updated'))
}

export function getLibrary() {
  try {
    const savedBooks = localStorage.getItem(STORAGE_KEY)
    return savedBooks ? JSON.parse(savedBooks) : []
  } catch {
    return []
  }
}

export function addBookToLibrary(book) {
  const library = getLibrary()

  const alreadySaved = library.some(
    (item) => item.key === book.key
  )

  if (alreadySaved) return false

  const newBook = {
    key: book.key,
    title: book.title,
    author: book.author_name?.join(', ') || 'Unknown Author',
    year: book.first_publish_year || 'Year unavailable',
    cover_i: book.cover_i || null,
    status: 'Want to Read',
    savedAt: new Date().toISOString(),
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...library, newBook])
  )

  notifyLibraryUpdate()
  return true
}

export function updateBookStatus(bookKey, newStatus) {
  const library = getLibrary()

  const updatedLibrary = library.map((book) =>
    book.key === bookKey
      ? { ...book, status: newStatus }
      : book
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLibrary))
  notifyLibraryUpdate()
}

export function removeBookFromLibrary(bookKey) {
  const library = getLibrary()

  const updatedLibrary = library.filter(
    (book) => book.key !== bookKey
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLibrary))
  notifyLibraryUpdate()
}
