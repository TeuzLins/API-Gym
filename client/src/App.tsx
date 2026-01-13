import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { StudentsPage } from './pages/StudentsPage';
import { PlansPage } from './pages/PlansPage';
import { ProgressPage } from './pages/ProgressPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/exercises"
          element={
            <ProtectedRoute roles={['ADMIN', 'TRAINER']}>
              <ExercisesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute roles={['ADMIN', 'TRAINER']}>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Route>
    </Routes>
  );
}
