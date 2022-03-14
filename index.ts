// Very simple express API
import express from 'express'
import router from './router' // Created a separate router file for our endpoints, so I could also import it on our test file

const app = express()
const port = process.env.PORT || 5000

app.use('/', router)

app.listen(port, () => {
  console.log(`booksearch-react-vite-api listening on http://localhost:${port}`)
})
