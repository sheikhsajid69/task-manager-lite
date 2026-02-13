import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteTask, fetchTaskById, updateTask } from './services/taskServices';

const formatDate = (value) => {
  if (!value) return 'No due date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No due date';
  return date.toLocaleDateString();
};

const TaskView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const ownerLabel = useMemo(() => {
    if (!task?.userId) return 'Unknown user';
    if (typeof task.userId === 'object') {
      return task.userId.username || task.userId.email || 'Unknown user';
    }
    return task.userId;
  }, [task]);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchTaskById(id);
        setTask(data);
      } catch (err) {
        setError(err.message || 'Unable to load task.');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

  const handleStatusChange = async () => {
    if (!task) return;

    const statusOrder = ['pending', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
      setBusy(true);
      setError('');
      const updated = await updateTask(task._id, { status: nextStatus });
      setTask((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      setError(err.message || 'Unable to update task.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    try {
      setBusy(true);
      setError('');
      await deleteTask(task._id);
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Unable to delete task.');
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="text-center text-muted py-4">Loading task...</div>;
  }

  if (!task) {
    return <div className="alert alert-warning">Task not found.</div>;
  }

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
        <div>
          <h1 className="h2 fw-bold mb-1">Task details</h1>
          <p className="text-muted mb-0">Review task ownership, priority, and timeline.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link className="btn btn-outline-secondary" to="/tasks">
            Back to tasks
          </Link>
          <Link className="btn btn-outline-secondary" to={`/tasks/${task._id}/edit`}>
            Edit task
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex flex-column gap-3">
          <div>
            <h3 className="h4 mb-1">{task.title}</h3>
            <p className="text-muted mb-0">{task.description || 'No description'}</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <span className={`badge text-bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'}`}>
              Priority: {task.priority}
            </span>
            <span className={`badge text-bg-${task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'info' : 'secondary'}`}>
              Status: {task.status}
            </span>
            <span className="badge text-bg-light text-dark">Due: {formatDate(task.dueDate)}</span>
            <span className="badge text-bg-light text-dark">Owner: {ownerLabel}</span>
          </div>
          <div className="d-flex gap-2 flex-wrap justify-content-end">
            <button type="button" className="btn btn-primary" disabled={busy} onClick={handleStatusChange}>
              Next status
            </button>
            <button type="button" className="btn btn-outline-danger" disabled={busy} onClick={handleDelete}>
              Delete task
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskView;
