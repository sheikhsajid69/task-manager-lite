import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteTask, updateTask } from './services/taskServices';

const formatDate = (value) => {
  if (!value) return 'No due date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No due date';
  return date.toLocaleDateString();
};

const getUserLabel = (task, users) => {
  if (task?.userId && typeof task.userId === 'object') {
    return task.userId.username || task.userId.email || 'Unknown user';
  }
  const match = users.find((user) => user._id === task.userId);
  return match ? match.username || match.email : 'Unknown user';
};

const TaskList = ({ tasks, users, onTaskUpdated, onTaskDeleted, onError }) => {
  const [busyId, setBusyId] = useState('');

  if (!tasks.length) {
    return <p className="text-muted text-center py-4">No tasks yet. Add one to get started.</p>;
  }

  return (
    <div className="row g-3">
      {tasks.map((task) => (
        <div key={task._id} className="col-12 col-xl-6">
          <div className="tm-card h-100">
            <div className="tm-card-top">
              <div className="tm-card-bar" />
              <div className="tm-card-icons">
                <span className="tm-icon-bubble"><i className="bi bi-list-check" /></span>
                <span className="tm-icon-bubble"><i className="bi bi-stars" /></span>
              </div>
            </div>

            <div className="tm-card-body">
              <h5 className="mb-2">{task.title}</h5>
              <p className="text-muted mb-3">{task.description || 'No description'}</p>

              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className={`badge text-bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'}`}>
                  {task.priority}
                </span>
                <span className={`badge text-bg-${task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'info' : 'secondary'}`}>
                  {task.status}
                </span>
                <span className="badge text-bg-light text-dark">{formatDate(task.dueDate)}</span>
                <span className="badge text-bg-light text-dark">{getUserLabel(task, users)}</span>
              </div>

              <div className="glitch-checkbox-container mb-3">
                <input
                  id={`quick-complete-${task._id}`}
                  type="checkbox"
                  checked={task.status === 'completed'}
                  disabled={busyId === task._id}
                  onChange={async (event) => {
                    try {
                      setBusyId(task._id);
                      const updated = await updateTask(task._id, {
                        status: event.target.checked ? 'completed' : 'pending',
                      });
                      onTaskUpdated(updated);
                    } catch (error) {
                      onError?.(error.message || 'Unable to update task.');
                    } finally {
                      setBusyId('');
                    }
                  }}
                />
                <div className="checkbox-box">
                  <div className="checkbox-mark" />
                </div>
                <label className="checkbox-label" htmlFor={`quick-complete-${task._id}`}>Mark completed</label>
              </div>

              <div className="d-flex align-items-start gap-2 flex-wrap justify-content-end">
                <Link className="btn btn-outline-secondary btn-sm" to={`/tasks/${task._id}`}>
                  View
                </Link>
                <Link className="btn btn-outline-secondary btn-sm" to={`/tasks/${task._id}/edit`}>
                  Edit
                </Link>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={busyId === task._id}
                  onClick={async () => {
                    const statusOrder = ['pending', 'in-progress', 'completed'];
                    const currentIndex = statusOrder.indexOf(task.status);
                    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
                    try {
                      setBusyId(task._id);
                      const updated = await updateTask(task._id, { status: nextStatus });
                      onTaskUpdated(updated);
                    } catch (error) {
                      onError?.(error.message || 'Unable to update task.');
                    } finally {
                      setBusyId('');
                    }
                  }}
                >
                  Next status
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  disabled={busyId === task._id}
                  onClick={async () => {
                    try {
                      setBusyId(task._id);
                      await deleteTask(task._id);
                      onTaskDeleted(task._id);
                    } catch (error) {
                      onError?.(error.message || 'Unable to delete task.');
                    } finally {
                      setBusyId('');
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
