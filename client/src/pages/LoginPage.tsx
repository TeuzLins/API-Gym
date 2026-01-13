import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Não foi possível entrar. Verifique suas credenciais.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="card">
        <h2>Entrar</h2>
        <label>
          E-mail
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Senha
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn primary">
          Acessar
        </button>
        <p>
          Não tem conta? <Link to="/register">Crie agora</Link>
        </p>
      </form>
    </div>
  );
}
