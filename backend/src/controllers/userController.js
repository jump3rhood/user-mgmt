const { pool } = require('../config/db')
const bcrypt = require('bcryptjs')

const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users',
    )
    res.json({ success: true, data: rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.params.id],
    )
    if (!rows.length)
      return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body
    if (!name || !email || !password)
      return res.status(400).json({
        success: false,
        message: 'name, email and password are required',
      })

    const hashed = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role],
    )
    res
      .status(201)
      .json({ success: true, data: { id: result.insertId, name, email, role } })
  } catch (err) {
    const isDupe = err.code === 'ER_DUP_ENTRY'
    res.status(isDupe ? 400 : 500).json({
      success: false,
      message: isDupe ? 'Email already exists' : err.message,
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const fields = []
    const values = []

    if (name) {
      fields.push('name = ?')
      values.push(name)
    }
    if (email) {
      fields.push('email = ?')
      values.push(email)
    }
    if (password) {
      fields.push('password = ?')
      values.push(await bcrypt.hash(password, 10))
    }
    if (role) {
      fields.push('role = ?')
      values.push(role)
    }

    if (!fields.length)
      return res
        .status(400)
        .json({ success: false, message: 'No fields to update' })

    values.push(req.params.id)

    const [result] = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values,
    )
    if (!result.affectedRows)
      return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, message: 'User updated' })
  } catch (err) {
    const isDupe = err.code === 'ER_DUP_ENTRY'
    res.status(isDupe ? 409 : 500).json({
      success: false,
      message: isDupe ? 'Email already exists' : err.message,
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [
      req.params.id,
    ])
    if (!result.affectedRows)
      return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser }
