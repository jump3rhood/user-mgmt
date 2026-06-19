import { useState, useEffect } from 'react'

const EMPTY = { name: '', email: '', password: '', role: 'user' }

export default function UserForm({ editingUser, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    setForm(editingUser ? { ...editingUser, password: '' } : EMPTY)
  }, [editingUser])

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  const isEditing = editingUser ? true : false

  return (
    <form className='user-form' onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit User' : 'New User'}</h2>

      <label>
        Name
        <input
          name='name'
          value={form.name}
          onChange={handleChange}
          required
          placeholder='Full name'
        />
      </label>

      <label>
        Email
        <input
          name='email'
          type='email'
          value={form.email}
          onChange={handleChange}
          required
          placeholder='email@example.com'
        />
      </label>

      <label>
        Password{' '}
        {isEditing && (
          <span className='hint'>(leave blank to keep current)</span>
        )}
        <input
          name='password'
          type='password'
          value={form.password}
          onChange={handleChange}
          required={!isEditing}
          placeholder={isEditing ? 'unchanged' : ''}
        />
      </label>

      <label>
        Role
        <select name='role' value={form.role} onChange={handleChange}>
          <option value='user'>User</option>
          <option value='admin'>Admin</option>
        </select>
      </label>

      <div className='form-actions'>
        <button type='submit' className='btn-primary'>
          {isEditing ? 'Update' : 'Create'}
        </button>
        {isEditing && (
          <button type='button' className='btn-secondary' onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
