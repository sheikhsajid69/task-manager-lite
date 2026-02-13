import React, { useEffect, useState } from 'react';

const getInitialState = (initialValues = {}) => ({
  title: initialValues.title || '',
  description: initialValues.description || '',
  status: initialValues.status || 'pending',
  priority: initialValues.priority || 'medium',
  dueDate: initialValues.dueDate ? new Date(initialValues.dueDate).toISOString().slice(0, 10) : '',
  userId: typeof initialValues.userId === 'object' ? initialValues.userId?._id || '' : initialValues.userId || '',
});

const TaskForm = ({
  initialValues,
  users = [],
  submitLabel,
  onSubmit,
  onCancel,
  loading = false,
  showOwner = true,
}) => {
  const [form, setForm] = useState(getInitialState(initialValues));

  useEffect(() => {
    setForm(getInitialState(initialValues));
  }, [initialValues]);

  useEffect(() => {
    if (showOwner && users.length && !form.userId) {
      setForm((prev) => ({ ...prev, userId: users[0]._id }));
    }
  }, [users, form.userId, showOwner]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      ...(showOwner ? { userId: form.userId } : {}),
    });
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit}>
      <div className="col-lg-4">
        <label className="form-label" htmlFor="task-title">Title</label>
        <input
          id="task-title"
          className="form-control"
          value={form.title}
          onChange={(event) => handleChange('title', event.target.value)}
          placeholder="Write API docs"
        />
      </div>
      {showOwner && (
        <div className="col-lg-4">
          <label className="form-label" htmlFor="task-userId">Owner</label>
          <select
            id="task-userId"
            className="form-select"
            value={form.userId}
            onChange={(event) => handleChange('userId', event.target.value)}
            disabled={!users.length}
          >
            {!users.length ? (
              <option value="">No users yet</option>
            ) : (
              <>
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username || user.email}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      )}
      <div className={showOwner ? 'col-lg-2' : 'col-lg-4'}>
        <label className="form-label" htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          className="form-select"
          value={form.priority}
          onChange={(event) => handleChange('priority', event.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className={showOwner ? 'col-lg-2' : 'col-lg-4'}>
        <label className="form-label" htmlFor="task-status">Status</label>
        <select
          id="task-status"
          className="form-select"
          value={form.status}
          onChange={(event) => handleChange('status', event.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="col-lg-3">
        <label className="form-label" htmlFor="task-dueDate">Due date</label>
        <input
          id="task-dueDate"
          type="date"
          className="form-control"
          value={form.dueDate}
          onChange={(event) => handleChange('dueDate', event.target.value)}
        />
      </div>
      <div className="col-12">
        <label className="form-label" htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          className="form-control"
          value={form.description}
          onChange={(event) => handleChange('description', event.target.value)}
          placeholder="Add a little context for the team"
          rows={3}
        />
      </div>
      <div className="col-12 d-flex flex-wrap justify-content-end gap-2">
        {onCancel && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading || (showOwner && !users.length)}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
