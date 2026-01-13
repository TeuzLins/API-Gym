import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const muscleGroups = ['CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE', 'FULL_BODY'];
const equipments = ['BODYWEIGHT', 'DUMBBELL', 'BARBELL', 'MACHINE', 'KETTLEBELL', 'BAND', 'OTHER'];

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
}

export function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState(muscleGroups[0]);
  const [equipment, setEquipment] = useState(equipments[0]);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/exercises');
    setExercises(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/exercises', { name, muscleGroup, equipment });
      setName('');
      await load();
    } catch {
      setError('Não foi possível salvar o exercício.');
    }
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/exercises/${id}`);
    await load();
  };

  return (
    <section>
      <h2>Exercícios</h2>
      <form onSubmit={handleCreate} className="card form-grid">
        <label>
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Grupo muscular
          <select value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value)}>
            {muscleGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>
        <label>
          Equipamento
          <select value={equipment} onChange={(e) => setEquipment(e.target.value)}>
            {equipments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn primary">
          Adicionar
        </button>
      </form>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Grupo</th>
              <th>Equipamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => (
              <tr key={exercise.id}>
                <td>{exercise.name}</td>
                <td>{exercise.muscleGroup}</td>
                <td>{exercise.equipment}</td>
                <td>
                  <button className="btn danger" type="button" onClick={() => handleDelete(exercise.id)}>
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
