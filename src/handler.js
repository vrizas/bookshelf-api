const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  const id = nanoid(16)
  const finished = (pageCount === readPage)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    }).code(201)
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  }).code(500)
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  let booksPicked = []

  if (name) {
    const filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))

    filteredBooks.forEach((book) => {
      booksPicked.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      })
    })
  }

  if (reading) {
    let filteredBooks = []

    if (reading === '1') {
      filteredBooks = books.filter((book) => book.reading === true)
    } else if (reading === '0') {
      filteredBooks = books.filter((book) => book.reading === false)
    }

    filteredBooks.forEach((book) => {
      booksPicked.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      })
    })
  }

  if (finished) {
    let filteredBooks = []

    if (finished === '1') {
      filteredBooks = books.filter((book) => book.finished === true)
    } else if (finished === '0') {
      filteredBooks = books.filter((book) => book.finished === false)
    }

    filteredBooks.forEach((book) => {
      booksPicked.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      })
    })
  }

  if (name || reading || finished) {
    return {
      status: 'success',
      data: {
        books: booksPicked
      }
    }
  }

  booksPicked = books.map((book) => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }
  })

  return {
    status: 'success',
    data: {
      books: booksPicked
    }
  }
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.find((book) => book.id === bookId)

  if (book) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)
}

const updateBookHandler = (request, h) => {
  const { bookId } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  const book = books.find((book) => book.id === bookId)

  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404)
  }

  const finished = (pageCount === readPage)
  const updatedAt = new Date().toISOString()

  book.name = name
  book.year = year
  book.author = author
  book.summary = summary
  book.publisher = publisher
  book.pageCount = pageCount
  book.readPage = readPage
  book.finished = finished
  book.reading = reading
  book.updatedAt = updatedAt

  return {
    status: 'success',
    message: 'Buku berhasil diperbarui'
  }
}

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.find((book) => book.id === bookId)

  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404)
  }

  books.splice(books.indexOf(book), 1)

  return {
    status: 'success',
    message: 'Buku berhasil dihapus'
  }
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler
}
