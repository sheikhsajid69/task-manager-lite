import React, { useState } from 'react';

const MainContent = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design system architecture', status: 'Completed', priority: 'High' },
    { id: 2, title: 'Develop frontend components', status: 'In Progress', priority: 'High' },
    { id: 3, title: 'Setup database schema', status: 'Pending', priority: 'Medium' },
    { id: 4, title: 'Write API documentation', status: 'Pending', priority: 'Low' },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now(),
      title: newTask,
      status: 'Pending',
      priority: 'Medium',
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const statusOrder = ['Pending', 'In Progress', 'Completed'];
        const nextStatusIndex = (statusOrder.indexOf(task.status) + 1) % statusOrder.length;
        return { ...task, status: statusOrder[nextStatusIndex] };
      }
      return task;
    }));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => t.status !== 'Completed').length,
    completed: tasks.filter(t => t.status === 'Completed').length
  };

  return (
    <main className="main-content">
      <div className="welcome-section">
        <h2>Task Dashboard</h2>
        <p>Manage your projects and track progress.</p>
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <h4>{stats.total}</h4>
          <p>Total Tasks</p>
        </div>
        <div className="stat-item">
          <h4>{stats.active}</h4>
          <p>Active</p>
        </div>
        <div className="stat-item">
          <h4>{stats.completed}</h4>
          <p>Completed</p>
        </div>
      </div>

      <div className="task-manager-container">
        <div className="add-task-section">
          <input
            type="text"
            className="task-input"
            placeholder="What needs to be done?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button className="cta-button" onClick={addTask}>Add Task</button>
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add one above!</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-card ${task.status.toLowerCase().replace(' ', '-')}`}>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <div className="task-meta">
                    <span className={`priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
                    <span className="status-text">{task.status}</span>
                  </div>
                </div>
                <div className="task-actions">
                  <button className="action-btn status" onClick={() => toggleStatus(task.id)}>
                    {task.status === 'Completed' ? 'Undo' : 'Next Stage'}
                  </button>
                  <button className="action-btn delete" onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default MainContent;