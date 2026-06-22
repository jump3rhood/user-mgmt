require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env'),
})
const bcrypt = require('bcryptjs')
const { pool } = require('./db')

const users = [
  {
    name: 'Alice Admin',
    email: 'alice@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Bob User',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Carol User',
    email: 'carol@example.com',
    password: 'password123',
    role: 'user',
  },
]

const createTableSql = `
  CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    role ENUM('admin', 'user') DEFAULT 'user' NOT NULL,
    PRIMARY KEY(id)
  )
`
async function seed() {
  await pool.query(createTableSql)
  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10)
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
      [user.name, user.email, hashed, user.role],
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
