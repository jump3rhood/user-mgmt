import { useState } from 'react'

const AVATAR_PALETTE = [
  { bg: '#EEF4FF', color: '#3B4EDE' },
  { bg: '#F0FDF4', color: '#15803D' },
  { bg: '#FFF7ED', color: '#C2410C' },
  { bg: '#FDF4FF', color: '#7E22CE' },
  { bg: '#ECFEFF', color: '#0E7490' },
  { bg: '#FFF1F2', color: '#BE123C' },
  { bg: '#FFFBEB', color: '#92400E' },
  { bg: '#F0F9FF', color: '#0369A1' },
]

function getAvatar(name = '') {
  return AVATAR_PALETTE[(name.charCodeAt(0) || 0) % AVATAR_PALETTE.length]
}

function getInitials(name = '') {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?'
}

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

const TH = {
  padding: '10px 16px',
  textAlign: 'left',
  fontSize: '0.6875rem',
  fontWeight: 600,
  color: '#98A2B3',
  background: '#F9FAFB',
  borderBottom: '1px solid #E4E7EC',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  whiteSpace: 'nowrap',
}

const TD = {
  padding: '13px 16px',
  verticalAlign: 'middle',
  fontSize: '0.875rem',
  color: '#101828',
  borderBottom: '1px solid #F2F4F7',
}

export default function UserTable({ users, onEdit, onDelete }) {
  const [openMenuId, setOpenMenuId] = useState(null)
  const [menuPos, setMenuPos] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const closeMenu = () => {
    setOpenMenuId(null)
    setMenuPos(null)
  }

  const toggleMenu = (e, id) => {
    if (openMenuId === id) { closeMenu(); return }
    const rect = e.currentTarget.getBoundingClientRect()
    setMenuPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right })
    setOpenMenuId(id)
  }

  const handleEdit = (u) => {
    closeMenu()
    onEdit(u)
  }

  const handleDeleteRequest = (id) => {
    closeMenu()
    setConfirmId(id)
  }

  if (!users.length) {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center' }}>
        <div style={{
          width: '48px', height: '48px',
          background: '#F2F4F7', borderRadius: '12px',
          margin: '0 auto 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="8" r="4" stroke="#98A2B3" strokeWidth="1.5" />
            <path d="M3 19c0-4.418 3.582-8 8-8s8 3.582 8 8"
              stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p style={{ margin: 0, fontWeight: 600, color: '#475467', fontSize: '0.875rem' }}>No users yet</p>
        <p style={{ margin: '4px 0 0', color: '#98A2B3', fontSize: '0.8125rem' }}>
          Add your first user using the form.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* ── Transparent overlay — closes the menu on outside click ── */}
      {openMenuId && (
        <div
          onClick={closeMenu}
          style={{ position: 'fixed', inset: 0, zIndex: 199 }}
        />
      )}

      {/* ── Dropdown — fixed, escapes overflow clipping ── */}
      {openMenuId && menuPos && (
        <div
          className="action-menu"
          style={{
            position: 'fixed',
            top: menuPos.top,
            right: menuPos.right,
            zIndex: 200,
            background: '#fff',
            border: '1px solid #E4E7EC',
            borderRadius: '10px',
            boxShadow: '0 8px 28px rgba(16, 24, 40, 0.12)',
            minWidth: '168px',
            padding: '4px',
          }}
        >
          <MenuBtn
            onClick={() => handleEdit(users.find((u) => u.id === openMenuId))}
            icon={
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M8.5 1.5L11.5 4.5L4 12H1V9L8.5 1.5Z"
                  stroke="#667085" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            label="Edit Details"
            hoverBg="#F9FAFB"
            color="#344054"
          />
          <div style={{ height: '1px', background: '#F2F4F7', margin: '3px 6px' }} />
          <MenuBtn
            onClick={() => handleDeleteRequest(openMenuId)}
            icon={
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1.5 3.5H11.5M4.5 3.5V2.5H8.5V3.5M5 6V10.5M8 6V10.5M2.5 3.5L3.3 11H9.7L10.5 3.5"
                  stroke="#B42318" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            label="Delete User"
            hoverBg="#FEF3F2"
            color="#B42318"
          />
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {confirmId && (
        <div
          onClick={() => setConfirmId(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(16, 24, 40, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 300,
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            className="action-menu"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '14px',
              padding: '24px',
              width: '380px',
              maxWidth: 'calc(100vw - 40px)',
              boxShadow: '0 20px 60px rgba(16, 24, 40, 0.18)',
            }}
          >
            <div style={{
              width: '44px', height: '44px',
              background: '#FEF3F2', borderRadius: '10px',
              marginBottom: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.5 5H17.5M6.5 5V4H13.5V5M7 8V15.5M10 8V15.5M13 8V15.5M3.5 5L4.5 16.5H15.5L16.5 5"
                  stroke="#B42318" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 700, color: '#101828' }}>
              Delete this user?
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: '#475467', lineHeight: 1.6 }}>
              This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setConfirmId(null)} className="btn-ghost" style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                onClick={() => { onDelete(confirmId); setConfirmId(null) }}
                style={{
                  flex: 1, padding: '9px 0',
                  background: '#B42318', color: '#fff',
                  border: 'none', borderRadius: '8px',
                  fontSize: '0.875rem', fontWeight: 600,
                  fontFamily: 'inherit', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#912018')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#B42318')}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={TH}>User</th>
              <th className="col-sm" style={TH}>Email</th>
              <th style={TH}>Role</th>
              <th style={TH}>Status</th>
              <th className="col-lg" style={TH}>Created</th>
              <th style={{ ...TH, width: '52px', textAlign: 'center' }} />
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const av = getAvatar(u.name)
              return (
                <tr
                  key={u.id}
                  className="table-row"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td style={TD}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                      <div style={{
                        width: '36px', height: '36px',
                        borderRadius: '50%',
                        background: av.bg, color: av.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.6875rem', fontWeight: 700,
                        letterSpacing: '0.04em', flexShrink: 0,
                      }}>
                        {getInitials(u.name)}
                      </div>
                      <span style={{ fontWeight: 600, color: '#101828', fontSize: '0.875rem' }}>
                        {u.name}
                      </span>
                    </div>
                  </td>

                  <td className="col-sm" style={{
                    ...TD,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.78rem',
                    color: '#475467',
                  }}>
                    {u.email}
                  </td>

                  <td style={TD}>
                    <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {u.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>

                  <td style={TD}>
                    <span className="badge badge-active">
                      <span className="pulse-dot" />
                      Active
                    </span>
                  </td>

                  <td className="col-lg" style={{
                    ...TD,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.775rem',
                    color: '#98A2B3',
                  }}>
                    {formatDate(u.created_at)}
                  </td>

                  <td style={{ ...TD, textAlign: 'center' }}>
                    <button
                      onClick={(e) => toggleMenu(e, u.id)}
                      style={{
                        width: '30px', height: '30px',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: openMenuId === u.id ? '#F2F4F7' : 'transparent',
                        border: '1px solid',
                        borderColor: openMenuId === u.id ? '#E4E7EC' : 'transparent',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        color: openMenuId === u.id ? '#475467' : '#98A2B3',
                        fontSize: '18px', lineHeight: 1,
                        fontFamily: 'inherit',
                        transition: 'all 0.1s',
                      }}
                      onMouseEnter={(e) => {
                        if (openMenuId !== u.id) {
                          e.currentTarget.style.background = '#F2F4F7'
                          e.currentTarget.style.borderColor = '#E4E7EC'
                          e.currentTarget.style.color = '#475467'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (openMenuId !== u.id) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.borderColor = 'transparent'
                          e.currentTarget.style.color = '#98A2B3'
                        }
                      }}
                    >
                      ⋮
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

function MenuBtn({ onClick, icon, label, hoverBg, color }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        width: '100%',
        padding: '8px 10px',
        background: hovered ? hoverBg : 'none',
        border: 'none', borderRadius: '7px',
        fontSize: '0.8125rem', fontWeight: 500,
        color, fontFamily: 'inherit',
        cursor: 'pointer', textAlign: 'left',
        transition: 'background 0.1s',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
