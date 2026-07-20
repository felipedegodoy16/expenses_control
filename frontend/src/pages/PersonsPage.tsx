import { useEffect, useState } from 'react';
import api from '../api';
import { UserPlus, Trash2, Users } from 'lucide-react';

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Users className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Gestão de Pessoas</h1>
        </div>
        <p className="text-slate-400">Cadastre e gerencie os moradores da residência.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl ring-1 ring-white/5">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-200">
              <UserPlus className="w-5 h-5 text-indigo-400" />
              Novo Morador
            </h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
                  placeholder="Ex: João Silva"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Idade</label>
                <input 
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
                  placeholder="Ex: 25"
                  required
                  min="0"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium px-4 py-3 rounded-xl hover:from-indigo-400 hover:to-cyan-400 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                Cadastrar Morador
              </button>
            </form>
          </div>
        </div>

        {/* Tabela */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl ring-1 ring-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800">
                    <th className="p-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                    <th className="p-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nome</th>
                    <th className="p-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Idade</th>
                    <th className="p-5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {persons.map(person => (
                    <tr key={person.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="p-5 text-slate-400 font-mono text-sm">#{person.id}</td>
                      <td className="p-5 text-slate-200 font-medium">{person.name}</td>
                      <td className="p-5 text-slate-400">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 ring-1 ring-slate-700">
                          {person.age} anos
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button 
                          onClick={() => handleDelete(person.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-400 bg-rose-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-400/20 hover:text-rose-300"
                          title="Excluir morador"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Excluir</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {persons.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Users className="w-10 h-10 text-slate-700" />
                          <p>Nenhuma pessoa cadastrada no momento.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
