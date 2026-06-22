require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { testConnection } = require('./config/db')

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/users', require('./routes/userRoutes'))

const PORT = process.env.PORT || 3001

testConnection()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to connect to MySQL:', err.message)
    process.exit(1)
  })
