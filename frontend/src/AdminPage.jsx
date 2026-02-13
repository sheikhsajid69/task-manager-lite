import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import UserForm from './UserForm';
import UserList from './UserList';
import { createUser, fetchUsers } from './services/userServices';
import { fetchTasks } from './services/taskServices';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [tasksCount, setTasksCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formKey, setFormKey] = useState(0);
  const [query, setQuery] = useState({
    page: 1,
    limit: 9,
    role: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalItems: 0,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });

  const stats = useMemo(() => ({
    users: pagination.totalItems,
    tasks: tasksCount,
  }), [pagination.totalItems, tasksCount]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [userResponse, taskResponse] = await Promise.all([
        fetchUsers({
          page: query.page,
          limit: query.limit,
          role: query.role,
          sortBy: query.sortBy,
          sortOrder: query.sortOrder,
        }),
        fetchTasks({ page: 1, limit: 1 }),
      ]);

      setUsers(userResponse.items);
      setPagination(userResponse.pagination);
      setTasksCount(taskResponse.pagination.totalItems || 0);
    } catch (err) {
      setError(err.message || 'Unable to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [query.page, query.limit, query.role, query.sortBy, query.sortOrder]);

  const updateQuery = (field, value) => {
    setQuery((prev) => ({
      ...prev,
      [field]: value,
      page: field === 'page' ? value : 1,
    }));
  };

  const handleCreateUser = async (payload) => {
    if (!payload.username || !payload.email || !payload.password) {
      setError('Please fill in username, email, and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await createUser(payload);
      setFormKey((prev) => prev + 1);
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to create user.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUserDeleted = async () => {
    await loadData();
  };

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
        <div>
          <h1 className="h2 fw-bold mb-1">Admin Panel</h1>
          <p className="text-muted mb-0">Manage all users and access full task controls.</p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="badge text-bg-primary">Users: {stats.users}</span>
          <span className="badge text-bg-secondary">Tasks: {stats.tasks}</span>
          <Link className="btn btn-outline-secondary" to="/tasks">
            Manage tasks
          </Link>
          <button type="button" className="btn btn-outline-secondary" onClick={loadData}>
            Refresh
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label" htmlFor="admin-role-filter">Role</label>
              <select
                id="admin-role-filter"
                className="form-select"
                value={query.role}
                onChange={(event) => updateQuery('role', event.target.value)}
              >
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="admin-sort-by">Sort By</label>
              <select
                id="admin-sort-by"
                className="form-select"
                value={query.sortBy}
                onChange={(event) => updateQuery('sortBy', event.target.value)}
              >
                <option value="createdAt">Created date</option>
                <option value="updatedAt">Updated date</option>
                <option value="username">Username</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="admin-sort-order">Order</label>
              <select
                id="admin-sort-order"
                className="form-select"
                value={query.sortOrder}
                onChange={(event) => updateQuery('sortOrder', event.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h2 className="h5 mb-3">Create user</h2>
          <UserForm
            key={formKey}
            submitLabel={submitting ? 'Creating...' : 'Create user'}
            onSubmit={handleCreateUser}
            loading={submitting}
            includeRole
            requirePassword
          />
        </div>
      </div>

      {error && <div className="alert alert-danger mb-0">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h2 className="h5 mb-3">All users</h2>
          {loading ? (
            <div className="text-center text-muted py-4">Loading users...</div>
          ) : (
            <UserList users={users} onUserDeleted={handleUserDeleted} onError={setError} />
          )}
          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => updateQuery('page', pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
            >
              Previous
            </button>
            <span className="text-muted small">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => updateQuery('page', pagination.page + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
