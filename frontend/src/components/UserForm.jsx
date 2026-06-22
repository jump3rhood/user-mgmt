import { useState, useEffect } from 'react'
import { toast } from 'sonner'

const EMPTY = { name: '', email: '', password: '', role: 'user' }

export default function UserForm({ editingUser, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm(editingUser ? { ...editingUser, password: '' } : EMPTY)
  }, [editingUser])

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(form)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.')
    } finally {
      setSubmitting(false)
      setForm(EMPTY)
    }
  }

  const isEditing = !!editingUser

  return (
    <div className='card form-sticky'>
      {/* Card header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E4E7EC',
          background: isEditing ? '#FAFBFF' : '#FFFFFF',
          borderRadius: '12px 12px 0 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isEditing ? '#EEF4FF' : '#F4F5F7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isEditing ? (
              <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
                <path
                  d='M9.5 1.5L12.5 4.5L4.5 12.5H1.5V9.5L9.5 1.5Z'
                  stroke='#3B4EDE'
                  strokeWidth='1.3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            ) : (
              <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
                <path
                  d='M7 1.5V12.5M1.5 7H12.5'
                  stroke='#475467'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
              </svg>
            )}
          </div>
          <div>
            <h2 className='section-title'>
              {isEditing ? 'Edit User' : 'Add User'}
            </h2>
            <p className='section-sub'>
              {isEditing
                ? `Editing ${editingUser.name}`
                : 'Create a new account'}
            </p>
          </div>
        </div>
      </div>

      {/* Form body */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div>
          <label className='field-label'>Full Name</label>
          <input
            name='name'
            value={form.name}
            onChange={handleChange}
            required
            placeholder='e.g. Jane Doe'
            className='input-field'
          />
        </div>

        <div>
          <label className='field-label'>Email Address</label>
          <input
            name='email'
            type='email'
            value={form.email}
            onChange={handleChange}
            required
            placeholder='jane@example.com'
            className='input-field'
          />
        </div>

        <div>
          <div className='field-label-row'>
            <label className='field-label' style={{ margin: 0 }}>
              Password
            </label>
            {isEditing && (
              <span className='field-hint'>Leave blank to keep unchanged</span>
            )}
          </div>
          <input
            name='password'
            type='password'
            value={form.password}
            onChange={handleChange}
            required={!isEditing}
            placeholder={isEditing ? '••••••••' : 'Min. 8 characters'}
            className='input-field'
          />
        </div>

        <div>
          <label className='field-label'>Role</label>
          <div style={{ position: 'relative' }}>
            <select
              name='role'
              value={form.role}
              onChange={handleChange}
              className='input-field'
              style={{ paddingRight: '32px' }}
            >
              <option value='user'>User</option>
              <option value='admin'>Admin</option>
            </select>
            <div
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#98A2B3',
              }}
            >
              <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
                <path
                  d='M3 5L7 9L11 5'
                  stroke='currentColor'
                  strokeWidth='1.4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', paddingTop: '6px' }}>
          <button type='submit' disabled={submitting} className='btn-primary'>
            {submitting ? (
              <>
                <svg
                  width='13'
                  height='13'
                  viewBox='0 0 13 13'
                  fill='none'
                  style={{
                    animation: 'spin 0.7s linear infinite',
                    flexShrink: 0,
                  }}
                >
                  <circle
                    cx='6.5'
                    cy='6.5'
                    r='5'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeDasharray='22 8'
                    strokeLinecap='round'
                  />
                </svg>
                Saving…
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Create User'
            )}
          </button>

          {isEditing && (
            <button type='button' onClick={onCancel} className='btn-ghost'>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
