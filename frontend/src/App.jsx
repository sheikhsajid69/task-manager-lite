import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';
import TaskPage from './TaskPage';
import TaskView from './TaskView';
import EditTaskPage from './EditTaskPage';
import AdminPage from './AdminPage';
import UserView from './UserView';
import EditUserPage from './EditUserPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ProtectedRoute from './ProtectedRoute';
import Footer from './Footer';
import './layout.css';

const PublicOnly = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center text-muted py-5">Loading session...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <main className="app-main flex-grow-1 py-4">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route
              path="/login"
              element={(
                <PublicOnly>
                  <LoginPage />
                </PublicOnly>
              )}
            />
            <Route
              path="/signup"
              element={(
                <PublicOnly>
                  <SignupPage />
                </PublicOnly>
              )}
            />
            <Route
              path="/tasks"
              element={(
                <ProtectedRoute>
                  <TaskPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/tasks/:id"
              element={(
                <ProtectedRoute>
                  <TaskView />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/tasks/:id/edit"
              element={(
                <ProtectedRoute>
                  <EditTaskPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/admin"
              element={(
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/users"
              element={(
                <ProtectedRoute allowedRoles={['admin']}>
                  <Navigate to="/admin" replace />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/users/:id"
              element={(
                <ProtectedRoute>
                  <UserView />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/users/:id/edit"
              element={(
                <ProtectedRoute>
                  <EditUserPage />
                </ProtectedRoute>
              )}
            />
            <Route path="*" element={<Navigate to="/tasks" replace />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
