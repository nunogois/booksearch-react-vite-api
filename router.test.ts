import request from 'supertest' // Used supertest: https://github.com/visionmedia/supertest
import express from 'express'
import router from './router'

const app = express()
app.use('/', router)

describe('booksearch-react-vite-api routes', () => {
  test('GET / > returns a welcome message, suggesting checking out the GitHub repo', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toBe(200)
    expect(res.text).toContain(
      '<a href="https://github.com/nunogois/booksearch-react-vite-api" target="_blank">booksearch-react-vite-api</a>'
    )
  })

  test('GET /books > returns a 400 with an error message, since the search query param is required', async () => {
    const res = await request(app).get('/books')
    expect(res.statusCode).toBe(400)
    expect(res.text).toBe('Search query parameter is required.')
  })

  test('GET /books?search=keyes > returns books with "keyes"', async () => {
    const res = await request(app).get('/books?search=keyes')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('total')
    expect(res.body.total).toBeGreaterThan(0)
    expect(res.body).toHaveProperty('items')
    expect(res.body.items.length).toBeGreaterThan(0)
    expect(JSON.stringify(res.body.items[0])).toContain('keyes')
  })
})
