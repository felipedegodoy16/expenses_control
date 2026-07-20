import { useEffect, useState } from 'react';
import api from '../api';

interface Person {
  id: number;
  name: string;
  age: number;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 0 | 1; // 0: Expense, 1: Income
  personId: number;
  person?: Person;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<0 | 1>(0);
  const [personId, setPersonId] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [transRes, persRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/persons')
      ]);
      setTransactions(transRes.data);
      setPersons(persRes.data);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/transactions', { 
        description, 
        amount: parseFloat(amount), 
        type, 
        personId: parseInt(personId) 
      });
      
      setDescription('');
      setAmount('');
      setType(0);
      setPersonId('');
      loadData();
    } catch (err: any) {
      setError(err.response?.data || 'Erro ao criar transação');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gestão de Transações</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleCreate} className="mb-8 flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Valor (R$)</label>
          <input 
            type="number" 
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-32"
            required
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select 
            value={type} 
            onChange={(e) => setType(parseInt(e.target.value) as 0 | 1)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value={0}>Despesa</option>
            <option value={1}>Receita</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pessoa</label>
          <select 
            value={personId} 
            onChange={(e) => setPersonId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-48"
            required
          >
            <option value="">Selecione...</option>
            {persons.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.age} anos)</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Cadastrar Transação
        </button>
      </form>

      <div className="bg-white rounded shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">ID</th>
              <th className="p-4">Descrição</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Pessoa</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className="border-b">
                <td className="p-4">{t.id}</td>
                <td className="p-4">{t.description}</td>
                <td className="p-4">R$ {t.amount.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm ${t.type === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {t.type === 1 ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className="p-4">{t.person?.name}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Nenhuma transação cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
