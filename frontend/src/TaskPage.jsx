import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { createTask, fetchTasks } from './services/taskServices';
import { fetchUsers } from './services/userServices';

const TaskPage = () => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formKey, setFormKey] = useState(0);
  const [query, setQuery] = useState({
    page: 1,
    limit: 8,
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    totalItems: 0,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });

  const stats = useMemo(() => {
    const total = pagination.totalItems;
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const active = Math.max(total - completed, 0);
    return { total, active, completed };
  }, [tasks, pagination.totalItems]);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        status: query.status,
        priority: query.priority,
      };

      const taskResponse = await fetchTasks(params);
      setTasks(taskResponse.items);
      setPagination(taskResponse.pagination);
    } catch (err) {
      setError(err.message || 'Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const loadUsers = useCallback(async () => {
    if (!user) return;

    try {
      if (!isAdmin) {
        setUsers([user]);
        return;
      }

      const usersResponse = await fetchUsers({
        page: 1,
        limit: 100,
        sortBy: 'username',
        sortOrder: 'asc',
      });
      setUsers(usersResponse.items);
    } catch {
      setUsers([]);
    }
  }, [isAdmin, user]);

  useEffect(() => {
    if (!user) return;
    loadTasks();
  }, [user, loadTasks]);

  useEffect(() => {
    if (!user) return;
    loadUsers();
  }, [user, loadUsers]);

  const updateQuery = (field, value) => {
    setQuery((prev) => ({
      ...prev,
      [field]: value,
      page: field === 'page' ? value : 1,
    }));
  };

  const handleCreateTask = async (payload) => {
    if (!payload.title) {
      setError('Please enter a task title.');
      return;
    }

    const resolvedUserId = isAdmin ? payload.userId : user?.id;
    if (!resolvedUserId) {
      setError('Please select a user for this task.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await createTask({ ...payload, userId: resolvedUserId });
      setFormKey((prev) => prev + 1);
      await loadTasks();
    } catch (err) {
      setError(err.message || 'Unable to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTaskUpdated = async () => {
    await loadTasks();
  };

  const handleTaskDeleted = async () => {
    await loadTasks();
  };

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
        <div>
          <h1 className="h2 fw-bold mb-1">Tasks</h1>
          <p className="text-muted mb-0">Track what matters most and keep your team moving.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          {isAdmin && (
            <Link className="btn btn-outline-light bg-primary" to="/users">
              Manage users
            </Link>
          )}
          <button type="button" className="btn btn-outline-secondary" onClick={loadTasks}>
            Refresh
          </button>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2">
        <div className="card border-0 shadow-sm">
          <div className="card-body py-3 px-4">
            <small className="text-muted">Total</small>
            <div className="fs-4 fw-semibold">{stats.total}</div>
          </div>
        </div>
        <div className="card border-0 shadow-sm">
          <div className="card-body py-3 px-4">
            <small className="text-muted">Active</small>
            <div className="fs-4 fw-semibold">{stats.active}</div>
          </div>
        </div>
        <div className="card border-0 shadow-sm">
          <div className="card-body py-3 px-4">
            <small className="text-muted">Completed (page)</small>
            <div className="fs-4 fw-semibold">{stats.completed}</div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label" htmlFor="filter-status">Status</label>
              <select
                id="filter-status"
                className="form-select"
                value={query.status}
                onChange={(event) => updateQuery('status', event.target.value)}
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="filter-priority">Priority</label>
              <select
                id="filter-priority"
                className="form-select"
                value={query.priority}
                onChange={(event) => updateQuery('priority', event.target.value)}
              >
                <option value="">All priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="filter-sort-by">Sort By</label>
              <select
                id="filter-sort-by"
                className="form-select"
                value={query.sortBy}
                onChange={(event) => updateQuery('sortBy', event.target.value)}
              >
                <option value="createdAt">Created date</option>
                <option value="updatedAt">Updated date</option>
                <option value="dueDate">Due date</option>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="filter-sort-order">Order</label>
              <select
                id="filter-sort-order"
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
          <TaskForm
            key={formKey}
            users={users}
            submitLabel={submitting ? 'Creating...' : 'Create task'}
            onSubmit={handleCreateTask}
            loading={submitting}
            showOwner={isAdmin}
          />
        </div>
      </div>

      {isAdmin && !users.length && !loading && (
        <div className="alert alert-warning">
          No users found. Create a user first to assign tasks.
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center text-muted py-4">Loading tasks...</div>
      ) : (
        <>
          <TaskList
            tasks={tasks}
            users={users}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
            onError={setError}
          />
          <div className="d-flex justify-content-center align-items-center gap-3">
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
        </>
      )}
    </section>
  );
};

export default TaskPage;
