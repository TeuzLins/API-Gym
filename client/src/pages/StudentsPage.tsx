import React, { useEffect, useState } from 'react';
import api from '../api/axios';

interface Student {
  id: string;
  name: string;
  email: string;
  studentProfile?: {
    id: string;
    height?: number;
    goal?: string;
  };
}

export function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [userId, setUserId] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/students');
    setStudents(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/students', {
        userId,
        height: height ? Number(height) : undefined,
        goal: goal || undefined,
      });
      setUserId('');
      setHeight('');
      setGoal('');
      await load();
    } catch {
      setError('Não foi possível criar o perfil.');
    }
  };

  const handleDelete = async (profileId: string) => {
    await api.delete(`/students/${profileId}`);
    await load();
  };

  return (
    <section>
      <h2>Alunos</h2>
      <form onSubmit={handleCreate} className="card form-grid">
        <label>
          ID do usuário (student)
          <input value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </label>
        <label>
          Altura (cm)
          <input value={height} onChange={(e) => setHeight(e.target.value)} type="number" />
        </label>
        <label>
          Objetivo
          <input value={goal} onChange={(e) => setGoal(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn primary">
          Criar perfil
        </button>
      </form>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Altura</th>
              <th>Objetivo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.studentProfile?.height ?? '-'}</td>
                <td>{student.studentProfile?.goal ?? '-'}</td>
                <td>
                  {student.studentProfile && (
                    <button
                      type="button"
                      className="btn danger"
                      onClick={() => handleDelete(student.studentProfile!.id)}
                    >
                      Remover perfil
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
