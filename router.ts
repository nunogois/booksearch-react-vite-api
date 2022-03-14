import { Router } from 'express'
const router = Router()

import axios from 'axios' // Used Axios for the Google Books API request: https://github.com/axios/axios

// / endpoint, welcome message, simply return a string to be rendered as HTML by the browser
router.get('/', (_, res) => {
  res.send(
    'Check out <a href="https://github.com/nunogois/booksearch-react-vite-api" target="_blank">booksearch-react-vite-api</a> for more information.'
  )
})

// BookResult type
interface BookResult {
  total: number
  items: unknown[]
}

// Simple in-memory cache layer for book data based on full URL. In prod, this could be e.g. Redis
const cache: { [key: string]: BookResult } = {}

// /books endpoint, returning the list of books
router.get('/books', async (req, res) => {
  const { search } = req.query // Use destructuring to get the search query param from the request: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  let { page, filter } = req.query // Do the same as let for page and filter query params

  if (!search)
    return res.status(400).send('Search query parameter is required.')

  // Add the filter query param to the URL, if it exists
  if (filter && filter !== 'all') filter = `&filter=${filter}`
  else filter = ''

  const currentPage = page ? +page : 1 // Use ternary operator to get current page as number, otherwise assume default 1: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  const url = `https://www.googleapis.com/books/v1/volumes?q=${search}${filter}&printType=books&startIndex=${
    (currentPage - 1) * 10 // startIndex will be currentPage - 1, multiplied by 10, e.g., for page 1: 0, for page 2: 10, etc
  }` // Construct the URL using template string: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

  if (cache[url]) return res.json(cache[url]) // If this URL is already cached, return its result instead of proceeding with the request below

  const { items, totalItems: total } = await axios
    .get(url)
    .then(res => res.data) // Make the request using Axios. Use destructuring to get the data from the response: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

  cache[url] = {
    total,
    items
  } // Add result to the cache layer map, using the final URL as the key

  res.json({
    total, // total pages = Math.ceil(data.totalItems / 10)
    items
  }) // Return the fresh result
})

export default router
