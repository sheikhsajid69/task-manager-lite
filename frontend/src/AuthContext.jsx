/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStoredToken, setAuthToken } from './api';
import { fetchMe, login, logoutRequest, signup } from './services/authServices';

const AuthContext = createContext(null);

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user._id,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
        const currentUser = await fetchMe();
        setUser(normalizeUser(currentUser));
      } catch {
        setAuthToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const signUp = async (payload) => {
    const response = await signup(payload);
    setAuthToken(response.token);
    setUser(normalizeUser(response.user));
    return response.user;
  };

  const signIn = async (payload) => {
    const response = await login(payload);
    setAuthToken(response.token);
    setUser(normalizeUser(response.user));
    return response.user;
  };

  const signOut = async () => {
    try {
      await logoutRequest();
    } catch {
      // Client-side token clear is authoritative for stateless JWT logout.
    }
    setAuthToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      signUp,
      signIn,
      signOut,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

