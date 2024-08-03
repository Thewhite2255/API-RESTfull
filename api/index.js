const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const connectDB = require('./config/db')
const errorMiddleware = require('./middlewares/errorMiddleware')

require('dotenv').config()

connectDB()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(helmet())

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/posts', require('./routes/postRoutes'))
app.use('/api/comments', require('./routes/commentRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'))

if (process.env.NODE_ENV === 'production') {
  const _dirname = path.resolve()
  app.use(express.static(path.join(_dirname, 'client/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, 'frontend', 'dist', 'index.html'))
  })
} else {
  app.get('/api', (req, res) => {
    res.send('Server is ready')
  })
}

app.use(errorMiddleware)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(process.env.NODE_ENV)
  console.log(`Server running on port ${PORT}`)
})
