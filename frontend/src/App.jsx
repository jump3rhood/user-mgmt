import { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import UserTable from './components/UserTable'
import UserForm from './components/UserForm'
import { getUsers, createUser, updateUser, deleteUser } from './api/users'

function App() {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await getUsers()
      setUsers(data.data)
    } catch {
      toast.error('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleSubmit = async (form) => {
    if (editingUser) {
      const payload = { ...form }
      if (!payload.password) delete payload.password
      await updateUser(editingUser.id, payload)
      setEditingUser(null)
      toast.success('User updated successfully.')
    } else {
      await createUser(form)
      toast.success('User created successfully.')
    }
    fetchUsers()
  }

  const handleDelete = async (id) => {
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success('User deleted.')
    } catch {
      toast.error('Failed to delete user.')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7' }}>
      <Toaster position="top-right" theme="light" richColors closeButton />

      {/* ── Navbar ──────────────────────────────────── */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E4E7EC',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '0 28px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Brand mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '30px', height: '30px',
              background: '#101828',
              borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" />
                <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.4" />
                <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.4" />
                <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" />
              </svg>
            </div>
            <span style={{
              fontWeight: 800,
              fontSize: '0.9rem',
              color: '#101828',
              letterSpacing: '-0.025em',
            }}>
              UserMgmt
            </span>
          </div>

          {/* Admin avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#101828', lineHeight: '1.3' }}>
                Admin User
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#98A2B3', lineHeight: '1.3' }}>
                admin@triniti.ai
              </div>
            </div>
            <div style={{
              width: '34px', height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B4EDE 0%, #7C3AED 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              flexShrink: 0,
              boxShadow: '0 0 0 2px #fff, 0 0 0 3.5px #E4E7EC',
            }}>
              AU
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────── */}
      <main style={{ maxWidth: '1320px', margin: '0 auto', padding: '28px 28px' }}>
        <div className="layout-grid">

          {/* Form card */}
          <UserForm
            editingUser={editingUser}
            onSubmit={handleSubmit}
            onCancel={() => setEditingUser(null)}
          />

          {/* Table card */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #E4E7EC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}>
              <div>
                <h2 className="section-title">User Details</h2>
                <p className="section-sub">
                  {loading ? 'Loading…' : `${users.length} ${users.length === 1 ? 'user' : 'users'} total`}
                </p>
              </div>
            </div>

            {loading ? (
              <div style={{
                padding: '72px 0',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#98A2B3',
              }}>
                Loading users…
              </div>
            ) : (
              <UserTable
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

export default App
