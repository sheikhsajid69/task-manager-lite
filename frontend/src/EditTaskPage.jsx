import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TaskForm from './TaskForm';
import { fetchTaskById, updateTask } from './services/taskServices';

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const taskData = await fetchTaskById(id);
        setTask(taskData);
      } catch (err) {
        setError(err.message || 'Unable to load task.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (payload) => {
    if (!payload.title) {
      setError('Please enter a task title.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await updateTask(id, {
        title: payload.title,
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
        ...(payload.dueDate ? { dueDate: payload.dueDate } : { dueDate: null }),
      });
      navigate(`/tasks/${id}`);
    } catch (err) {
      setError(err.message || 'Unable to update task.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center text-muted py-4">Loading task...</div>;
  }

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div>
          <h1 className="h2 fw-bold mb-1">Edit task</h1>
          <p className="text-muted mb-0">Update task details and status.</p>
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-secondary" to={`/tasks/${id}`}>
            Cancel
          </Link>
          <Link className="btn btn-outline-secondary" to="/tasks">
            Back to tasks
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {task && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <TaskForm
              initialValues={task}
              submitLabel={submitting ? 'Saving...' : 'Save changes'}
              onSubmit={handleSubmit}
              onCancel={() => navigate(`/tasks/${id}`)}
              loading={submitting}
              showOwner={false}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default EditTaskPage;
