import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface ProgressLog {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent?: number;
  notes?: string;
  studentId: string;
}

export function ProgressPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [bodyFatPercent, setBodyFatPercent] = useState('');
  const [notes, setNotes] = useState('');

  const load = async () => {
    const { data } = await api.get('/progress',
      user?.role === 'STUDENT' ? {} : { params: { studentId: studentId || undefined } }
    );
    setLogs(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post('/progress', {
      studentId: user?.role === 'STUDENT' ? undefined : studentId,
      date,
      weightKg: Number(weightKg),
      bodyFatPercent: bodyFatPercent ? Number(bodyFatPercent) : undefined,
      notes: notes || undefined,
    });
    setDate('');
    setWeightKg('');
    setBodyFatPercent('');
    setNotes('');
    await load();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/progress/${id}`);
    await load();
  };

  return (
    <section>
      <h2>Progresso</h2>
      <form onSubmit={handleCreate} className="card form-grid">
        {user?.role !== 'STUDENT' && (
          <label>
            ID do aluno
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
          </label>
        )}
        <label>
          Data
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date" required />
        </label>
        <label>
          Peso (kg)
          <input value={weightKg} onChange={(e) => setWeightKg(e.target.value)} type="number" required />
        </label>
        <label>
          % Gordura
          <input value={bodyFatPercent} onChange={(e) => setBodyFatPercent(e.target.value)} type="number" />
        </label>
        <label>
          Observações
          <input value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <button type="submit" className="btn primary">
          Registrar
        </button>
      </form>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Peso</th>
              <th>% Gordura</th>
              <th>Notas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.date).toLocaleDateString()}</td>
                <td>{log.weightKg} kg</td>
                <td>{log.bodyFatPercent ?? '-'}</td>
                <td>{log.notes ?? '-'}</td>
                <td>
                  <button type="button" className="btn danger" onClick={() => handleDelete(log.id)}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
