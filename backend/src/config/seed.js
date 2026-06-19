require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })
const bcrypt = require('bcryptjs')
const { pool } = require('./db')

const users = [
  { name: 'Alice Admin', email: 'alice@example.com', password: 'password123', role: 'admin' },
  { name: 'Bob User',    email: 'bob@example.com',   password: 'password123', role: 'user'  },
  { name: 'Carol User',  email: 'carol@example.com', password: 'password123', role: 'user'  },
]

async function seed() {
  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10)
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
      [user.name, user.email, hashed, user.role]
    )
    console.log(`Seeded: ${user.email}`)
  }
  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
