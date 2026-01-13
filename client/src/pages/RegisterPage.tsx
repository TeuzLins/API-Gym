import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await register({ name, email, password });
      setMessage('Cadastro realizado com sucesso!');
      setTimeout(() => navigate('/login'), 1000);
    } catch {
      setError('Não foi possível registrar.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="card">
        <h2>Criar conta</h2>
        <label>
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          E-mail
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Senha
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn primary">
          Registrar
        </button>
        <p>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
