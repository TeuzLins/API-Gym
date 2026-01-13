import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>GymTrack</h1>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          {(user?.role === 'ADMIN' || user?.role === 'TRAINER') && (
            <>
              <NavLink to="/exercises">Exercícios</NavLink>
              <NavLink to="/students">Alunos</NavLink>
              <NavLink to="/plans">Planos</NavLink>
            </>
          )}
          {user?.role === 'STUDENT' && <NavLink to="/plans">Meu treino</NavLink>}
          <NavLink to="/progress">Progresso</NavLink>
        </nav>
        <button type="button" onClick={logout} className="btn secondary">
          Sair
        </button>
      </aside>
      <main className="content">
        <header>
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
