import { useEffect, useState } from 'react';
import api from '../api';
import { CreditCard, PlusCircle, AlertCircle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <CreditCard className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Registro de Transações</h1>
        </div>
        <p className="text-slate-400">Adicione receitas ou despesas aos moradores cadastrados.</p>
      </header>
      
      {error && (
        <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 shadow-lg shadow-rose-500/5 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl ring-1 ring-white/5">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-200">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              Nova Transação
            </h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Descrição</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
                  placeholder="Ex: Conta de Luz"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
                    placeholder="0.00"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Tipo</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(parseInt(e.target.value) as 0 | 1)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none shadow-inner"
                  >
                    <option value={0}>Despesa</option>
                    <option value={1}>Receita</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Morador</label>
                <select 
                  value={personId} 
                  onChange={(e) => setPersonId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none shadow-inner"
                  required
                >
                  <option value="" disabled>Selecione um morador...</option>
                  {persons.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.age} anos)</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium px-4 py-3 rounded-xl hover:from-indigo-400 hover:to-cyan-400 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                Registrar Transação
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
                    <th className="p-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Descrição</th>
                    <th className="p-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Valor</th>
                    <th className="p-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Morador</th>
                    <th className="p-5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Tipo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-5">
                        <p className="text-slate-200 font-medium">{t.description}</p>
                        <p className="text-xs text-slate-500 font-mono mt-1">ID: #{t.id}</p>
                      </td>
                      <td className="p-5 font-mono text-slate-300">
                        R$ {t.amount.toFixed(2)}
                      </td>
                      <td className="p-5 text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-300 ring-1 ring-slate-700">
                            {t.person?.name.charAt(0).toUpperCase()}
                          </div>
                          {t.person?.name}
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        {t.type === 1 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                            <ArrowUpCircle className="w-3.5 h-3.5" />
                            Receita
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
                            <ArrowDownCircle className="w-3.5 h-3.5" />
                            Despesa
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <CreditCard className="w-10 h-10 text-slate-700" />
                          <p>Nenhuma transação registrada no momento.</p>
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
