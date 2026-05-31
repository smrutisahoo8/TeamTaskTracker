import { useEffect, useState } from 'react';
import { fetchUsers, updateUserRole, updateUserStatus } from '../api/users.api';
import { useAppContext } from '../context/AppContext';
import { UserSummary } from '../types';

const UsersPage = () => {
  const { auth } = useAppContext();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUsers();
      setUsers(response);
    } catch {
      setError('Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: number, role: string) => {
    try {
      const updated = await updateUserRole(userId, { role: role as UserSummary['role'] });
      setUsers((current) => current.map((user) => (user.id === updated.id ? updated : user)));
      setMessage('Role updated successfully.');
    } catch {
      setError('Unable to update role.');
    }
  };

  const handleStatusChange = async (userId: number, isActive: boolean) => {
    try {
      const updated = await updateUserStatus(userId, { isActive });
      setUsers((current) => current.map((user) => (user.id === updated.id ? updated : user)));
      setMessage('Status updated successfully.');
    } catch {
      setError('Unable to update status.');
    }
  };

  if (!auth.user) {
    return <p className="error-message">You must be signed in to view users.</p>;
  }

  return (
    <section className="card">
      <h2>Users</h2>
      <p>Admin actions are available for accounts with elevated permissions.</p>
      {loading ? (
        <p>Loading user list…</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          {message && <p className="success-message">{message}</p>}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Organization</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.isActive ? 'Yes' : 'No'}</td>
                    <td>{user.organizationId}</td>
                    <td>
                      {auth.user.role === 'ADMIN' ? (
                        <>
                          <select
                            value={user.role}
                            onChange={(event) => handleRoleChange(user.id, event.target.value)}
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="MEMBER">MEMBER</option>
                          </select>
                          <button
                            className="button button-secondary"
                            type="button"
                            onClick={() => handleStatusChange(user.id, !user.isActive)}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </>
                      ) : (
                        <span>Admin only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default UsersPage;
