import { useEffect, useState } from 'react';
import api from '../api';

interface Person {
  id: number;
  name: string;
  age: number;
}

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const loadPersons = async () => {
    try {
      const response = await api.get('/persons');
      setPersons(response.data);
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
    }
  };

  useEffect(() => {
    loadPersons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/persons', { name, age: parseInt(age) });
      setName('');
      setAge('');
      loadPersons();
    } catch (error) {
      console.error('Erro ao criar pessoa:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/persons/${id}`);
      loadPersons();
    } catch (error) {
      console.error('Erro ao deletar pessoa:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gestão de Pessoas</h1>
      
      <form onSubmit={handleCreate} className="mb-8 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Idade</label>
          <input 
            type="number" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-24"
            required
            min="0"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Cadastrar
        </button>
      </form>

      <div className="bg-white rounded shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">ID</th>
              <th className="p-4">Nome</th>
              <th className="p-4">Idade</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {persons.map(person => (
              <tr key={person.id} className="border-b">
                <td className="p-4">{person.id}</td>
                <td className="p-4">{person.name}</td>
                <td className="p-4">{person.age}</td>
                <td className="p-4">
                  <button 
                    onClick={() => handleDelete(person.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
            {persons.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Nenhuma pessoa cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
