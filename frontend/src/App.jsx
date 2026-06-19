import { useState, useEffect } from 'react'
import UserTable from './components/UserTable'
import UserForm from './components/UserForm'
import { getUsers, createUser, updateUser, deleteUser } from './api/users'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await getUsers()
      console.log(data)
      setUsers(data.data)
    } catch {
      setError('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  const setErrorMessage = (msg) => {
    setError(msg)
    setTimeout(() => setError(null), 5000)
  }

  const handleSubmit = async (form) => {
    setError('')
    try {
      if (editingUser) {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await updateUser(editingUser.id, payload)
        setEditingUser(null)
      } else {
        await createUser(form)
        setEditingUser(null)
      }
      fetchUsers()
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Operation failed.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch {
      setErrorMessage('Failed to delete user.')
    }
  }

  return (
    <div className='app'>
      <header>
        <h1>User Management</h1>
      </header>

      <main>
        {error && <div className='error-banner'>{error}</div>}

        <section className='form-section'>
          <UserForm
            editingUser={editingUser}
            onSubmit={handleSubmit}
            onCancel={() => setEditingUser(null)}
          />
        </section>

        <section className='table-section'>
          <h2>
            Users {!loading && <span className='count'>({users.length})</span>}
          </h2>
          {loading ? (
            <p className='loading'>Loading...</p>
          ) : (
            <UserTable
              users={users}
              onEdit={setEditingUser}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
