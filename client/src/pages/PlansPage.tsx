import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface Plan {
  id: string;
  title: string;
  goal?: string;
  startDate: string;
  endDate?: string;
  student: { name: string };
  trainer: { name: string };
  days: Array<{ id: string; title: string; dayOfWeek: number }>;
}

export function PlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [studentId, setStudentId] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/plans');
    setPlans(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/plans', {
        studentId,
        trainerId: trainerId || undefined,
        title,
        goal: goal || undefined,
        startDate,
        endDate: endDate || undefined,
      });
      setStudentId('');
      setTrainerId('');
      setTitle('');
      setGoal('');
      setStartDate('');
      setEndDate('');
      await load();
    } catch {
      setError('Não foi possível criar o plano.');
    }
  };

  return (
    <section>
      <h2>Planos de treino</h2>
      {(user?.role === 'ADMIN' || user?.role === 'TRAINER') && (
        <form onSubmit={handleCreate} className="card form-grid">
          <label>
            ID do aluno
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
          </label>
          {user?.role === 'ADMIN' && (
            <label>
              ID do treinador
              <input value={trainerId} onChange={(e) => setTrainerId(e.target.value)} />
            </label>
          )}
          <label>
            Título
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Objetivo
            <input value={goal} onChange={(e) => setGoal(e.target.value)} />
          </label>
          <label>
            Início
            <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" required />
          </label>
          <label>
            Fim
            <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn primary">
            Criar plano
          </button>
        </form>
      )}

      <div className="grid">
        {plans.map((plan) => (
          <div key={plan.id} className="card">
            <h3>{plan.title}</h3>
            <p>Aluno: {plan.student?.name}</p>
            <p>Treinador: {plan.trainer?.name}</p>
            {plan.goal && <p>Objetivo: {plan.goal}</p>}
            <p>
              Período: {new Date(plan.startDate).toLocaleDateString()} -{' '}
              {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'Em aberto'}
            </p>
            <p>Dias: {plan.days.length}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
