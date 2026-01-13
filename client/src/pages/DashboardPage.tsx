import React from 'react';
import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <section>
      <h2>Bem-vindo(a) ao GymTrack</h2>
      <p>Use o menu lateral para acessar suas funcionalidades.</p>
      <div className="grid">
        <div className="card">
          <h3>Perfil</h3>
          <p>{user?.name}</p>
          <p>{user?.email}</p>
          <p>Perfil: {user?.role}</p>
        </div>
        <div className="card">
          <h3>Atalhos</h3>
          <ul>
            <li>Exercícios e planos (administrativo)</li>
            <li>Progresso do aluno</li>
            <li>Gestão de perfis</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
