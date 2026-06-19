export default function UserTable({ users, onEdit, onDelete }) {
  if (!users.length)
    return <p className="empty">No users found.</p>

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
            <td>{new Date(u.created_at).toLocaleDateString()}</td>
            <td className="actions">
              <button className="btn-edit" onClick={() => onEdit(u)}>Edit</button>
              <button className="btn-delete" onClick={() => onDelete(u.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
